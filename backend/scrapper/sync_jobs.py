#!/usr/bin/env python3
"""Import normalized scraper output into the canonical CareerWizard database."""

import argparse
import json
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.db.database import SessionLocal  # noqa: E402
from app.services.job_service import sync_normalized_jobs_to_db  # noqa: E402


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", default=str(Path(__file__).with_name("jobs_output.json")))
    args = parser.parse_args()
    payload = json.loads(Path(args.input).read_text(encoding="utf-8"))
    jobs = payload.get("jobs", payload if isinstance(payload, list) else [])
    if not isinstance(jobs, list):
        raise SystemExit("Input must contain a jobs array")
    db = SessionLocal()
    try:
        result = sync_normalized_jobs_to_db(db, jobs)
        print(json.dumps(result))
    finally:
        db.close()


if __name__ == "__main__":
    main()
