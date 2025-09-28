class ModelViewer {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = document.querySelectorAll('.model-slide').length;
        this.isTransitioning = false;
        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateNavigation();
    }
    
    setupEventListeners() {
        // Navigation dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Navigation buttons
        document.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const direction = e.target.dataset.direction;
                if (direction === 'prev') {
                    this.previousSlide();
                } else if (direction === 'next') {
                    this.nextSlide();
                }
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }
    
    
    handleKeydown(e) {
        if (this.isTransitioning) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
        }
    }
    
    nextSlide() {
        if (this.isTransitioning) return;
        
        const nextSlide = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextSlide);
    }
    
    previousSlide() {
        if (this.isTransitioning) return;
        
        const prevSlide = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
        this.goToSlide(prevSlide);
    }
    
    goToSlide(slideIndex) {
        if (this.isTransitioning || slideIndex === this.currentSlide) return;
        
        this.isTransitioning = true;
        
        const slides = document.querySelectorAll('.model-slide');
        const currentSlide = slides[this.currentSlide];
        const targetSlide = slides[slideIndex];
        
        // Remove active class from current slide
        currentSlide.classList.remove('active');
        
        // Add appropriate classes based on direction
        if (slideIndex > this.currentSlide) {
            targetSlide.classList.add('active');
            currentSlide.classList.add('prev');
        } else {
            targetSlide.classList.add('active');
            currentSlide.classList.add('prev');
        }
        
        // Clean up classes after transition - reduced timeout
        setTimeout(() => {
            slides.forEach(slide => {
                slide.classList.remove('prev');
                if (!slide.classList.contains('active')) {
                    slide.classList.remove('active');
                }
            });
            
            this.currentSlide = slideIndex;
            this.updateNavigation();
            this.isTransitioning = false;
        }, 250); // Reduced to 250ms to match CSS transition
    }
    
    updateNavigation() {
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
}

// Initialize the model viewer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ModelViewer();
});

// Add some additional mobile optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Prevent pull-to-refresh on mobile
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Optimize for mobile viewport
    const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
});
