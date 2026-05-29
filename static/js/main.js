// PSL Mobil Enerji - Main JavaScript

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const backdrop = document.getElementById('mobile-menu-backdrop');

    if (!hamburger || !mobileMenu) return;

    function openMenu() {
        mobileMenu.classList.add('active');
        hamburger.classList.add('open');
        document.body.classList.add('mobile-menu-open');
    }

    function closeMenu() {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('open');
        document.body.classList.remove('mobile-menu-open');
    }

    hamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        mobileMenu.classList.contains('active') ? closeMenu() : openMenu();
    });

    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);

    mobileMenu.querySelectorAll('.mm-link, .mm-cta, .mm-wa-full').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth >= 1024) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
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

    window.addEventListener('scroll', throttle(toggleBackToTop, 100));
    backToTopButton.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Contact Panel Toggle
function initContactPanel() {
    const contactToggle = document.getElementById('contactToggle');
    const contactOptions = document.querySelector('.contact-options');
    if (!contactToggle || !contactOptions) return;

    contactToggle.addEventListener('click', function () {
        contactOptions.classList.toggle('open');
    });
}

// Form Enhancements
function initFormEnhancements() {
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('invalid', function () {
            this.classList.add('border-red-500');
            this.classList.remove('border-white/20');
        });
        input.addEventListener('input', function () {
            if (this.validity.valid) {
                this.classList.remove('border-red-500');
                this.classList.add('border-white/20');
            }
        });
    });

    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function () {
            let value = this.value.replace(/\D/g, '');
            if (value.startsWith('90')) value = value.substring(2);
            if (value.length > 0) {
                value = '+90 ' + value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6, 8) + ' ' + value.substring(8, 10);
            }
            this.value = value.trim();
        });
    });
}

// Utility Functions
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => { clearTimeout(timeout); func(...args); };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => { timeout = null; if (!immediate) func(...args); };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-20 right-4 z-50 glass-panel px-5 py-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300 ${
        type === 'error' ? 'border-l-4 border-red-500' : 'border-l-4 border-yellow-400'
    }`;
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <p class="text-sm font-medium text-white">${message}</p>
            <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-white ml-auto">
                <i data-feather="x" class="w-4 h-4"></i>
            </button>
        </div>
    `;
    document.body.appendChild(toast);
    if (typeof feather !== 'undefined') feather.replace();
    setTimeout(() => toast.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
    }, 5000);
}

// Smooth scrolling for anchor links
document.addEventListener('click', function (e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

// Form submit loading state
document.addEventListener('submit', function (e) {
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = `<span class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>Gönderiliyor...`;
    }
});

// Keyboard nav
document.addEventListener('keydown', function (e) {
    if ((e.key === ' ' || e.key === 'Enter') && e.target.matches('button, .btn, [role="button"]')) {
        e.preventDefault();
        e.target.click();
    }
});

// Initialize everything
document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initBackToTop();
    initContactPanel();
    initFormEnhancements();

    if (typeof feather !== 'undefined') {
        console.log('%c⚡ PSL Mobil Enerji ⚡', 'color: #FFD700; font-size: 16px; font-weight: bold;');
        feather.replace();
    }

    // Auto-hide flash messages
    setTimeout(() => {
        document.querySelectorAll('.flash-message').forEach(msg => {
            msg.style.animation = 'slide-out-right 0.5s ease-in forwards';
            setTimeout(() => msg.remove(), 500);
        });
    }, 5000);
});
