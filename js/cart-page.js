/* ============================================================
   منطق صفحة السلة
   ============================================================ */

(async function () {
  try {
    await LJ_initDB();
  } catch (err) {
    LJ_onReady(() => LJ_showLoadError("lj-cart-root"));
    return;
  }

  const params = new URLSearchParams(location.search);
  const storeId = params.get("store") || LJ_DEFAULT_STORE_ID;
  const store = LJ_DB.stores[storeId];

  if (!store) {
    document.getElementById("lj-cart-root").innerHTML = `<p style='padding:60px;text-align:center'>${LJ_t("store_not_found")}</p>`;
    return;
  }

  LJ_applyStoreTheme(storeId);

  function renderHeader() {
    document.getElementById("lj-header").innerHTML = `
      <div class="lj-topbar">
        <div class="lj-container lj-topbar-inner">
          <a href="index.html" class="lj-logo" style="color:var(--store-heading)">${LJ_storeField(store, "logoText")}</a>
          <nav class="lj-nav">
            <a href="store-${store.slug}.html" data-i18n="back_to_store">${LJ_t("back_to_store")}</a>
          </nav>
          <div class="lj-topbar-end">
            ${LJ_themeToggleBtn()}
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
  }

  function renderFooter() {
    const el = document.getElementById("lj-footer");
    if (!el) return;
    el.innerHTML = `
      <p class="lj-copyright">&copy; ${new Date().getFullYear()} ${LJ_storeField(store, "name")} — <span data-i18n="footer_rights">${LJ_t("footer_rights")}</span></p>
    `;
  }

  function renderFavoritesHtml() {
    const wishlist = LJ_getWishlist(storeId);
    const items = wishlist.map(id => LJ_findProduct(storeId, id)).filter(Boolean);
    const cardsHtml = items.length
      ? `<div class="lj-product-grid">${items.map(p => `
          <div class="lj-product-card" data-id="${p.id}">
            <div class="lj-product-image">
              <img src="${p.image}" alt="${LJ_productField(p, "name")}" onerror='this.onerror=null;this.src="${LJ_placeholderImg()}"'>
              <button type="button" class="lj-wishlist-btn active" data-id="${p.id}" aria-label="حذف من المفضلة">${LJ_icon("heartFill")}</button>
            </div>
            <div class="lj-product-body">
              <h3 class="lj-product-title">${LJ_productField(p, "name")}</h3>
              <div class="lj-product-price"><span class="lj-price-current">${p.price} ₪</span></div>
              <div class="lj-product-actions">
                <button class="lj-btn lj-btn-primary lj-fav-add-btn" data-id="${p.id}" data-i18n="add_cart">${LJ_t("add_cart")}</button>
                <a class="lj-btn lj-btn-ghost" href="product.html?store=${storeId}&id=${p.id}" data-i18n="details">${LJ_t("details")}</a>
              </div>
            </div>
          </div>`).join("")}</div>`
      : `<p class="lj-empty-msg" data-i18n="empty_favorites">${LJ_t("empty_favorites")}</p>`;

    return `
      <div class="lj-container" id="favorites" style="padding-top:36px;scroll-margin-top:24px">
        <h1 data-i18n="favorites_title">${LJ_t("favorites_title")}</h1>
        ${cardsHtml}
      </div>
    `;
  }

  function bindFavoritesEvents(root) {
    root.querySelectorAll(".lj-wishlist-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        LJ_toggleWishlist(storeId, btn.dataset.id);
        renderCart();
      });
    });
    root.querySelectorAll(".lj-fav-add-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        LJ_addToCart(storeId, btn.dataset.id, 1);
        const original = LJ_t("add_cart");
        btn.innerHTML = LJ_icon("check") + " " + original;
        setTimeout(() => (btn.textContent = original), 900);
      });
    });
  }

  function renderCart() {
    const cart = LJ_getCart(storeId);
    const root = document.getElementById("lj-cart-root");
    const favoritesHtml = renderFavoritesHtml();

    if (!cart.length) {
      root.innerHTML = `
        ${favoritesHtml}
        <div class="lj-container lj-cart-empty">
          <p data-i18n="empty_cart">${LJ_t("empty_cart")}</p>
          <a class="lj-btn lj-btn-primary" href="store-${store.slug}.html" data-i18n="back_to_store">${LJ_t("back_to_store")}</a>
        </div>`;
      bindFavoritesEvents(root);
      LJ_applyLang(LJ_getLang());
      return;
    }

    const rows = cart.map((item, idx) => {
      const product = LJ_findProduct(storeId, item.productId);
      if (!product) return "";
      const productName = LJ_productField(product, "name");
      const variantText = [item.variant?.color, item.variant?.size].filter(Boolean).map(v => LJ_colorLabel(v)).join(" / ");
      return `
        <div class="lj-cart-row" data-idx="${idx}">
          <img src="${product.image}" alt="${productName}" onerror='this.onerror=null;this.src="${LJ_placeholderImg()}"'>
          <div class="lj-cart-row-info">
            <h4>${productName}</h4>
            ${variantText ? `<p class="lj-cart-variant">${variantText}</p>` : ""}
            <p class="lj-cart-row-price">${product.price} ₪</p>
          </div>
          <div class="lj-cart-qty">
            <button class="lj-qty-btn" data-action="dec">-</button>
            <input type="number" min="1" value="${item.qty}" class="lj-qty-input">
            <button class="lj-qty-btn" data-action="inc">+</button>
          </div>
          <div class="lj-cart-row-total">${(product.price * item.qty).toFixed(0)} ₪</div>
          <button class="lj-cart-remove" data-action="remove" aria-label="remove">${LJ_icon("close")}</button>
        </div>`;
    }).join("");

    root.innerHTML = `
      ${favoritesHtml}
      <div class="lj-container" style="padding-top:36px">
        <h1 data-i18n="cart_title">${LJ_t("cart_title")}</h1>
        <div class="lj-cart-list">${rows}</div>
        <div class="lj-cart-summary">
          <div class="lj-cart-total-row">
            <span data-i18n="total">${LJ_t("total")}</span>
            <strong>${LJ_cartTotal(storeId).toFixed(0)} ₪</strong>
          </div>
          <a class="lj-btn lj-btn-primary lj-btn-block" href="checkout.html?store=${storeId}" data-i18n="checkout_btn">${LJ_t("checkout_btn")}</a>
        </div>
      </div>
    `;

    bindFavoritesEvents(root);
    LJ_applyLang(LJ_getLang());

    root.querySelectorAll(".lj-cart-row").forEach(row => {
      const idx = Number(row.dataset.idx);
      row.querySelector('[data-action="inc"]').addEventListener("click", () => {
        const cart = LJ_getCart(storeId);
        LJ_updateQty(storeId, idx, cart[idx].qty + 1);
        renderCart();
      });
      row.querySelector('[data-action="dec"]').addEventListener("click", () => {
        const cart = LJ_getCart(storeId);
        LJ_updateQty(storeId, idx, cart[idx].qty - 1);
        renderCart();
      });
      row.querySelector(".lj-qty-input").addEventListener("change", (e) => {
        LJ_updateQty(storeId, idx, Number(e.target.value) || 1);
        renderCart();
      });
      row.querySelector('[data-action="remove"]').addEventListener("click", () => {
        LJ_removeFromCart(storeId, idx);
        renderCart();
      });
    });
  }

  LJ_onReady(() => {
    renderHeader();
    renderFooter();
    renderCart();
    LJ_updateCartBadge(storeId);
    LJ_updateWishlistBadge(storeId);
  });
})();
