// PSL Mobil Enerji - Main JavaScript
// Premium dark theme with electric effects

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initBackToTop();
    initElectricEffects();
    initFormEnhancements();
    initPerformanceOptimizations();
    
    // Initialize external libraries if available
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            disable: window.innerWidth < 768 ? true : false // Disable on mobile for performance
        });
    }
});

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = mobileMenuButton?.querySelector('[data-feather="menu"]');
    
    if (!mobileMenuButton || !mobileMenu) return;
    
    mobileMenuButton.addEventListener('click', function() {
        const isOpen = !mobileMenu.classList.contains('hidden');
        
        if (isOpen) {
            mobileMenu.classList.add('hidden');
            if (menuIcon) {
                menuIcon.setAttribute('data-feather', 'menu');
                feather.replace();
            }
        } else {
            mobileMenu.classList.remove('hidden');
            if (menuIcon) {
                menuIcon.setAttribute('data-feather', 'x');
                feather.replace();
            }
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            if (menuIcon) {
                menuIcon.setAttribute('data-feather', 'menu');
                feather.replace();
            }
        }
    });
    
    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            mobileMenu.classList.add('hidden');
            if (menuIcon) {
                menuIcon.setAttribute('data-feather', 'menu');
                feather.replace();
            }
        }
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;
    
    function toggleBackToTop() {
        const scrolled = window.pageYOffset;
        const coords = document.documentElement.clientHeight;
        
        if (scrolled > coords) {
            backToTopButton.classList.add('visible');
            backToTopButton.classList.remove('opacity-0', 'invisible');
        } else {
            backToTopButton.classList.remove('visible');
            backToTopButton.classList.add('opacity-0', 'invisible');
        }
    }
    
    // Show/hide back to top button on scroll
    window.addEventListener('scroll', throttle(toggleBackToTop, 100));
    
    // Smooth scroll to top
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Electric Effects and Animations
function initElectricEffects() {
    // Add electric glow to CTA buttons on hover
    const ctaButtons = document.querySelectorAll('.bg-electric-blue, .border-electric-blue');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('animate-pulse-glow');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('animate-pulse-glow');
        });
    });
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.min-h-screen');
    if (heroSection) {
        window.addEventListener('scroll', throttle(function() {
            const scrolled = window.pageYOffset;
            const parallax = heroSection.querySelector('.absolute.inset-0');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        }, 16));
    }
    
    // Add floating animation to electric orbs
    createFloatingOrbs();
}

// Create floating electric orbs
function createFloatingOrbs() {
    const orbContainer = document.body;
    const orbCount = 3;
    
    for (let i = 0; i < orbCount; i++) {
        const orb = document.createElement('div');
        orb.className = `fixed w-2 h-2 bg-electric-blue rounded-full opacity-30 pointer-events-none z-10`;
        orb.style.left = Math.random() * 100 + '%';
        orb.style.top = Math.random() * 100 + '%';
        orb.style.animation = `float ${6 + Math.random() * 4}s ease-in-out infinite`;
        orb.style.animationDelay = Math.random() * 2 + 's';
        
        orbContainer.appendChild(orb);
        
        // Remove orb after animation completes multiple cycles
        setTimeout(() => {
            if (orb.parentNode) {
                orb.parentNode.removeChild(orb);
            }
        }, 30000);
    }
}

// Form Enhancements
function initFormEnhancements() {
    // Add floating labels effect
    const formInputs = document.querySelectorAll('input, textarea, select');
    
    formInputs.forEach(input => {
        // Add focus/blur effects
        input.addEventListener('focus', function() {
            this.parentElement?.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement?.classList.remove('focused');
        });
        
        // Add validation styling
        input.addEventListener('invalid', function() {
            this.classList.add('border-red-500');
            this.classList.remove('border-white/20');
        });
        
        input.addEventListener('input', function() {
            if (this.validity.valid) {
                this.classList.remove('border-red-500');
                this.classList.add('border-white/20');
            }
        });
    });
    
    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.startsWith('90')) {
                value = value.substring(2);
            }
            if (value.length > 0) {
                value = '+90 ' + value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6, 8) + ' ' + value.substring(8, 10);
            }
            this.value = value.trim();
        });
    });
}

// Performance Optimizations
function initPerformanceOptimizations() {
    // Intersection Observer for animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements that need animation
        const animatedElements = document.querySelectorAll('[data-aos]');
        animatedElements.forEach(el => observer.observe(el));
    }
    
    // Lazy load images
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    } else {
        // Fallback for browsers that don't support loading="lazy"
        loadLazyImages();
    }
    
    // Preload critical resources
    preloadCriticalResources();
}

// Lazy loading fallback
function loadLazyImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Preload critical resources
function preloadCriticalResources() {
    const criticalResources = [
        '/static/img/placeholder-van-hero.svg',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
    ];
    
    criticalResources.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = url.includes('.css') ? 'style' : 'image';
        link.href = url;
        document.head.appendChild(link);
    });
}

// Utility Functions
function throttle(func, wait) {
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

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Electric pulse effect for buttons
function addElectricPulse(element) {
    element.style.animation = 'pulse-glow 1s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 1000);
}

// Toast notification system
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-20 right-4 z-50 glass-panel px-6 py-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300 ${
        type === 'error' ? 'border-l-4 border-red-500 bg-red-500/10' : 'border-l-4 border-electric-blue bg-electric-blue/10'
    }`;
    
    toast.innerHTML = `
        <div class="flex items-center space-x-3">
            <i data-feather="${type === 'error' ? 'alert-circle' : 'check-circle'}" class="w-5 h-5 ${type === 'error' ? 'text-red-500' : 'text-electric-blue'}"></i>
            <p class="text-sm font-medium text-white">${message}</p>
            <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-white">
                <i data-feather="x" class="w-4 h-4"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(toast);
    feather.replace();
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add loading states to forms
document.addEventListener('submit', function(e) {
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <div class="spinner w-5 h-5 mr-2"></div>
            Gönderiliyor...
        `;
    }
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', debounce(function() {
    // Refresh AOS on resize
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
    
    // Update mobile menu state
    if (window.innerWidth >= 768) {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
        }
    }
}, 250));

// Keyboard navigation enhancements
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    }
    
    // Space or Enter activates buttons
    if ((e.key === ' ' || e.key === 'Enter') && e.target.matches('button, .btn, [role="button"]')) {
        e.preventDefault();
        e.target.click();
    }
});

// Console branding
console.log('%c⚡ PSL Mobil Enerji ⚡', 'color: #FFD700; font-size: 20px; font-weight: bold;');
console.log('%cSahada Kesintisiz Güç', 'color: #FFA500; font-size: 14px;');
console.log('%c🚐 Araç Üstü Mobil Jeneratör Hizmetleri', 'color: #ffffff; font-size: 12px;');
