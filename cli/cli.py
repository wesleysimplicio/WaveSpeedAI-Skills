#!/usr/bin/env python3
"""wavespeed-cli — language-agnostic CLI for the WaveSpeedAI inference platform.

A thin, dependency-light wrapper around the official `wavespeed` Python SDK
plus direct REST helpers for endpoints not surfaced by the SDK.

Subcommands
-----------
    run       <model_uuid> '<json>'    Submit a media job, poll until terminal.
    submit    <model_uuid> '<json>'    Submit only; print task id (no polling).
    result    <task_id>                Fetch result for an existing task.
    cancel    <task_id>                Best-effort cancel/delete a task.
    upload    <path>                   Upload a local file; print hosted URL.
    models                             List available models (JSON).
    balance                            Show account balance.
    llm       <model> '<prompt>'       OpenAI-compatible chat completion.
    verify-webhook <body> <signature>  Verify HMAC-SHA256 webhook signature.

Auth
----
    Reads WAVESPEED_API_KEY from the environment. Get a key at
    https://wavespeed.ai/accesskey.

Example
-------
    wavespeed-cli run wavespeed-ai/z-image/turbo '{"prompt":"Cat"}'
    URL=$(wavespeed-cli upload ./input.png)
    wavespeed-cli run wavespeed-ai/seedance-v2 \\
        "$(jq -nc --arg u "$URL" '{image:$u, prompt:"camera dolly in"}')"
    wavespeed-cli llm anthropic/claude-opus-4.6 "Hello"
"""

from __future__ import annotations

import argparse
import hashlib
import hmac
import json
import os
import sys
import time
from typing import Any

import requests

try:  # SDK is optional for some commands.
    import wavespeed

    _HAS_SDK = True
except ImportError:  # pragma: no cover
    wavespeed = None  # type: ignore[assignment]
    _HAS_SDK = False

API_BASE = os.environ.get("WAVESPEED_API_BASE", "https://api.wavespeed.ai/api/v3").rstrip("/")
LLM_BASE = os.environ.get("WAVESPEED_LLM_BASE", "https://llm.wavespeed.ai/v1").rstrip("/")
TERMINAL_STATUSES = {
    "completed",
    "failed",
    "canceled",
    "cancelled",
    "succeeded",
    "error",
}


# ----- helpers ---------------------------------------------------------------


def _key() -> str:
    key = os.environ.get("WAVESPEED_API_KEY", "").strip()
    if not key:
        sys.stderr.write(
            "ERROR: WAVESPEED_API_KEY is not set.\n"
            "Get one at https://wavespeed.ai/accesskey, then:\n"
            "    export WAVESPEED_API_KEY=ws_...\n"
        )
        sys.exit(2)
    return key


def _headers(json_body: bool = True) -> dict[str, str]:
    h = {"Authorization": f"Bearer {_key()}"}
    if json_body:
        h["Content-Type"] = "application/json"
    return h


def _print_json(data: Any) -> None:
    print(json.dumps(data, ensure_ascii=False, indent=2))


def _require_sdk() -> None:
    if not _HAS_SDK:
        sys.stderr.write(
            "ERROR: the `wavespeed` Python package is required for this command.\n"
            "Install with: pip install wavespeed (or use the bundled venv).\n"
        )
        sys.exit(2)


# ----- commands --------------------------------------------------------------


def cmd_run(args: argparse.Namespace) -> int:
    _require_sdk()
    payload: dict[str, Any] = json.loads(args.json_input) if args.json_input else {}
    out = wavespeed.run(  # type: ignore[union-attr]
        args.model,
        payload,
        timeout=args.timeout,
        poll_interval=args.poll_interval,
        enable_sync_mode=args.sync,
    )
    _print_json(out)
    return 0


def cmd_submit(args: argparse.Namespace) -> int:
    payload = json.loads(args.json_input) if args.json_input else {}
    if args.webhook_url:
        payload["webhook_url"] = args.webhook_url
    r = requests.post(f"{API_BASE}/{args.model}", headers=_headers(), json=payload, timeout=60)
    if r.status_code >= 400:
        sys.stderr.write(f"submit failed [{r.status_code}]: {r.text[:500]}\n")
        return 1
    _print_json(r.json())
    return 0


