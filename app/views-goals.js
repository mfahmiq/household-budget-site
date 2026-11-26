// Goals & debt — savings goals with working contributions, and a debt
// payoff calculator (snowball vs avalanche) with real payoff dates.

import { fmt, pct, esc } from './format.js';
import { state, addToGoal, payoffMonths, totalInterest } from './state.js';
import { DEBTS } from './data.js';

export function viewGoals() {
  const goals = state.goals.map((g) => `
    <article class="goal-card">
      <h3>${esc(g.name)}</h3>
      <p class="muted">${esc(g.note)}</p>
      <p class="goal-big">${fmt(g.saved)} <span>of ${fmt(g.target)}</span></p>
      <div class="bar"><span style="width:${Math.round((g.saved / g.target) * 100)}%"></span></div>
      <p class="muted">${pct(g.saved / g.target)} saved · ${fmt(g.target - g.saved)} to go · ${esc(g.eta)}</p>
      <form class="goal-add" data-goal="${g.id}">
        <label>Add (Rp) <input type="number" min="10000" step="10000" value="250000" aria-label="Amount to add to ${esc(g.name)}"></label>
        <button class="btn" type="submit">Add to goal</button>
      </form>
    </article>`).join('');

  const debts = DEBTS.map((d) => {
    const months = payoffMonths(d.balance, d.minPay, d.apr);
    const interest = totalInterest(d.balance, d.minPay, d.apr);
    return `<tr><td>${esc(d.name)}</td><td class="num">${fmt(d.balance)}</td><td class="num">${d.apr}%</td>
      <td class="num">${fmt(d.minPay)}</td><td>${months === null ? 'Never — payment covers only interest' : months + ' months'}</td>
      <td class="num">${interest === null ? '—' : fmt(interest)}</td></tr>`;
  }).join('');

  const totalDebt = DEBTS.reduce((a, d) => a + d.balance, 0);
  const avalanche = [...DEBTS].sort((a, b) => b.apr - a.apr).map((d) => d.name).join(' → ');
  const snowball = [...DEBTS].sort((a, b) => a.balance - b.balance).map((d) => d.name).join(' → ');

  return `
  <section class="page-head">
    <p class="kicker">Goals &amp; debt</p>
    <h1>Save for the good stuff. Kill the debt.</h1>
    <p class="lede">Four goals, ${fmt(state.goals.reduce((a, g) => a + g.saved, 0))} saved so far, and
    ${fmt(totalDebt)} of debt to clear. Add money to a goal below — the progress bars move.</p>
  </section>

  <section class="card">
    <h2>Savings goals</h2>
    <div class="goal-grid">${goals}</div>
  </section>

  <section class="card">
    <h2>Debt payoff</h2>
    <p>Paying only the minimum on the credit card at 24% costs ${fmt(totalInterest(2850000, 285000, 24))} in
    interest. Two ways to attack the list — the maths says avalanche, the motivation says snowball:</p>
    <table class="table">
      <thead><tr><th>Debt</th><th class="num">Balance</th><th class="num">APR</th><th class="num">Min. pay</th><th>Debt-free in</th><th class="num">Interest</th></tr></thead>
      <tbody>${debts}</tbody>
    </table>
    <h3>Avalanche (highest interest first)</h3>
    <p>${esc(avalanche)} — cheapest overall, ${fmt(DEBTS.reduce((a, d) => a + (totalInterest(d.balance, d.minPay, d.apr) || 0), 0))} total interest at minimum payments.</p>
    <h3>Snowball (smallest balance first)</h3>
    <p>${esc(snowball)} — quick wins first; the PayLater is gone in 3 months, which keeps the family going.</p>
  </section>

  <section class="card">
    <h2>Try a bigger payment</h2>
    <p>Extra money changes the maths a lot. Pick a debt and a monthly payment:</p>
    <form id="debt-form" class="form-grid">
      <label>Debt
        <select id="debt-pick">${DEBTS.map((d) => `<option value="${d.id}">${esc(d.name)} — ${fmt(d.balance)} at ${d.apr}%</option>`).join('')}</select>
      </label>
      <label>Monthly payment (Rp) <input type="number" id="debt-pay" min="100000" step="50000" value="500000"></label>
      <span class="form-actions"><button class="btn btn-primary" type="submit">Calculate payoff</button></span>
    </form>
    <p id="debt-result" class="result" aria-live="polite">Paying ${fmt(500000)} a month clears the credit card in 7 months with ${fmt(totalInterest(2850000, 500000, 24))} interest — versus 12 months and ${fmt(totalInterest(2850000, 285000, 24))} at the minimum.</p>
  </section>`;
}

export function wireGoals() {
  document.querySelectorAll('.goal-add').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      addToGoal(form.dataset.goal, Number(form.querySelector('input').value));
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  });

  const form = document.getElementById('debt-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const debt = DEBTS.find((d) => d.id === document.getElementById('debt-pick').value);
    const pay = Number(document.getElementById('debt-pay').value);
    const months = payoffMonths(debt.balance, pay, debt.apr);
    const interest = totalInterest(debt.balance, pay, debt.apr);
    const minMonths = payoffMonths(debt.balance, debt.minPay, debt.apr);
    const minInterest = totalInterest(debt.balance, debt.minPay, debt.apr);
    const out = document.getElementById('debt-result');
    if (months === null) {
      out.textContent = `At ${fmt(pay)} a month the ${debt.name} balance never falls — the payment does not even cover the interest. Pay more than ${fmt(Math.ceil(debt.balance * (debt.apr / 100 / 12)))} a month.`;
    } else {
      out.textContent = `Paying ${fmt(pay)} a month clears the ${debt.name} in ${months} months with ${fmt(interest)} interest — versus ${minMonths} months and ${fmt(minInterest)} at the minimum of ${fmt(debt.minPay)}. You save ${fmt(minInterest - interest)}.`;
    }
  });
}
