(function () {
    // FIX: totalPages used to be hardcoded to 4, which broke any page
    // that didn't have exactly 4 product grids (e.g. apparel.html has 3,
    // basketballs.html has 2). Now we detect grids automatically by
    // matching any element whose id starts with "productGrid-".
    const grids = Array.from(document.querySelectorAll('[id^="productGrid-"]'))
        .sort((a, b) => {
            const numA = parseInt(a.id.split('-')[1], 10);
            const numB = parseInt(b.id.split('-')[1], 10);
            return numA - numB;
        });
    const totalPages = grids.length;

    if (totalPages === 0) return; // no paginated grid on this page — nothing to do

    const pageBtns = document.querySelectorAll('.pagination .page-btn');
    // Number buttons are index 1–4; index 0 = prev, index 5 = next
    const prevBtn = pageBtns[0];
    const nextBtn = pageBtns[pageBtns.length - 1];
    const numberBtns = Array.from(pageBtns).slice(1, pageBtns.length - 1);

    let currentPage = 1;

    function goToPage(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;

        // Show only the active grid
        grids.forEach((g, i) => {
            if (!g) return;
            if (i + 1 === currentPage) {
                g.classList.add('active-grid');
            } else {
                g.classList.remove('active-grid');
            }
        });

        // Update active button style
        numberBtns.forEach((btn, i) => {
            btn.classList.toggle('active', i + 1 === currentPage);
        });

        // Scroll to top of product grid area
        const shopMain = document.querySelector('.shop-main');
        if (shopMain) shopMain.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Attach click handlers to number buttons
    numberBtns.forEach((btn, i) => {
        btn.addEventListener('click', () => goToPage(i + 1));
    });

    prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
    nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

    // Initialize on page 1
    goToPage(1);
})();
