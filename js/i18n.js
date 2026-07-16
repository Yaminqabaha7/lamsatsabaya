/* ============================================================
   طبقة تعدد اللغات (i18n)
   النسخة الأولى تشتغل بالكامل بالعربية، لكن كل نصوص الواجهة
   موجودة بالإنجليزية والعبرية أيضاً حتى يكون النظام جاهز للتوسع
   بدون أي إعادة هيكلة لاحقاً (كما ورد في القرار المعماري بالـ SRS)
   ============================================================ */

const LJ_I18N = {
  ar: {
    dir: "rtl",
    nav_home: "الرئيسية", nav_stores: "المتاجر", nav_cart: "السلة", nav_contact: "تواصل معنا", nav_about: "من نحن",
    hero_title: "إشراقة الجمال الحقيقي", hero_sub: "ثلاثة متاجر متخصصة بالجمال والموضة والهدايا الفاخرة، نقدم لكم تجربة تسوق واحدة تجمع بين الأصالة والجودة والأناقة الحقيقية.",
    hero_cta: "استكشف مجموعة",
    about_title: "شغف بالتميز، لمسة من الإبداع",
    about_desc: "مجموعة لمسة جمال التجارية تضم ثلاثة متاجر مستقلة تحت نظام واحد: لمسة جمال للمكياج والعناية بالبشرة، لمسة صبايا للإكسسوارات والموضة، ومعرض لمسة جمال للهدايا الفاخرة والعطور. نمنحك تجربة تسوق سلسة من التصفح إلى الطلب، مع تواصل مباشر عبر واتساب مع فريق كل متجر.",
    stat_products_label: "منتج مميز", stat_customers_label: "عميل سعيد",
    experience_years_label: "سنوات من الخبرة",
    feature_quality_title: "جودة مضمونة", feature_quality_sub: "منتجات أصلية 100%",
    feature_service_title: "خدمة متميزة", feature_service_sub: "تواصل مباشر عبر واتساب",
    contact_sub: "فريق خدمة العملاء لدينا جاهز دائماً للإجابة عن استفساراتكم بخصوص المنتجات والطلبات، تواصلوا معنا مباشرة.",
    footer_about_desc: "مجموعة رائدة في عالم الجمال والأناقة واللايف ستايل، تضم ثلاثة متاجر متخصصة تحت سقف واحد.",
    store_not_found: "المتجر غير موجود", product_not_found: "المنتج غير موجود", step_confirm: "تأكيد",
    all_products_title: "تصفح كل المنتجات",
    favorites_title: "المفضلة", empty_favorites: "لا توجد منتجات مفضلة بعد",
    stores_title: "وجهاتك المتميزة",
    visit_store: "تسوق الآن",
    contact_title: "هل لديكم أي استفسار؟",
    footer_rights: "جميع الحقوق محفوظة",
    footer_quick_links: "روابط سريعة",
    footer_our_stores: "متاجرنا",
    newsletter_ph: "بريدك الإلكتروني",
    newsletter_btn: "اشترك الآن",
    categories_label: "الفئات",
    shop_by_category: "تسوق حسب الفئة",
    bestsellers_title: "الأكثر مبيعاً",
    view_all: "عرض الكل ←",
    promo_title: "تحتاجين مساعدة باختيار طلبك؟",
    promo_sub: "فريقنا جاهز يساعدك تختاري الأنسب إلك، تواصلي معنا مباشرة عبر واتساب.",
    related_products: "منتجات قد تعجبك",
    order_summary_title: "ملخص طلبك",
    search_ph: "ابحث عن منتج...",
    price_filter: "الفلترة حسب السعر",
    from: "من", to: "إلى", apply: "تطبيق",
    load_more: "عرض المزيد",
    add_cart: "أضف للسلة",
    details: "التفاصيل",
    whatsapp_us: "تواصل عبر واتساب",
    other_stores: "متاجرنا الأخرى",
    cart_title: "سلة المشتريات",
    product_qty: "الكمية",
    price: "السعر",
    total: "المجموع الكلي",
    remove: "حذف",
    checkout_btn: "إتمام الطلب",
    empty_cart: "سلتك فارغة حالياً",
    back_to_store: "عودة للمتجر",
    checkout_title: "إتمام الطلب",
    full_name: "الاسم الكامل",
    whatsapp_number: "رقم الواتساب",
    city: "المدينة",
    address: "العنوان بالتفصيل",
    notes: "ملاحظات (اختياري)",
    submit_order: "تأكيد الطلب",
    order_success: "تم استلام طلبك بنجاح!",
    order_success_sub: "بيتواصل معك فريقنا قريباً لتأكيد التفاصيل",
    order_error: "صار في خطأ بإرسال الطلب، حاول مرة ثانية",
    go_whatsapp: "المتابعة عبر واتساب",
    product_details: "تفاصيل المنتج",
    colors: "الألوان المتاحة",
    sizes: "المقاسات المتاحة",
    inquire_whatsapp: "استفسار عبر واتساب",
    no_results: "لا توجد منتجات مطابقة",
    language: "اللغة",
    reviews_label: "تقييم",
    wa_inquiry_msg: "مرحباً، عندي استفسار عن منتج: {name} ({price} ₪) من {store}",
    order_msg_new_from: "طلب جديد من",
    order_msg_products_label: "المنتجات"
  },
  en: {
    dir: "ltr",
    nav_home: "Home", nav_stores: "Stores", nav_cart: "Cart", nav_contact: "Contact", nav_about: "About Us",
    hero_title: "The True Radiance of Beauty", hero_sub: "Three specialized stores for beauty, fashion and luxury gifts — one shopping experience blending authenticity, quality and true elegance.",
    hero_cta: "Explore the Collection",
    about_title: "A Passion for Excellence, A Touch of Creativity",
    about_desc: "Lamset Jamal Group brings together three independent stores under one system: Lamset Jamal for makeup and skincare, Lamset Sabaya for accessories and fashion, and Maaraz Lamset Jamal for luxury gifts and perfumes. We give you a seamless shopping experience from browsing to ordering, with direct WhatsApp contact for each store's team.",
    stat_products_label: "Featured Products", stat_customers_label: "Happy Customers",
    experience_years_label: "Years of Experience",
    feature_quality_title: "Guaranteed Quality", feature_quality_sub: "100% authentic products",
    feature_service_title: "Outstanding Service", feature_service_sub: "Direct contact via WhatsApp",
    contact_sub: "Our customer service team is always ready to answer your questions about products and orders — reach out directly.",
    footer_about_desc: "A leading group in beauty, elegance and lifestyle, bringing together three specialized stores under one roof.",
    store_not_found: "Store not found", product_not_found: "Product not found", step_confirm: "Confirm",
    all_products_title: "Browse All Products",
    favorites_title: "Favorites", empty_favorites: "No favorite products yet",
    stores_title: "Your Distinguished Destinations",
    visit_store: "Shop Now",
    contact_title: "Have a Question?",
    footer_rights: "All rights reserved",
    footer_quick_links: "Quick Links",
    footer_our_stores: "Our Stores",
    newsletter_ph: "Your email address",
    newsletter_btn: "Subscribe Now",
    categories_label: "Categories",
    shop_by_category: "Shop by Category",
    bestsellers_title: "Bestsellers",
    view_all: "View All ←",
    promo_title: "Need help choosing?",
    promo_sub: "Our team is ready to help you pick the best fit — reach out directly on WhatsApp.",
    related_products: "You Might Also Like",
    order_summary_title: "Order Summary",
    search_ph: "Search products...",
    price_filter: "Filter by price",
    from: "From", to: "To", apply: "Apply",
    load_more: "Load More",
    add_cart: "Add to Cart",
    details: "Details",
    whatsapp_us: "Chat on WhatsApp",
    other_stores: "Our Other Stores",
    cart_title: "Shopping Cart",
    product_qty: "Qty",
    price: "Price",
    total: "Total",
    remove: "Remove",
    checkout_btn: "Checkout",
    empty_cart: "Your cart is empty",
    back_to_store: "Back to store",
    checkout_title: "Checkout",
    full_name: "Full Name",
    whatsapp_number: "WhatsApp Number",
    city: "City",
    address: "Detailed Address",
    notes: "Notes (optional)",
    submit_order: "Confirm Order",
    order_success: "Your order was received!",
    order_success_sub: "Our team will contact you soon to confirm details",
    order_error: "Something went wrong submitting your order, please try again",
    go_whatsapp: "Continue on WhatsApp",
    product_details: "Product Details",
    colors: "Available Colors",
    sizes: "Available Sizes",
    inquire_whatsapp: "Inquire on WhatsApp",
    no_results: "No matching products",
    language: "Language",
    reviews_label: "Reviews",
    wa_inquiry_msg: "Hello, I have a question about the product: {name} ({price} ₪) from {store}",
    order_msg_new_from: "New order from",
    order_msg_products_label: "Products"
  },
  he: {
    dir: "rtl",
    nav_home: "בית", nav_stores: "חנויות", nav_cart: "עגלה", nav_contact: "צור קשר", nav_about: "אודותינו",
    hero_title: "הזוהר האמיתי של היופי", hero_sub: "שלוש חנויות מקצועיות ליופי, אופנה ומתנות יוקרה — חוויית קנייה אחת שמשלבת אותנטיות, איכות ואלגנטיות אמיתית.",
    hero_cta: "גלו את הקולקציה",
    about_title: "תשוקה למצוינות, נגיעה של יצירתיות",
    about_desc: "קבוצת למסת ג'מאל כוללת שלוש חנויות עצמאיות תחת מערכת אחת: למסת ג'מאל לאיפור וטיפוח עור, למסת סבאיא לאביזרים ואופנה, ומעראז' למסת ג'מאל למתנות יוקרה ובשמים. אנו מעניקים לך חוויית קנייה חלקה מהעיון ועד ההזמנה, עם קשר ישיר בוואטסאפ עם צוות כל חנות.",
    stat_products_label: "מוצרים נבחרים", stat_customers_label: "לקוחות מרוצים",
    experience_years_label: "שנות ניסיון",
    feature_quality_title: "איכות מובטחת", feature_quality_sub: "מוצרים מקוריים 100%",
    feature_service_title: "שירות מעולה", feature_service_sub: "קשר ישיר בוואטסאפ",
    contact_sub: "צוות שירות הלקוחות שלנו זמין תמיד לענות על שאלותיכם לגבי מוצרים והזמנות — צרו קשר ישירות.",
    footer_about_desc: "קבוצה מובילה בעולם היופי, האלגנטיות והלייף-סטייל, הכוללת שלוש חנויות מקצועיות תחת קורת גג אחת.",
    store_not_found: "החנות לא נמצאה", product_not_found: "המוצר לא נמצא", step_confirm: "אישור",
    all_products_title: "עיינו בכל המוצרים",
    favorites_title: "מועדפים", empty_favorites: "אין עדיין מוצרים מועדפים",
    stores_title: "היעדים המובחרים שלכם",
    visit_store: "קנו עכשיו",
    contact_title: "יש לכם שאלה?",
    footer_rights: "כל הזכויות שמורות",
    footer_quick_links: "קישורים מהירים",
    footer_our_stores: "החנויות שלנו",
    newsletter_ph: "כתובת האימייל שלך",
    newsletter_btn: "הירשמו עכשיו",
    categories_label: "קטגוריות",
    shop_by_category: "קנייה לפי קטגוריה",
    bestsellers_title: "הנמכרים ביותר",
    view_all: "הצג הכל ←",
    promo_title: "צריכה עזרה בבחירה?",
    promo_sub: "הצוות שלנו כאן בשבילך — צרי קשר ישירות בוואטסאפ.",
    related_products: "אולי יעניין אותך",
    order_summary_title: "סיכום הזמנה",
    search_ph: "חפש מוצר...",
    price_filter: "סינון לפי מחיר",
    from: "מ-", to: "עד", apply: "החל",
    load_more: "טען עוד",
    add_cart: "הוסף לעגלה",
    details: "פרטים",
    whatsapp_us: "צור קשר בוואטסאפ",
    other_stores: "החנויות האחרות שלנו",
    cart_title: "עגלת קניות",
    product_qty: "כמות",
    price: "מחיר",
    total: "סה\"כ",
    remove: "הסר",
    checkout_btn: "לתשלום",
    empty_cart: "העגלה שלך ריקה",
    back_to_store: "חזרה לחנות",
    checkout_title: "השלמת הזמנה",
    full_name: "שם מלא",
    whatsapp_number: "מספר וואטסאפ",
    city: "עיר",
    address: "כתובת מפורטת",
    notes: "הערות (אופציונלי)",
    submit_order: "אישור הזמנה",
    order_success: "ההזמנה שלך התקבלה!",
    order_success_sub: "הצוות שלנו יצור איתך קשר בקרוב",
    order_error: "משהו השתבש בשליחת ההזמנה, נסה שוב",
    go_whatsapp: "המשך בוואטסאפ",
    product_details: "פרטי המוצר",
    colors: "צבעים זמינים",
    sizes: "מידות זמינות",
    inquire_whatsapp: "שאלה בוואטסאפ",
    no_results: "לא נמצאו מוצרים",
    language: "שפה",
    reviews_label: "ביקורות",
    wa_inquiry_msg: "שלום, יש לי שאלה לגבי המוצר: {name} ({price} ₪) מ-{store}",
    order_msg_new_from: "הזמנה חדשה מ",
    order_msg_products_label: "מוצרים"
  }
};

