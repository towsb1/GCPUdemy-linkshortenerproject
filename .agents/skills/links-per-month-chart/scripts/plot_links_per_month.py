#!/usr/bin/env python3
"""
Query the link shortener's Postgres database for the number of links
created per month over the last N months (default 12) and render the
result as a bar chart PNG.

Usage:
    python plot_links_per_month.py [--env-file PATH] [--database-url URL]
                                    [--output PATH] [--months N]

DATABASE_URL is resolved in this order:
    1. --database-url flag
    2. DATABASE_URL loaded from --env-file (or auto-discovered .env)
    3. DATABASE_URL already present in the environment
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
from urllib.parse import urlparse, parse_qs

import matplotlib

matplotlib.use("Agg")  # headless-safe backend, must be set before pyplot import
import matplotlib.pyplot as plt  # noqa: E402


def find_default_env_file() -> Path | None:
    """Walk up from this script looking for linkshortenerproject/.env."""
    here = Path(__file__).resolve()
    for parent in here.parents:
        candidate = parent / ".env"
        if candidate.is_file():
            return candidate
        if parent.name == "linkshortenerproject":
            candidate = parent / ".env"
            if candidate.is_file():
                return candidate
    return None


def load_database_url(env_file_arg: str | None, database_url_arg: str | None) -> str:
    if database_url_arg:
        return database_url_arg

    from dotenv import dotenv_values
    import os

    env_file = Path(env_file_arg) if env_file_arg else find_default_env_file()
    values: dict[str, str | None] = {}
    if env_file and env_file.is_file():
        values = dotenv_values(env_file)

    db_url = values.get("DATABASE_URL") or os.environ.get("DATABASE_URL")
    if not db_url:
        raise SystemExit(
            "Could not resolve DATABASE_URL. Pass --database-url, "
            "--env-file, or export DATABASE_URL in the environment."
        )
    return db_url


def build_psycopg2_connect_kwargs(database_url: str) -> dict:
    """Parse a postgres:// connection string into psycopg2 connect kwargs,
    dropping query params psycopg2/libpq may not recognize (e.g. channel_binding
    on older libpq builds) while keeping sslmode."""
    parsed = urlparse(database_url)
    query = parse_qs(parsed.query)

    kwargs = {
        "host": parsed.hostname,
        "port": parsed.port or 5432,
        "dbname": (parsed.path or "/").lstrip("/"),
        "user": parsed.username,
        "password": parsed.password,
        "sslmode": query.get("sslmode", ["require"])[0],
    }
    return kwargs


def fetch_monthly_counts(database_url: str, months: int) -> list[tuple[str, int]]:
    import psycopg2

    query = """
        SELECT
            to_char(month_start, 'Mon YYYY') AS month_label,
            COUNT(l.id) AS link_count
        FROM generate_series(
            date_trunc('month', now()) - (%s || ' months')::interval,
            date_trunc('month', now()),
            interval '1 month'
        ) AS month_start
        LEFT JOIN links l
            ON date_trunc('month', l."createdAt") = month_start
        GROUP BY month_start
        ORDER BY month_start;
    """

    conn_kwargs = build_psycopg2_connect_kwargs(database_url)
    conn = psycopg2.connect(**conn_kwargs)
    try:
        with conn.cursor() as cur:
            cur.execute(query, (months - 1,))
            rows = cur.fetchall()
    finally:
        conn.close()

    return [(label, count) for label, count in rows]


def plot_chart(data: list[tuple[str, int]], output_path: Path, months: int) -> None:
    labels = [label for label, _ in data]
    counts = [count for _, count in data]

    fig, ax = plt.subplots(figsize=(12, 6))
    bars = ax.bar(labels, counts, color="#2563eb")

    ax.set_title(f"Links Created Per Month (Last {months} Months)")
    ax.set_xlabel("Month")
    ax.set_ylabel("Total Links Created")
    ax.set_ylim(bottom=0)
    plt.xticks(rotation=45, ha="right")

    for bar, count in zip(bars, counts):
        ax.annotate(
            str(count),
            xy=(bar.get_x() + bar.get_width() / 2, bar.get_height()),
            xytext=(0, 3),
            textcoords="offset points",
            ha="center",
            va="bottom",
            fontsize=9,
        )

    fig.tight_layout()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(output_path, dpi=150)
    plt.close(fig)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--env-file", default=None, help="Path to a .env file containing DATABASE_URL")
    parser.add_argument("--database-url", default=None, help="Postgres connection string (overrides .env lookup)")
    parser.add_argument("--output", default="links_per_month.png", help="Output PNG path")
    parser.add_argument("--months", type=int, default=12, help="Number of trailing months to include")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    database_url = load_database_url(args.env_file, args.database_url)

    data = fetch_monthly_counts(database_url, args.months)

    print("Links created per month:")
    for label, count in data:
        print(f"  {label}: {count}")

    output_path = Path(args.output)
    plot_chart(data, output_path, args.months)
    print(f"\nChart saved to: {output_path.resolve()}")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:  # noqa: BLE001
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)
