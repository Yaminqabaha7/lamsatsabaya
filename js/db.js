/* ============================================================
   طبقة الاتصال بقاعدة البيانات (Supabase)
   ============================================================ */

const SUPABASE_URL = "https://rzikauexkyjkjzuptygg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ufRZtjSSfMi0e5udocZ3fg_i9Cq64hq";
const LJ_SB = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ينفذ fn فوراً إذا كان الـ DOM جاهز، أو ينتظر DOMContentLoaded إذا لسه عم يتحمل */
function LJ_onReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
}

let ljDbPromise = null;

async function LJ_fetchDBOnce() {
  const [{ data: stores, error: storesErr }, { data: products, error: productsErr }] = await Promise.all([
    LJ_SB.from("stores").select("*"),
    LJ_SB.from("products").select("*")
  ]);
  if (storesErr) throw storesErr;
  if (productsErr) throw productsErr;

  LJ_DB.stores = {};
  stores.forEach(s => {
    LJ_DB.stores[s.id] = {
      id: s.id,
      slug: s.slug,
      name: s.name,
      tagline: s.tagline,
      description: s.description,
      logoText: s.logo_text,
      address: s.address,
      hours: s.hours,
      whatsapp: s.whatsapp,
      categories: s.categories || [],
      theme: s.theme,
      themeDark: s.theme_dark,
      translations: s.translations || {},
      products: []
    };
  });

  products.forEach(p => {
    const store = LJ_DB.stores[p.store_id];
    if (!store) return;
    store.products.push({
      id: p.id,
      name: p.name,
      category: p.category,
      price: Number(p.price),
      oldPrice: p.old_price === null ? null : Number(p.old_price),
      image: p.image,
      images: p.images || [],
      description: p.description,
      colors: p.colors || [],
      sizes: p.sizes || [],
      translations: p.translations || {}
    });
  });
}

/* يجيب المتاجر والمنتجات من Supabase ويعبي LJ_DB بنفس الشكل القديم تماماً
   بيعيد المحاولة تلقائياً لو صار انقطاع مؤقت بالشبكة قبل ما يستسلم */
function LJ_initDB() {
  if (ljDbPromise) return ljDbPromise;

  ljDbPromise = (async () => {
    const attempts = 3;
    for (let i = 0; i < attempts; i++) {
      try {
        await LJ_fetchDBOnce();
        return;
      } catch (err) {
        if (i === attempts - 1) {
          ljDbPromise = null; // نسمح بمحاولة جديدة لاحقاً (مثلاً لما يضغط الزائر "إعادة المحاولة")
          throw err;
        }
        await new Promise(r => setTimeout(r, 700 * (i + 1)));
      }
    }
  })();

  return ljDbPromise;
}

/* بتعرض رسالة "تعذر تحميل البيانات" مع زر إعادة محاولة، بدل رسالة مضللة متل "المتجر غير موجود"
   لما يكون سبب الفشل انقطاع بالشبكة أو تعذر الوصول لقاعدة البيانات مش خطأ برابط فعلي */
function LJ_showLoadError(rootId) {
  const el = rootId ? document.getElementById(rootId) : document.body;
  if (!el) return;
  el.innerHTML = `
    <div style="padding:60px 20px;text-align:center">
      <p>تعذر تحميل بيانات المتجر، تحقق من الاتصال بالإنترنت وحاول مرة ثانية</p>
      <button type="button" id="lj-retry-load-btn" style="margin-top:14px;padding:10px 22px;border-radius:8px;border:none;background:var(--store-primary,#16342b);color:#fff;cursor:pointer;font-family:inherit">إعادة المحاولة</button>
    </div>
  `;
  document.getElementById("lj-retry-load-btn").addEventListener("click", () => location.reload());
}

/* ============================================================
   الطلبات
   ============================================================ */

function LJ_mapOrderRow(row) {
  return {
    id: row.id,
    storeId: row.store_id,
    name: row.name,
    phone: row.phone,
    city: row.city,
    address: row.address,
    notes: row.notes,
    items: row.items || [],
    total: Number(row.total),
    status: row.status,
    createdAt: row.created_at
  };
}

