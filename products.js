/* products.js — Products page logic */

let activeFilters = { brands: ['Dell', 'HP', 'Lenovo', 'Apple'], maxPrice: 75000, search: '' };
let currentSort = 'featured';

function getFilteredProducts() {
    let ps = [...window.PRODUCTS];
    // brand filter
    ps = ps.filter(p => activeFilters.brands.includes(p.brand));
    // price filter
    ps = ps.filter(p => p.price <= activeFilters.maxPrice);
    // search
    if (activeFilters.search) {
        const q = activeFilters.search.toLowerCase();
        ps = ps.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.specs.toLowerCase().includes(q)
        );
    }
    // sort
    if (currentSort === 'price-asc') ps.sort((a, b) => a.price - b.price);
    else if (currentSort === 'price-desc') ps.sort((a, b) => b.price - a.price);
    else if (currentSort === 'name-asc') ps.sort((a, b) => a.name.localeCompare(b.name));
    return ps;
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');
    const foundCount = document.getElementById('foundCount');
    if (!grid) return;

    const ps = getFilteredProducts();
    foundCount.textContent = ps.length;
    grid.innerHTML = '';
    noResults.classList.toggle('show', ps.length === 0);

    ps.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'prod-card';
        card.style.transitionDelay = Math.min(i * 0.05, 0.5) + 's';
        card.innerHTML = `
      <div class="prod-card-img">
        <img src="${p.img}" alt="${p.name}" onerror="this.src='images/laptop1.png'" loading="lazy"/>
      </div>
      <div class="prod-card-body">
        <div class="prod-brand">${p.brand}</div>
        <h3 class="prod-name">${p.name}</h3>
        <p class="prod-specs">${p.specs}</p>
        <div class="prod-footer">
          <span class="prod-price">₹${p.price.toLocaleString('en-IN')}</span>
          <button class="prod-atc" data-idx="${i}">ADD TO CART</button>
        </div>
      </div>
    `;
        grid.appendChild(card);
    });

    // Re-observe for reveal
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 60);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.05 });
    grid.querySelectorAll('.prod-card').forEach(c => obs.observe(c));

    // Add to cart buttons
    grid.querySelectorAll('.prod-atc').forEach((btn, i) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.addToCart(ps[i]);
            btn.textContent = 'ADDED ✓';
            btn.style.background = '#22c55e';
            setTimeout(() => {
                btn.textContent = 'ADD TO CART';
                btn.style.background = '';
            }, 1500);
        });
    });

    // Card click → cart
    grid.querySelectorAll('.prod-card').forEach((card, i) => {
        card.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') return;
        });
    });
}

function resetFilters() {
    activeFilters = { brands: ['Dell', 'HP', 'Lenovo', 'Apple'], maxPrice: 75000, search: '' };
    document.querySelectorAll('.filter-toggle[data-brand]').forEach(t => t.checked = true);
    const slider = document.getElementById('maxPriceSlider');
    if (slider) { slider.value = 75000; document.getElementById('priceMax').textContent = '₹75,000'; }
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    renderProducts();
}
window.resetFilters = resetFilters;

document.addEventListener('DOMContentLoaded', () => {
    // Brand filters
    document.querySelectorAll('.filter-toggle[data-brand]').forEach(toggle => {
        toggle.addEventListener('change', () => {
            const brand = toggle.dataset.brand;
            if (toggle.checked) {
                if (!activeFilters.brands.includes(brand)) activeFilters.brands.push(brand);
            } else {
                activeFilters.brands = activeFilters.brands.filter(b => b !== brand);
            }
            renderProducts();
        });
    });

    // Price slider
    const slider = document.getElementById('maxPriceSlider');
    const priceMax = document.getElementById('priceMax');
    if (slider) {
        slider.addEventListener('input', () => {
            activeFilters.maxPrice = parseInt(slider.value);
            priceMax.textContent = '₹' + parseInt(slider.value).toLocaleString('en-IN');
            renderProducts();
        });
    }

    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let debounce;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounce);
            debounce = setTimeout(() => {
                activeFilters.search = searchInput.value.trim();
                renderProducts();
            }, 300);
        });
    }

    // Sort
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            currentSort = sortSelect.value;
            renderProducts();
        });
    }

    renderProducts();
});
