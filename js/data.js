/* ============================================================
   LAMSET JAMAL GROUP - DATA LAYER
   كل شيء في النظام مرتبط بـ Store ID (حسب القرار المعماري في SRS)
   LJ_DB يتعبى فعلياً من Supabase عبر LJ_initDB() (راجع js/db.js)
   حقل translations اختياري لكل متجر/منتج (en/he) - العربي هو النص الأساسي
   ============================================================ */

const LJ_DB = { stores: {} };

/* المتجر الافتراضي لما يفتح الزائر رابط بدون ما يحدد ?store= (مثلاً /cart مباشرة) */
const LJ_DEFAULT_STORE_ID = "lamset-jamal";

/* صورة بديلة تظهر تلقائياً إذا تعذر تحميل صورة المنتج (بدون اتصال إنترنت مثلاً) */
function LJ_placeholderImg() {
  return "data:image/svg+xml;utf8," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="700"><rect width="100%" height="100%" fill="#eee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="28" font-family="sans-serif">صورة المنتج</text></svg>`
  );
}

/* دالة مساعدة لإيجاد منتج من أي متجر عن طريق المعرف */
function LJ_findProduct(storeId, productId) {
  const store = LJ_DB.stores[storeId];
  if (!store) return null;
  return store.products.find(p => p.id === productId) || null;
}

/* دالة مساعدة لتطبيق ألوان الثيم الخاصة بالمتجر على الصفحة (تراعي الوضع الداكن/الفاتح) */
function LJ_applyStoreTheme(storeId) {
  const store = LJ_DB.stores[storeId];
  if (!store) return;
  const mode = (typeof LJ_getThemeMode === "function") ? LJ_getThemeMode() : "light";
  const theme = (mode === "dark" && store.themeDark) ? store.themeDark : store.theme;
  const root = document.documentElement;
  root.style.setProperty("--store-primary", theme.primary);
  root.style.setProperty("--store-primary-dark", theme.primaryDark);
  root.style.setProperty("--store-secondary", theme.secondary);
  root.style.setProperty("--store-surface", theme.surface);
  root.style.setProperty("--store-ink", theme.ink);
  root.style.setProperty("--store-accent", theme.accent);
}

/* يرجع قيمة حقل متجر مترجمة حسب اللغة الحالية (يرجع العربي إذا ما في ترجمة) */
function LJ_storeField(store, field) {
  if (!store) return "";
  const lang = LJ_getLang();
  if (lang !== "ar" && store.translations && store.translations[lang] && store.translations[lang][field]) {
    return store.translations[lang][field];
  }
  return store[field];
}

/* يرجع قيمة حقل منتج مترجمة حسب اللغة الحالية (يرجع العربي إذا ما في ترجمة) */
function LJ_productField(product, field) {
  if (!product) return "";
  const lang = LJ_getLang();
  if (lang !== "ar" && product.translations && product.translations[lang] && product.translations[lang][field]) {
    return product.translations[lang][field];
  }
  return product[field];
}
