// Rupiah formatting helpers — one clear job: turn numbers into readable money.

// 12500000 -> "Rp 12.500.000"
export function fmt(n) {
  const s = String(Math.round(Math.abs(n)));
  const grouped = s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (n < 0 ? '-Rp ' : 'Rp ') + grouped;
}

// 12500000 -> "12,5 jt" (short form for charts and tight spaces)
export function fmtShort(n) {
  if (Math.abs(n) >= 1000000) {
    const v = (n / 1000000).toFixed(1).replace('.', ',').replace(/,0$/, '');
    return v + ' jt';
  }
  if (Math.abs(n) >= 1000) return Math.round(n / 1000) + ' rb';
  return String(Math.round(n));
}

// 0.61 -> "61%"
export function pct(x) {
  return Math.round(x * 100) + '%';
}

// "2026-11-26" -> "26 Nov"
export function fmtDate(iso) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const parts = iso.split('-');
  return Number(parts[2]) + ' ' + months[Number(parts[1]) - 1];
}

// Escape text that goes into HTML strings.
export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
