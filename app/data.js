// DuitRumah data — the Hartono household, Jakarta, November 2026.
// Every figure is the site's own content. Category spending is derived from
// the transaction list, so the dashboard, budgets and reports always agree.

export const HOUSEHOLD = {
  name: 'Hartono family',
  members: ['Budi', 'Sari', 'Nadia', 'Raka'],
  city: 'Jakarta',
  month: 'November 2026',
  monthKey: '2026-11',
  note: 'Two incomes, two kids (Nadia 14, Raka 9), one rented house in Depok.',
};

export const INCOME = [
  { source: 'Budi — salary, PT Nusantara Logistics', amount: 12500000, day: 1 },
  { source: 'Sari — freelance design', amount: 4800000, day: 15 },
  { source: 'Bank interest & cashback', amount: 350000, day: 28 },
];

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', budget: 3500000, color: '#14532d', blurb: 'Rent, repairs and upkeep of the house.' },
  { id: 'groceries', label: 'Groceries', budget: 3200000, color: '#15803d', blurb: 'Weekly market, supermarket and pantry staples.' },
  { id: 'transport', label: 'Transport', budget: 1400000, color: '#0e7490', blurb: 'Fuel, tolls, MRT and ride-hailing.' },
  { id: 'utilities', label: 'Utilities', budget: 1150000, color: '#0369a1', blurb: 'Electricity, water, internet and phones.' },
  { id: 'school', label: 'School & kids', budget: 1800000, color: '#b45309', blurb: 'Tuition, books, tutoring and school needs.' },
  { id: 'dining', label: 'Eating out', budget: 900000, color: '#be123c', blurb: 'Restaurants, delivery and weekend treats.' },
  { id: 'health', label: 'Health', budget: 600000, color: '#7c3aed', blurb: 'Doctor, dentist, pharmacy and vitamins.' },
  { id: 'entertainment', label: 'Entertainment', budget: 500000, color: '#db2777', blurb: 'Cinema, streaming and family fun.' },
  { id: 'clothing', label: 'Clothing', budget: 400000, color: '#475569', blurb: 'Clothes and shoes for the four of us.' },
  { id: 'misc', label: 'Everything else', budget: 400000, color: '#78716c', blurb: 'Gifts, household bits and surprises.' },
];

// Savings is a transfer, not spending: it leaves the current account on purpose.
export const SAVINGS_TARGET = 2500000;
export const SAVINGS_MOVED = 2500000;

