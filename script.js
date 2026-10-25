'use strict';

/**
 * FIX 1: addEventOnElem — original used elem.length > 1 which breaks for:
 *   - window (window.length = number of child frames, not whether it's a list)
 * Safe fix: explicitly check for NodeList / HTMLCollection before iterating.
 */
const addEventOnElem = function (elem, type, callback) {
  if (!elem) return; // null guard
  if (elem instanceof NodeList || elem instanceof HTMLCollection) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
};

/* ===== NAVBAR ===== */

const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  if (navbar) navbar.classList.toggle("active");
  if (overlay) overlay.classList.toggle("active");
};

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  if (navbar) navbar.classList.remove("active");
  if (overlay) overlay.classList.remove("active");
};

addEventOnElem(navbarLinks, "click", closeNavbar);

/* ===== STICKY HEADER ===== */

// FIX 2: Null guard — if [data-header] is missing, these scroll handlers crash.
const header = document.querySelector("[data-header]");

const headerActive = function () {
  if (!header) return;
  if (window.scrollY > 150) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
};

addEventOnElem(window, "scroll", headerActive);

let lastScrolledPos = 0;

const headerSticky = function () {
  if (!header) return;
  if (lastScrolledPos >= window.scrollY) {
    header.classList.remove("header-hide");
  } else {
    header.classList.add("header-hide");
  }
  lastScrolledPos = window.scrollY;
};

addEventOnElem(window, "scroll", headerSticky);

/* ===== SCROLL REVEAL ===== */

const section = document.querySelectorAll("[data-section]");

const scrollReveal = function () {
  for (let i = 0; i < section.length; i++) {
    if (section[i].getBoundingClientRect().top < window.innerHeight * 0.85) {
      section[i].classList.add("active");
    } else {
      section[i].classList.remove("active");
    }
  }
};

scrollReveal();
addEventOnElem(window, "scroll", scrollReveal);

/* ===== FAVORITE SYSTEM ===== */

const favoriteBtns = document.querySelectorAll(".favorite-btn");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// FIX 3: Null guard on badge — querySelector returns null if element doesn't exist.
const favoriteBadge = document.querySelector(
  '.header-action-btn[aria-label="favorite item"] .btn-badge'
);

const updateFavoriteBadge = () => {
  if (favoriteBadge) {
    favoriteBadge.textContent = favorites.length;
  }
};

favoriteBtns.forEach(btn => {
  const id = btn.dataset.id;
  const icon = btn.querySelector("ion-icon");

  if (favorites.includes(id)) {
    btn.classList.add("active");
    if (icon) icon.setAttribute("name", "star"); // FIX 4: null guard on icon
  }

  btn.addEventListener("click", () => toggleFavorite(btn));
});

