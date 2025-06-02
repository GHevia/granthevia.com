document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(event) {
            event.stopPropagation();
            closeAllDropdowns();
            dropdown.classList.toggle('open');
        });
    });

    document.addEventListener('click', closeAllDropdowns);

    function closeAllDropdowns() {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('open');
        });
    }

    // Lightbox functionality
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            lightboxModal.style.display = 'block';
            lightboxImg.src = this.src;
            lightboxImg.alt = this.alt;
        });
    });

    lightboxClose.addEventListener('click', function() {
        lightboxModal.style.display = 'none';
    });

    lightboxModal.addEventListener('click', function(event) {
        if (event.target === lightboxModal) {
            lightboxModal.style.display = 'none';
        }
    });
});

window.addEventListener('load', () => {
    document.body.style.overflowY = 'auto'; // Ensure scroll remains active
    document.body.offsetHeight; // Trigger reflow
});

window.addEventListener('load', () => {
    const galleryImages = document.querySelectorAll('.gallery img');

    galleryImages.forEach(img => {
        img.addEventListener('load', () => {
            img.style.display = 'none';
            // Trigger reflow
            void img.offsetHeight;
            img.style.display = 'block';
        });
    });

    // Fallback: trigger reflow after 200ms
    setTimeout(() => {
        document.body.style.overflowY = 'auto';
        document.body.offsetHeight;
    }, 200);
});
