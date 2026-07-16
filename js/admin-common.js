/* ============================================================
   منطق مشترك بين صفحات لوحة الأدمن (admin.html و orders.html):
   حماية الدخول، رسم صفوف/تفاصيل الطلبات، النافذة المنبثقة
   ============================================================ */

const LJ_ORDER_STATUS_OPTIONS = ["قيد المعالجة", "تم الشحن", "تم التسليم", "ملغي"];
const LJ_ORDER_STATUS_CLASS = {
  "قيد المعالجة": "lj-status-pending",
  "تم الشحن": "lj-status-shipped",
  "تم التسليم": "lj-status-delivered",
  "ملغي": "lj-status-canceled"
};

function LJ_fmtOrderDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" });
}

function LJ_orderRowHtml(order) {
  const store = LJ_DB.stores[order.storeId];
  const firstItem = order.items && order.items[0] ? LJ_findProduct(order.storeId, order.items[0].productId) : null;
  const extra = order.items && order.items.length > 1 ? ` +${order.items.length - 1}` : "";
  return `
    <tr>
      <td>${LJ_fmtOrderDate(order.createdAt)}</td>
      <td>
        <select class="lj-status-select ${LJ_ORDER_STATUS_CLASS[order.status] || ""}" data-order-id="${order.id}">
          ${LJ_ORDER_STATUS_OPTIONS.map(s => `<option value="${s}" ${s === order.status ? "selected" : ""}>${s}</option>`).join("")}
        </select>
      </td>
      <td>${(order.total || 0).toFixed(0)} ₪</td>
      <td>${firstItem ? firstItem.name : "-"}${extra}</td>
      <td>${order.name || "-"} <span class="lj-admin-muted">/ ${store ? store.name : order.storeId}</span></td>
      <td class="lj-admin-muted"><button type="button" class="lj-order-details-btn" data-order-id="${order.id}">${order.id}</button></td>
    </tr>
  `;
}

function LJ_ordersTableHtml(orders) {
  if (!orders.length) {
    return `<tbody><tr><td colspan="6" class="lj-empty-msg">لا توجد طلبات بعد</td></tr></tbody>`;
  }
  return `
    <thead><tr><th>التاريخ</th><th>الحالة</th><th>المبلغ</th><th>المنتج</th><th>العميل</th><th>رقم الطلب</th></tr></thead>
    <tbody>${orders.map(LJ_orderRowHtml).join("")}</tbody>
  `;
}

/* عرض بديل للجدول بشكل بطاقات على الموبايل: كل معلومات الطلب خلف زر واحد واضح
   بدل ما المستخدم يضطر يعمل scroll أفقي بجدول ضيق */
function LJ_orderCardHtml(order) {
  const store = LJ_DB.stores[order.storeId];
  const firstItem = order.items && order.items[0] ? LJ_findProduct(order.storeId, order.items[0].productId) : null;
  const extra = order.items && order.items.length > 1 ? ` +${order.items.length - 1}` : "";
  return `
    <div class="lj-order-card">
      <div class="lj-order-card-top">
        <span class="lj-order-card-date">${LJ_fmtOrderDate(order.createdAt)}</span>
        <select class="lj-status-select ${LJ_ORDER_STATUS_CLASS[order.status] || ""}" data-order-id="${order.id}">
          ${LJ_ORDER_STATUS_OPTIONS.map(s => `<option value="${s}" ${s === order.status ? "selected" : ""}>${s}</option>`).join("")}
        </select>
      </div>
      <div class="lj-order-card-body">
        <div class="lj-order-card-row"><span>المنتج</span><strong>${firstItem ? firstItem.name : "-"}${extra}</strong></div>
        <div class="lj-order-card-row"><span>العميل</span><strong>${order.name || "-"} <span class="lj-admin-muted">/ ${store ? store.name : order.storeId}</span></strong></div>
        <div class="lj-order-card-row"><span>المبلغ</span><strong>${(order.total || 0).toFixed(0)} ₪</strong></div>
      </div>
      <button type="button" class="lj-btn lj-btn-ghost lj-btn-block lj-order-details-btn" data-order-id="${order.id}">عرض التفاصيل الكاملة (${order.id})</button>
    </div>
  `;
}

function LJ_ordersCardsHtml(orders) {
  if (!orders.length) return `<p class="lj-empty-msg">لا توجد طلبات بعد</p>`;
  return orders.map(LJ_orderCardHtml).join("");
}

