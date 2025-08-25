// PSL Mobil Enerji - Main JavaScript
// Premium dark theme with electric effects

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initBackToTop();
    initElectricEffects();
    initFormEnhancements();
    initPerformanceOptimizations();
    initGSAPAnimations();
    
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

// GSAP Advanced Electric Animations
function initGSAPAnimations() {
    // Register GSAP plugins
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger, TextPlugin);
        
        // Electric Loading Animation
        createElectricLoadingAnimation();
        
        // Hero Electric Text Animation
        animateHeroText();
        
        // Electric Border Animations
        animateElectricBorders();
        
        // Floating Electric Orbs
        createFloatingOrbs();
        
        // Electric Card Reveals
        animateCardReveals();
        
        // Electric Counter Animations
        animateCounters();
        
        // Electric Button Hover Effects
        enhanceButtonHovers();
        
        // Electric Page Transitions
        setupPageTransitions();
        
        // Electric Particle System
        initializeElectricParticleSystem();
    }
}

// Electric Loading Animation - Faster Preloading
function createElectricLoadingAnimation() {
    // Create modern loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'electric-loader';
    loadingOverlay.innerHTML = `
        <div class="modern-loader-content">
            <div class="loader-brand">
                <div class="brand-icon">
                    <div class="rotating-gear">
                        <svg width="60" height="60" viewBox="0 0 60 60">
                            <circle cx="30" cy="30" r="25" fill="none" stroke="#FFD700" stroke-width="2" stroke-dasharray="10 5"/>
                            <circle cx="30" cy="30" r="15" fill="none" stroke="#FFA500" stroke-width="2"/>
                            <circle cx="30" cy="30" r="8" fill="#FFD700"/>
                        </svg>
                    </div>
                </div>
                <div class="brand-text">
                    <div class="main-title">PSL MOBİL ENERJİ</div>
                    <div class="sub-title">Sahada Kesintisiz Güç</div>
                </div>
            </div>
            
            <div class="loading-indicator">
                <div class="pulse-dots">
                    <div class="dot dot-1"></div>
                    <div class="dot dot-2"></div>
                    <div class="dot dot-3"></div>
                </div>
                <div class="loading-text">Yükleniyor...</div>
            </div>
        </div>
    `;
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #000000 0%, #0A0A0A 50%, #1A1A1A 100%);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFD700;
        font-family: 'Inter', sans-serif;
    `;
    
    document.body.appendChild(loadingOverlay);
    
    // Modern GSAP animation timeline
    const tl = gsap.timeline();
    
    // Animate loading sequence
    tl.set('.modern-loader-content', { opacity: 0, scale: 0.8 })
      .to('.modern-loader-content', { 
        opacity: 1, 
        scale: 1, 
        duration: 0.6,
        ease: "back.out(1.7)"
      })
      .from('.brand-icon', {
        rotation: -180,
        scale: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.3)"
      }, 0.2)
      .from('.main-title', {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
      }, 0.4)
      .from('.sub-title', {
        y: 20,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out"
      }, 0.6)
      .from('.loading-indicator', {
        y: 40,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out"
      }, 0.8)
      .to('#electric-loader', { 
        opacity: 0, 
        duration: 0.5, 
        delay: 1.5,
        ease: "power2.inOut",
        onComplete: () => {
          document.body.removeChild(loadingOverlay);
        }
      });
}

// Hero Electric Text Animation
function animateHeroText() {
    const heroTitle = document.querySelector('h1');
    const powerWord = document.querySelector('.electric-power-word');
    
    if (heroTitle) {
        // Animate the main title first
        gsap.fromTo(heroTitle, 
            { 
                opacity: 0, 
                y: 30,
                scale: 0.95
            },
            { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                duration: 1, 
                ease: "power3.out",
                delay: 1.2
            }
        );
        
        // Special electric animation for "Güç" word
        if (powerWord) {
            // Split "Güç" into characters for individual animation
            const powerChars = powerWord.innerText.split('');
            powerWord.innerHTML = powerChars.map(char => 
                `<span class="power-char">${char}</span>`
            ).join('');
            
            // Enhanced electric reveal for "Güç"
            gsap.fromTo('.power-char', 
                { 
                    opacity: 0, 
                    y: 80, 
                    rotationY: -180,
                    scale: 0.5,
                    transformOrigin: '50% 50%'
                },
                { 
                    opacity: 1, 
                    y: 0, 
                    rotationY: 0,
                    scale: 1,
                    duration: 1.2, 
                    stagger: 0.15,
                    ease: "elastic.out(1, 0.5)",
                    delay: 2
                }
            );
            
            // Continuous electric pulse for "Güç"
            gsap.to('.power-char', {
                textShadow: '0 0 15px #FFD700, 0 0 30px #FFD700, 0 0 45px #FFD700, 0 0 60px #FFA500',
                scale: 1.1,
                duration: 0.8,
                stagger: 0.1,
                repeat: -1,
                yoyo: true,
                delay: 3.5,
                ease: "sine.inOut"
            });
            
            // Electric lightning strikes on "Güç"
            gsap.to(powerWord, {
                filter: 'brightness(1.5) saturate(1.5)',
                duration: 0.1,
                repeat: -1,
                repeatDelay: 3,
                delay: 4,
                onRepeat: function() {
                    // Add random electric spark
                    createElectricSpark(powerWord);
                }
            });
        }
    }
}

// Create Electric Spark for Power Word
function createElectricSpark(element) {
    const rect = element.getBoundingClientRect();
    const spark = document.createElement('div');
    
    spark.style.cssText = `
        position: fixed;
        width: 3px;
        height: 20px;
        background: linear-gradient(180deg, #FFD700, #FFA500, transparent);
        pointer-events: none;
        z-index: 1000;
        left: ${rect.left + Math.random() * rect.width}px;
        top: ${rect.top - 10}px;
        transform-origin: bottom center;
    `;
    
    document.body.appendChild(spark);
    
    gsap.fromTo(spark, 
        { 
            scaleY: 0, 
            opacity: 1, 
            rotation: Math.random() * 30 - 15 
        },
        { 
            scaleY: 1, 
            opacity: 0,
            y: -30,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => document.body.removeChild(spark)
        }
    );
}

// Electric Border Animations
function animateElectricBorders() {
    const cards = document.querySelectorAll('.electric-card');
    
    cards.forEach((card, index) => {
        // Create electric border elements
        const borderTop = document.createElement('div');
        const borderRight = document.createElement('div');
        const borderBottom = document.createElement('div');
        const borderLeft = document.createElement('div');
        
        [borderTop, borderRight, borderBottom, borderLeft].forEach(border => {
            border.className = 'electric-border-line';
            border.style.cssText = `
                position: absolute;
                background: linear-gradient(90deg, transparent, #FFD700, transparent);
                z-index: 1;
            `;
            card.appendChild(border);
        });
        
        // Position borders
        borderTop.style.cssText += 'top: 0; left: 0; width: 100%; height: 2px;';
        borderRight.style.cssText += 'top: 0; right: 0; width: 2px; height: 100%; background: linear-gradient(0deg, transparent, #FFD700, transparent);';
        borderBottom.style.cssText += 'bottom: 0; left: 0; width: 100%; height: 2px;';
        borderLeft.style.cssText += 'top: 0; left: 0; width: 2px; height: 100%; background: linear-gradient(0deg, transparent, #FFD700, transparent);';
        
        // Animate on scroll
        ScrollTrigger.create({
            trigger: card,
            start: "top 80%",
            onEnter: () => {
                const tl = gsap.timeline();
                tl.fromTo([borderTop, borderRight, borderBottom, borderLeft],
                    { opacity: 0, scale: 0 },
                    { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1 }
                );
            }
        });
    });
}

// Floating Electric Orbs
function createFloatingOrbs() {
    const orbContainer = document.createElement('div');
    orbContainer.className = 'floating-orbs';
    orbContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: -1;
    `;
    
    // Create multiple orbs
    for (let i = 0; i < 6; i++) {
        const orb = document.createElement('div');
        orb.className = 'electric-orb';
        orb.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: ${Math.random() > 0.5 ? '#FFD700' : '#FFA500'};
            border-radius: 50%;
            box-shadow: 0 0 10px currentColor;
        `;
        
        orbContainer.appendChild(orb);
        
        // Animate orb movement
        gsap.set(orb, {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
        });
        
        gsap.to(orb, {
            x: `+=${Math.random() * 200 - 100}`,
            y: `+=${Math.random() * 200 - 100}`,
            duration: Math.random() * 3 + 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        // Pulse effect
        gsap.to(orb, {
            opacity: Math.random() * 0.5 + 0.3,
            duration: Math.random() * 2 + 1,
            repeat: -1,
            yoyo: true
        });
    }
    
    document.body.appendChild(orbContainer);
}

// Electric Card Reveals
function animateCardReveals() {
    const cards = document.querySelectorAll('.glass-panel');
    
    cards.forEach((card, index) => {
        ScrollTrigger.create({
            trigger: card,
            start: "top 85%",
            onEnter: () => {
                gsap.fromTo(card,
                    { 
                        opacity: 0, 
                        y: 60, 
                        rotationY: -15,
                        transformOrigin: "center center"
                    },
                    { 
                        opacity: 1, 
                        y: 0, 
                        rotationY: 0,
                        duration: 0.8, 
                        delay: index * 0.1,
                        ease: "power3.out"
                    }
                );
                
                // Electric spark effect
                const spark = document.createElement('div');
                spark.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 2px;
                    height: 2px;
                    background: #FFD700;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                `;
                card.appendChild(spark);
                
                gsap.to(spark, {
                    scale: 20,
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => card.removeChild(spark)
                });
            }
        });
    });
}

