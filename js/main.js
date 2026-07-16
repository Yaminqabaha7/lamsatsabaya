/* ============================================================
   منطق الصفحة الرئيسية
   ============================================================ */

(async function () {
  try {
    await LJ_initDB();
  } catch (err) {
    LJ_onReady(() => LJ_showLoadError("lj-stores-grid"));
    return;
  }

  /* عرض مخصص لبطاقات المتاجر بالصفحة الرئيسية: ترتيب وألوان وأيقونات وتصنيف كل متجر */
  const HOME_CARD_ORDER = ["maaraz-lamset-jamal", "lamset-sabaya", "lamset-jamal"];
  const HOME_CARD_META = {
    "lamset-jamal": { color: "#16342b", colorDark: "#5aa885", icon: "lipstick", tag: "Beauty & Cosmetics", logo: "images/2.jpeg" },
    "lamset-sabaya": { color: "#8E5FA6", colorDark: "#b891ce", icon: "dress", tag: "Fashion & Accessories", logo: "images/1.jpeg" },
    "maaraz-lamset-jamal": { color: "#1C1C1E", colorDark: "#cfa96e", icon: "gift", tag: "Gifts & Perfumes", logo: "images/3.jpeg" }
  };

  function renderStoreCards() {
    const wrap = document.getElementById("lj-stores-grid");
    if (!wrap) return;
    const isDark = typeof LJ_getThemeMode === "function" && LJ_getThemeMode() === "dark";
    const headingColor = isDark ? "var(--ink)" : null;
    wrap.innerHTML = HOME_CARD_ORDER.map(id => {
      const store = LJ_DB.stores[id];
      const meta = HOME_CARD_META[id];
      /* بالوضع الداكن نستخدم لون فاتح للنصوص والتفاصيل الصغيرة (التاق والأيقونة) عشان تضل واضحة،
         وبنخلي شريط أعلى الكارت وزر "تسوق الآن" بلونهم الأساسي لأنهم خلفيات ملوّنة أصلاً */
      const accent = isDark ? meta.colorDark : meta.color;
      return `
      <article class="lj-store-card">
        <div class="lj-store-card-top" style="background:${meta.color}">
          <img class="lj-store-card-logo" src="${meta.logo}" alt="${LJ_storeField(store, "name")}">
        </div>
        <div class="lj-store-card-body">
          <span class="lj-store-tag" style="color:${accent}">${meta.tag}</span>
          <div class="lj-store-card-heading">
            <span class="lj-store-icon" style="background:color-mix(in srgb, ${accent} 16%, transparent);color:${accent}">${LJ_icon(meta.icon)}</span>
            <h3 style="color:${headingColor || meta.color}">${LJ_storeField(store, "name")}</h3>
          </div>
          <p>${LJ_storeField(store, "description")}</p>
          <a class="lj-btn lj-store-cta" style="background:${meta.color}"
             href="store-${store.slug}.html">
             <span data-i18n="visit_store">${LJ_t("visit_store")}</span>
             <span aria-hidden="true">←</span>
          </a>
        </div>
      </article>
    `;
    }).join("");
  }

  function renderContact() {
    const waBtn = document.getElementById("lj-contact-whatsapp");
    if (waBtn) {
      const mainStore = LJ_DB.stores["lamset-jamal"];
      waBtn.href = `https://wa.me/${mainStore.whatsapp}`;
    }

    const footerStoresWrap = document.getElementById("lj-footer-stores-links");
    if (footerStoresWrap) {
      footerStoresWrap.innerHTML = Object.values(LJ_DB.stores).map(store => `
        <li><a href="store-${store.slug}.html">${LJ_storeField(store, "name")}</a></li>
      `).join("");
    }

    const footerLinksWrap = document.getElementById("lj-footer-contact-links");
    if (footerLinksWrap) {
      footerLinksWrap.innerHTML = Object.values(LJ_DB.stores).map(store => `
        <li><a target="_blank" rel="noopener" href="https://wa.me/${store.whatsapp}">${LJ_storeField(store, "name")} — WhatsApp</a></li>
      `).join("");
    }
  }

  function bindNewsletter() {
    const form = document.getElementById("lj-newsletter-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button");
      const original = btn.textContent;
      btn.innerHTML = LJ_icon("check") + " " + LJ_t("newsletter_btn");
      form.reset();
      setTimeout(() => (btn.textContent = original), 1400);
    });
  }

  LJ_onReady(() => {
    renderStoreCards();
    renderContact();
    bindNewsletter();
    LJ_applyLang(LJ_getLang());
    LJ_initHeaderSearch();
  });
})();
