/* home.js — Homepage specific JS */

// ── Countdown Timer ──────────────────────────────────────────
(function () {
    let hours = 47, mins = 59, secs = 51;
    const ch = document.getElementById('ch');
    const cm = document.getElementById('cm');
    const cs = document.getElementById('cs');
    if (!ch) return;
    setInterval(() => {
        secs--;
        if (secs < 0) { secs = 59; mins--; }
        if (mins < 0) { mins = 59; hours--; }
        if (hours < 0) { hours = 0; mins = 0; secs = 0; }
        ch.textContent = String(hours).padStart(2, '0');
        cm.textContent = String(mins).padStart(2, '0');
        cs.textContent = String(secs).padStart(2, '0');
    }, 1000);
})();

// ── Featured Products ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // wait for PRODUCTS to be defined
    if (!window.PRODUCTS) return;
    const featured = window.PRODUCTS.filter((_, i) => i < 4);
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;
    featured.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.transitionDelay = (i * 0.12) + 's';
        card.innerHTML = `
      <div class="product-card-img">
        <img src="${p.img}" alt="${p.name}" onerror="this.src='images/laptop1.png'"/>
      </div>
      <div class="product-card-body">
        <div class="product-card-brand">${p.brand}</div>
        <h3 class="product-card-name">${p.name}</h3>
        <p class="product-card-specs">${p.specs}</p>
        <div class="product-card-footer">
          <span class="product-card-price">₹${p.price.toLocaleString('en-IN')}</span>
          <button class="add-to-cart-btn" onclick="addToCart(${JSON.stringify(p).replace(/"/g, "'").replace(/'/g, '&apos;')})">ADD TO CART</button>
        </div>
      </div>
    `;
        card.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            window.location.href = 'products.html';
        });
        grid.appendChild(card);
    });

    // Re-observe new cards
    const cardObs = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 100);
                cardObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    grid.querySelectorAll('.product-card').forEach(c => cardObs.observe(c));

    // Fix add to cart button with proper data
    grid.querySelectorAll('.add-to-cart-btn').forEach((btn, i) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.addToCart(featured[i]);
        });
    });
});

// Parallax on hero
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const scrolled = window.scrollY;
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');
    if (orb1) orb1.style.transform = `translateY(${scrolled * 0.3}px)`;
    if (orb2) orb2.style.transform = `translateY(${scrolled * 0.2}px)`;
});

// Scroll Counter Animation (moved to main.js)
