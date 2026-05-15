"""
spacex_payloads_to_gcs.py
─────────────────────────────────────────────────────────────────────────────
Pipeline:
  1. Fetch all payload records from https://api.spacexdata.com/v3/payloads
  2. Convert to a Polars DataFrame
  3. Upload as a Parquet file to a GCS bucket

Authentication uses Application Default Credentials (ADC).
Run `gcloud auth application-default login` if not already configured.

Dependencies
────────────
    pip install requests polars google-cloud-storage
"""

import io
import json
import logging

import polars as pl
import requests
from google.cloud import storage

# ──────────────────────────────────────────────────────────────────────────────
# Configuration — edit these variables
# ──────────────────────────────────────────────────────────────────────────────

BUCKET_NAME = "dpq-landing-zone"          # GCS bucket name
FILE_NAME   = "aakiruthi/launch_payloads_002.csv"     # destination blob path inside the bucket

# ──────────────────────────────────────────────────────────────────────────────

SPACEX_API_URL = "https://api.spacexdata.com/v3/payloads"
API_TIMEOUT_SEC = 30

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)


# ──────────────────────────────────────────────────────────────────────────────
# 1. Fetch from SpaceX API
# ──────────────────────────────────────────────────────────────────────────────

def fetch_spacex_payloads() -> pl.DataFrame:
    log.info("Fetching payloads from %s ...", SPACEX_API_URL)
    resp = requests.get(SPACEX_API_URL, timeout=API_TIMEOUT_SEC)
    resp.raise_for_status()

    raw: list[dict] = resp.json()
    log.info("Received %d payload records.", len(raw))

    # Stringify any nested values (lists or dicts) so Polars produces a flat,
    # CSV-compatible schema — covers both list columns and struct/nested-object columns
    for record in raw:
        for key, val in record.items():
            if isinstance(val, (list, dict)):
                record[key] = json.dumps(val)

    df = pl.DataFrame(raw, infer_schema_length=len(raw))

    # Drop orbit_params column if present
    if "orbit_params" in df.columns:
        df = df.drop("orbit_params")
        log.info("Dropped column: orbit_params")

    log.info("Polars DataFrame shape: %d rows x %d cols", df.height, df.width)
    return df


# ──────────────────────────────────────────────────────────────────────────────
# 2. Upload to GCS
# ──────────────────────────────────────────────────────────────────────────────

def upload_to_gcs(df: pl.DataFrame, bucket_name: str, file_name: str) -> None:
    log.info("Uploading to gs://%s/%s ...", bucket_name, file_name)

    buf = io.BytesIO()
    df.write_csv(buf)
    buf.seek(0)

    client = storage.Client()
    blob = client.bucket(bucket_name).blob(file_name)
    blob.upload_from_file(buf, content_type="text/csv")

    log.info("Upload complete. gs://%s/%s", bucket_name, file_name)


# ──────────────────────────────────────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────────────────────────────────────

def main():
    df = fetch_spacex_payloads()
    upload_to_gcs(df, bucket_name=BUCKET_NAME, file_name=FILE_NAME)
    log.info("Pipeline finished successfully.")


if __name__ == "__main__":
    main()