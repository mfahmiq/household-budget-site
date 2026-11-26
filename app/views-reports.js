// Reports — the month in hindsight: budget vs actual, the six-month trend,
// and how this household compares with the average Jakarta family of four.

import { fmt, pct, esc } from './format.js';
import { groupedBars, hbars } from './charts.js';
import { state, spentByCategory, totalIncome, totalBudget } from './state.js';
import { CATEGORIES, TREND, BENCHMARKS } from './data.js';

export function viewReports() {
  const byCat = spentByCategory();
  const income = totalIncome();

  const variance = CATEGORIES.map((c) => {
    const s = byCat[c.id];
    const b = state.budgets[c.id];
    const diff = b - s;
    return `<tr class="${diff < 0 ? 'row-warn' : ''}"><td>${esc(c.label)}</td>
      <td class="num">${fmt(b)}</td><td class="num">${fmt(s)}</td>
      <td class="num">${diff >= 0 ? '+' : '−'}${fmt(Math.abs(diff))}</td>
      <td>${diff >= 0 ? 'Under' : 'Over'}</td></tr>`;
  }).join('');

  const benchRows = BENCHMARKS.map((row) => {
    const cat = CATEGORIES.find((c) => c.label === row.cat);
    const ours = cat ? byCat[cat.id] : 0;
    const diff = ours - row.avg;
    return `<tr><td>${esc(row.cat)}</td><td class="num">${fmt(ours)}</td><td class="num">${fmt(row.avg)}</td>
      <td class="num">${diff <= 0 ? '−' : '+'}${fmt(Math.abs(diff))}</td>
      <td>${diff <= 0 ? 'Below average — good' : 'Above average'}</td></tr>`;
  }).join('');

  const trend = groupedBars(
    [TREND.map((t) => t.income), TREND.map((t) => t.spent)],
    TREND.map((t) => t.month),
    ['#14532d', '#b45309'],
  );

  const topCats = [...CATEGORIES]
    .map((c) => ({ label: c.label, value: byCat[c.id], color: c.color }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const totalSaved = TREND.reduce((a, t) => a + (t.income - t.spent), 0);

  return `
  <section class="page-head">
    <p class="kicker">Reports · June – November 2026</p>
    <h1>What six months actually look like.</h1>
    <p class="lede">Income has beaten spending every month since June — ${fmt(totalSaved)} kept in six
    months. The trend below, the variance table and the benchmark check show where, exactly.</p>
  </section>

  <section class="card">
    <h2>Income vs spending — last 6 months</h2>
    ${trend}
    <p class="legend-inline"><span class="dot" style="background:#14532d"></span> Income &nbsp;
    <span class="dot" style="background:#b45309"></span> Spending</p>
    <p class="muted">August was the worst month: school fees and a new phone pushed spending to
    ${fmt(15100000)}. September bounced back — proof the budget works when it is followed.</p>
  </section>

  <div class="two-col">
    <section class="card">
      <h2>Biggest spending — November</h2>
      ${hbars(topCats)}
      <p class="muted">Housing and groceries are two-thirds of all spending. That is normal for a
      family of four — and why the planner starts there.</p>
    </section>
    <section class="card">
      <h2>Budget vs actual — November</h2>
      <table class="table">
        <thead><tr><th>Category</th><th class="num">Budget</th><th class="num">Actual</th><th class="num">Left</th><th></th></tr></thead>
        <tbody>${variance}</tbody>
      </table>
      <p class="muted">Three categories over, seven under. Net across all ten pots:
      ${fmt(totalBudget() - Object.values(byCat).reduce((a, b) => a + b, 0))} still unspent against the plan.</p>
    </section>
  </div>

  <section class="card">
    <h2>Against the average Jakarta household of four</h2>
    <p>Benchmarks are a mirror, not a verdict: this family rents in Depok, not central Jakarta,
    and cooks most nights — so housing and dining run below average while school runs above it.</p>
    <table class="table">
      <thead><tr><th>Category</th><th class="num">Hartono</th><th class="num">Average</th><th class="num">Difference</th><th></th></tr></thead>
      <tbody>${benchRows}</tbody>
    </table>
    <p class="muted">Benchmark figures: average monthly spending, Jakarta households of four, 2026.
    Use them to spot a category worth a second look — not to feel bad about school fees.</p>
  </section>`;
}