/* ============================================================
   ترجمة أسماء التصنيفات والألوان (نفس المفاتيح المستخدمة بالبيانات)
   ============================================================ */

const LJ_CATEGORY_I18N = {
  "الكل": { ar: "الكل", en: "All", he: "הכל" },
  "مكياج": { ar: "مكياج", en: "Makeup", he: "איפור" },
  "عناية بالبشرة": { ar: "عناية بالبشرة", en: "Skincare", he: "טיפוח עור" },
  "عطور": { ar: "عطور", en: "Perfumes", he: "בשמים" },
  "أدوات تجميل": { ar: "أدوات تجميل", en: "Beauty Tools", he: "כלי איפור" },
  "إكسسوارات": { ar: "إكسسوارات", en: "Accessories", he: "אביזרים" },
  "حقائب": { ar: "حقائب", en: "Bags", he: "תיקים" },
  "مجوهرات": { ar: "مجوهرات", en: "Jewelry", he: "תכשיטים" },
  "ملابس": { ar: "ملابس", en: "Clothing", he: "ביגוד" },
  "هدايا": { ar: "هدايا", en: "Gifts", he: "מתנות" },
  "ديكور": { ar: "ديكور", en: "Decor", he: "עיצוב" },
  "شموع": { ar: "شموع", en: "Candles", he: "נרות" }
};

