'use strict';

/* ===== CONTACT FORM ===== */
// NOTE: There's no backend yet, so this only simulates a successful send.
// Once Django is wired up, replace the setTimeout block below with a real
// fetch() POST to a /contact/ endpoint and handle the actual response.
const contactForm = document.getElementById('contactForm');
const successMsg = document.getElementById('contactSuccessMsg');

if (contactForm && successMsg) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic required-field check (HTML5 `required` already blocks
        // empty submits in modern browsers, but this covers older ones
        // and gives us a hook for custom validation messages later).
        const requiredFields = contactForm.querySelectorAll('[required]');
        let allFilled = true;
        requiredFields.forEach(field => {
            if (!field.value.trim()) allFilled = false;
        });

        if (!allFilled) return;

        const submitBtn = contactForm.querySelector('.contact-submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulated network delay so the UI feels real.
        setTimeout(() => {
            successMsg.classList.add('active');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Hide the success message again after a while so the form
            // is clearly reusable for a second message.
            setTimeout(() => successMsg.classList.remove('active'), 6000);
        }, 600);
    });
}
