/* ============================================================
   مكتبة أيقونات SVG (بديل عن الإيموجي)
   كل أيقونة عبارة عن مسار SVG بسيط بلون موروث من العنصر المحيط (currentColor)
   ============================================================ */

const LJ_ICON_PATHS = {
  search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.2" y2="16.2"/>',
  heart: '<path d="M12 20.5s-7.5-4.6-10-9.3C.6 8 2 4.5 5.4 4c2-.3 3.9.6 5 2.3C11.5 4.6 13.4 3.7 15.4 4c3.4.5 4.8 4 3.4 7.2-2.5 4.7-10 9.3-10 9.3z"/>',
  heartFill: '<path d="M12 20.5s-7.5-4.6-10-9.3C.6 8 2 4.5 5.4 4c2-.3 3.9.6 5 2.3C11.5 4.6 13.4 3.7 15.4 4c3.4.5 4.8 4 3.4 7.2-2.5 4.7-10 9.3-10 9.3z" fill="currentColor" stroke="none"/>',
  bag: '<path d="M6 9h12l-1 12H7L6 9Z"/><path d="M9 9V7a3 3 0 0 1 6 0v2"/>',
  home: '<path d="m3 11 9-7 9 7"/><path d="M5 10v10h14V10"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1"/><rect x="13.5" y="3.5" width="7" height="7" rx="1"/><rect x="3.5" y="13.5" width="7" height="7" rx="1"/><rect x="13.5" y="13.5" width="7" height="7" rx="1"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  checkCircle: '<circle cx="12" cy="12" r="9" fill="currentColor" stroke="none"/><path d="M8 12.3 10.7 15 16 9.3" stroke="#fff" fill="none"/>',
  star: '<path d="m12 3 2.7 5.9 6.3.7-4.7 4.4 1.2 6.3L12 17.4 6.5 20.3l1.2-6.3-4.7-4.4 6.3-.7z"/>',
  starFill: '<path d="m12 3 2.7 5.9 6.3.7-4.7 4.4 1.2 6.3L12 17.4 6.5 20.3l1.2-6.3-4.7-4.4 6.3-.7z" fill="currentColor" stroke="none"/>',
  sparkle: '<path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/>',
  lipstick: '<rect x="9" y="2" width="6" height="7" rx="1.5"/><path d="M9 9h6l-1 11a2 2 0 0 1-2 1.8 2 2 0 0 1-2-1.8L9 9Z"/>',
  droplet: '<path d="M12 3s6 6.6 6 11a6 6 0 1 1-12 0c0-4.4 6-11 6-11Z"/>',
  perfume: '<path d="M9 3h6v3H9z"/><rect x="10.4" y="6" width="3.2" height="2.2"/><path d="M7 8.2h10l1 11.8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L7 8.2Z"/>',
  brush: '<path d="m19 3-7 7"/><path d="m14.2 6.8 3 3"/><path d="M12.5 9.5 6 16c-1.5 1.5-2 4-2 4s2.5-.5 4-2l6.5-6.5"/>',
  ring: '<circle cx="12" cy="15" r="6"/><path d="m9 9 3-6 3 6"/>',
  handbag: '<path d="M5 9h14l-1 12H6L5 9Z"/><path d="M8 9V7a4 4 0 0 1 8 0v2"/>',
  gem: '<path d="M6 3h12l4 6-10 12L2 9Z"/><path d="M2 9h20M9 3l3 6-3 12M15 3l-3 6 3 12"/>',
  dress: '<path d="M9 2h6l1 4-2 2 3 14H7l3-14-2-2 1-4Z"/>',
  gift: '<rect x="3" y="9" width="18" height="12" rx="1"/><path d="M12 9v12M3 9V7a2 2 0 0 1 2-2h2a3 3 0 0 1 0 4Zm18 0V7a2 2 0 0 0-2-2h-2a3 3 0 0 0 0 4Z"/>',
  vase: '<path d="M9 2h6v3l2 3a6 6 0 0 1-2 9v3H9v-3a6 6 0 0 1-2-9l2-3Z"/>',
  candle: '<rect x="8" y="8" width="8" height="14" rx="1"/><path d="M12 2c1.2 1.4 1.6 2.3 1.6 3.2A1.6 1.6 0 0 1 12 6.8a1.6 1.6 0 0 1-1.6-1.6C10.4 4.3 10.8 3.4 12 2Z"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 5H5a3 3 0 0 0 3 5M16 5h3a3 3 0 0 1-3 5"/><path d="M12 13v3M9 20h6M9 18h6v2H9z"/>',
  chat: '<path d="M4 5h16v11H8l-4 4Z"/>',
  share: '<path d="M7 17 17 7"/><path d="M9 7h8v8"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 19c1.2-3.3 4-5 6.5-5s5.3 1.7 6.5 5"/><circle cx="17" cy="9" r="2.6"/><path d="M15.5 14.2c2 .3 4 1.8 5 4.8"/>',
  receipt: '<path d="M6 2h12v20l-2-1.3L14 22l-2-1.3L10 22l-2-1.3L6 22Z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
  box: '<path d="m3 8 9-5 9 5-9 5-9-5Z"/><path d="M3 8v9l9 5 9-5V8"/><path d="M12 13v9"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.4 5.6l-1.5 1.5M7.1 16.9l-1.5 1.5M18.4 18.4l-1.5-1.5M7.1 7.1 5.6 5.6"/>',
  chart: '<path d="M4 20V10M11 20V4M18 20v-7"/><path d="M2 20h20"/>',
  bell: '<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  money: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/>',
  sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.6M12 18.9v2.6M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12h2.6M18.9 12h2.6M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/>',
  moon: '<path d="M20.5 14.7A8.5 8.5 0 0 1 9.3 3.5a8.5 8.5 0 1 0 11.2 11.2Z" fill="currentColor" stroke="none"/>'
};

/**
 * يبني وسم SVG لأيقونة معينة
 * @param {string} name اسم الأيقونة من LJ_ICON_PATHS
 * @param {Object} [opts]
 * @param {string} [opts.class] كلاس إضافي
 * @param {number} [opts.size] الحجم بالبكسل (افتراضي 20)
 */
function LJ_icon(name, opts) {
  opts = opts || {};
  const size = opts.size || 20;
  const cls = "lj-icon" + (opts.class ? " " + opts.class : "");
  const inner = LJ_ICON_PATHS[name] || LJ_ICON_PATHS.sparkle;
  return `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}
