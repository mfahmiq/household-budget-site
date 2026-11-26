// Budgets — one bar per category: planned vs spent, editable amounts,
// plus the envelope view (the same money, grouped as cash envelopes).

import { fmt, pct, esc } from './format.js';
import { state, spentByCategory, totalBudget, totalSpent, setBudget } from './state.js';
import { CATEGORIES, ENVELOPES } from './data.js';

export function viewBudgets() {
  const byCat = spentByCategory();
  const totalB = totalBudget();
  const spent = totalSpent();
  const rows = CATEGORIES.map((c) => {
    const s = byCat[c.id];
    const b = state.budgets[c.id];
    const over = s > b;
    return `<div class="budget-row">
      <div class="budget-head">
        <strong><span class="dot" style="background:${c.color}"></span>${esc(c.label)}</strong>
        <span>${fmt(s)} of ${fmt(b)} · ${pct(s / b)} used</span>
      </div>
      <div class="bar ${over ? 'bar-over' : ''}"><span style="width:${Math.min(100, (s / b) * 100)}%"></span></div>
      <p class="muted">${esc(c.blurb)} ${over ? `<strong class="over-text">${fmt(s - b)} over — move money or raise the budget.</strong>` : `${fmt(b - s)} still in the pot.`}</p>
      <form class="budget-edit" data-cat="${c.id}">
        <label>Monthly budget (Rp) <input type="number" min="0" step="50000" value="${b}" aria-label="Budget for ${esc(c.label)}"></label>
        <button class="btn" type="submit">Update</button>
      </form>
    </div>`;
  }).join('');

  const envelopes = ENVELOPES.map((env) => {
    const planned = env.cats.reduce((a, id) => a + state.budgets[id], 0);
    const spentEnv = env.cats.reduce((a, id) => a + byCat[id], 0);
    return `<article class="envelope">
      <h3>${esc(env.name)}</h3>
      <p class="muted">${env.cats.map((id) => esc(CATEGORIES.find((c) => c.id === id).label)).join(' + ')}</p>
      <p class="envelope-cash">${fmt(env.cash - spentEnv)} <span>left of ${fmt(env.cash)} cash</span></p>
      <div class="bar"><span style="width:${Math.min(100, (spentEnv / env.cash) * 100)}%"></span></div>
      <p class="muted">${fmt(spentEnv)} spent · ${pct(spentEnv / env.cash)} of the envelope</p>
    </article>`;
  }).join('');

  return `
  <section class="page-head">
    <p class="kicker">Budgets · November 2026</p>
    <h1>Ten pots, one income.</h1>
    <p class="lede">You planned ${fmt(totalB)} across ten categories and have spent ${fmt(spent)}.
    Edit any budget below — the bars, the dashboard and the reports follow.</p>
  </section>

  <section class="card">
    <h2>Category budgets</h2>
    ${rows}
  </section>

  <section class="card">
    <h2>Envelope view</h2>
    <p>Prefer cash? The same budget, regrouped into five envelopes. When an envelope is
    empty, spending from it stops until next month — no borrowing without deciding to.</p>
    <div class="envelope-grid">${envelopes}</div>
  </section>

  <section class="card tip">
    <h2>How the Hartonos set these</h2>
    <p>Start from last month's real spending, not a wish. Groceries got ${fmt(3200000)} because
    October's market trips averaged ${fmt(795000)} a week. School &amp; kids is the only pot over
    budget this month — tutoring was a one-off, so it stays as it is.</p>
  </section>`;
}

export function wireBudgets() {
  document.querySelectorAll('.budget-edit').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      setBudget(form.dataset.cat, Number(input.value));
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  });
}
