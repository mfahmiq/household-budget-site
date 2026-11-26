// Dashboard — the month at a glance: income vs spending, category donut,
// savings goals, upcoming bills and the latest transactions.

import { fmt, fmtShort, pct, fmtDate, esc } from './format.js';
import { donut } from './charts.js';
import {
  state,
  totalIncome,
  totalSpent,
  spentByCategory,
  remaining,
  upcomingBills,
  categoryOf,
} from './state.js';
import { CATEGORIES, SAVINGS_MOVED, SAVINGS_TARGET, HOUSEHOLD } from './data.js';

export function viewDashboard() {
  const income = totalIncome();
  const spent = totalSpent();
  const left = remaining();
  const byCat = spentByCategory();
  const segments = CATEGORIES.map((c) => ({ label: c.label, value: byCat[c.id], color: c.color }));
  const over = CATEGORIES.filter((c) => byCat[c.id] > state.budgets[c.id]);
  const latest = [...state.transactions].slice(0, 6);
  const bills = upcomingBills();

  return `
  <section class="page-head">
    <p class="kicker">${esc(HOUSEHOLD.month)} · ${esc(HOUSEHOLD.city)}</p>
    <h1>Good evening, Hartono family.</h1>
    <p class="lede">November is nearly done. You have spent ${fmt(spent)} of ${fmt(income)} coming in,
    moved ${fmt(SAVINGS_MOVED)} to savings, and have <strong>${fmt(left)} left to allocate</strong>.</p>
  </section>

  <section class="stat-grid" aria-label="Month summary">
    <article class="stat"><span class="stat-label">Income</span><strong>${fmt(income)}</strong><span class="stat-sub">Salary + freelance + interest</span></article>
    <article class="stat"><span class="stat-label">Spent</span><strong>${fmt(spent)}</strong><span class="stat-sub">${pct(spent / income)} of income</span></article>
    <article class="stat"><span class="stat-label">To savings</span><strong>${fmt(SAVINGS_MOVED)}</strong><span class="stat-sub">Target ${fmt(SAVINGS_TARGET)} — reached</span></article>
    <article class="stat ${left < 0 ? 'stat-bad' : 'stat-good'}"><span class="stat-label">Left to allocate</span><strong>${fmt(left)}</strong><span class="stat-sub">${bills.length} bills still due · ${fmt(bills.reduce((a, b) => a + b.amount, 0))}</span></article>
  </section>

  ${over.length ? `<p class="notice notice-warn"><strong>Over budget:</strong> ${over.map((c) => esc(c.label) + ' (' + fmt(byCat[c.id] - state.budgets[c.id]) + ' over)').join(', ')}. See <a href="#/budgets">Budgets</a> to adjust or move money.</p>` : ''}

  <div class="two-col">
    <section class="card">
      <h2>Where the money went</h2>
      <div class="donut-wrap">${donut(segments)}
        <div class="donut-centre"><strong>${fmtShort(spent)}</strong><span>spent in Nov</span></div>
      </div>
      <ul class="legend">
        ${segments.map((s) => `<li><span class="dot" style="background:${s.color}"></span>${esc(s.label)} <strong>${fmt(s.value)}</strong></li>`).join('')}
      </ul>
    </section>

    <section class="card">
      <h2>Savings goals</h2>
      ${state.goals.map((g) => `
        <div class="goal-row">
          <div class="goal-head"><strong>${esc(g.name)}</strong><span>${fmt(g.saved)} of ${fmt(g.target)}</span></div>
          <div class="bar"><span style="width:${Math.round((g.saved / g.target) * 100)}%"></span></div>
          <p class="muted">${pct(g.saved / g.target)} saved · ${esc(g.eta)}</p>
        </div>`).join('')}
      <p><a class="btn" href="#/goals">Open savings &amp; debt →</a></p>
    </section>
  </div>

  <div class="two-col">
    <section class="card">
      <h2>Bills still to pay</h2>
      ${bills.length ? `<ul class="bill-list">
        ${bills.map((b) => `<li><strong>${esc(b.name)}</strong><span>due ${fmtDate(b.due)}</span><strong>${fmt(b.amount)}</strong></li>`).join('')}
      </ul>` : '<p>All November bills are paid. Well done.</p>'}
      <p><a class="btn" href="#/bills">See all bills →</a></p>
    </section>

    <section class="card">
      <h2>Latest spending</h2>
      <table class="table">
        <thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th></tr></thead>
        <tbody>
          ${latest.map((t) => `<tr><td>${fmtDate(t.date)}</td><td>${esc(t.desc)}</td><td>${esc(categoryOf(t.cat).label)}</td><td class="num">${fmt(t.amount)}</td></tr>`).join('')}
        </tbody>
      </table>
      <p><a class="btn" href="#/transactions">All transactions →</a></p>
    </section>
  </div>

  <section class="card tip">
    <h2>This month's tip</h2>
    <p>Needs run at 66% of income — over the 50% in the 50/30/20 rule, but normal for a Jakarta
    family of four with two tuitions. Wants are only 12%, so there is nothing painless left to
    trim there. The lever is the ${fmt(left)} left over: it goes to the emergency fund on the
    1st, not to impulse spending on the 28th. Check the rule on the <a href="#/planner">Planner</a>.</p>
  </section>`;
}
