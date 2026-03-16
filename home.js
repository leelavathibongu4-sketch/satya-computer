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
    if (!window.PRODUCTS) return;
    const featured = window.PRODUCTS.filter((_, i) => i < 8);
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;

    featured.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'product-card neon-card';
        card.setAttribute('data-index', i);
        card.innerHTML = `
      <div class="neon-card-glow"></div>
      <div class="product-card-img">
        <img src="${p.img}" alt="${p.name}" onerror="this.src='images/laptop1.png'"/>
        <div class="card-img-shine"></div>
      </div>
      <div class="product-card-body">
        <div class="product-card-brand">${p.brand}</div>
        <h3 class="product-card-name">${p.name}</h3>
        <p class="product-card-specs">${p.specs}</p>
        <div class="product-card-footer">
          <span class="product-card-price">₹${p.price.toLocaleString('en-IN')}</span>
          <button class="add-to-cart-btn" id="cartBtn-${i}">
            <span class="btn-icon">🛒</span>
            <span class="btn-label">ADD TO CART</span>
            <span class="btn-ripple"></span>
          </button>
        </div>
      </div>
    `;
        // Navigate to product page on card click
        card.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart-btn')) return;
            window.location.href = 'products.html';
        });

        // Add to cart with feedback animation
        const btn = card.querySelector('.add-to-cart-btn');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (btn.classList.contains('added')) return;
            window.addToCart(p);
            btn.classList.add('added');
            btn.querySelector('.btn-label').textContent = '✓ ADDED!';
            setTimeout(() => {
                btn.classList.remove('added');
                btn.querySelector('.btn-label').textContent = 'ADD TO CART';
            }, 1800);
        });

        // 3D tilt on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);
            card.style.transform = `
        perspective(800px)
        rotateY(${dx * 10}deg)
        rotateX(${-dy * 8}deg)
        translateZ(12px)
        scale(1.03)
      `;
            card.querySelector('.neon-card-glow').style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateZ(0) scale(1)';
            card.querySelector('.neon-card-glow').style.opacity = '0';
        });

        grid.appendChild(card);
    });

    // Show cards with stagger
    const cardObs = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 80);
                cardObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.08 });
    grid.querySelectorAll('.product-card').forEach(c => cardObs.observe(c));
});

// ── Drag-to-Scroll on Elite Track ───────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.querySelector('.elite-track-wrapper');
    if (!wrapper) return;

    let isDown = false, startX, scrollLeft;

    wrapper.addEventListener('mousedown', (e) => {
        isDown = true;
        wrapper.classList.add('dragging');
        startX = e.pageX - wrapper.offsetLeft;
        scrollLeft = wrapper.scrollLeft;
    });
    wrapper.addEventListener('mouseleave', () => {
        isDown = false;
        wrapper.classList.remove('dragging');
    });
    wrapper.addEventListener('mouseup', () => {
        isDown = false;
        wrapper.classList.remove('dragging');
    });
    wrapper.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - wrapper.offsetLeft;
        const walk = (x - startX) * 1.6;
        wrapper.scrollLeft = scrollLeft - walk;
    });

    // Touch support
    let touchStartX = 0, touchScrollLeft = 0;
    wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].pageX;
        touchScrollLeft = wrapper.scrollLeft;
    }, { passive: true });
    wrapper.addEventListener('touchmove', (e) => {
        const dx = touchStartX - e.touches[0].pageX;
        wrapper.scrollLeft = touchScrollLeft + dx;
    }, { passive: true });
});
