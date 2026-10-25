'use strict';

/* ===== FILTER SIDEBAR TOGGLE ===== */
const filterToggleBtn = document.getElementById('filterToggleBtn');
const shopSidebar = document.getElementById('shopSidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

function openSidebar() {
    if (!shopSidebar || !sidebarOverlay) return;
    shopSidebar.classList.add('mobile-open');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    if (!shopSidebar || !sidebarOverlay) return;
    shopSidebar.classList.remove('mobile-open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (filterToggleBtn) {
    filterToggleBtn.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            openSidebar();
        } else {
            shopSidebar.classList.toggle('hidden');
            const span = filterToggleBtn.querySelector('span') || filterToggleBtn;
            const isHidden = shopSidebar.classList.contains('hidden');
            filterToggleBtn.innerHTML = isHidden
                ? 'Show Filters <ion-icon name="options-outline"></ion-icon>'
                : 'Hide Filters <ion-icon name="options-outline"></ion-icon>';
        }
    });
}

if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

// Close sidebar when window is resized to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeSidebar();
    }
});

/* ===== COLLAPSIBLE FILTER GROUPS ===== */
const filterTitles = document.querySelectorAll('[data-filter-toggle]');

filterTitles.forEach(title => {
    title.addEventListener('click', () => {
        const list = title.nextElementSibling;
        if (!list) return;
        title.classList.toggle('collapsed');
        list.classList.toggle('hidden');
    });
});

/* ===== PAGINATION ===== */
const pageBtns = document.querySelectorAll('.page-btn');

pageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Only set active on number buttons, not arrow buttons
        if (!btn.querySelector('ion-icon')) {
            pageBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }

        // Scroll back to top of product grid smoothly
        const productGrid = document.getElementById('productGrid');
        if (productGrid) {
            productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ===== SORT ===== */
const sortSelect = document.getElementById('sortSelect');
const productGrid = document.getElementById('productGrid');

if (sortSelect && productGrid) {
    sortSelect.addEventListener('change', () => {
        const cards = Array.from(productGrid.querySelectorAll('.product-card'));
        const val = sortSelect.value;

        cards.sort((a, b) => {
            if (val === 'Price: Low to High') return Number(a.dataset.price) - Number(b.dataset.price);
            if (val === 'Price: High to Low') return Number(b.dataset.price) - Number(a.dataset.price);
            if (val === 'Newest') return (b.dataset.id || 0) - (a.dataset.id || 0);
            return 0; // Featured — original order
        });

        // Re-append in sorted order with a fade effect
        productGrid.style.opacity = '0';
        productGrid.style.transition = 'opacity 0.2s ease';

        setTimeout(() => {
            cards.forEach(card => productGrid.appendChild(card));
            productGrid.style.opacity = '1';
        }, 200);
    });
}

/* ===== ACTIVE FILTER CHECKBOXES ===== */
const filterCheckboxes = document.querySelectorAll('.filter-item input[type="checkbox"]');
const productCount = document.querySelector('.shop-title-bar .count');

filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateActiveFilters);
});

function updateActiveFilters() {
    const checked = document.querySelectorAll('.filter-item input[type="checkbox"]:checked');

    // Show how many filters are active in the filter button
    if (filterToggleBtn) {
        const span = filterToggleBtn.querySelector('span');
        if (span) {
            span.textContent = checked.length > 0
                ? `Filter (${checked.length})`
                : 'Filter';
        }
    }
}

/* ===== FAVORITE & CART SYNC ===== */
// Reload badge counts from localStorage on page load
// (the main logic lives in script.js — this just re-initializes)
window.addEventListener('DOMContentLoaded', () => {
    // Restore favorite button states
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const icon = btn.querySelector('ion-icon');
        if (savedFavorites.includes(btn.dataset.id)) {
            btn.classList.add('active');
            if (icon) icon.setAttribute('name', 'star');
        }
    });

    // Restore cart button states
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    document.querySelectorAll('.cart-btn').forEach(btn => {
        const icon = btn.querySelector('ion-icon');
        if (savedCart.includes(btn.dataset.id)) {
            btn.classList.add('active');
            if (icon) icon.setAttribute('name', 'bag');
        }
    });
});