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

    // Improved image loading handling
    const galleryImages = document.querySelectorAll('.gallery img');
    
    galleryImages.forEach(img => {
        // Force layout recalculation when image loads
        img.addEventListener('load', () => {
            // Force a reflow
            void img.offsetHeight;
            
            // Ensure proper display
            img.style.display = 'block';
            img.style.width = '100%';
            img.style.height = 'auto';
        });

        // Handle images that are already loaded
        if (img.complete) {
            img.style.display = 'block';
            img.style.width = '100%';
            img.style.height = 'auto';
        }
    });

    // Ensure proper layout after all images are loaded
    window.addEventListener('load', () => {
        document.body.style.overflowY = 'auto';
        // Force a reflow
        void document.body.offsetHeight;
    });
});

window.dispatchEvent(new Event('resize'));