const LJ_COLOR_I18N = {
  "أسود": { ar: "أسود", en: "Black", he: "שחור" },
  "بني داكن": { ar: "بني داكن", en: "Dark Brown", he: "חום כהה" },
  "وردي مرجاني": { ar: "وردي مرجاني", en: "Coral Pink", he: "ורוד אלמוג" },
  "خوخي": { ar: "خوخي", en: "Peach", he: "אפרסק" },
  "توتي": { ar: "توتي", en: "Berry", he: "פירות יער" },
  "ذهبي": { ar: "ذهبي", en: "Gold", he: "זהב" },
  "فضي": { ar: "فضي", en: "Silver", he: "כסף" },
  "بيج": { ar: "بيج", en: "Beige", he: "בז'" },
  "بورجوندي": { ar: "بورجوندي", en: "Burgundy", he: "בורדו" },
  "أبيض": { ar: "أبيض", en: "White", he: "לבן" },
  "سماوي": { ar: "سماوي", en: "Sky Blue", he: "תכלת" },
  "وردي": { ar: "وردي", en: "Pink", he: "ורוד" },
  "بني": { ar: "بني", en: "Brown", he: "חום" },
  "شفاف": { ar: "شفاف", en: "Clear", he: "שקוף" },
  "كحلي": { ar: "كحلي", en: "Navy", he: "כחול נייבי" },
  "زيتي": { ar: "زيتي", en: "Olive", he: "זית" },
  "متعدد الألوان": { ar: "متعدد الألوان", en: "Multicolor", he: "רב-גוני" },
  "تراكوتا": { ar: "تراكوتا", en: "Terracotta", he: "טרקוטה" },
  "فاتح": { ar: "فاتح", en: "Light", he: "בהיר" },
  "متوسط": { ar: "متوسط", en: "Medium", he: "בינוני" },
  "غامق": { ar: "غامق", en: "Dark", he: "כהה" }
};