def cmd_result(args: argparse.Namespace) -> int:
    deadline = time.time() + args.timeout
    while True:
        r = requests.get(
            f"{API_BASE}/predictions/{args.task_id}/result",
            headers=_headers(json_body=False),
            timeout=30,
        )
        if r.status_code >= 400:
            sys.stderr.write(f"result fetch failed [{r.status_code}]: {r.text[:500]}\n")
            return 1
        data = r.json()
        status = (data.get("data", data) or {}).get("status", "").lower()
        if not args.wait or status in TERMINAL_STATUSES:
            _print_json(data)
            return 0 if status not in {"failed", "error"} else 1
        if time.time() > deadline:
            sys.stderr.write(f"timed out waiting for terminal status (last: {status})\n")
            return 1
        time.sleep(args.poll_interval)


def cmd_cancel(args: argparse.Namespace) -> int:
    r = requests.delete(
        f"{API_BASE}/predictions/{args.task_id}",
        headers=_headers(json_body=False),
        timeout=30,
    )
    if r.status_code >= 400:
        sys.stderr.write(f"cancel failed [{r.status_code}]: {r.text[:500]}\n")
        return 1
    print(r.text or "{}")
    return 0


def cmd_upload(args: argparse.Namespace) -> int:
    if _HAS_SDK:
        url = wavespeed.upload(args.path)  # type: ignore[union-attr]
        print(url)
        return 0
    # Fallback: direct multipart POST.
    with open(args.path, "rb") as fh:
        r = requests.post(
            f"{API_BASE}/uploads",
            headers={"Authorization": f"Bearer {_key()}"},
            files={"file": (os.path.basename(args.path), fh)},
            timeout=300,
        )
    if r.status_code >= 400:
        sys.stderr.write(f"upload failed [{r.status_code}]: {r.text[:500]}\n")
        return 1
    body = r.json()
    print(body.get("url") or body.get("data", {}).get("url") or json.dumps(body))
    return 0


def cmd_models(args: argparse.Namespace) -> int:
    r = requests.get(f"{API_BASE}/models", headers=_headers(json_body=False), timeout=30)
    r.raise_for_status()
    data = r.json()
    if args.filter:
        needle = args.filter.lower()
        items = data.get("data") if isinstance(data, dict) else data
        if isinstance(items, list):
            items = [m for m in items if needle in json.dumps(m).lower()]
            if isinstance(data, dict):
                data["data"] = items
            else:
                data = items
    if args.names_only and isinstance(data, dict):
        items = data.get("data", [])
        for m in items:
            print(m.get("id") or m.get("uuid") or m.get("name"))
        return 0
    _print_json(data)
    return 0


def cmd_balance(_: argparse.Namespace) -> int:
    last_err = ""
    for path in ("/account/balance", "/balance", "/billing/balance"):
        r = requests.get(f"{API_BASE}{path}", headers=_headers(json_body=False), timeout=15)
        if r.status_code == 200:
            try:
                _print_json(r.json())
            except ValueError:
                print(r.text)
            return 0
        last_err = f"{r.status_code} {r.text[:200]}"
    sys.stderr.write(f"balance lookup failed: {last_err}\n")
    return 1


def cmd_llm(args: argparse.Namespace) -> int:
    body: dict[str, Any] = {
        "model": args.model,
        "messages": [{"role": "user", "content": args.prompt}],
    }
    if args.system:
        body["messages"].insert(0, {"role": "system", "content": args.system})
    if args.json_mode:
        body["response_format"] = {"type": "json_object"}
    if args.temperature is not None:
        body["temperature"] = args.temperature
    if args.max_tokens is not None:
        body["max_tokens"] = args.max_tokens
    if args.stream:
        body["stream"] = True
        with requests.post(
            f"{LLM_BASE}/chat/completions",
            headers=_headers(),
            json=body,
            stream=True,
            timeout=300,
        ) as r:
            r.raise_for_status()
            for line in r.iter_lines(decode_unicode=True):
                if not line or not line.startswith("data: "):
                    continue
                payload = line[6:]
                if payload.strip() == "[DONE]":
                    break
                try:
                    chunk = json.loads(payload)
                except json.JSONDecodeError:
                    continue
                delta = (chunk.get("choices") or [{}])[0].get("delta", {}).get("content", "")
                if delta:
                    sys.stdout.write(delta)
                    sys.stdout.flush()
            sys.stdout.write("\n")
        return 0
    r = requests.post(f"{LLM_BASE}/chat/completions", headers=_headers(), json=body, timeout=300)
    r.raise_for_status()
    data = r.json()
    if args.raw:
        _print_json(data)
    else:
        print(data["choices"][0]["message"]["content"])
    return 0


