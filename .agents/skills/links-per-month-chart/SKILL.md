---
name: links-per-month-chart
description: Query the link shortener's Neon Postgres database for how many links were created each month over the last 12 months, and render the result as a bar chart PNG. Use this skill whenever the user asks for link-creation trends, a chart/graph of links created over time, "links per month", monthly link stats, or wants to visualize/export link creation data from the database, even if they don't mention Python or the database explicitly.
---

# Links Per Month Chart

Generates a bar chart PNG showing the total number of `links` rows created in
each of the last 12 calendar months (rolling window ending with the current
month), pulled directly from the project's Neon Postgres database.

## When to use

Trigger this skill for requests like:
- "Chart/plot how many links were created per month"
- "Show link creation trends for the past year"
- "Export a bar graph of monthly link stats"

## How it works

A single Python script (`scripts/plot_links_per_month.py`) does everything:
1. Reads `DATABASE_URL` from the project's `.env` file
   (`linkshortenerproject/.env` by default — the connection string for the
   Neon Postgres instance used by this app).
2. Connects with `psycopg2` and runs a query that builds a 12-month rolling
   series (current month + previous 11 months) and left-joins the `links`
   table (matching on `"createdAt"`), so months with zero links still show
   up with a count of 0.
3. Plots the result with `matplotlib` as a bar chart (x-axis = month labels
   like `Sep 2025`, y-axis = number of links created) and saves it as a PNG.

## Running it

From the repo root:

```powershell
# One-time: install dependencies (do this in whatever Python env is active)
pip install -r linkshortenerproject\.agents\skills\links-per-month-chart\scripts\requirements.txt

# Run the script
python linkshortenerproject\.agents\skills\links-per-month-chart\scripts\plot_links_per_month.py
```

By default this:
- Loads the `.env` file at `linkshortenerproject\.env` (auto-detected by
  walking up from the script's location; override with `--env-file <path>`).
- Writes the chart to `links_per_month.png` in the current working directory
  (override with `--output <path>`).

Useful flags:
- `--env-file PATH` — explicit path to a `.env` file containing `DATABASE_URL`.
- `--database-url URL` — pass the connection string directly instead of
  reading it from a `.env` file (also honors an already-exported
  `DATABASE_URL` environment variable if neither flag is given).
- `--output PATH` — where to save the PNG (must end in `.png`).
- `--months N` — number of trailing months to include (default `12`).

After running, confirm the script printed the per-month counts and the
output PNG path, and report that path back to the user.

## Notes

- The query counts **all** links in the table (not scoped to a single user)
  because the schema (`db/schema.ts`) does not tie "created" reporting to a
  specific viewer — adjust the `WHERE l."userId" = ...` clause in the script
  if the user wants counts scoped to one account.
- The database column is `"createdAt"` (camelCase, quoted) — see
  `linkshortenerproject/drizzle/*/migration.sql` for the exact schema.
- Requires network access to the Neon database and the `psycopg2-binary`,
  `matplotlib`, and `python-dotenv` packages (see `scripts/requirements.txt`).
