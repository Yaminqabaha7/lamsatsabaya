/* ============================================================
   LJ Product Carousel
   كاروسيل أفقي لانهائي (Infinite Loop) لعرض المنتجات
   قابل لإعادة الاستخدام في أي متجر - يستقبل بيانات المنتجات
   ودالة رسم الكارت بدون أي تغيير على شكل الكارت الحالي
   ============================================================ */

class LJProductCarousel {
  /**
   * @param {HTMLElement} rootEl - العنصر الحاوي (.lj-carousel)
   * @param {Object} options
   * @param {Function} options.renderCard - دالة (product) => htmlString لرسم كارت المنتج
   * @param {Number} options.speed - سرعة الحركة بالبكسل/ثانية
   * @param {Number} options.copies - عدد نسخ تكرار القائمة لضمان لانهائية الحركة
   */
  constructor(rootEl, options) {
    this.root = rootEl;
    this.renderCard = options.renderCard;
    this.speed = options.speed || 45;
    this.copies = options.copies || 4;
    this.products = [];
    this.pos = 0;
    this.singleSetWidth = 0;
    this.paused = false;
    this.rafId = null;
    this.lastTs = null;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this._buildDom();
    this._bindEvents();

    this._onResize = LJ_debounce(() => this._measure(), 200);
    window.addEventListener("resize", this._onResize);
  }

  _buildDom() {
    this.root.classList.add("lj-carousel");
    this.root.innerHTML = `
      <button type="button" class="lj-carousel-arrow lj-carousel-prev" aria-label="السابق">&lsaquo;</button>
      <div class="lj-carousel-viewport">
        <div class="lj-carousel-track"></div>
      </div>
      <button type="button" class="lj-carousel-arrow lj-carousel-next" aria-label="التالي">&rsaquo;</button>
    `;
    this.viewport = this.root.querySelector(".lj-carousel-viewport");
    this.track = this.root.querySelector(".lj-carousel-track");
    this.prevBtn = this.root.querySelector(".lj-carousel-prev");
    this.nextBtn = this.root.querySelector(".lj-carousel-next");
  }

  _bindEvents() {
    this.root.addEventListener("mouseenter", () => (this.paused = true));
    this.root.addEventListener("mouseleave", () => (this.paused = false));
    this.root.addEventListener("touchstart", () => (this.paused = true), { passive: true });
    this.root.addEventListener("touchend", () => (this.paused = false));
    this.root.addEventListener("focusin", () => (this.paused = true));
    this.root.addEventListener("focusout", () => (this.paused = false));

    this.prevBtn.addEventListener("click", () => this._nudge(1));
    this.nextBtn.addEventListener("click", () => this._nudge(-1));
  }

  _nudge(sign) {
    // نقلة يدوية بسيطة عند الضغط على الأسهم مع مراعاة اتجاه اللغة
    const dirSign = this._isRtl() ? -1 : 1;
    this.pos += sign * dirSign * 220;
    this._normalizePos();
    this._render();
  }

  _isRtl() {
    return document.documentElement.getAttribute("dir") === "rtl";
  }

  /** يستقبل مصفوفة منتجات جديدة (بعد فلترة أو بحث) ويعيد بناء الشريط */
  setProducts(products) {
    this.products = products || [];
    this.pos = 0;

    if (!this.products.length) {
      this.track.innerHTML = "";
      this._stop();
      return;
    }

    const singleSetHTML = this.products.map(p => this.renderCard(p)).join("");
    let html = "";
    for (let i = 0; i < this.copies; i++) html += singleSetHTML;
    this.track.innerHTML = html;
    this.track.style.transform = "translateX(0px)";

    // القياس بعد رسم العناصر بإطار واحد لضمان دقة الأبعاد
    requestAnimationFrame(() => {
      this._measure();
      this._start();
    });
  }

  _measure() {
    if (!this.products.length) return;
    const totalWidth = this.track.scrollWidth;
    this.singleSetWidth = totalWidth / this.copies;
  }

  _start() {
    this._stop();
    if (this.reducedMotion || !this.products.length) return;
    this.lastTs = null;
    const step = (ts) => {
      if (this.lastTs === null) this.lastTs = ts;
      const dt = (ts - this.lastTs) / 1000;
      this.lastTs = ts;

      if (!this.paused && this.singleSetWidth > 0) {
        const dirSign = this._isRtl() ? 1 : -1;
        this.pos += dirSign * this.speed * dt;
        this._normalizePos();
        this._render();
      }
      this.rafId = requestAnimationFrame(step);
    };
    this.rafId = requestAnimationFrame(step);
  }

  _normalizePos() {
    if (!this.singleSetWidth) return;
    // إعادة تدوير الموضع بسلاسة حتى لا يحدث قفزة مرئية عند اكتمال دورة كاملة
    if (this.pos <= -this.singleSetWidth) this.pos += this.singleSetWidth;
    if (this.pos >= this.singleSetWidth) this.pos -= this.singleSetWidth;
  }

  _render() {
    this.track.style.transform = `translateX(${this.pos}px)`;
  }

  _stop() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }

  destroy() {
    this._stop();
    window.removeEventListener("resize", this._onResize);
    this.root.innerHTML = "";
  }
}

function LJ_debounce(fn, delay) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}
