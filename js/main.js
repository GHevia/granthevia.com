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
