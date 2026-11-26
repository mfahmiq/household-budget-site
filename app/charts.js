// Hand-rolled SVG charts — donut, horizontal bars, vertical bars, line.
// No library: small, dependency-free, and every chart is drawn from real data.

import { fmtShort, esc } from './format.js';

// Donut: segments [{label, value, color}]. Returns an SVG string.
export function donut(segments, size = 220, thickness = 34) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - thickness) / 2;
  let angle = -90;
  let paths = '';
  for (const seg of segments) {
    const frac = seg.value / total;
    const sweep = frac * 360;
    if (sweep <= 0) continue;
    const a0 = (angle * Math.PI) / 180;
    const a1 = ((angle + sweep) * Math.PI) / 180;
    const large = sweep > 180 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    if (sweep >= 359.9) {
      paths += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${seg.color}" stroke-width="${thickness}"/>`;
    } else {
      paths += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="${seg.color}" stroke-width="${thickness}"/>`;
    }
    angle += sweep;
  }
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category chart" class="chart-svg">${paths}</svg>`;
}

// Horizontal bars: rows [{label, value, color, max?}]. Value labels in Rp.
export function hbars(rows, maxValue) {
  const max = maxValue || Math.max(...rows.map((r) => r.value), 1);
  const rowsHtml = rows
    .map(
      (r) => `<div class="hbar-row">
        <span class="hbar-label">${esc(r.label)}</span>
        <span class="hbar-track"><span class="hbar-fill" style="width:${Math.min(100, (r.value / max) * 100).toFixed(1)}%;background:${r.color}"></span></span>
        <span class="hbar-value">${fmtShort(r.value)}</span>
      </div>`,
    )
    .join('');
  return `<div class="hbars">${rowsHtml}</div>`;
}

// Vertical grouped bars for two series (income vs spent) over months.
export function groupedBars(series, labels, colors) {
  const w = 560;
  const h = 220;
  const padL = 44;
  const padB = 26;
  const padT = 12;
  const max = Math.max(...series.flat(), 1);
  const n = labels.length;
  const slot = (w - padL - 8) / n;
  const barW = Math.min(26, (slot - 18) / 2);
  let bars = '';
  series.forEach((values, si) => {
    values.forEach((v, i) => {
      const bh = ((h - padT - padB) * v) / max;
      const x = padL + i * slot + 8 + si * (barW + 3);
      const y = h - padB - bh;
      bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW}" height="${bh.toFixed(1)}" fill="${colors[si]}" rx="2"><title>${esc(labels[i])}: ${fmtShort(v)}</title></rect>`;
    });
  });
  let grid = '';
  for (let g = 0; g <= 4; g++) {
    const y = padT + ((h - padT - padB) * g) / 4;
    const val = max * (1 - g / 4);
    grid += `<line x1="${padL}" y1="${y}" x2="${w - 8}" y2="${y}" stroke="#e7e0d3" stroke-width="1"/><text x="${padL - 6}" y="${y + 4}" text-anchor="end" font-size="10" fill="#78716c">${fmtShort(val)}</text>`;
  }
  const axis = labels
    .map((l, i) => `<text x="${(padL + i * slot + slot / 2).toFixed(1)}" y="${h - 8}" text-anchor="middle" font-size="11" fill="#57534e">${esc(l)}</text>`)
    .join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Income versus spending by month" class="chart-svg">${grid}${bars}${axis}</svg>`;
}

// Simple line chart for one series with dots and labels.
export function lineChart(values, labels, color = '#14532d') {
  const w = 560;
  const h = 200;
  const padL = 44;
  const padB = 26;
  const padT = 16;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const xs = values.map((_, i) => padL + (i * (w - padL - 12)) / (values.length - 1));
  const ys = values.map((v) => padT + ((max - v) / span) * (h - padT - padB));
  const pts = xs.map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const dots = xs
    .map((x, i) => `<circle cx="${x.toFixed(1)}" cy="${ys[i].toFixed(1)}" r="4" fill="${color}"><title>${esc(labels[i])}: ${fmtShort(values[i])}</title></circle>`)
    .join('');
  const axis = labels
    .map((l, i) => `<text x="${xs[i].toFixed(1)}" y="${h - 8}" text-anchor="middle" font-size="11" fill="#57534e">${esc(l)}</text>`)
    .join('');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Trend chart" class="chart-svg"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>${dots}${axis}</svg>`;
}