function LJ_orderDetailHtml(order) {
  const store = LJ_DB.stores[order.storeId];
  const itemsHtml = (order.items || []).map(item => {
    const p = LJ_findProduct(order.storeId, item.productId);
    const variant = [item.variant && item.variant.color, item.variant && item.variant.size].filter(Boolean).join(" / ");
    return `
      <div class="lj-order-detail-item">
        <span>${p ? p.name : "منتج محذوف"}${variant ? ` (${variant})` : ""} × ${item.qty}</span>
        <span>${p ? (p.price * item.qty).toFixed(0) + " ₪" : "-"}</span>
      </div>`;
  }).join("");

  return `
    <h2>تفاصيل الطلب</h2>
    <div class="lj-order-detail-row"><span>رقم الطلب</span><strong>${order.id}</strong></div>
    <div class="lj-order-detail-row"><span>المتجر</span><strong>${store ? store.name : order.storeId}</strong></div>
    <div class="lj-order-detail-row"><span>التاريخ</span><strong>${LJ_fmtOrderDate(order.createdAt)}</strong></div>
    <div class="lj-order-detail-row"><span>الحالة</span><strong>${order.status}</strong></div>
    <div class="lj-order-detail-row"><span>الاسم</span><strong>${order.name || "-"}</strong></div>
    <div class="lj-order-detail-row"><span>رقم الهاتف</span><strong>${order.phone || "-"}</strong></div>
    <div class="lj-order-detail-row"><span>المدينة</span><strong>${order.city || "-"}</strong></div>
    <div class="lj-order-detail-row"><span>العنوان</span><strong>${order.address || "-"}</strong></div>
    <div class="lj-order-detail-row"><span>ملاحظات</span><strong>${order.notes || "-"}</strong></div>
    <div class="lj-order-detail-items">
      <h3>المنتجات</h3>
      ${itemsHtml || `<p class="lj-admin-muted">لا توجد منتجات</p>`}
    </div>
    <div class="lj-order-detail-total"><span>الإجمالي</span><span>${(order.total || 0).toFixed(0)} ₪</span></div>
  `;
}

function LJ_openOrderModal(order) {
  document.getElementById("lj-order-modal-body").innerHTML = LJ_orderDetailHtml(order);
  document.getElementById("lj-order-modal").hidden = false;
}

function LJ_closeOrderModal() {
  document.getElementById("lj-order-modal").hidden = true;
}

function LJ_bindOrderModal() {
  document.querySelector("#lj-order-modal .lj-order-modal-backdrop").addEventListener("click", LJ_closeOrderModal);
  document.querySelector("#lj-order-modal .lj-order-modal-close").addEventListener("click", LJ_closeOrderModal);
}

/* بتربط تغيير الحالة وزر التفاصيل لكل صفوف جدول طلبات معروض بالصفحة.
   onStatusChanged بتنعاد بعد نجاح تحديث الحالة عشان الصفحة تعيد رسم نفسها */
function LJ_bindOrderRowActions(root, orders, onStatusChanged) {
  root.querySelectorAll(".lj-status-select").forEach(sel => {
    sel.addEventListener("change", async () => {
      sel.disabled = true;
      try {
        await LJ_updateOrderStatus(sel.dataset.orderId, sel.value);
      } catch (err) {
        alert("تعذر تحديث حالة الطلب");
      }
      if (onStatusChanged) await onStatusChanged();
    });
  });

  root.querySelectorAll(".lj-order-details-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const order = orders.find(o => o.id === btn.dataset.orderId);
      if (order) LJ_openOrderModal(order);
    });
  });
}

/* بوابة الدخول المشتركة بكل صفحات الأدمن - بترجع true إذا المستخدم مسجل دخول وجاهز يكمل،
   وإلا بتعرض فورم تسجيل الدخول وترجع false */
async function LJ_requireAdminAuth() {
  const session = await LJ_adminGetSession();
  if (session) return true;

  document.querySelector(".lj-admin-shell").hidden = true;
  document.getElementById("lj-admin-login").hidden = false;

  const form = document.getElementById("lj-admin-login-form");
  const errorEl = document.getElementById("lj-admin-login-error");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    errorEl.textContent = "";
    try {
      await LJ_adminSignIn(fd.get("email"), fd.get("password"));
      location.reload();
    } catch (err) {
      submitBtn.disabled = false;
      errorEl.textContent = "بيانات الدخول غير صحيحة";
    }
  });

  return false;
}

/* بيربط زر الهامبرغر بفتح/إغلاق القائمة الجانبية كدرج منزلق على الموبايل (أقل من 900px) */
function LJ_bindAdminSidebarToggle() {
  const menuBtn = document.getElementById("lj-admin-menu-btn");
  const sidebar = document.querySelector(".lj-admin-sidebar");
  const backdrop = document.getElementById("lj-admin-sidebar-backdrop");
  if (!menuBtn || !sidebar || !backdrop) return;

  const close = () => { sidebar.classList.remove("lj-open"); backdrop.classList.remove("lj-open"); };
  const open = () => { sidebar.classList.add("lj-open"); backdrop.classList.add("lj-open"); };

  menuBtn.addEventListener("click", () => sidebar.classList.contains("lj-open") ? close() : open());
  backdrop.addEventListener("click", close);
  sidebar.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
}

function LJ_bindAdminLogout() {
  const btn = document.getElementById("lj-admin-logout");
  if (!btn) return;
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    await LJ_adminSignOut();
    location.href = "index.html";
  });
}