export const TRANSACTIONS = [
  { date: '2026-11-01', desc: 'House rent — November', cat: 'housing', amount: 3200000, who: 'Budi' },
  { date: '2026-11-02', desc: 'Pasar Minggu — weekly shop', cat: 'groceries', amount: 620000, who: 'Sari' },
  { date: '2026-11-03', desc: 'Fuel — Pertamax, Avanza', cat: 'transport', amount: 350000, who: 'Budi' },
  { date: '2026-11-04', desc: 'PLN electricity token', cat: 'utilities', amount: 420000, who: 'Budi' },
  { date: '2026-11-05', desc: 'Nadia school tuition', cat: 'school', amount: 900000, who: 'Sari' },
  { date: '2026-11-05', desc: 'Raka school tuition', cat: 'school', amount: 650000, who: 'Sari' },
  { date: '2026-11-06', desc: 'Supermarket — Hypermart', cat: 'groceries', amount: 540000, who: 'Sari' },
  { date: '2026-11-07', desc: 'Dinner at Warung Sederhana', cat: 'dining', amount: 185000, who: 'Budi' },
  { date: '2026-11-08', desc: 'MRT + toll — Jakarta trip', cat: 'transport', amount: 280000, who: 'Budi' },
  { date: '2026-11-09', desc: 'Plumber — leaking kitchen tap', cat: 'housing', amount: 180000, who: 'Budi' },
  { date: '2026-11-10', desc: 'PDAM water bill', cat: 'utilities', amount: 185000, who: 'Sari' },
  { date: '2026-11-11', desc: 'Cinema — family movie night', cat: 'entertainment', amount: 180000, who: 'Sari' },
  { date: '2026-11-12', desc: 'Pasar Minggu — weekly shop', cat: 'groceries', amount: 480000, who: 'Sari' },
  { date: '2026-11-13', desc: 'Dentist — Raka check-up', cat: 'health', amount: 350000, who: 'Sari' },
  { date: '2026-11-14', desc: 'Nadia maths tutoring', cat: 'school', amount: 300000, who: 'Sari' },
  { date: '2026-11-15', desc: 'Internet — IndiHome', cat: 'utilities', amount: 350000, who: 'Budi' },
  { date: '2026-11-16', desc: 'Supermarket — weekly shop', cat: 'groceries', amount: 715000, who: 'Sari' },
  { date: '2026-11-17', desc: 'Gojek rides — school run', cat: 'transport', amount: 195000, who: 'Sari' },
  { date: '2026-11-18', desc: 'Pharmacy — flu medicine', cat: 'health', amount: 120000, who: 'Sari' },
  { date: '2026-11-19', desc: 'Raka new school shoes', cat: 'clothing', amount: 280000, who: 'Sari' },
  { date: '2026-11-20', desc: 'Streaming — yearly plan share', cat: 'entertainment', amount: 149000, who: 'Budi' },
  { date: '2026-11-21', desc: 'Pasar Minggu — weekly shop', cat: 'groceries', amount: 390000, who: 'Sari' },
  { date: '2026-11-22', desc: 'Lunch — Soto Betawi, family', cat: 'dining', amount: 240000, who: 'Budi' },
  { date: '2026-11-23', desc: 'Fuel — Pertamax, Avanza', cat: 'transport', amount: 350000, who: 'Budi' },
  { date: '2026-11-24', desc: 'Sari new blouse', cat: 'clothing', amount: 190000, who: 'Sari' },
  { date: '2026-11-25', desc: 'Phone credit — Sari', cat: 'utilities', amount: 150000, who: 'Sari' },
  { date: '2026-11-26', desc: 'Gift — neighbour wedding', cat: 'misc', amount: 150000, who: 'Sari' },
  { date: '2026-11-26', desc: 'Vitamins — family pack', cat: 'health', amount: 95000, who: 'Sari' },
  { date: '2026-11-26', desc: 'Board game — family night', cat: 'entertainment', amount: 220000, who: 'Budi' },
  { date: '2026-11-26', desc: 'Household items — broom, soap', cat: 'misc', amount: 130000, who: 'Sari' },
  { date: '2026-11-26', desc: 'Pasar Minggu — top-up shop', cat: 'groceries', amount: 265000, who: 'Sari' },
  { date: '2026-11-26', desc: 'Parking — mall', cat: 'transport', amount: 85000, who: 'Budi' },
  { date: '2026-11-26', desc: 'Delivery dinner — fried chicken', cat: 'dining', amount: 120000, who: 'Budi' },
  { date: '2026-11-25', desc: 'Delivery lunch — nasi padang', cat: 'dining', amount: 95000, who: 'Sari' },
  { date: '2026-11-24', desc: 'Coffee & cake — Sari & friend', cat: 'dining', amount: 210000, who: 'Sari' },
];

export const GOALS = [
  { id: 'emergency', name: 'Emergency fund', target: 30000000, saved: 18400000, note: 'Six months of essentials, for the unexpected.', eta: 'March 2027 at Rp 2.5 jt a month' },
  { id: 'laptop', name: "Nadia's laptop", target: 9500000, saved: 6200000, note: 'For school coding class — she starts in January.', eta: 'January 2027' },
  { id: 'holiday', name: 'Family holiday — Bali', target: 12000000, saved: 4750000, note: 'Five days in Ubud next school break.', eta: 'June 2027' },
  { id: 'bike', name: 'Motorbike down payment', target: 5000000, saved: 2100000, note: 'A second bike so Budi stops borrowing Sari’s.', eta: 'February 2027' },
];

