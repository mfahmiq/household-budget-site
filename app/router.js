// Hash router — one route per page, each reached by a link in the header.
// After rendering, the page's own wiring function hooks up its controls.

import { viewDashboard } from './views-dashboard.js';
import { viewTransactions, wireTransactions } from './views-transactions.js';
import { viewBudgets, wireBudgets } from './views-budgets.js';
import { viewPlanner, wirePlanner } from './views-planner.js';
import { viewGoals, wireGoals } from './views-goals.js';
import { viewBills, wireBills } from './views-bills.js';
import { viewReports } from './views-reports.js';

const ROUTES = {
  '/': { title: 'Dashboard', render: viewDashboard, wire: null },
  '/transactions': { title: 'Transactions', render: viewTransactions, wire: wireTransactions },
  '/budgets': { title: 'Budgets', render: viewBudgets, wire: wireBudgets },
  '/planner': { title: 'Planner', render: viewPlanner, wire: wirePlanner },
  '/goals': { title: 'Goals & debt', render: viewGoals, wire: wireGoals },
  '/bills': { title: 'Bills', render: viewBills, wire: wireBills },
  '/reports': { title: 'Reports', render: viewReports, wire: null },
};

export function currentRoute() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  return ROUTES[hash] ? hash : '/';
}

export function render() {
  const route = ROUTES[currentRoute()];
  const app = document.getElementById('app');
  app.innerHTML = route.render();
  document.title = `DuitRumah — ${route.title}`;
  document.querySelectorAll('.site-nav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + currentRoute());
  });
  if (route.wire) route.wire();
  window.scrollTo(0, 0);
}

export function startRouter() {
  window.addEventListener('hashchange', render);
  render();
}
