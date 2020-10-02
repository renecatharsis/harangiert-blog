import GLightbox from 'glightbox';

(function() {
    "use strict";

    let lightboxElements = document.querySelectorAll('a[data-gallery^="lightbox-"]');
    let lightboxes = [];

    lightboxElements.forEach(function (element) {
        const selector = element.getAttribute('data-gallery');
        if (!lightboxes.includes(selector)) {
            GLightbox();
            lightboxes.push(selector);
        }
    });
})();
