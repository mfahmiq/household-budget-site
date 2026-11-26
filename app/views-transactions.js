// Transactions — the full ledger: filter by category or member, search by
// description, and add a new transaction (it updates every page at once).

import { fmt, fmtDate, esc } from './format.js';
import { state, addTransaction, categoryOf, totalSpent } from './state.js';
import { CATEGORIES, HOUSEHOLD } from './data.js';

export function viewTransactions() {
  const rows = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1));
  return `
  <section class="page-head">
    <p class="kicker">Ledger · ${esc(HOUSEHOLD.month)}</p>
    <h1>Every rupiah, accounted for.</h1>
    <p class="lede">${rows.length} transactions, ${fmt(totalSpent())} spent. Filter the list, or add
    something you just bought — the dashboard, budgets and reports update with it.</p>
  </section>

  <section class="card">
    <h2>Add a transaction</h2>
    <form id="add-form" class="form-grid">
      <label>Date <input type="date" id="f-date" value="2026-11-26" required></label>
      <label>What was it? <input type="text" id="f-desc" placeholder="e.g. Pasar Minggu — weekly shop" required></label>
      <label>Category
        <select id="f-cat">${CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join('')}</select>
      </label>
      <label>Amount (Rp) <input type="number" id="f-amount" min="1000" step="1000" placeholder="250000" required></label>
      <label>Who spent it?
        <select id="f-who">${HOUSEHOLD.members.map((m) => `<option>${esc(m)}</option>`).join('')}</select>
      </label>
      <span class="form-actions"><button class="btn btn-primary" type="submit">Add to the ledger</button></span>
    </form>
    <p class="muted" id="add-note">New entries appear at the top of the list below.</p>
  </section>

  <section class="card">
    <h2>Filter the ledger</h2>
    <div class="filters">
      <label>Category
        <select id="filter-cat">
          <option value="">All categories</option>
          ${CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join('')}
        </select>
      </label>
      <label>Who
        <select id="filter-who">
          <option value="">Everyone</option>
          ${HOUSEHOLD.members.map((m) => `<option>${esc(m)}</option>`).join('')}
        </select>
      </label>
      <label>Search <input type="search" id="filter-text" placeholder="e.g. pasar, fuel, school"></label>
    </div>
    <p class="muted"><span id="filter-count">${rows.length}</span> of ${rows.length} shown · <strong id="filter-total">${fmt(totalSpent())}</strong></p>
    <table class="table" id="ledger">
      <thead><tr><th>Date</th><th>What</th><th>Category</th><th>Who</th><th class="num">Amount</th></tr></thead>
      <tbody>
        ${rows.map((t) => `<tr data-cat="${t.cat}" data-who="${esc(t.who)}" data-desc="${esc(t.desc.toLowerCase())}" data-amount="${t.amount}">
          <td>${fmtDate(t.date)}</td><td>${esc(t.desc)}</td><td>${esc(categoryOf(t.cat).label)}</td><td>${esc(t.who)}</td><td class="num">${fmt(t.amount)}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </section>`;
}

// Wiring for this page, called by the router after the HTML is in place.
export function wireTransactions() {
  const form = document.getElementById('add-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const tx = {
      date: document.getElementById('f-date').value,
      desc: document.getElementById('f-desc').value.trim(),
      cat: document.getElementById('f-cat').value,
      amount: Number(document.getElementById('f-amount').value),
      who: document.getElementById('f-who').value,
    };
    if (!tx.desc || !tx.amount) return;
    addTransaction(tx);
    document.getElementById('add-note').textContent = `Added “${tx.desc}” — ${fmt(tx.amount)}. It now counts everywhere.`;
    form.reset();
    document.getElementById('f-date').value = '2026-11-26';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });

  const applyFilter = () => {
    const cat = document.getElementById('filter-cat').value;
    const who = document.getElementById('filter-who').value;
    const text = document.getElementById('filter-text').value.trim().toLowerCase();
    let count = 0;
    let total = 0;
    document.querySelectorAll('#ledger tbody tr').forEach((tr) => {
      const ok =
        (!cat || tr.dataset.cat === cat) &&
        (!who || tr.dataset.who === who) &&
        (!text || tr.dataset.desc.includes(text));
      tr.style.display = ok ? '' : 'none';
      if (ok) {
        count += 1;
        total += Number(tr.dataset.amount);
      }
    });
    document.getElementById('filter-count').textContent = count;
    document.getElementById('filter-total').textContent = fmt(total);
  };
  ['filter-cat', 'filter-who', 'filter-text'].forEach((id) => {
    document.getElementById(id).addEventListener('input', applyFilter);
  });
}
