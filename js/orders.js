/* ============================================================
   صفحة "كل الطلبات" - محمية بتسجيل دخول، مع تقسيم صفحات (Pagination)
   عشان ما يتعرض آلاف الطلبات دفعة وحدة بنفس الصفحة
   ============================================================ */

(function () {
  const PAGE_SIZE = 20;
  let allOrders = [];
  let currentPage = 1;

  function renderPage() {
    const totalPages = Math.max(1, Math.ceil(allOrders.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * PAGE_SIZE;
    const pageOrders = allOrders.slice(start, start + PAGE_SIZE);

    const table = document.getElementById("lj-orders-table");
    table.innerHTML = LJ_ordersTableHtml(pageOrders);
    LJ_bindOrderRowActions(table, pageOrders, refreshAndRender);

    const cards = document.getElementById("lj-orders-cards");
    cards.innerHTML = LJ_ordersCardsHtml(pageOrders);
    LJ_bindOrderRowActions(cards, pageOrders, refreshAndRender);

    document.getElementById("lj-orders-page-info").textContent =
      `صفحة ${currentPage} من ${totalPages} (${allOrders.length} طلب)`;
    document.getElementById("lj-orders-prev").disabled = currentPage <= 1;
    document.getElementById("lj-orders-next").disabled = currentPage >= totalPages;
  }

  async function refreshAndRender() {
    allOrders = await LJ_getAllOrders(); // مرتبة الأحدث أولاً أصلاً من db.js
    renderPage();
  }

  function bindPagination() {
    document.getElementById("lj-orders-prev").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage();
      }
    });
    document.getElementById("lj-orders-next").addEventListener("click", () => {
      const totalPages = Math.max(1, Math.ceil(allOrders.length / PAGE_SIZE));
      if (currentPage < totalPages) {
        currentPage++;
        renderPage();
      }
    });
  }

  async function init() {
    await LJ_initDB();
    await refreshAndRender();
    bindPagination();
    LJ_bindOrderModal();
    LJ_bindAdminLogout();
    LJ_bindAdminSidebarToggle();
  }

  LJ_onReady(async () => {
    const ok = await LJ_requireAdminAuth();
    if (!ok) return;
    init();
  });
})();