function toggleFavorite(btn) {
  const id = btn.dataset.id;
  const icon = btn.querySelector("ion-icon");

  if (favorites.includes(id)) {
    favorites = favorites.filter(item => item !== id);
    btn.classList.remove("active");
    if (icon) icon.setAttribute("name", "star-outline");
  } else {
    favorites.push(id);
    btn.classList.add("active");
    if (icon) icon.setAttribute("name", "star");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateFavoriteBadge();
}

updateFavoriteBadge();

/* ===== ADD TO CART SYSTEM ===== */

const cartButtons = document.querySelectorAll(".cart-btn");

// FIX 5: Null guard — cartCount is null if the badge element doesn't exist.
const cartCount = document.querySelector(
  '.header-action-btn[aria-label="cart item"] .btn-badge'
);

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartUI() {
  if (cartCount) {
    cartCount.textContent = cart.length;
  }
}

cartButtons.forEach(button => {
  const id = button.dataset.id;
  const icon = button.querySelector("ion-icon");

  if (cart.includes(id)) {
    button.classList.add("active");
    if (icon) icon.setAttribute("name", "bag");
  }

  button.addEventListener("click", () => {
    if (cart.includes(id)) {
      cart = cart.filter(item => item !== id);
      button.classList.remove("active");
      if (icon) icon.setAttribute("name", "bag-handle-outline");
    } else {
      cart.push(id);
      button.classList.add("active");
      if (icon) icon.setAttribute("name", "bag");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
  });
});

updateCartUI();

/* ===== SEARCH ===== */
// There's no <form> tag around the search input, so we listen for a
// click on the submit button and Enter inside the field directly.
(function () {
    const searchField = document.querySelector('.search-field');
    const searchSubmit = document.querySelector('.search-submit');
    if (!searchField || !searchSubmit) return;

    function runSearch() {
        const query = searchField.value.trim();
        if (!query) return;

        // Catalog pages (shop/shoe/apparel/basketballs) have real product
        // cards we can filter in place. Everywhere else (home, product,
        // contact) we redirect to the shop page with the query attached.
        const hasCatalog = document.querySelector('.product-grid, .product-row');
        if (hasCatalog) {
            filterCurrentPage(query);
        } else {
            window.location.href = 'shop.html?q=' + encodeURIComponent(query);
        }
    }

    function filterCurrentPage(query) {
        const q = query.toLowerCase();

        // Paginated category pages (shoe/apparel/basketballs) normally show
        // only one grid at a time via pagination.js. While searching, show
        // every grid and hide pagination — matches can be on any "page".
        const grids = document.querySelectorAll('[id^="productGrid-"]');
        const pagination = document.querySelector('.pagination');
        if (grids.length > 1) {
            grids.forEach(g => g.classList.add('active-grid'));
            if (pagination) pagination.style.display = 'none';
        }

        let matchCount = 0;
        document.querySelectorAll('.product-card').forEach(card => {
            const nameEl = card.querySelector('.product-name');
            const text = nameEl ? nameEl.textContent.toLowerCase() : '';
            const isMatch = text.includes(q);
            card.style.display = isMatch ? '' : 'none';
            if (isMatch) matchCount++;
        });

        showResultsBanner(query, matchCount, grids.length > 1 ? pagination : null);
    }

    function showResultsBanner(query, count, hiddenPagination) {
        let banner = document.getElementById('searchResultsBanner');
        const anchor = document.querySelector('.product-grid, .product-row, [id^="productGrid-"]');

        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'searchResultsBanner';
            banner.className = 'search-results-banner';
            if (anchor && anchor.parentNode) {
                anchor.parentNode.insertBefore(banner, anchor);
            }
        }

        banner.textContent = '';
        const label = document.createElement('span');
        label.textContent = `${count} result${count === 1 ? '' : 's'} for "${query}"`;
        banner.appendChild(label);

        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.textContent = 'Clear search';
        clearBtn.addEventListener('click', () => clearSearch(hiddenPagination));
        banner.appendChild(clearBtn);
    }

    function clearSearch(hiddenPagination) {
        searchField.value = '';
        const banner = document.getElementById('searchResultsBanner');
        if (banner) banner.remove();

        document.querySelectorAll('.product-card').forEach(card => {
            card.style.display = '';
        });

        if (hiddenPagination) {
            hiddenPagination.style.display = '';
            // Restore normal single-page-visible behavior
            const allGrids = document.querySelectorAll('[id^="productGrid-"]');
            allGrids.forEach(g => g.classList.remove('active-grid'));
            const firstGrid = document.getElementById('productGrid-1');
            if (firstGrid) firstGrid.classList.add('active-grid');
        }
    }

    searchSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        runSearch();
    });

    searchField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            runSearch();
        }
    });

    // Arrived here via a redirect from another page's search (?q=...)?
    // Run the search automatically once the page loads.
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q');
    if (initialQuery) {
        searchField.value = initialQuery;
        // Wait a tick so pagination.js (which also runs on load) finishes
        // its own initial goToPage(1) first, or our grid-visibility
        // changes here would just get overwritten.
        setTimeout(runSearch, 0);
    }
})();

/* ===== NEWSLETTER FORM (footer) ===== */
const newsletterForms = document.querySelectorAll('[data-newsletter-form]');

newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const button = form.querySelector('button');
        const input = form.querySelector('input');
        const originalText = button.textContent;

        button.textContent = 'Subscribed!';
        button.disabled = true;

        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            if (input) input.value = '';
        }, 2500);
    });
});

const track = document.querySelector(".hero-track");
const slides = document.querySelectorAll(".hero-slide");
const nextBtn = document.querySelector(".slide-btn.next");
const prevBtn = document.querySelector(".slide-btn.prev");

let index = 0;

function updateSlider() {
  if (track) track.style.transform = `translateX(-${index * 100}%)`;
}

// FIX 6: Critical crash — nextBtn/prevBtn are null when elements are missing.
// Original code called .addEventListener directly on them, throwing
// "Cannot read properties of null". Wrapped in a null guard.
if (track && slides.length && nextBtn && prevBtn) {
  nextBtn.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    updateSlider();
  });

  prevBtn.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    updateSlider();
  });

  // FIX 7: Store interval reference so it can be cleared when the tab is hidden.
  const autoSlide = setInterval(() => {
    index = (index + 1) % slides.length;
    updateSlider();
  }, 10000);

  // Pause auto-slide when the tab is not visible to avoid invisible state drift.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(autoSlide);
    }
  });
}