def cmd_verify_webhook(args: argparse.Namespace) -> int:
    secret = os.environ.get("WAVESPEED_WEBHOOK_SECRET", "").strip()
    if not secret:
        sys.stderr.write("ERROR: WAVESPEED_WEBHOOK_SECRET is not set.\n")
        return 2
    body = args.body if args.body != "-" else sys.stdin.buffer.read().decode("utf-8")
    expected = hmac.new(secret.encode("utf-8"), body.encode("utf-8"), hashlib.sha256).hexdigest()
    received = args.signature.removeprefix("sha256=")
    ok = hmac.compare_digest(expected, received)
    print("valid" if ok else "invalid")
    return 0 if ok else 1


# ----- argparse --------------------------------------------------------------


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="wavespeed-cli",
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    p.add_argument("--version", action="version", version="wavespeed-cli 1.0.0")
    sub = p.add_subparsers(dest="cmd", required=True)

    pr = sub.add_parser("run", help="submit a media job and poll until complete (uses SDK)")
    pr.add_argument("model")
    pr.add_argument("json_input", nargs="?", default="{}")
    pr.add_argument("--timeout", type=float, default=1800.0)
    pr.add_argument("--poll-interval", type=float, default=1.0)
    pr.add_argument("--sync", action="store_true")
    pr.set_defaults(func=cmd_run)

    ps = sub.add_parser("submit", help="submit only; print the task id (no polling)")
    ps.add_argument("model")
    ps.add_argument("json_input", nargs="?", default="{}")
    ps.add_argument("--webhook-url")
    ps.set_defaults(func=cmd_submit)

    pres = sub.add_parser("result", help="fetch the result of a submitted task")
    pres.add_argument("task_id")
    pres.add_argument("--wait", action="store_true", help="poll until terminal")
    pres.add_argument("--timeout", type=float, default=1800.0)
    pres.add_argument("--poll-interval", type=float, default=1.0)
    pres.set_defaults(func=cmd_result)

    pc = sub.add_parser("cancel", help="cancel/delete a task")
    pc.add_argument("task_id")
    pc.set_defaults(func=cmd_cancel)

    pu = sub.add_parser("upload", help="upload a local file; print hosted URL")
    pu.add_argument("path")
    pu.set_defaults(func=cmd_upload)

    pm = sub.add_parser("models", help="list available models")
    pm.add_argument("--filter", help="case-insensitive substring filter on JSON")
    pm.add_argument("--names-only", action="store_true")
    pm.set_defaults(func=cmd_models)

    pb = sub.add_parser("balance", help="show account balance")
    pb.set_defaults(func=cmd_balance)

    pl = sub.add_parser("llm", help="OpenAI-compatible chat completion")
    pl.add_argument("model")
    pl.add_argument("prompt")
    pl.add_argument("--system")
    pl.add_argument("--json-mode", action="store_true")
    pl.add_argument("--stream", action="store_true")
    pl.add_argument("--temperature", type=float)
    pl.add_argument("--max-tokens", type=int)
    pl.add_argument("--raw", action="store_true")
    pl.set_defaults(func=cmd_llm)

    pv = sub.add_parser("verify-webhook", help="verify HMAC-SHA256 webhook signature")
    pv.add_argument("body", help='raw body string, or "-" to read from stdin')
    pv.add_argument("signature", help="value of the X-Webhook-Signature header")
    pv.set_defaults(func=cmd_verify_webhook)

    return p


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