// Electric Counter Animations
function animateCounters() {
    const counters = document.querySelectorAll('[class*="text-4xl"]');
    
    counters.forEach(counter => {
        const text = counter.innerText;
        const numbers = text.match(/\d+/);
        
        if (numbers) {
            const targetNumber = parseInt(numbers[0]);
            const unit = text.replace(numbers[0], '');
            
            ScrollTrigger.create({
                trigger: counter,
                start: "top 90%",
                onEnter: () => {
                    gsap.fromTo(counter, 
                        { innerText: 0 },
                        {
                            innerText: targetNumber,
                            duration: 2,
                            snap: { innerText: 1 },
                            onUpdate: function() {
                                counter.innerText = Math.ceil(this.targets()[0].innerText) + unit;
                            }
                        }
                    );
                    
                    // Electric pulse on complete
                    gsap.to(counter, {
                        textShadow: '0 0 20px #FFD700',
                        duration: 0.3,
                        repeat: 3,
                        yoyo: true,
                        delay: 2
                    });
                }
            });
        }
    });
}

// Enhanced Button Hover Effects
function enhanceButtonHovers() {
    const buttons = document.querySelectorAll('a[class*="bg-electric"], button[class*="bg-electric"]');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.05,
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
                duration: 0.3
            });
            
            // Electric spark trail
            createSparkTrail(button);
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                boxShadow: '0 0 0px rgba(255, 215, 0, 0)',
                duration: 0.3
            });
        });
    });
}