export const DEBTS = [
  { id: 'cc', name: 'Credit card — BCA', balance: 2850000, apr: 24, minPay: 285000, note: 'Left over from the Lebaran trip.' },
  { id: 'bike-loan', name: 'Motorbike loan', balance: 6400000, apr: 12, minPay: 550000, note: '18 of 24 instalments paid.' },
  { id: 'paylater', name: 'PayLater — 0% promo', balance: 720000, apr: 0, minPay: 240000, note: 'Three instalments left, no interest.' },
];

export const BILLS = [
  { id: 'rent', name: 'House rent', amount: 3200000, due: '2026-11-01', paid: true, recur: 'Monthly' },
  { id: 'tuition-nadia', name: 'Nadia school tuition', amount: 900000, due: '2026-11-05', paid: true, recur: 'Monthly' },
  { id: 'tuition-raka', name: 'Raka school tuition', amount: 650000, due: '2026-11-05', paid: true, recur: 'Monthly' },
  { id: 'pln', name: 'PLN electricity', amount: 420000, due: '2026-11-10', paid: true, recur: 'Monthly' },
  { id: 'pdam', name: 'PDAM water', amount: 185000, due: '2026-11-12', paid: true, recur: 'Monthly' },
  { id: 'internet', name: 'Internet — IndiHome', amount: 350000, due: '2026-11-15', paid: true, recur: 'Monthly' },
  { id: 'streaming', name: 'Streaming subscription', amount: 149000, due: '2026-11-20', paid: true, recur: 'Monthly' },
  { id: 'phone', name: 'Phone — Sari', amount: 150000, due: '2026-11-25', paid: true, recur: 'Monthly' },
  { id: 'cc-bill', name: 'Credit card minimum', amount: 285000, due: '2026-11-27', paid: false, recur: 'Monthly' },
  { id: 'bike-bill', name: 'Motorbike loan instalment', amount: 550000, due: '2026-11-30', paid: false, recur: 'Monthly' },
];

// Six months of income vs spending, for the trend chart on Reports.
export const TREND = [
  { month: 'Jun', income: 16900000, spent: 13800000 },
  { month: 'Jul', income: 17200000, spent: 14200000 },
  { month: 'Aug', income: 17500000, spent: 15100000 },
  { month: 'Sep', income: 17100000, spent: 13900000 },
  { month: 'Oct', income: 17650000, spent: 13400000 },
  { month: 'Nov', income: 17650000, spent: 13529000 },
];

// Average Jakarta household of four, per month — the benchmark on Reports.
export const BENCHMARKS = [
  { cat: 'Housing', avg: 3800000 },
  { cat: 'Groceries', avg: 3500000 },
  { cat: 'Transport', avg: 1600000 },
  { cat: 'Utilities', avg: 1200000 },
  { cat: 'School & kids', avg: 1500000 },
  { cat: 'Eating out', avg: 1100000 },
  { cat: 'Health', avg: 500000 },
  { cat: 'Entertainment', avg: 700000 },
];

// Envelopes: the same budget split into cash envelopes (concept 4, folded in).
export const ENVELOPES = [
  { id: 'env-food', name: 'Food envelope', cats: ['groceries', 'dining'], cash: 4100000 },
  { id: 'env-home', name: 'Home envelope', cats: ['housing', 'utilities'], cash: 4650000 },
  { id: 'env-move', name: 'Getting around', cats: ['transport'], cash: 1400000 },
  { id: 'env-kids', name: 'Kids envelope', cats: ['school', 'clothing'], cash: 2200000 },
  { id: 'env-fun', name: 'Fun envelope', cats: ['entertainment', 'health', 'misc'], cash: 1500000 },
];
