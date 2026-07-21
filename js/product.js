/* ============================================================
   منطق صفحة تفاصيل المنتج
   ============================================================ */

(async function () {
  LJ_setFavicon(new URLSearchParams(location.search).get("store") || LJ_DEFAULT_STORE_ID);

  try {
    await LJ_initDB();
  } catch (err) {
    LJ_onReady(() => LJ_showLoadError("lj-product-root"));
    return;
  }

  const params = new URLSearchParams(location.search);
  const storeId = params.get("store") || LJ_DEFAULT_STORE_ID;
  const productId = params.get("id");
  const store = LJ_DB.stores[storeId];
  const product = store ? LJ_findProduct(storeId, productId) : null;

  if (!store || !product) {
    document.getElementById("lj-product-root").innerHTML =
      `<p style='padding:60px;text-align:center'>${LJ_t("product_not_found")}</p>`;
    return;
  }

  LJ_applyStoreTheme(storeId);
  let selectedColor = product.colors && product.colors.length ? product.colors[0] : null;
  let selectedSize = product.sizes && product.sizes.length ? product.sizes[0] : null;
  let relatedCarousel = null;

  function renderHeader() {
    document.getElementById("lj-header").innerHTML = `
      <div class="lj-topbar">
        <div class="lj-container lj-topbar-inner">
          <a href="index.html" class="lj-logo" style="color:var(--store-heading)">${LJ_storeField(store, "logoText")}</a>
          <nav class="lj-nav">
            <a href="store-${store.slug}.html" data-i18n="back_to_store">${LJ_t("back_to_store")}</a>
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

  /* ---------- بطاقة منتج مصغرة لكاروسيل "منتجات قد تعجبك" ---------- */
  function renderRelatedCard(p) {
    const pName = LJ_productField(p, "name");
    const oldPriceHtml = p.oldPrice ? `<span class="lj-price-old">${p.oldPrice} ₪</span>` : "";
    return `
      <div class="lj-product-card" data-id="${p.id}">
        <div class="lj-product-image">
          <img src="${p.image}" alt="${pName}" loading="lazy"
               onerror='this.onerror=null;this.src="${LJ_placeholderImg()}"'>
          ${p.oldPrice ? `<span class="lj-badge-sale">خصم</span>` : ""}
          <button type="button" class="lj-wishlist-btn ${LJ_isWished(storeId, p.id) ? "active" : ""}" data-id="${p.id}" aria-label="أضف للمفضلة">${LJ_icon(LJ_isWished(storeId, p.id) ? "heartFill" : "heart")}</button>
        </div>
        <div class="lj-product-body">
          <h3 class="lj-product-title">${pName}</h3>
          <div class="lj-product-price">
            <span class="lj-price-current">${p.price} ₪</span>
            ${oldPriceHtml}
          </div>
          <div class="lj-product-actions">
            <button class="lj-btn lj-btn-primary lj-related-add-btn" data-id="${p.id}" data-i18n="add_cart">${LJ_t("add_cart")}</button>
            <a class="lj-btn lj-btn-ghost" href="product.html?store=${storeId}&id=${p.id}" data-i18n="details">${LJ_t("details")}</a>
          </div>
        </div>
      </div>
    `;
  }

  function renderRelatedProducts() {
    const related = store.products.filter(p => p.id !== product.id);
    const wrap = document.getElementById("lj-related-carousel");
    if (!wrap || !related.length) return;
    relatedCarousel = new LJProductCarousel(wrap, { renderCard: renderRelatedCard, speed: 35 });
    relatedCarousel.setProducts(related);
    wrap.addEventListener("click", (e) => {
      const wishBtn = e.target.closest(".lj-wishlist-btn");
      if (wishBtn) {
        const nowWished = LJ_toggleWishlist(storeId, wishBtn.dataset.id);
        wishBtn.classList.toggle("active", nowWished);
        wishBtn.innerHTML = LJ_icon(nowWished ? "heartFill" : "heart");
        return;
      }
      const btn = e.target.closest(".lj-related-add-btn");
      if (!btn) return;
      LJ_addToCart(storeId, btn.dataset.id, 1);
      const original = LJ_t("add_cart");
      btn.innerHTML = LJ_icon("check") + " " + original;
      setTimeout(() => (btn.textContent = original), 900);
    });
  }

  function renderProduct() {
    const name = LJ_productField(product, "name");
    const images = product.images && product.images.length ? product.images : [product.image];
    const colorsHtml = product.colors && product.colors.length ? `
      <div class="lj-option-group">
        <label data-i18n="colors">${LJ_t("colors")}</label>
        <div class="lj-swatches">
          ${product.colors.map(c => `<button class="lj-swatch ${c === selectedColor ? "active" : ""}" data-color="${c}" style="${c.startsWith('#') ? `background:${c}` : ''}">${c.startsWith('#') ? '' : LJ_colorLabel(c)}</button>`).join("")}
        </div>
      </div>` : "";

    const sizesHtml = product.sizes && product.sizes.length ? `
      <div class="lj-option-group">
        <label data-i18n="sizes">${LJ_t("sizes")}</label>
        <div class="lj-swatches">
          ${product.sizes.map(s => `<button class="lj-swatch lj-swatch-text ${s === selectedSize ? "active" : ""}" data-size="${s}">${s}</button>`).join("")}
        </div>
      </div>` : "";

    document.getElementById("lj-product-root").innerHTML = `
      <div class="lj-container lj-product-detail-grid">
        <div class="lj-gallery">
          <div class="lj-gallery-main">
            <img id="lj-main-img" src="${images[0]}" alt="${name}" onerror='this.onerror=null;this.src="${LJ_placeholderImg()}"'>
            <div class="lj-gallery-tools">
              <button type="button" class="lj-gallery-tool-btn ${LJ_isWished(storeId, product.id) ? "active" : ""}" id="lj-gallery-wishlist" aria-label="أضف للمفضلة">${LJ_icon(LJ_isWished(storeId, product.id) ? "heartFill" : "heart")}</button>
              <button type="button" class="lj-gallery-tool-btn" aria-label="مشاركة">${LJ_icon("share")}</button>
            </div>
          </div>
          <div class="lj-gallery-thumbs">
            ${images.map((img, i) => `<img src="${img}" class="lj-thumb ${i === 0 ? "active" : ""}" data-src="${img}" onerror='this.onerror=null;this.src="${LJ_placeholderImg()}"'>`).join("")}
          </div>
        </div>
        <div class="lj-product-info">
          <p class="lj-breadcrumb">${LJ_storeField(store, "name")} / ${LJ_categoryLabel(product.category)}</p>
          <h1>${name}</h1>
          <div class="lj-product-rating">
            <span class="lj-product-rating-stars">${LJ_icon("starFill", { size: 16 }).repeat(5)}</span>
            <span class="lj-product-rating-count">4.8 (120+ ${LJ_t("reviews_label")})</span>
          </div>
          <div class="lj-product-price">
            <span class="lj-price-current">${product.price} ₪</span>
            ${product.oldPrice ? `<span class="lj-price-old">${product.oldPrice} ₪</span>` : ""}
          </div>
          <p class="lj-product-desc">${LJ_productField(product, "description")}</p>
          ${colorsHtml}
          ${sizesHtml}
          <div class="lj-qty-row">
            <label data-i18n="product_qty">${LJ_t("product_qty")}</label>
            <div class="lj-qty-stepper">
              <button type="button" id="lj-qty-dec" aria-label="-">−</button>
              <input type="number" id="lj-qty" value="1" min="1">
              <button type="button" id="lj-qty-inc" aria-label="+">+</button>
            </div>
          </div>
          <div class="lj-product-actions lj-product-actions-lg">
            <button id="lj-add-cart" class="lj-btn lj-btn-primary" data-i18n="add_cart">${LJ_t("add_cart")}</button>
            <a id="lj-whatsapp-inquire" class="lj-btn lj-btn-whatsapp" target="_blank" rel="noopener" data-i18n="inquire_whatsapp">${LJ_t("inquire_whatsapp")}</a>
          </div>
        </div>
      </div>
      <section class="lj-section lj-related-section">
        <div class="lj-container">
          <div class="lj-products-heading">
            <h2 data-i18n="related_products">${LJ_t("related_products")}</h2>
          </div>
          <div id="lj-related-carousel"></div>
        </div>
      </section>
      <div class="lj-sticky-cta">
        <div class="lj-container lj-sticky-cta-inner">
          <span class="lj-price-current">${product.price} ₪</span>
          <button id="lj-add-cart-mobile" class="lj-btn lj-btn-primary" data-i18n="add_cart">${LJ_t("add_cart")}</button>
        </div>
      </div>
    `;

    document.getElementById("lj-product-root").querySelectorAll(".lj-thumb").forEach(t => {
      t.addEventListener("click", () => {
        document.getElementById("lj-main-img").src = t.dataset.src;
        document.querySelectorAll(".lj-thumb").forEach(x => x.classList.remove("active"));
        t.classList.add("active");
      });
    });

    document.getElementById("lj-gallery-wishlist").addEventListener("click", (e) => {
      const nowWished = LJ_toggleWishlist(storeId, product.id);
      e.currentTarget.classList.toggle("active", nowWished);
      e.currentTarget.innerHTML = LJ_icon(nowWished ? "heartFill" : "heart");
    });

    document.querySelectorAll("[data-color]").forEach(b => b.addEventListener("click", () => {
      selectedColor = b.dataset.color;
      document.querySelectorAll("[data-color]").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
    }));
    document.querySelectorAll("[data-size]").forEach(b => b.addEventListener("click", () => {
      selectedSize = b.dataset.size;
      document.querySelectorAll("[data-size]").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
    }));

    function addToCartFromPage() {
      const qty = Math.max(1, Number(document.getElementById("lj-qty").value) || 1);
      LJ_addToCart(storeId, product.id, qty, { color: selectedColor, size: selectedSize });
    }

    document.getElementById("lj-add-cart").addEventListener("click", () => {
      addToCartFromPage();
      const btn = document.getElementById("lj-add-cart");
      const original = LJ_t("add_cart");
      btn.innerHTML = LJ_icon("check") + " " + original;
      setTimeout(() => (btn.textContent = original), 900);
    });

    const mobileAddBtn = document.getElementById("lj-add-cart-mobile");
    if (mobileAddBtn) {
      mobileAddBtn.addEventListener("click", () => {
        addToCartFromPage();
        const original = LJ_t("add_cart");
        mobileAddBtn.innerHTML = LJ_icon("check") + " " + original;
        setTimeout(() => (mobileAddBtn.textContent = original), 900);
      });
    }

    const qtyInput = document.getElementById("lj-qty");
    document.getElementById("lj-qty-dec").addEventListener("click", () => {
      qtyInput.value = Math.max(1, (Number(qtyInput.value) || 1) - 1);
    });
    document.getElementById("lj-qty-inc").addEventListener("click", () => {
      qtyInput.value = (Number(qtyInput.value) || 1) + 1;
    });

    const waMsg = encodeURIComponent(LJ_tf("wa_inquiry_msg", { name, price: product.price, store: LJ_storeField(store, "name") }));
    document.getElementById("lj-whatsapp-inquire").href = `https://wa.me/${store.whatsapp}?text=${waMsg}`;

    renderRelatedProducts();
  }

  LJ_onReady(() => {
    renderHeader();
    renderFooter();
    renderProduct();
    LJ_updateCartBadge(storeId);
  });
})();
