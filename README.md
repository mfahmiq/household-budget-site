[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/mfahmiq/household-budget-site/rank.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/mfahmiq/household-budget-site/reward.svg)](https://make.fun/c/best-household-budget-site-20261126-1457)

# DuitRumah — Household Budget

A working household budget site for the Hartono family of four in Jakarta, in rupiah.
Seven linked pages, all with real November 2026 figures and every control working: a
dashboard with income vs spending and a category donut, a full transaction ledger you
can filter and add to, editable category budgets plus a cash-envelope view, a monthly
planner with a 50/30/20 checker, savings goals you can contribute to, a debt payoff
calculator (snowball vs avalanche), a bills list you can mark paid, and reports with
budget-vs-actual, a six-month trend and a benchmark against the average Jakarta
household. Charts are hand-rolled SVG; the site is static, with no build step and no
network requests.

## How to run

Serve `app/` with any static server and open `index.html`, for example:

```sh
python3 -m http.server --directory app 8080
```

Then open http://localhost:8080 — it works on desktop and on a phone, with no network
request. Hash routes: `#/` dashboard, `#/transactions`, `#/budgets`, `#/planner`,
`#/goals`, `#/bills`, `#/reports`.

## Handing it in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to
`$MAKEFUN_OUTPUT_DIR` (default `/output`) and writes `dossier.json` with the vendored
make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `app/index.html` — shell: header, nav, footer; `#app` is filled by the router
- `app/main.js` — entry point, starts the router
- `app/router.js` — hash routes, page state, wiring for every control
- `app/data.js` — every figure: income, transactions, budgets, goals, debts, bills
- `app/state.js` — live in-memory state and actions (add, edit, mark paid, contribute)
- `app/charts.js` — hand-rolled SVG charts (donut, bars, line)
- `app/format.js` — rupiah formatting helpers
- `app/views-dashboard.js`, `app/views-transactions.js`, `app/views-budgets.js`,
  `app/views-planner.js`, `app/views-goals.js`, `app/views-bills.js`,
  `app/views-reports.js` — one page each
- `app/style.css` — the whole design, system fonts only
- `screenshots/` — 4 real renders of the site (dashboard, planner, reports, phone)
- `vendor/makefun-frontend.ts` — the kit's copy, unchanged
- `shots.json` — which view each screenshot was taken of
- `TOURNAMENT.md` — the 14-concept tournament that picked this design
