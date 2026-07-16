/* ============================================================
   الوضع الداكن / الفاتح - يعمل بكل صفحات الموقع
   هذا الملف يُحمَّل بأول <head> بكل صفحة عشان يطبق الوضع المحفوظ
   فوراً قبل ما ترسم الصفحة (تفادي وميض التبديل)
   ============================================================ */

const LJ_THEME_KEY = "lj_theme_mode";

function LJ_getThemeMode() {
  const stored = localStorage.getItem(LJ_THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** يحدّث الوضع ويعيد تحميل الصفحة عشان كل الألوان (حتى الثابتة داخل السكربتات) تتحدث صح */
function LJ_setThemeMode(mode) {
  if (mode === LJ_getThemeMode()) return;
  localStorage.setItem(LJ_THEME_KEY, mode);
  location.reload();
}

function LJ_toggleThemeMode() {
  LJ_setThemeMode(LJ_getThemeMode() === "dark" ? "light" : "dark");
}

/** يبني زر تبديل الوضع الداكن/الفاتح (نفس شكل أيقونات الهيدر) */
function LJ_themeToggleBtn() {
  return `
    <button type="button" class="lj-topbar-icon lj-theme-toggle" aria-label="تبديل الوضع الداكن/الفاتح">
      ${LJ_icon("sun", { class: "lj-icon-sun" })}
      ${LJ_icon("moon", { class: "lj-icon-moon" })}
    </button>
  `;
}

/* تطبيق فوري لمنع وميض الوضع الفاتح قبل تحميل بقية السكربتات */
document.documentElement.setAttribute("data-theme", LJ_getThemeMode());

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".lj-theme-toggle");
  if (btn) LJ_toggleThemeMode();
});