// Create Spark Trail Effect
function createSparkTrail(element) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 5; i++) {
        const spark = document.createElement('div');
        spark.style.cssText = `
            position: fixed;
            width: 2px;
            height: 2px;
            background: #FFD700;
            pointer-events: none;
            z-index: 1000;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
        `;
        
        document.body.appendChild(spark);
        
        gsap.to(spark, {
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            opacity: 0,
            scale: 0,
            duration: 0.8,
            onComplete: () => document.body.removeChild(spark)
        });
    }
}

// Page Transition Effects
function setupPageTransitions() {
    const links = document.querySelectorAll('a[href^="/"], a[href^="./"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            if (!e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                
                // Electric page transition
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: -100%;
                    width: 100vw;
                    height: 100vh;
                    background: linear-gradient(45deg, #FFD700, #FFA500);
                    z-index: 9999;
                `;
                
                document.body.appendChild(overlay);
                
                gsap.to(overlay, {
                    left: '0%',
                    duration: 0.5,
                    ease: "power2.inOut",
                    onComplete: () => {
                        window.location.href = link.href;
                    }
                });
            }
        });
    });
}

// ================================
// MINIMALIST ELECTRIC PARTICLE SYSTEM
// ================================

let particleSystem = {
    container: null,
    particles: [],
    isActive: true,
    intensity: 2, // 0: off, 1: low, 2: medium, 3: high, 4: ultra
    maxParticles: {
        0: 0,
        1: 15,
        2: 25,
        3: 40,
        4: 60
    }
};

function initializeElectricParticleSystem() {
    console.log('%c⚡ Electric Particle System Initialized ⚡', 'color: #FFD700; font-size: 12px; font-weight: bold;');
    
    // Create particle containers for different sections
    createParticleContainers();
    
    // Create control UI
    createParticleControls();
    
    // Start particle generation
    generateParticles();
    
    // Setup particle management
    manageParticleLifecycle();
}

function createParticleContainers() {
    // Add particles to hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        const heroContainer = document.createElement('div');
        heroContainer.className = 'electric-particle-container';
        heroContainer.id = 'hero-particles';
        heroSection.appendChild(heroContainer);
    }
    
    // Add particles to main sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        if (index > 0) { // Skip hero section
            const container = document.createElement('div');
            container.className = 'electric-particle-container';
            container.id = `section-particles-${index}`;
            section.style.position = 'relative';
            section.appendChild(container);
        }
    });
}

function createParticleControls() {
    // Keep particles at medium level, no UI controls needed
    particleSystem.intensity = 2; // Medium level
}

function toggleParticlePanel() {
    const panel = document.querySelector('.particle-control-panel');
    panel.classList.toggle('active');
}

function generateParticles() {
    if (!particleSystem.isActive) return;
    
    const containers = document.querySelectorAll('.electric-particle-container');
    const particleCount = particleSystem.maxParticles[particleSystem.intensity];
    
    containers.forEach(container => {
        // Clear existing particles
        container.innerHTML = '';
        
        if (particleCount === 0) return;
        
        // Generate new particles
        for (let i = 0; i < particleCount; i++) {
            createSingleParticle(container, i);
        }
    });
}

function createSingleParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'electric-particle';
    
    // Random variant
    const variant = Math.floor(Math.random() * 3) + 1;
    particle.classList.add(`particle-variant-${variant}`);
    
    // Random position and properties
    const startX = Math.random() * 100;
    const drift = (Math.random() - 0.5) * 200;
    const angle = Math.random() * 360;
    const delay = Math.random() * 3;
    
    // Set CSS custom properties
    particle.style.setProperty('--particle-index', index);
    particle.style.setProperty('--particle-drift', `${drift}px`);
    particle.style.setProperty('--particle-angle', `${angle}deg`);
    particle.style.setProperty('--particle-opacity', getOpacityForIntensity());
    
    // Position particle
    particle.style.left = `${startX}%`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = getSpeedForIntensity();
    
    container.appendChild(particle);
    
    // Create occasional connection lines
    if (Math.random() < 0.1) {
        createConnectionLine(container, startX);
    }
}

function createConnectionLine(container, x) {
    const line = document.createElement('div');
    line.className = 'electric-connection';
    line.style.left = `${x}%`;
    line.style.height = `${Math.random() * 150 + 50}px`;
    line.style.top = `${Math.random() * 50}%`;
    line.style.animationDelay = `${Math.random() * 2}s`;
    container.appendChild(line);
}

function getOpacityForIntensity() {
    const opacities = {
        0: 0,
        1: 0.3,
        2: 0.5,
        3: 0.7,
        4: 0.8
    };
    return opacities[particleSystem.intensity];
}

function getSpeedForIntensity() {
    const speeds = {
        0: '0s',
        1: '12s',
        2: '10s',
        3: '8s',
        4: '6s'
    };
    return speeds[particleSystem.intensity];
}

function updateParticleIntensity() {
    // Update CSS custom properties on containers
    const containers = document.querySelectorAll('.electric-particle-container');
    containers.forEach(container => {
        container.className = `electric-particle-container particles-${getIntensityName()}`;
    });
    
    // Regenerate particles with new intensity
    generateParticles();
}

function getIntensityName() {
    const names = {
        0: 'off',
        1: 'low',
        2: 'medium',
        3: 'high',
        4: 'ultra'
    };
    return names[particleSystem.intensity];
}

function resetParticles() {
    generateParticles();
}

function manageParticleLifecycle() {
    // Regenerate particles periodically to keep them fresh
    setInterval(() => {
        if (particleSystem.isActive && particleSystem.intensity > 0) {
            // Randomly regenerate some particles for variation
            const containers = document.querySelectorAll('.electric-particle-container');
            containers.forEach(container => {
                const particles = container.querySelectorAll('.electric-particle');
                particles.forEach(particle => {
                    if (Math.random() < 0.1) { // 10% chance to regenerate
                        // Remove old particle
                        particle.remove();
                        // Create new one
                        createSingleParticle(container, Math.floor(Math.random() * 100));
                    }
                });
            });
        }
    }, 5000); // Every 5 seconds
}

// Global functions for controls
window.resetParticles = resetParticles;
window.toggleParticlePanel = toggleParticlePanel;

// Console branding
console.log('%c⚡ PSL Mobil Enerji ⚡', 'color: #FFD700; font-size: 20px; font-weight: bold;');
console.log('%cSahada Kesintisiz Güç', 'color: #FFA500; font-size: 14px;');
console.log('%c🚐 Araç Üstü Mobil Jeneratör Hizmetleri', 'color: #ffffff; font-size: 12px;');
console.log('%c⚡ GSAP Electric Animations Loaded ⚡', 'color: #FFD700; font-size: 14px; font-weight: bold;');
