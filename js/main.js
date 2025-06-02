// Utility functions
const utils = {
    forceReflow: (element) => {
        void element.offsetHeight;
    },
    
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Gallery functionality
const gallery = {
    init() {
        this.setupLightbox();
        this.setupImageLoading();
    },

    setupLightbox() {
        const lightboxModal = document.getElementById('lightbox-modal');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.querySelector('.lightbox-close');
        const galleryItems = document.querySelectorAll('.gallery-item');

        if (!lightboxModal || !lightboxImg || !lightboxClose) return;

        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                lightboxModal.style.display = 'block';
                lightboxImg.src = item.src;
                lightboxImg.alt = item.alt;
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightboxModal.style.display = 'none';
        });

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.style.display = 'none';
            }
        });
    },

    setupImageLoading() {
        const galleryImages = document.querySelectorAll('.gallery img');
        
        galleryImages.forEach(img => {
            const handleImageLoad = () => {
                utils.forceReflow(img);
                img.style.display = 'block';
                img.style.width = '100%';
                img.style.height = 'auto';
            };

            img.addEventListener('load', handleImageLoad);
            
            // Handle already loaded images
            if (img.complete) {
                handleImageLoad();
            }

            // Add error handling
            img.addEventListener('error', () => {
                console.error(`Failed to load image: ${img.src}`);
                img.style.display = 'none';
            });
        });
    }
};

// Navigation functionality
const navigation = {
    init() {
        this.setupDropdowns();
    },

    setupDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeAllDropdowns();
                dropdown.classList.toggle('open');
            });
        });

        document.addEventListener('click', () => this.closeAllDropdowns());
    },

    closeAllDropdowns() {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('open');
        });
    }
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    gallery.init();
    navigation.init();

    // Ensure proper layout after all images are loaded
    window.addEventListener('load', () => {
        document.body.style.overflowY = 'auto';
        utils.forceReflow(document.body);
    });
});

// Handle window resize with debounce
window.addEventListener('resize', utils.debounce(() => {
    utils.forceReflow(document.body);
}, 250));