function LJ_categoryLabel(key) {
  const lang = LJ_getLang();
  return (LJ_CATEGORY_I18N[key] && LJ_CATEGORY_I18N[key][lang]) || key;
}

function LJ_colorLabel(key) {
  const lang = LJ_getLang();
  return (LJ_COLOR_I18N[key] && LJ_COLOR_I18N[key][lang]) || key;
}

/** يستبدل رموز {name} {price} {store} داخل نص مترجم بقيمها الفعلية */
function LJ_tf(key, vars) {
  let str = LJ_t(key);
  Object.keys(vars || {}).forEach(k => {
    str = str.replace(`{${k}}`, vars[k]);
  });
  return str;
}

const LJ_LANG_KEY = "lj_lang";

function LJ_getLang() {
  return localStorage.getItem(LJ_LANG_KEY) || "ar";
}

function LJ_setLang(lang) {
  if (lang === LJ_getLang()) return;
  localStorage.setItem(LJ_LANG_KEY, lang);
  /* إعادة تحميل الصفحة لضمان ترجمة كل المحتوى الديناميكي (بيانات المتاجر والمنتجات)
     وليس فقط عناصر data-i18n الثابتة */
  location.reload();
}

function LJ_t(key) {
  const lang = LJ_getLang();
  return (LJ_I18N[lang] && LJ_I18N[lang][key]) || LJ_I18N.ar[key] || key;
}

function LJ_applyLang(lang) {
  const dict = LJ_I18N[lang] || LJ_I18N.ar;
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", dict.dir);
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    const key = el.getAttribute("data-i18n-ph");
    if (dict[key]) el.setAttribute("placeholder", dict[key]);
  });
  document.querySelectorAll(".lj-lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  LJ_applyLang(LJ_getLang());
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".lj-lang-btn");
  if (btn) LJ_setLang(btn.dataset.lang);
});
