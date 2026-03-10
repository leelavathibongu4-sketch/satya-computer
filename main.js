/* ============================================================
   SATYA COMPUTERS — Main JS (shared across all pages)
   ============================================================ */

// ── Custom Cursor ────────────────────────────────────────────
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');

if (dot && ring) {
  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });
  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();
  document.querySelectorAll('a, button, .product-card, .sol-card, .prod-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
}

// ── Scroll Progress Bar ──────────────────────────────────────
const progressBar = document.getElementById('progressBar');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (window.scrollY / total) * 100;
    progressBar.style.width = pct + '%';
  });
}

// ── Header Scroll ────────────────────────────────────────────
const header = document.getElementById('siteHeader');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  });
}

// ── Mobile Nav ────────────────────────────────────────────────
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    siteNav.classList.toggle('open');
  });
  siteNav.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      siteNav.classList.remove('open');
    });
  });
}

// ── Active nav link ──────────────────────────────────────────
document.querySelectorAll('.nav-link').forEach(link => {
  if (link.href === window.location.href) link.classList.add('active');
});

// ── Scroll Reveal ────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => revealObs.observe(el));

// ── Product Card Reveal (staggered) ─────────────────────────
const cardObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      cardObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.product-card, .prod-card').forEach(c => cardObs.observe(c));

