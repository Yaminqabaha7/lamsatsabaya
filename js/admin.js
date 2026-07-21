/* ============================================================
   لوحة تحكم الأدمن
   تعرض بيانات حقيقية من Supabase (المتاجر والمنتجات والطلبات)
   محمية بتسجيل دخول (Supabase Auth) - راجع js/db.js وjs/admin-common.js
   جدول كل الطلبات (بصفحات) موجود بصفحة منفصلة orders.html
   ============================================================ */

(function () {
  /* نفس شعارات المتاجر المستخدمة بالصفحة الرئيسية (main.js) */
  const STORE_LOGOS = {
    "lamset-jamal": "images/2.jpeg",
    "lamset-sabaya": "images/1.jpeg",
    "maaraz-lamset-jamal": "images/3.jpeg"
  };

  function storeOrderCount(orders, storeId) {
    return orders.filter(o => o.storeId === storeId).length;
  }

  function allProductsFlat() {
    const list = [];
    Object.values(LJ_DB.stores).forEach(store => {
      store.products.forEach(p => list.push({ ...p, storeId: store.id, storeName: store.name }));
    });
    return list;
  }

  /* ---------------- إحصائيات عامة ---------------- */
  function renderStats(orders) {
    const uniqueCustomers = new Set(orders.map(o => o.phone).filter(Boolean)).size;

    const wrap = document.getElementById("lj-admin-stats");
    wrap.innerHTML = `
      <div class="lj-admin-stat-card lj-stat-pink">
        <span class="lj-admin-stat-icon">${LJ_icon("users")}</span>
        <strong>${uniqueCustomers}</strong>
        <span>عملاء فريدون</span>
      </div>
      <div class="lj-admin-stat-card lj-stat-gold">
        <span class="lj-admin-stat-icon">${LJ_icon("receipt")}</span>
        <strong>${orders.length}</strong>
        <span>إجمالي الطلبات</span>
      </div>
      <div class="lj-admin-stat-card lj-stat-dark">
        <span class="lj-admin-stat-icon">${LJ_icon("box")}</span>
        <strong>${allProductsFlat().length}</strong>
        <span>عدد المنتجات</span>
      </div>
    `;
  }

  /* ---------------- إدارة المتاجر ---------------- */
  function renderStores(orders) {
    const wrap = document.getElementById("lj-admin-stores");
    wrap.innerHTML = Object.values(LJ_DB.stores).map(store => `
      <div class="lj-admin-store-card">
        <div class="lj-admin-store-avatar" style="background:${store.theme.primary}"><img src="${STORE_LOGOS[store.id]}" alt="${store.name}"></div>
        <div class="lj-admin-store-info">
          <h4>${store.name}</h4>
          <span>${store.tagline}</span>
        </div>
        <div class="lj-admin-store-metrics">
          <div><strong>${store.products.length}</strong><span>المخزون</span></div>
          <div><strong>${storeOrderCount(orders, store.id)}</strong><span>عدد الطلبات</span></div>
        </div>
        <a class="lj-btn lj-store-cta" style="background:${store.theme.primary}" target="_blank" rel="noopener" href="store-${store.slug}.html">الذهاب للمتجر</a>
      </div>
    `).join("");
  }

  /* ---------------- آخر الطلبات (معاينة فقط - كل الطلبات بصفحة orders.html) ---------------- */
  const ORDERS_PREVIEW_COUNT = 10;

  function renderOrdersPreview(orders) {
    // orders راجعة من LJ_getAllOrders() مرتبة الأحدث أولاً أصلاً
    const preview = orders.slice(0, ORDERS_PREVIEW_COUNT);
    const previewTable = document.getElementById("lj-admin-orders-preview");
    previewTable.innerHTML = LJ_ordersTableHtml(preview);
    document.getElementById("lj-admin-orders-count-overview").textContent = `${preview.length} من ${orders.length}`;
    LJ_bindOrderRowActions(previewTable, preview, refreshAll);

    const previewCards = document.getElementById("lj-admin-orders-preview-cards");
    previewCards.innerHTML = LJ_ordersCardsHtml(preview);
    LJ_bindOrderRowActions(previewCards, preview, refreshAll);
  }

  /* ---------------- إدارة الفئات ---------------- */
  function renderCategoryStoreOptions() {
    const sel = document.getElementById("lj-admin-cat-store");
    sel.innerHTML = Object.values(LJ_DB.stores).map(s => `<option value="${s.id}">${s.name}</option>`).join("");
    sel.addEventListener("change", renderCategoryList);
  }

  function renderCategoryList() {
    const storeId = document.getElementById("lj-admin-cat-store").value;
    const store = LJ_DB.stores[storeId];
    const list = document.getElementById("lj-admin-cat-list");

    list.innerHTML = store.categories.map(c => {
      if (c === "الكل") {
        return `<li><span class="lj-admin-dot"></span><span class="lj-admin-cat-name">${c}</span></li>`;
      }
      return `
        <li data-name="${c}">
          <span class="lj-admin-dot"></span>
          <span class="lj-admin-cat-name">${c}</span>
          <button type="button" class="lj-admin-edit-btn" aria-label="تعديل">✎</button>
          <button type="button" class="lj-admin-remove-btn" aria-label="حذف">&times;</button>
        </li>`;
    }).join("");

    list.querySelectorAll("li[data-name]").forEach(li => {
      const name = li.dataset.name;

      li.querySelector(".lj-admin-edit-btn").addEventListener("click", async () => {
        const input = prompt("اسم الفئة الجديد:", name);
        if (!input) return;
        const newName = input.trim();
        if (!newName || newName === name) return;
        if (store.categories.includes(newName)) {
          alert("الفئة موجودة أصلاً");
          return;
        }
        try {
          await LJ_renameCategory(storeId, name, newName);
        } catch (err) {
          alert("تعذر تعديل الفئة");
          return;
        }
        renderCategoryList();
        if (document.getElementById("lj-admin-product-store").value === storeId) renderProductCategoryOptions(storeId);
      });

      li.querySelector(".lj-admin-remove-btn").addEventListener("click", async () => {
        const count = store.products.filter(p => p.category === name).length;
        const msg = count > 0
          ? `في ${count} منتج بهاي الفئة، رح تبقى بدون فئة محددة. متأكد إنك بدك تحذف "${name}"؟`
          : `متأكد إنك بدك تحذف "${name}"؟`;
        if (!confirm(msg)) return;
        try {
          await LJ_deleteCategory(storeId, name);
        } catch (err) {
          alert("تعذر حذف الفئة");
          return;
        }
        renderCategoryList();
        if (document.getElementById("lj-admin-product-store").value === storeId) renderProductCategoryOptions(storeId);
      });
    });
  }

  function bindCategoryForm() {
    document.getElementById("lj-admin-cat-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const storeId = document.getElementById("lj-admin-cat-store").value;
      const input = document.getElementById("lj-admin-cat-input");
      const name = input.value.trim();
      if (!name) return;
      try {
        await LJ_addCategory(storeId, name);
      } catch (err) {
        alert("تعذر إضافة الفئة");
        return;
      }
      input.value = "";
      renderCategoryList();
      const productStoreSel = document.getElementById("lj-admin-product-store");
      if (productStoreSel && productStoreSel.value === storeId) renderProductCategoryOptions(storeId);
    });
  }

  /* ---------------- مخزون المنتجات ---------------- */
  let productSearchQuery = "";

  function renderProductList() {
    const list = document.getElementById("lj-admin-product-list");
    const q = productSearchQuery.trim().toLowerCase();
    const products = allProductsFlat().filter(p =>
      !q || p.name.toLowerCase().includes(q) || p.storeName.toLowerCase().includes(q)
    );

    list.innerHTML = products.length
      ? products.map(p => `
        <li data-id="${p.id}" data-store="${p.storeId}">
          <img src="${p.image}" alt="${p.name}" onerror='this.onerror=null;this.src="${LJ_placeholderImg()}"'>
          <div class="lj-admin-product-list-info">
            <strong>${p.name}</strong>
            <span class="lj-admin-muted">${p.storeName} · ${p.price} ₪</span>
          </div>
          <button type="button" class="lj-admin-remove-btn" aria-label="حذف">&times;</button>
        </li>
      `).join("")
      : `<li class="lj-empty-msg">لا توجد منتجات مطابقة</li>`;

    list.querySelectorAll(".lj-admin-remove-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const li = btn.closest("li");
        try {
          await LJ_deleteProduct(li.dataset.store, li.dataset.id);
        } catch (err) {
          alert("تعذر حذف المنتج");
          return;
        }
        renderProductList();
        renderStores(await LJ_getAllOrders());
      });
    });
  }

  function bindProductSearch() {
    document.getElementById("lj-admin-product-search").addEventListener("input", (e) => {
      productSearchQuery = e.target.value;
      renderProductList();
    });
  }

  function renderProductStoreOptions() {
    const sel = document.getElementById("lj-admin-product-store");
    sel.innerHTML = Object.values(LJ_DB.stores).map(s => `<option value="${s.id}">${s.name}</option>`).join("");
    sel.addEventListener("change", () => renderProductCategoryOptions(sel.value));
    renderProductCategoryOptions(sel.value);
  }

  function renderProductCategoryOptions(storeId) {
    const store = LJ_DB.stores[storeId];
    const catSelect = document.getElementById("lj-admin-product-category");
    catSelect.innerHTML = store.categories
      .filter(c => c !== "الكل")
      .map(c => `<option value="${c}">${c}</option>`)
      .join("");
  }

  /* يصغّر الصورة المرفوعة ويحوّلها لـ data URI عشان ما تكبر حجم القاعدة بلا داعي */
  function readAndResizeImage(file, maxSize = 800, quality = 0.8) {
    return new Promise((resolve, reject) => {
      if (!file) { resolve(null); return; }
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function bindProductForm() {
    document.getElementById("lj-admin-product-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const storeId = document.getElementById("lj-admin-product-store").value;
      const category = document.getElementById("lj-admin-product-category").value;
      const nameInput = document.getElementById("lj-admin-product-name");
      const priceInput = document.getElementById("lj-admin-product-price");
      const descInput = document.getElementById("lj-admin-product-desc");
      const imageInput = document.getElementById("lj-admin-product-image");
      const name = nameInput.value.trim();
      const price = Number(priceInput.value);
      if (!name || !price || !category) return;

      const submitBtn = e.target.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      try {
        const image = await readAndResizeImage(imageInput.files[0]);
        await LJ_addProduct(storeId, { name, price, category, description: descInput.value.trim(), image });
      } catch (err) {
        alert("تعذر إضافة المنتج");
        submitBtn.disabled = false;
        return;
      }

      nameInput.value = "";
      priceInput.value = "";
      descInput.value = "";
      imageInput.value = "";
      submitBtn.disabled = false;
      renderProductList();
      renderStores(await LJ_getAllOrders());
    });
  }

  /* ---------------- العملاء (مشتقة من الطلبات الحقيقية) ---------------- */
  function renderCustomers(orders) {
    const map = new Map();
    orders.forEach(o => {
      const key = o.phone || o.name;
      if (!key) return;
      if (!map.has(key)) map.set(key, { name: o.name, phone: o.phone, city: o.city, orders: 0, total: 0 });
      const c = map.get(key);
      c.orders += 1;
      c.total += o.total || 0;
    });

    const table = document.getElementById("lj-admin-customers-table");
    const customers = Array.from(map.values());
    if (!customers.length) {
      table.innerHTML = `<tbody><tr><td class="lj-empty-msg">لا يوجد عملاء بعد</td></tr></tbody>`;
      return;
    }
    table.innerHTML = `
      <thead><tr><th>الاسم</th><th>الهاتف</th><th>المدينة</th><th>عدد الطلبات</th><th>إجمالي الإنفاق</th></tr></thead>
      <tbody>${customers.map(c => `
        <tr>
          <td>${c.name || "-"}</td>
          <td class="lj-admin-muted">${c.phone || "-"}</td>
          <td>${c.city || "-"}</td>
          <td>${c.orders}</td>
          <td>${c.total.toFixed(0)} ₪</td>
        </tr>
      `).join("")}</tbody>
    `;
  }

  /* ---------------- الإعدادات (عنوان ودوام كل متجر، قابلة للتعديل) ---------------- */
  function renderSettings() {
    const wrap = document.getElementById("lj-admin-settings-card");
    wrap.innerHTML = Object.values(LJ_DB.stores).map(s => `
      <form class="lj-admin-settings-row lj-admin-settings-form" data-store-id="${s.id}">
        <div class="lj-admin-store-avatar" style="background:${s.theme.primary}"><img src="${STORE_LOGOS[s.id]}" alt="${s.name}"></div>
        <div style="flex:1">
          <h4>${s.name}</h4>
          <div class="lj-admin-inline-form">
            <input type="text" class="lj-admin-settings-address" value="${s.address}" placeholder="العنوان" required>
            <input type="text" class="lj-admin-settings-hours" value="${s.hours}" placeholder="أوقات الدوام" required>
            <input type="text" class="lj-admin-settings-whatsapp" value="${s.whatsapp}" placeholder="رقم الواتساب (بدون + أو أصفار، مثال: 970599111222)" required>
            <input type="text" class="lj-admin-settings-facebook" value="${s.facebook || ""}" placeholder="رابط فيسبوك (اختياري)">
            <input type="text" class="lj-admin-settings-instagram" value="${s.instagram || ""}" placeholder="رابط انستجرام (اختياري)">
            <button type="submit" class="lj-btn lj-btn-primary">حفظ</button>
          </div>
        </div>
      </form>
    `).join("");
  }

  function bindSettingsForms() {
    document.querySelectorAll(".lj-admin-settings-form").forEach(form => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const storeId = form.dataset.storeId;
        const address = form.querySelector(".lj-admin-settings-address").value.trim();
        const hours = form.querySelector(".lj-admin-settings-hours").value.trim();
        const whatsapp = form.querySelector(".lj-admin-settings-whatsapp").value.trim();
        const facebook = form.querySelector(".lj-admin-settings-facebook").value.trim();
        const instagram = form.querySelector(".lj-admin-settings-instagram").value.trim();
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        const original = btn.textContent;
        try {
          await LJ_updateStoreDetails(storeId, { address, hours, whatsapp, facebook, instagram });
          btn.textContent = "تم الحفظ ✓";
        } catch (err) {
          alert("تعذر حفظ التعديل");
        } finally {
          setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1400);
        }
      });
    });
  }

  /* ---------------- تفعيل عنصر الشريط الجانبي حسب القسم الظاهر ---------------- */
  function bindSidebarActiveState() {
    const links = document.querySelectorAll("#lj-admin-nav a[data-section]");
    const sections = Array.from(links).map(l => document.getElementById(l.dataset.section)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(l => l.classList.remove("active"));
        const activeLink = document.querySelector(`#lj-admin-nav a[data-section="${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add("active");
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    sections.forEach(s => observer.observe(s));
  }

  async function refreshAll() {
    const orders = await LJ_getAllOrders();
    renderStats(orders);
    renderStores(orders);
    renderOrdersPreview(orders);
    renderCustomers(orders);
  }

  async function init() {
    await refreshAll();
    renderCategoryStoreOptions();
    renderCategoryList();
    bindCategoryForm();
    renderProductStoreOptions();
    renderProductList();
    bindProductForm();
    bindProductSearch();
    renderSettings();
    bindSettingsForms();
    bindSidebarActiveState();
    LJ_bindAdminLogout();
    LJ_bindOrderModal();
    LJ_bindAdminSidebarToggle();
  }

  LJ_onReady(async () => {
    const ok = await LJ_requireAdminAuth();
    if (!ok) return;
    await LJ_initDB();
    init();
  });
})();
