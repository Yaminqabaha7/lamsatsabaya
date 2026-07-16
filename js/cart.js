/* ============================================================
   منطق سلة المشتريات - السلة مرتبطة بمعرف المتجر (Store ID)
   ============================================================ */

function LJ_cartKey(storeId) {
  return `lj_cart_${storeId}`;
}

function LJ_getCart(storeId) {
  try {
    return JSON.parse(localStorage.getItem(LJ_cartKey(storeId))) || [];
  } catch (e) {
    return [];
  }
}

function LJ_saveCart(storeId, cart) {
  localStorage.setItem(LJ_cartKey(storeId), JSON.stringify(cart));
  LJ_updateCartBadge(storeId);
}

function LJ_addToCart(storeId, productId, qty = 1, variant = {}) {
  const cart = LJ_getCart(storeId);
  const variantKey = JSON.stringify(variant);
  const existing = cart.find(i => i.productId === productId && JSON.stringify(i.variant) === variantKey);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ productId, qty, variant });
  }
  LJ_saveCart(storeId, cart);
}

function LJ_updateQty(storeId, index, qty) {
  const cart = LJ_getCart(storeId);
  if (!cart[index]) return;
  cart[index].qty = Math.max(1, qty);
  LJ_saveCart(storeId, cart);
}

function LJ_removeFromCart(storeId, index) {
  const cart = LJ_getCart(storeId);
  cart.splice(index, 1);
  LJ_saveCart(storeId, cart);
}

function LJ_cartCount(storeId) {
  return LJ_getCart(storeId).reduce((sum, i) => sum + i.qty, 0);
}

function LJ_cartTotal(storeId) {
  const cart = LJ_getCart(storeId);
  return cart.reduce((sum, item) => {
    const product = LJ_findProduct(storeId, item.productId);
    if (!product) return sum;
    return sum + product.price * item.qty;
  }, 0);
}

function LJ_updateCartBadge(storeId) {
  document.querySelectorAll(".lj-cart-badge").forEach(badge => {
    const count = LJ_cartCount(storeId);
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-flex" : "none";
  });
}

/* ============================================================
   المفضلة (Wishlist) - مرتبطة بمعرف المتجر مثل السلة تماماً
   ============================================================ */

function LJ_wishlistKey(storeId) {
  return `lj_wishlist_${storeId}`;
}

function LJ_getWishlist(storeId) {
  try {
    return JSON.parse(localStorage.getItem(LJ_wishlistKey(storeId))) || [];
  } catch (e) {
    return [];
  }
}

function LJ_saveWishlist(storeId, list) {
  localStorage.setItem(LJ_wishlistKey(storeId), JSON.stringify(list));
  LJ_updateWishlistBadge(storeId);
}

/** يبدّل حالة منتج بالمفضلة، ويرجع true إذا أصبح مضافاً */
function LJ_toggleWishlist(storeId, productId) {
  const list = LJ_getWishlist(storeId);
  const idx = list.indexOf(productId);
  if (idx >= 0) {
    list.splice(idx, 1);
    LJ_saveWishlist(storeId, list);
    return false;
  }
  list.push(productId);
  LJ_saveWishlist(storeId, list);
  return true;
}

function LJ_isWished(storeId, productId) {
  return LJ_getWishlist(storeId).includes(productId);
}

function LJ_wishlistCount(storeId) {
  return LJ_getWishlist(storeId).length;
}

function LJ_updateWishlistBadge(storeId) {
  document.querySelectorAll(".lj-wishlist-badge").forEach(badge => {
    const count = LJ_wishlistCount(storeId);
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-flex" : "none";
  });
}

/* ============================================================
   البحث العام في الهيدر - يعمل بكل صفحات الموقع
   ============================================================ */

function LJ_allProducts() {
  const list = [];
  Object.values(LJ_DB.stores).forEach(store => {
    store.products.forEach(p => list.push({ ...p, storeId: store.id, storeSlug: store.slug, storeName: LJ_storeField(store, "name") }));
  });
  return list;
}

function LJ_closeSearchPanel() {
  const panel = document.getElementById("lj-search-panel");
  if (panel) panel.remove();
}

function LJ_toggleSearchPanel(icon) {
  const existing = document.getElementById("lj-search-panel");
  if (existing) {
    existing.remove();
    return;
  }

  const panel = document.createElement("div");
  panel.id = "lj-search-panel";
  panel.className = "lj-search-panel";
  panel.innerHTML = `
    <div class="lj-search-panel-inner">
      ${LJ_icon("search")}
      <input type="text" id="lj-global-search-input" placeholder="${LJ_t("search_ph")}">
      <button type="button" class="lj-search-panel-close" aria-label="close">${LJ_icon("close")}</button>
    </div>
    <div id="lj-global-search-results" class="lj-search-panel-results"></div>
  `;
  document.body.appendChild(panel);

  const input = panel.querySelector("#lj-global-search-input");
  const resultsWrap = panel.querySelector("#lj-global-search-results");
  const localInput = document.getElementById("lj-search");
  input.focus();

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (localInput) {
      localInput.value = input.value;
      localInput.dispatchEvent(new Event("input"));
    }
    if (!q) {
      resultsWrap.innerHTML = "";
      return;
    }
    const matches = LJ_allProducts().filter(p => LJ_productField(p, "name").toLowerCase().includes(q)).slice(0, 8);
    resultsWrap.innerHTML = matches.length
      ? matches.map(p => `
          <a class="lj-search-result" href="product.html?store=${p.storeId}&id=${p.id}">
            <img src="${p.image}" alt="" onerror='this.onerror=null;this.src="${LJ_placeholderImg()}"'>
            <div><strong>${LJ_productField(p, "name")}</strong><span>${p.storeName} · ${p.price} ₪</span></div>
          </a>`).join("")
      : `<p class="lj-search-empty">${LJ_t("no_results")}</p>`;
  });

  panel.querySelector(".lj-search-panel-close").addEventListener("click", LJ_closeSearchPanel);

  setTimeout(() => {
    document.addEventListener("click", function onDocClick(e) {
      if (!panel.contains(e.target) && !(icon && icon.contains(e.target))) {
        panel.remove();
        document.removeEventListener("click", onDocClick);
      }
    });
  }, 0);
}

function LJ_initHeaderSearch() {
  document.querySelectorAll('.lj-topbar-icon[data-action="search"]').forEach(icon => {
    if (icon.dataset.searchBound) return;
    icon.dataset.searchBound = "1";
    icon.addEventListener("click", (e) => {
      e.stopPropagation();
      LJ_toggleSearchPanel(icon);
    });
  });
}
