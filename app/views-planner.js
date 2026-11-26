// Planner — plan next month before it starts: income, the 50/30/20 rule
// with working sliders, and a projected end-of-month balance.

import { fmt, pct, esc } from './format.js';
import { state, totalIncome, setPlan } from './state.js';
import { CATEGORIES, SAVINGS_TARGET } from './data.js';

const NEEDS = ['housing', 'groceries', 'transport', 'utilities', 'school', 'health'];
const WANTS = ['dining', 'entertainment', 'clothing', 'misc'];

function groupSum(ids) {
  return ids.reduce((a, id) => a + state.budgets[id], 0);
}

export function viewPlanner() {
  const income = totalIncome();
  const needs = groupSum(NEEDS);
  const wants = groupSum(WANTS);
  const savings = SAVINGS_TARGET;
  const planned = needs + wants + savings;
  const unplanned = income - planned;
  const p = state.plan;

  const checkRow = (label, share, actual, target, isFloor) => {
    const ok = isFloor ? share >= target : share <= target;
    let verdict;
    if (ok) verdict = 'On track';
    else if (isFloor) verdict = 'Under — add ' + fmt(income * target - actual);
    else verdict = 'Over — trim ' + fmt(actual - income * target);
    return `<tr class="${ok ? '' : 'row-warn'}"><td>${label}</td><td>${pct(share)}</td><td>${fmt(actual)}</td><td>${isFloor ? 'at least ' : 'at most '}${pct(target)}</td><td>${verdict}</td></tr>`;
  };

  return `
  <section class="page-head">
    <p class="kicker">Planner · December 2026</p>
    <h1>Plan December before December happens.</h1>
    <p class="lede">Income ${fmt(income)}. The plan below puts ${fmt(planned)} to work and leaves
    <strong>${fmt(unplanned)} unplanned</strong> — give every rupiah a job before the month starts.</p>
  </section>

  <section class="card">
    <h2>The 50/30/20 check</h2>
    <p>Needs at most 50%, wants at most 30%, savings at least 20%. Move the sliders and
    the check updates — the rule is a guide, not a law, but a household that breaks it
    three months running is living beyond its income.</p>
    <div class="sliders">
      <label>Needs — ${p.needs}% <input type="range" id="plan-needs" min="30" max="70" value="${p.needs}"></label>
      <label>Wants — ${p.wants}% <input type="range" id="plan-wants" min="10" max="50" value="${p.wants}"></label>
      <label>Savings — ${p.savings}% <input type="range" id="plan-savings" min="5" max="40" value="${p.savings}"></label>
      <p class="muted" id="plan-sum">Needs ${p.needs}% + wants ${p.wants}% + savings ${p.savings}% = ${p.needs + p.wants + p.savings}%</p>
    </div>
    <table class="table">
      <thead><tr><th>Group</th><th>Share</th><th>Planned</th><th>Rule</th><th>Verdict</th></tr></thead>
      <tbody>
        ${checkRow('Needs', needs / income, needs, 0.5, false)}
        ${checkRow('Wants', wants / income, wants, 0.3, false)}
        ${checkRow('Savings', savings / income, savings, 0.2, true)}
      </tbody>
    </table>
  </section>

  <div class="two-col">
    <section class="card">
      <h2>Needs — ${fmt(needs)}</h2>
      <ul class="plain-list">
        ${NEEDS.map((id) => { const c = CATEGORIES.find((x) => x.id === id); return `<li><span>${esc(c.label)}</span><strong>${fmt(state.budgets[id])}</strong></li>`; }).join('')}
      </ul>
    </section>
    <section class="card">
      <h2>Wants — ${fmt(wants)}</h2>
      <ul class="plain-list">
        ${WANTS.map((id) => { const c = CATEGORIES.find((x) => x.id === id); return `<li><span>${esc(c.label)}</span><strong>${fmt(state.budgets[id])}</strong></li>`; }).join('')}
      </ul>
      <h2>Savings — ${fmt(savings)}</h2>
      <p class="muted">Emergency fund first, then Nadia's laptop, then the Bali holiday.
      <a href="#/goals">See the goals →</a></p>
    </section>
  </div>

  <section class="card">
    <h2>Projected December</h2>
    <p>If December repeats November's income and this plan holds, the household ends the
    month with <strong>${fmt(unplanned)}</strong> still unplanned. The Hartonos' rule: unplanned
    money goes to the emergency fund on the 1st, not to impulse spending on the 28th.</p>
    <p><a class="btn btn-primary" href="#/goals">Send the leftover to a goal →</a></p>
  </section>`;
}

export function wirePlanner() {
  const read = () => ({
    needs: Number(document.getElementById('plan-needs').value),
    wants: Number(document.getElementById('plan-wants').value),
    savings: Number(document.getElementById('plan-savings').value),
  });
  const update = () => {
    const v = read();
    setPlan(v.needs, v.wants, v.savings);
    document.getElementById('plan-sum').textContent =
      `Needs ${v.needs}% + wants ${v.wants}% + savings ${v.savings}% = ${v.needs + v.wants + v.savings}%` +
      (v.needs + v.wants + v.savings === 100 ? ' — adds up to 100%.' : ' — should add up to 100%.');
    document.querySelectorAll('.sliders label').forEach((label, i) => {
      const key = ['needs', 'wants', 'savings'][i];
      label.firstChild.textContent = `${key[0].toUpperCase() + key.slice(1)} — ${v[key]}% `;
    });
  };
  ['plan-needs', 'plan-wants', 'plan-savings'].forEach((id) => {
    document.getElementById(id).addEventListener('input', update);
  });
}
