// Bills — every recurring bill: what is due, what is paid, what is coming,
// with a working "mark paid" control.

import { fmt, fmtDate, esc } from './format.js';
import { state, markBillPaid, upcomingBillsTotal } from './state.js';

export function viewBills() {
  const paid = state.bills.filter((b) => b.paid);
  const due = state.bills.filter((b) => !b.paid);
  const paidTotal = paid.reduce((a, b) => a + b.amount, 0);
  const dueTotal = upcomingBillsTotal();

  const row = (b) => `<tr>
    <td>${esc(b.name)}</td><td>${esc(b.recur)}</td><td>${fmtDate(b.due)}</td><td class="num">${fmt(b.amount)}</td>
    <td>${b.paid
      ? '<span class="pill pill-paid">Paid</span>'
      : `<form class="inline-form" data-bill="${b.id}"><button class="btn btn-small" type="submit">Mark paid</button></form>`}</td>
  </tr>`;

  return `
  <section class="page-head">
    <p class="kicker">Bills · November 2026</p>
    <h1>Nothing due gets missed.</h1>
    <p class="lede">${paid.length} of ${state.bills.length} bills paid (${fmt(paidTotal)}). Still to pay:
    <strong>${fmt(dueTotal)}</strong> across ${due.length} bills. Mark one paid and it moves down the list.</p>
  </section>

  <section class="card">
    <h2>Still to pay</h2>
    ${due.length ? `<table class="table">
      <thead><tr><th>Bill</th><th>Repeats</th><th>Due</th><th class="num">Amount</th><th></th></tr></thead>
      <tbody>${due.map(row).join('')}</tbody>
    </table>` : '<p>All November bills are paid. December bills appear here on the 1st.</p>'}
  </section>

  <section class="card">
    <h2>Paid this month</h2>
    <table class="table">
      <thead><tr><th>Bill</th><th>Repeats</th><th>Due</th><th class="num">Amount</th><th></th></tr></thead>
      <tbody>${paid.map(row).join('')}</tbody>
    </table>
  </section>

  <section class="card tip">
    <h2>Why the Hartonos pay on the due date, not early</h2>
    <p>Money paid early earns nothing in a current account. Every bill is paid on its due
    date, and the cash sits in the savings account until then — about ${fmt(95000)} a year in
    interest on the float, for doing nothing.</p>
  </section>`;
}

export function wireBills() {
  document.querySelectorAll('.inline-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      markBillPaid(form.dataset.bill);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  });
}
