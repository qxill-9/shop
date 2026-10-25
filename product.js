'use strict';

/* ===== IMAGE GALLERY ===== */
const thumbBtns = document.querySelectorAll('.thumb-btn');
const mainImg = document.getElementById('mainProductImg');

thumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active state
        thumbBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Swap main image with a fade effect
        mainImg.style.opacity = '0';
        mainImg.style.transition = 'opacity 0.2s ease';
        setTimeout(() => {
            mainImg.src = btn.dataset.img;
            mainImg.style.opacity = '1';
        }, 200);
    });
});

/* ===== COLOR SELECTOR ===== */
const colorBtns = document.querySelectorAll('.color-btn');
const selectedColorLabel = document.getElementById('selectedColor');

colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        colorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (selectedColorLabel) {
            selectedColorLabel.textContent = btn.dataset.color;
        }
    });
});

/* ===== SIZE SELECTOR ===== */
const sizeBtns = document.querySelectorAll('.size-btn:not(.disabled)');
const selectedSizeLabel = document.getElementById('selectedSize');

sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        sizeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (selectedSizeLabel) {
            selectedSizeLabel.textContent = 'US ' + btn.dataset.size;
        }
    });
});

/* ===== QUANTITY CONTROL ===== */
const qtyMinus = document.getElementById('qtyMinus');
const qtyPlus = document.getElementById('qtyPlus');
const qtyValue = document.getElementById('qtyValue');

let quantity = 1;

if (qtyMinus && qtyPlus && qtyValue) {
    qtyMinus.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            qtyValue.textContent = quantity;
        }
    });

    qtyPlus.addEventListener('click', () => {
        if (quantity < 99) {
            quantity++;
            qtyValue.textContent = quantity;
        }
    });
}

/* ===== TABS ===== */
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        // Update active tab button
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Show matching content
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === 'tab-' + target) {
                content.classList.add('active');
            }
        });
    });
});

/* ===== ADD TO CART (product page specific) ===== */
// The main cart/favorite logic is in script.js
// This handles the add to cart button UI feedback
const addToCartBtn = document.getElementById('addToCartBtn');

if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
        const selectedSize = document.querySelector('.size-btn.active');

        if (!selectedSize) {
            // Shake the size selector to prompt user to pick a size
            const sizeOptions = document.querySelector('.size-options');
            if (sizeOptions) {
                sizeOptions.style.animation = 'none';
                sizeOptions.offsetHeight; // reflow
                sizeOptions.style.animation = 'shake 0.4s ease';
            }

            // Add shake keyframes if not already present
            if (!document.getElementById('shakeStyle')) {
                const style = document.createElement('style');
                style.id = 'shakeStyle';
                style.textContent = `
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        20% { transform: translateX(-8px); }
                        40% { transform: translateX(8px); }
                        60% { transform: translateX(-6px); }
                        80% { transform: translateX(6px); }
                    }
                `;
                document.head.appendChild(style);
            }

            // Highlight size label in red briefly
            const sizeLabel = document.querySelector('.option-group .option-label strong');
            if (sizeLabel) {
                const original = sizeLabel.textContent;
                sizeLabel.textContent = '← Please select a size';
                sizeLabel.style.color = 'hsl(0, 75%, 50%)';
                setTimeout(() => {
                    sizeLabel.textContent = original;
                    sizeLabel.style.color = '';
                }, 2000);
            }
            return;
        }

        // Visual feedback — button turns green briefly
        addToCartBtn.textContent = '✓ Added to Cart!';
        addToCartBtn.style.background = 'var(--hoockers-green)';
        setTimeout(() => {
            addToCartBtn.innerHTML = '<ion-icon name="bag-handle-outline"></ion-icon> Add to Cart';
            addToCartBtn.style.background = '';
        }, 2000);
    });
}
