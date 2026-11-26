// In-memory state — the household's live figures, derived from the seed data.
// Nothing is persisted: every page reads from here, so an added transaction,
// a paid bill or a goal contribution updates the whole site at once.

import {
  INCOME,
  CATEGORIES,
  TRANSACTIONS,
  GOALS,
  DEBTS,
  BILLS,
  SAVINGS_TARGET,
} from './data.js';

// Mutable copies of the seed lists.
export const state = {
  transactions: TRANSACTIONS.map((t) => ({ ...t })),
  budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget])),
  goals: GOALS.map((g) => ({ ...g })),
  bills: BILLS.map((b) => ({ ...b })),
  // Planner: the 50/30/20 split the family aims for this month.
  plan: { needs: 50, wants: 30, savings: 20 },
};

export function totalIncome() {
  return INCOME.reduce((a, i) => a + i.amount, 0);
}

// Spending per category, derived from the transaction list (savings excluded).
export function spentByCategory() {
  const out = Object.fromEntries(CATEGORIES.map((c) => [c.id, 0]));
  for (const t of state.transactions) {
    if (t.cat in out) out[t.cat] += t.amount;
  }
  return out;
}

export function totalSpent() {
  return Object.values(spentByCategory()).reduce((a, b) => a + b, 0);
}

export function totalBudget() {
  return CATEGORIES.reduce((a, c) => a + state.budgets[c.id], 0);
}

export function remaining() {
  return totalIncome() - totalSpent() - SAVINGS_TARGET;
}

export function categoryOf(id) {
  return CATEGORIES.find((c) => c.id === id);
}

export function upcomingBills() {
  return state.bills.filter((b) => !b.paid);
}

export function upcomingBillsTotal() {
  return upcomingBills().reduce((a, b) => a + b.amount, 0);
}

// --- Actions: every control on the site calls one of these, then re-renders. ---

export function addTransaction(tx) {
  state.transactions.push({ ...tx });
  state.transactions.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function setBudget(catId, amount) {
  if (categoryOf(catId) && amount >= 0) state.budgets[catId] = Math.round(amount);
}

export function markBillPaid(billId) {
  const bill = state.bills.find((b) => b.id === billId);
  if (bill) bill.paid = true;
}

export function addToGoal(goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (goal && amount > 0) goal.saved = Math.min(goal.target, goal.saved + Math.round(amount));
}

export function setPlan(needs, wants, savings) {
  state.plan = { needs, wants, savings };
}

// Debt payoff: months to clear a balance at a monthly payment and APR.
export function payoffMonths(balance, monthlyPay, aprPercent) {
  const r = aprPercent / 100 / 12;
  if (monthlyPay <= 0) return null;
  if (r === 0) return Math.ceil(balance / monthlyPay);
  if (monthlyPay <= balance * r) return null; // payment never covers the interest
  return Math.ceil(-Math.log(1 - (balance * r) / monthlyPay) / Math.log(1 + r));
}

export function totalInterest(balance, monthlyPay, aprPercent) {
  const months = payoffMonths(balance, monthlyPay, aprPercent);
  if (months === null) return null;
  return Math.max(0, months * monthlyPay - balance);
}