async function LJ_saveOrder(storeId, orderData) {
  const order = {
    id: "ORD-" + Date.now(),
    storeId,
    ...orderData,
    items: LJ_getCart(storeId),
    total: LJ_cartTotal(storeId),
    status: "قيد المعالجة",
    createdAt: new Date().toISOString()
  };

  const { error } = await LJ_SB.from("orders").insert({
    id: order.id,
    store_id: order.storeId,
    name: order.name,
    phone: order.phone,
    city: order.city,
    address: order.address,
    notes: order.notes,
    items: order.items,
    total: order.total,
    status: order.status
  });
  if (error) throw error;

  return order;
}

async function LJ_getAllOrders() {
  const { data, error } = await LJ_SB.from("orders").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data.map(LJ_mapOrderRow);
}

async function LJ_updateOrderStatus(orderId, status) {
  const { error } = await LJ_SB.from("orders").update({ status }).eq("id", orderId);
  if (error) throw error;
}

/* ============================================================
   إدارة الأدمن (فئات ومنتجات)
   ============================================================ */

async function LJ_addCategory(storeId, name) {
  const store = LJ_DB.stores[storeId];
  if (!store || store.categories.includes(name)) return;
  const categories = [...store.categories, name];
  const { error } = await LJ_SB.from("stores").update({ categories }).eq("id", storeId);
  if (error) throw error;
  store.categories = categories;
}

async function LJ_renameCategory(storeId, oldName, newName) {
  const store = LJ_DB.stores[storeId];
  if (!store || oldName === newName) return;
  const categories = store.categories.map(c => c === oldName ? newName : c);

  const { error: storeErr } = await LJ_SB.from("stores").update({ categories }).eq("id", storeId);
  if (storeErr) throw storeErr;

  const { error: productsErr } = await LJ_SB.from("products")
    .update({ category: newName })
    .eq("store_id", storeId)
    .eq("category", oldName);
  if (productsErr) throw productsErr;

  store.categories = categories;
  store.products.forEach(p => { if (p.category === oldName) p.category = newName; });
}

async function LJ_deleteCategory(storeId, name) {
  const store = LJ_DB.stores[storeId];
  if (!store) return;
  const categories = store.categories.filter(c => c !== name);

  const { error } = await LJ_SB.from("stores").update({ categories }).eq("id", storeId);
  if (error) throw error;

  store.categories = categories;
}

async function LJ_updateStoreDetails(storeId, { address, hours }) {
  const store = LJ_DB.stores[storeId];
  if (!store) return;

  const { error } = await LJ_SB.from("stores").update({ address, hours }).eq("id", storeId);
  if (error) throw error;

  store.address = address;
  store.hours = hours;
}

async function LJ_addProduct(storeId, { name, price, category, description = "", image }) {
  const store = LJ_DB.stores[storeId];
  const id = `${storeId}-${Date.now()}`;
  const img = image || LJ_placeholderImg();

  const { error } = await LJ_SB.from("products").insert({
    id,
    store_id: storeId,
    name,
    category,
    price,
    old_price: null,
    image: img,
    images: [img],
    description,
    colors: [],
    sizes: []
  });
  if (error) throw error;

  store.products.push({
    id, name, category, price, oldPrice: null,
    image: img, images: [img],
    description, colors: [], sizes: [], translations: {}
  });
}

async function LJ_deleteProduct(storeId, productId) {
  const { error } = await LJ_SB.from("products").delete().eq("id", productId);
  if (error) throw error;
  const store = LJ_DB.stores[storeId];
  if (store) store.products = store.products.filter(p => p.id !== productId);
}

/* ============================================================
   تسجيل دخول الأدمن
   ============================================================ */

async function LJ_adminSignIn(email, password) {
  const { data, error } = await LJ_SB.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

async function LJ_adminSignOut() {
  await LJ_SB.auth.signOut();
}

async function LJ_adminGetSession() {
  const { data } = await LJ_SB.auth.getSession();
  return data.session;
}