// ── Toast ────────────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Cart System ──────────────────────────────────────────────
function getCart() {
  try { return JSON.parse(localStorage.getItem('sc_cart') || '[]'); } catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem('sc_cart', JSON.stringify(cart));
  updateCartUI();
}
function updateCartUI() {
  const cart = getCart();
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => {
    el.textContent = count;
    el.classList.toggle('visible', count > 0);
  });
}
window.addToCart = function (product) {
  const cart = getCart();
  const existing = cart.find(i => i.name === product.name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  showToast(`✓ ${product.name} added to cart`);
};
window.removeFromCart = function (name) {
  let cart = getCart().filter(i => i.name !== name);
  saveCart(cart);
};
window.updateQty = function (name, qty) {
  let cart = getCart();
  const item = cart.find(i => i.name === name);
  if (item) { item.qty = qty; if (item.qty < 1) cart = cart.filter(i => i.name !== name); }
  saveCart(cart);
};
window.getCart = getCart;
window.saveCart = saveCart;
window.showToast = showToast;

// Init cart count
updateCartUI();

// ── Product Data ─────────────────────────────────────────────
window.PRODUCTS = [
  // DELL
  { name: 'DELL LATITUDE 5300', brand: 'Dell', specs: 'Intel Core i5-8th Gen · 8GB RAM · 256GB SSD', price: 18500, img: 'images/DELL LATITUDE 5300.jpg' },
  { name: 'DELL LATITUDE 5320', brand: 'Dell', specs: 'Intel Core i5-11th Gen · 8GB RAM · 512GB SSD', price: 24000, img: 'images/DELL LATITUDE 5320.jpg' },
  { name: 'DELL LATITUDE 5400', brand: 'Dell', specs: 'Intel Core i7-8th Gen · 16GB RAM · 512GB SSD', price: 22000, img: 'images/DELL LATITUDE 5400.jpg' },
  { name: 'DELL LATITUDE 5470', brand: 'Dell', specs: 'Intel Core i5-6th Gen · 8GB RAM · 256GB SSD', price: 14500, img: 'images/DELL LATITUDE 5470.jpg' },
  { name: 'DELL LATITUDE 5490', brand: 'Dell', specs: 'Intel Core i5-8th Gen · 8GB RAM · 256GB SSD', price: 17000, img: 'images/DELL LATITUDE 5490.jpg' },
  { name: 'DELL LATITUDE 7290 v1', brand: 'Dell', specs: 'Intel Core i5-8th Gen · 8GB RAM · 256GB SSD', price: 19000, img: 'images/DELL LATITUDE 7290 (v1).jpg' },
  { name: 'DELL LATITUDE 7290 v2', brand: 'Dell', specs: 'Intel Core i7-8th Gen · 16GB RAM · 512GB SSD', price: 22000, img: 'images/DELL LATITUDE 7290 (v2).jpg' },
  { name: 'DELL LATITUDE 7400', brand: 'Dell', specs: 'Intel Core i7-8th Gen · 16GB RAM · 512GB SSD · FHD IPS', price: 28000, img: 'images/DELL LATITUDE 7400.jpg' },
  { name: 'DELL LATITUDE 7490 v1', brand: 'Dell', specs: 'Intel Core i5-8th Gen · 8GB RAM · 256GB SSD', price: 21000, img: 'images/DELL LATITUDE 7490 (v1).jpg' },
  { name: 'DELL LATITUDE 7490 v2', brand: 'Dell', specs: 'Intel Core i7-8th Gen · 16GB RAM · 512GB SSD', price: 25000, img: 'images/DELL LATITUDE 7490 (v2).jpg' },
  { name: 'DELL PRECISION 5530', brand: 'Dell', specs: 'Intel Core i7-8th Gen · 16GB RAM · 512GB SSD · 2GB Graphics', price: 35000, img: 'images/DELL PRECISION 5530 (Graphic Card 2GB).jpg' },
  { name: 'DELL PRECISION 5540', brand: 'Dell', specs: 'Intel Core i9-9th Gen · 32GB RAM · 1TB SSD · NVIDIA', price: 45000, img: 'images/DELL PRECISION 5540.jpg' },
  { name: 'Dell Latitude 3450', brand: 'Dell', specs: 'Intel Core i5-5th Gen · 8GB RAM · 256GB SSD', price: 13000, img: 'images/Dell Latitude 3450.jpg' },
  { name: 'Dell Latitude 3470 v1', brand: 'Dell', specs: 'Intel Core i5-6th Gen · 8GB RAM · 256GB SSD', price: 14000, img: 'images/Dell Latitude 3470 (v1).jpg' },
  { name: 'Dell Latitude 3470 v2', brand: 'Dell', specs: 'Intel Core i5-6th Gen · 8GB RAM · 256GB SSD', price: 14500, img: 'images/Dell Latitude 3470 (v2).jpg' },
  { name: 'Dell Latitude 3480', brand: 'Dell', specs: 'Intel Core i5-7th Gen · 8GB RAM · 256GB SSD', price: 15000, img: 'images/Dell Latitude 3480.jpg' },
  { name: 'Dell Latitude 3490 v1', brand: 'Dell', specs: 'Intel Core i5-8th Gen · 8GB RAM · 256GB SSD', price: 16000, img: 'images/Dell Latitude 3490 (v1).jpg' },
  { name: 'Dell Latitude 3490 v2', brand: 'Dell', specs: 'Intel Core i5-8th Gen · 8GB RAM · 256GB SSD', price: 16500, img: 'images/Dell Latitude 3490 (v2).jpg' },
  { name: 'Dell Latitude 3490 v3', brand: 'Dell', specs: 'Intel Core i7-8th Gen · 16GB RAM · 512GB SSD', price: 20000, img: 'images/Dell Latitude 3490 (v3).jpg' },
  { name: 'Dell Latitude 5480', brand: 'Dell', specs: 'Intel Core i5-7th Gen · 8GB RAM · 256GB SSD', price: 17500, img: 'images/Dell Latitude 5480.jpg' },
  { name: 'Dell Basic Model', brand: 'Dell', specs: 'Intel Core i3 · 4GB RAM · 128GB SSD', price: 10000, img: 'images/Dell basic model laptop.jpg' },
  // HP
  { name: 'HP EliteBook 640 G5', brand: 'HP', specs: 'Intel Core i5-8th Gen · 8GB RAM · 256GB SSD', price: 19500, img: 'images/HP ELIGHT BOOK 640 G5.jpg' },
  { name: 'HP EliteBook 640 G9', brand: 'HP', specs: 'Intel Core i5-12th Gen · 16GB RAM · 512GB SSD', price: 32000, img: 'images/HP ELIGHT BOOK 640 G9.jpg' },
  { name: 'HP EliteBook 745 G6', brand: 'HP', specs: 'AMD Ryzen 5 · 8GB RAM · 256GB SSD', price: 20000, img: 'images/HP ELIGHT BOOK 745 G6.jpg' },
  { name: 'HP EliteBook 840 G3', brand: 'HP', specs: 'Intel Core i5-6th Gen · 8GB RAM · 256GB SSD', price: 15000, img: 'images/HP ELIGHT BOOK 840 G3.jpg' },
  { name: 'HP EliteBook 840 G4', brand: 'HP', specs: 'Intel Core i5-7th Gen · 8GB RAM · 256GB SSD', price: 17000, img: 'images/HP ELIGHT BOOK 840 G4.jpg' },
  { name: 'HP EliteBook 840 G6', brand: 'HP', specs: 'Intel Core i7-8th Gen · 16GB RAM · 512GB SSD', price: 24000, img: 'images/HP ELIGHT BOOK 840 G6.jpg' },
  // Lenovo
  { name: 'Lenovo ThinkPad L450', brand: 'Lenovo', specs: 'Intel Core i5-5th Gen · 8GB RAM · 256GB SSD', price: 13500, img: 'images/Lenovo ThinkPad L450.jpg' },
  { name: 'Lenovo ThinkPad L470', brand: 'Lenovo', specs: 'Intel Core i5-7th Gen · 8GB RAM · 256GB SSD', price: 16000, img: 'images/Lenovo ThinkPad L470.jpg' },
  { name: 'Lenovo ThinkPad T460 v2', brand: 'Lenovo', specs: 'Intel Core i5-6th Gen · 8GB RAM · 256GB SSD', price: 14000, img: 'images/Lenovo ThinkPad T460 (v2).jpg' },
  { name: 'Lenovo ThinkPad T460 v3', brand: 'Lenovo', specs: 'Intel Core i7-6th Gen · 16GB RAM · 512GB SSD', price: 18000, img: 'images/Lenovo ThinkPad T460 (v3).jpg' },
  { name: 'Lenovo ThinkPad T470', brand: 'Lenovo', specs: 'Intel Core i5-7th Gen · 8GB RAM · 256GB SSD', price: 16500, img: 'images/Lenovo ThinkPad T470.jpg' },
  { name: 'Lenovo ThinkPad X1 Gen 6', brand: 'Lenovo', specs: 'Intel Core i7-8th Gen · 16GB RAM · 512GB SSD · Touch', price: 30000, img: 'images/Lenovo ThinkPad X1 Gen 6.jpg' },
  { name: 'Lenovo ThinkPad x280 v1', brand: 'Lenovo', specs: 'Intel Core i5-8th Gen · 8GB RAM · 256GB SSD', price: 18000, img: 'images/Lenovo ThinkPad x280 (v1).jpg' },
  { name: 'Lenovo ThinkPad x280 v2', brand: 'Lenovo', specs: 'Intel Core i7-8th Gen · 16GB RAM · 512GB SSD', price: 22000, img: 'images/Lenovo ThinkPad x280 (v2).jpg' },
  { name: 'Lenovo ThinkPad T450', brand: 'Lenovo', specs: 'Intel Core i5-5th Gen · 8GB RAM · 256GB SSD', price: 13000, img: 'images/Lenovo Thinkpad T450.jpg' },
  { name: 'Lenovo ThinkPad T480', brand: 'Lenovo', specs: 'Intel Core i5-8th Gen · 8GB RAM · 256GB SSD', price: 20000, img: 'images/Lenovo Thinkpad T480.jpg' },
  { name: 'Lenovo v30', brand: 'Lenovo', specs: 'Intel Core i3 · 4GB RAM · 128GB HDD', price: 11000, img: 'images/Lenovo v30 laptop.jpg' },
  { name: 'Lenovo X1 Carbon', brand: 'Lenovo', specs: 'Intel Core i7-8th Gen · 16GB RAM · 512GB SSD · Ultrabook', price: 32000, img: 'images/Lenovo x1 carbon.jpg' },
  { name: 'Lenovo Yoga L13', brand: 'Lenovo', specs: 'Intel Core i5-10th Gen · 8GB RAM · 256GB SSD · 2-in-1', price: 22000, img: 'images/Lenovo yoga L13.jpg' },
  { name: 'Lenovo Yoga X380', brand: 'Lenovo', specs: 'Intel Core i5-8th Gen · 8GB RAM · 256GB SSD · 2-in-1', price: 24000, img: 'images/Lenovo yoga x 380.jpg' },
  { name: 'Lenovo Basic Model', brand: 'Lenovo', specs: 'Intel Core i3 · 4GB RAM · 256GB HDD', price: 10500, img: 'images/lenovo Basic model laptop.jpg' },
  { name: 'Lenovo ThinkPad T460 v1', brand: 'Lenovo', specs: 'Intel Core i5-6th Gen · 8GB RAM · 256GB SSD', price: 13500, img: 'images/lenovo ThinkPad T460 (v1).jpg' },
  // MacBook
  { name: 'MacBook Pro A1398 2015 Retina v1', brand: 'Apple', specs: 'Intel Core i7 · 16GB RAM · 256GB SSD · Retina Display', price: 45000, img: 'images/MAC BOOK PRO A1398 (2015 Retina v1).jpg' },
  { name: 'MacBook Pro A1398 2015 Retina v2', brand: 'Apple', specs: 'Intel Core i7 · 16GB RAM · 512GB SSD · Retina Display', price: 48000, img: 'images/MAC BOOK PRO A1398 (2015 Retina v2).jpg' },
  { name: 'MacBook Pro A1708 2017', brand: 'Apple', specs: 'Intel Core i5 · 8GB RAM · 256GB SSD · 13"', price: 40000, img: 'images/MAC BOOK PRO A1708 (2017).jpg' },
  { name: 'MacBook Pro A1989 2018 Touch Bar', brand: 'Apple', specs: 'Intel Core i5 · 8GB RAM · 512GB SSD · Touch Bar', price: 55000, img: 'images/MAC BOOK PRO A1989 (2018 Touch Bar).jpg' },
  { name: 'MacBook Pro A1990 2018 Retina Touch', brand: 'Apple', specs: 'Intel Core i7 · 16GB RAM · 512GB SSD · Touch Bar Pro', price: 65000, img: 'images/MAC BOOK PRO A1990 (2018 Retina Touch).jpg' },
  { name: 'MacBook Pro A2141 2019 Touch Bar', brand: 'Apple', specs: 'Intel Core i9 · 16GB RAM · 1TB SSD · 16" Retina', price: 75000, img: 'images/MAC BOOK PRO A2141 (2019 Touch Bar).jpg' },
];

// ── Shared Scroll Counter Animation ───────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const stats = document.querySelectorAll('.stat-num, .asb-num');
  if (stats.length === 0) return;

  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // default to text if no data-target to fallback but better if data-target exists
        if (!el.hasAttribute('data-target')) return;

        const target = parseInt(el.getAttribute('data-target') || '0');
        const suffix = el.getAttribute('data-suffix') || '';

        let start = 0;
        const duration = 2000; // 2 seconds
        let startTime = null;

        const step = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);

          // easeOutQuart 
          const easeOut = 1 - Math.pow(1 - progress, 4);
          const current = Math.floor(easeOut * target);

          el.textContent = current + suffix;

          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            el.textContent = target + suffix;
          }
        };

        window.requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => {
    countObserver.observe(stat);
  });
});
