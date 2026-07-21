/* ============================================================
   منطق صفحة المتجر - يعمل لأي متجر من المتاجر الثلاثة
   بالاعتماد فقط على data-store-id الموجود على body
   ============================================================ */

(async function () {
  try {
    await LJ_initDB();
  } catch (err) {
    LJ_onReady(() => LJ_showLoadError());
    return;
  }

  const storeId = document.body.getAttribute("data-store-id");
  const store = LJ_DB.stores[storeId];
  if (!store) {
    document.body.innerHTML = `<p style='padding:40px;text-align:center'>${LJ_t("store_not_found")}</p>`;
    return;
  }

  LJ_applyStoreTheme(storeId);

  const STORE_HERO_LOGOS = {
    "lamset-jamal": "images/2.jpeg",
    "lamset-sabaya": "images/1.jpeg",
    "maaraz-lamset-jamal": "images/3.jpeg"
  };

  const CATEGORY_ICONS = {
    "الكل": "sparkle", "مكياج": "lipstick", "عناية بالبشرة": "droplet", "عطور": "perfume", "أدوات تجميل": "brush",
    "إكسسوارات": "ring", "حقائب": "handbag", "مجوهرات": "gem", "ملابس": "dress",
    "هدايا": "gift", "ديكور": "vase", "شموع": "candle"
  };

  let state = {
    category: "الكل",
    search: "",
    minPrice: null,
    maxPrice: null
  };

  let carousel = null;

  /* ---------- كارت المنتج (نفس البيانات والمنطق، تصميم جديد فقط) ---------- */
  function renderProductCard(product) {
    const name = LJ_productField(product, "name");
    const oldPriceHtml = product.oldPrice
      ? `<span class="lj-price-old">${product.oldPrice} ₪</span>`
      : "";
    return `
      <div class="lj-product-card" data-id="${product.id}">
        <div class="lj-product-image">
          <img src="${product.image}" alt="${name}" loading="lazy"
               onerror='this.onerror=null;this.src="${LJ_placeholderImg()}"'>
          ${product.oldPrice ? `<span class="lj-badge-sale">خصم</span>` : ""}
          <button type="button" class="lj-wishlist-btn ${LJ_isWished(storeId, product.id) ? "active" : ""}" data-id="${product.id}" aria-label="أضف للمفضلة">${LJ_icon(LJ_isWished(storeId, product.id) ? "heartFill" : "heart")}</button>
        </div>
        <div class="lj-product-body">
          <h3 class="lj-product-title">${name}</h3>
          <div class="lj-product-price">
            <span class="lj-price-current">${product.price} ₪</span>
            ${oldPriceHtml}
          </div>
          <div class="lj-product-actions">
            <button class="lj-btn lj-btn-primary lj-add-cart-btn" data-id="${product.id}" data-i18n="add_cart">${LJ_t("add_cart")}</button>
            <a class="lj-btn lj-btn-ghost" href="product.html?store=${storeId}&id=${product.id}" data-i18n="details">${LJ_t("details")}</a>
          </div>
        </div>
      </div>
    `;
  }

  /* ---------- بناء الهيدر والبانر والفوتر المشترك ---------- */
  function renderHeader() {
    document.getElementById("lj-header").innerHTML = `
      <div class="lj-topbar">
        <div class="lj-container lj-topbar-inner">
          <a href="index.html" class="lj-logo" style="color:var(--store-heading)">${LJ_storeField(store, "logoText")}</a>
          <nav class="lj-nav">
            <a href="index.html" data-i18n="nav_home">${LJ_t("nav_home")}</a>
            <a href="index.html#stores" data-i18n="nav_stores">${LJ_t("nav_stores")}</a>
          </nav>
          <div class="lj-topbar-end">
            <div class="lj-topbar-icons">
              <button type="button" class="lj-topbar-icon" data-action="search" aria-label="بحث">${LJ_icon("search")}</button>
              <a href="cart.html?store=${storeId}#favorites" class="lj-topbar-icon lj-wishlist-link" aria-label="المفضلة">
                ${LJ_icon("heart")}
                <span class="lj-wishlist-badge"></span>
              </a>
              ${LJ_themeToggleBtn()}
            </div>
            <a href="cart.html?store=${storeId}" class="lj-cart-link">
              <span data-i18n="nav_cart">${LJ_t("nav_cart")}</span>
              <span class="lj-cart-badge"></span>
            </a>
            <div class="lj-lang-switch">
              <button class="lj-lang-btn" data-lang="ar">AR</button>
              <button class="lj-lang-btn" data-lang="en">EN</button>
              <button class="lj-lang-btn" data-lang="he">HE</button>
            </div>
          </div>
        </div>
      </div>
    `;
    LJ_applyLang(LJ_getLang());
    LJ_updateCartBadge(storeId);
    LJ_updateWishlistBadge(storeId);
    LJ_initHeaderSearch();
  }

  function renderBanner() {
    const bannerEl = document.getElementById("lj-banner");
    if (!bannerEl) return;
    const otherStores = Object.values(LJ_DB.stores).filter(s => s.id !== storeId);
    const heroImage = STORE_HERO_LOGOS[storeId];
    bannerEl.innerHTML = `
      <div class="lj-store-hero" style="background-image:url('${heroImage}')">
        <div class="lj-store-hero-overlay"></div>
        <div class="lj-container lj-store-hero-inner">
          <span class="lj-store-hero-eyebrow">${LJ_storeField(store, "logoText")}</span>
          <h1>${LJ_storeField(store, "tagline")}</h1>
          <p>${LJ_storeField(store, "description")}</p>
          <div class="lj-hero-actions">
            <a class="lj-btn lj-btn-gold" href="#lj-product-carousel">${LJ_t("visit_store")}</a>
            <a class="lj-btn lj-btn-ghost-light" href="#lj-categories">${LJ_t("categories_label")}</a>
          </div>
          ${otherStores.length ? `<div class="lj-store-banner-other">${otherStores.map(s => `<a href="store-${s.slug}.html">${LJ_storeField(s, "name")}</a>`).join("")}</div>` : ""}
        </div>
      </div>
    `;
  }

  function renderPromoPanel() {
    const promoEl = document.getElementById("lj-promo");
    if (!promoEl) return;
    promoEl.innerHTML = `
      <section class="lj-section" style="padding-top:0">
        <div class="lj-container">
          <div class="lj-contact-panel">
            <h2 class="lj-section-title">${LJ_t("promo_title")}</h2>
            <p class="lj-section-sub">${LJ_t("promo_sub")}</p>
            <a class="lj-btn lj-btn-whatsapp" target="_blank" rel="noopener" href="https://wa.me/${store.whatsapp}">${LJ_t("whatsapp_us")}</a>
          </div>
        </div>
      </section>
    `;
  }

  function renderFooter() {
    document.getElementById("lj-footer").innerHTML = `
      <div class="lj-container lj-footer-grid">
        <div>
          <h4>${LJ_storeField(store, "name")}</h4>
          <p>${store.address}</p>
          <p>${store.hours}</p>
          ${store.facebook || store.instagram ? `
            <div class="lj-footer-social">
              ${store.facebook ? `<a href="${store.facebook}" target="_blank" rel="noopener" aria-label="Facebook">f</a>` : ""}
              ${store.instagram ? `<a href="${store.instagram}" target="_blank" rel="noopener" aria-label="Instagram">◎</a>` : ""}
            </div>` : ""}
        </div>
        <div>
          <h4 data-i18n="other_stores">${LJ_t("other_stores")}</h4>
          <ul class="lj-footer-links">
            ${Object.values(LJ_DB.stores)
              .filter(s => s.id !== storeId)
              .map(s => `<li><a href="store-${s.slug}.html">${LJ_storeField(s, "name")}</a></li>`)
              .join("")}
          </ul>
        </div>
        <div>
          <h4 data-i18n="contact_title">${LJ_t("contact_title")}</h4>
          <a class="lj-btn lj-btn-whatsapp" target="_blank" rel="noopener"
             href="https://wa.me/${store.whatsapp}" data-i18n="whatsapp_us">${LJ_t("whatsapp_us")}</a>
        </div>
      </div>
      <p class="lj-copyright">&copy; ${new Date().getFullYear()} ${LJ_storeField(store, "name")} — <span data-i18n="footer_rights">${LJ_t("footer_rights")}</span></p>
    `;
  }

  function renderMobileNav() {
    const root = document.getElementById("lj-mobile-nav-root");
    if (!root) return;
    root.innerHTML = `
      <nav class="lj-mobile-nav">
        <a class="lj-mobile-nav-item" href="index.html">
          <span class="lj-mobile-nav-icon">${LJ_icon("home")}</span>
          <span data-i18n="nav_home">${LJ_t("nav_home")}</span>
        </a>
        <a class="lj-mobile-nav-item active" href="#">
          <span class="lj-mobile-nav-icon">${LJ_icon("grid")}</span>
          <span data-i18n="nav_stores">${LJ_t("nav_stores")}</span>
        </a>
        <a class="lj-mobile-nav-item" href="cart.html?store=${storeId}">
          <span class="lj-mobile-nav-icon">${LJ_icon("bag")}</span>
          <span data-i18n="nav_cart">${LJ_t("nav_cart")}</span>
        </a>
      </nav>
    `;
  }

  function renderFloatingWhatsapp() {
    const a = document.createElement("a");
    a.href = `https://wa.me/${store.whatsapp}`;
    a.target = "_blank";
    a.rel = "noopener";
    a.className = "lj-fixed-whatsapp";
    a.setAttribute("aria-label", "WhatsApp");
    a.innerHTML = LJ_icon("chat");
    document.body.appendChild(a);
  }

  /* ---------- عنوان قسم المنتجات (الأكثر مبيعاً + عرض الكل) ---------- */
  function renderProductsHeading() {
    const carouselEl = document.getElementById("lj-product-carousel");
    if (!carouselEl) return;
    carouselEl.insertAdjacentHTML("beforebegin", `
      <div class="lj-products-heading">
        <h2 data-i18n="bestsellers_title">${LJ_t("bestsellers_title")}</h2>
        <button type="button" class="lj-view-all-btn" id="lj-reset-filters" data-i18n="view_all">${LJ_t("view_all")}</button>
      </div>
    `);
    document.getElementById("lj-reset-filters").addEventListener("click", () => {
      state = { category: "الكل", search: "", minPrice: null, maxPrice: null };
      document.getElementById("lj-search").value = "";
      document.getElementById("lj-price-min").value = "";
      document.getElementById("lj-price-max").value = "";
      document.querySelectorAll(".lj-cat-icon").forEach(b => b.classList.remove("active"));
      const allBtn = document.querySelector('.lj-cat-icon[data-cat="الكل"]');
      if (allBtn) allBtn.classList.add("active");
      applyFilters();
    });

    const gridEl = document.getElementById("lj-product-grid");
    if (gridEl) {
      gridEl.insertAdjacentHTML("beforebegin", `
        <div class="lj-products-heading" style="margin-top:44px">
          <h2 data-i18n="all_products_title">${LJ_t("all_products_title")}</h2>
        </div>
      `);
    }
  }

  /* ---------- الفلاتر والتصنيفات ---------- */
  function renderFilters() {
    const catsWrap = document.getElementById("lj-categories");
    catsWrap.insertAdjacentHTML("beforebegin", `<h2 class="lj-categories-title">${LJ_t("shop_by_category")}</h2>`);
    catsWrap.innerHTML = store.categories
      .map(c => `
        <button type="button" class="lj-cat-icon ${c === state.category ? "active" : ""}" data-cat="${c}">
          <span class="lj-cat-icon-circle">${LJ_icon(CATEGORY_ICONS[c] || "bag", { size: 24 })}</span>
          <span class="lj-cat-icon-label">${LJ_categoryLabel(c)}</span>
        </button>
      `)
      .join("");

    catsWrap.querySelectorAll(".lj-cat-icon").forEach(btn => {
      btn.addEventListener("click", () => {
        state.category = btn.dataset.cat;
        catsWrap.querySelectorAll(".lj-cat-icon").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        applyFilters();
      });
    });

    document.getElementById("lj-search").addEventListener("input", (e) => {
      state.search = e.target.value.trim().toLowerCase();
      applyFilters();
    });

    document.getElementById("lj-price-apply").addEventListener("click", () => {
      const min = document.getElementById("lj-price-min").value;
      const max = document.getElementById("lj-price-max").value;
      state.minPrice = min ? Number(min) : null;
      state.maxPrice = max ? Number(max) : null;
      applyFilters();
    });
  }

  function getFilteredProducts() {
    return store.products.filter(p => {
      if (state.category !== "الكل" && p.category !== state.category) return false;
      if (state.search && !LJ_productField(p, "name").toLowerCase().includes(state.search)) return false;
      if (state.minPrice !== null && p.price < state.minPrice) return false;
      if (state.maxPrice !== null && p.price > state.maxPrice) return false;
      return true;
    });
  }

  function applyFilters() {
    const filtered = getFilteredProducts();
    const emptyMsg = document.getElementById("lj-empty-msg");
    const carouselEl = document.getElementById("lj-product-carousel");
    const gridEl = document.getElementById("lj-product-grid");

    if (!filtered.length) {
      carouselEl.style.display = "none";
      if (gridEl) gridEl.style.display = "none";
      emptyMsg.style.display = "block";
      return;
    }
    carouselEl.style.display = "block";
    emptyMsg.style.display = "none";
    carousel.setProducts(filtered);
    if (gridEl) {
      gridEl.style.display = "grid";
      gridEl.innerHTML = filtered.map(renderProductCard).join("");
    }
  }

  /* ---------- تفويض حدث "أضف للسلة" و"المفضلة" (لأن الكروت تتغير ديناميكياً) ---------- */
  function bindCartDelegation() {
    document.getElementById("lj-products-area").addEventListener("click", (e) => {
      const wishBtn = e.target.closest(".lj-wishlist-btn");
      if (wishBtn) {
        const nowWished = LJ_toggleWishlist(storeId, wishBtn.dataset.id);
        wishBtn.classList.toggle("active", nowWished);
        wishBtn.innerHTML = LJ_icon(nowWished ? "heartFill" : "heart");
        return;
      }
      const btn = e.target.closest(".lj-add-cart-btn");
      if (!btn) return;
      LJ_addToCart(storeId, btn.dataset.id, 1);
      const original = LJ_t("add_cart");
      btn.innerHTML = LJ_icon("check") + " " + original;
      setTimeout(() => (btn.textContent = original), 900);
    });
  }

  /* ---------- التشغيل ---------- */
  function init() {
    renderHeader();
    renderBanner();
    renderPromoPanel();
    renderFooter();
    renderMobileNav();
    renderFilters();
    renderFloatingWhatsapp();

    const carouselEl = document.getElementById("lj-product-carousel");
    carousel = new LJProductCarousel(carouselEl, {
      renderCard: renderProductCard,
      speed: 40
    });

    renderProductsHeading();
    bindCartDelegation();
    applyFilters();
    LJ_updateCartBadge(storeId);
  }

  LJ_onReady(init);
})();
