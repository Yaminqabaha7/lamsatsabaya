/* ============================================================
   منطق صفحة إتمام الطلب
   ============================================================ */

(async function () {
  try {
    await LJ_initDB();
  } catch (err) {
    LJ_onReady(() => LJ_showLoadError("lj-checkout-root"));
    return;
  }

  const params = new URLSearchParams(location.search);
  const storeId = params.get("store") || LJ_DEFAULT_STORE_ID;
  const store = LJ_DB.stores[storeId];

  if (!store) {
    document.getElementById("lj-checkout-root").innerHTML = `<p style='padding:60px;text-align:center'>${LJ_t("store_not_found")}</p>`;
    return;
  }

  LJ_applyStoreTheme(storeId);

  function renderHeader() {
    document.getElementById("lj-header").innerHTML = `
      <div class="lj-topbar">
        <div class="lj-container lj-topbar-inner">
          <a href="index.html" class="lj-logo" style="color:var(--store-heading)">${LJ_storeField(store, "logoText")}</a>
          <nav class="lj-nav">
            <a href="cart.html?store=${storeId}" data-i18n="nav_cart">${LJ_t("nav_cart")}</a>
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

  function renderForm() {
    const cart = LJ_getCart(storeId);
    const root = document.getElementById("lj-checkout-root");

    if (!cart.length) {
      root.innerHTML = `<div class="lj-container lj-cart-empty">
        <p data-i18n="empty_cart">${LJ_t("empty_cart")}</p>
        <a class="lj-btn lj-btn-primary" href="store-${store.slug}.html" data-i18n="back_to_store">${LJ_t("back_to_store")}</a>
      </div>`;
      return;
    }

    root.innerHTML = `
      <div class="lj-container">
        <div class="lj-checkout-steps">
          <div class="lj-checkout-steps-inner">
            <div class="lj-checkout-step done">
              <div class="lj-checkout-step-dot">${LJ_icon("check", { size: 16 })}</div>
              <span class="lj-checkout-step-label" data-i18n="cart_title">${LJ_t("cart_title")}</span>
            </div>
            <div class="lj-checkout-step-line done"></div>
            <div class="lj-checkout-step current">
              <div class="lj-checkout-step-dot">2</div>
              <span class="lj-checkout-step-label" data-i18n="checkout_title">${LJ_t("checkout_title")}</span>
            </div>
            <div class="lj-checkout-step-line"></div>
            <div class="lj-checkout-step">
              <div class="lj-checkout-step-dot">3</div>
              <span class="lj-checkout-step-label" data-i18n="step_confirm">${LJ_t("step_confirm")}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="lj-container lj-checkout-grid">
        <form id="lj-checkout-form" class="lj-form">
          <h1 data-i18n="checkout_title">${LJ_t("checkout_title")}</h1>
          <label data-i18n="full_name">${LJ_t("full_name")}</label>
          <input type="text" name="name" required>

          <label data-i18n="whatsapp_number">${LJ_t("whatsapp_number")}</label>
          <input type="tel" name="phone" required placeholder="9705xxxxxxxx">

          <label data-i18n="city">${LJ_t("city")}</label>
          <input type="text" name="city" required>

          <label data-i18n="address">${LJ_t("address")}</label>
          <input type="text" name="address" required>

          <label data-i18n="notes">${LJ_t("notes")}</label>
          <textarea name="notes" rows="3"></textarea>

          <button type="submit" class="lj-btn lj-btn-primary lj-btn-block" data-i18n="submit_order">${LJ_t("submit_order")}</button>
        </form>

        <aside class="lj-order-summary" id="lj-order-summary"></aside>
      </div>

      <div id="lj-order-success" class="lj-order-success" hidden>
        <div class="lj-order-success-inner">
          <div class="lj-order-success-icon">${LJ_icon("check", { size: 34 })}</div>
          <h2 data-i18n="order_success">${LJ_t("order_success")}</h2>
          <p data-i18n="order_success_sub">${LJ_t("order_success_sub")}</p>
          <a id="lj-go-whatsapp" class="lj-btn lj-btn-whatsapp" target="_blank" rel="noopener" data-i18n="go_whatsapp">${LJ_t("go_whatsapp")}</a>
        </div>
      </div>
    `;

    renderSummary();

    document.getElementById("lj-checkout-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const orderData = {
        name: fd.get("name"),
        phone: fd.get("phone"),
        city: fd.get("city"),
        address: fd.get("address"),
        notes: fd.get("notes")
      };
      const submitBtn = e.target.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      let order;
      try {
        order = await LJ_saveOrder(storeId, orderData);
      } catch (err) {
        submitBtn.disabled = false;
        alert(LJ_t("order_error"));
        return;
      }

      const lines = order.items.map(item => {
        const p = LJ_findProduct(storeId, item.productId);
        return `- ${LJ_productField(p, "name")} × ${item.qty} = ${(p.price * item.qty).toFixed(0)} ₪`;
      }).join("\n");

      const rawMsg =
        `${LJ_t("order_msg_new_from")} ${LJ_storeField(store, "name")}\n${LJ_t("full_name")}: ${order.name}\n${LJ_t("city")}: ${order.city}\n${LJ_t("address")}: ${order.address}\n` +
        `${LJ_t("notes")}: ${order.notes || "-"}\n\n${LJ_t("order_msg_products_label")}:\n${lines}\n\n${LJ_t("total")}: ${order.total} ₪`;
      const msg = encodeURIComponent(rawMsg);

      document.getElementById("lj-go-whatsapp").href = `https://wa.me/${store.whatsapp}?text=${msg}`;
      document.getElementById("lj-checkout-form").closest(".lj-checkout-grid").style.display = "none";
      document.getElementById("lj-order-success").hidden = false;

      LJ_saveCart(storeId, []); // تفريغ السلة بعد نجاح الطلب
    });
  }

  function renderSummary() {
    const cart = LJ_getCart(storeId);
    const wrap = document.getElementById("lj-order-summary");
    if (!wrap) return;

    wrap.innerHTML = `
      <h3 data-i18n="order_summary_title">${LJ_t("order_summary_title")}</h3>
      <ul class="lj-order-summary-list">
        ${cart.map((item, idx) => {
          const p = LJ_findProduct(storeId, item.productId);
          if (!p) return "";
          return `
            <li class="lj-order-summary-item" data-idx="${idx}">
              <span class="lj-order-summary-item-name">${LJ_productField(p, "name")}</span>
              <div class="lj-order-summary-item-right">
                <div class="lj-cart-qty lj-cart-qty-sm">
                  <button type="button" class="lj-qty-btn" data-action="dec">-</button>
                  <span class="lj-order-summary-item-qty">${item.qty}</span>
                  <button type="button" class="lj-qty-btn" data-action="inc">+</button>
                </div>
                <span>${(p.price * item.qty).toFixed(0)} ₪</span>
              </div>
            </li>`;
        }).join("")}
      </ul>
      <div class="lj-cart-total-row">
        <span data-i18n="total">${LJ_t("total")}</span>
        <strong>${LJ_cartTotal(storeId).toFixed(0)} ₪</strong>
      </div>
    `;

    wrap.querySelectorAll(".lj-order-summary-item").forEach(item => {
      const idx = Number(item.dataset.idx);
      item.querySelector('[data-action="inc"]').addEventListener("click", () => {
        const cart = LJ_getCart(storeId);
        LJ_updateQty(storeId, idx, cart[idx].qty + 1);
        renderSummary();
      });
      item.querySelector('[data-action="dec"]').addEventListener("click", () => {
        const cart = LJ_getCart(storeId);
        LJ_updateQty(storeId, idx, cart[idx].qty - 1);
        renderSummary();
      });
    });
  }

  LJ_onReady(() => {
    renderHeader();
    renderFooter();
    renderForm();
    LJ_updateCartBadge(storeId);
  });
})();
