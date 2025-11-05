// ===== GLOBAL VARIABLES =====
let currentSection = 'home';
let isLoading = true;
let particleSystem = null;
let typingInterval = null;
let cursorTrail = [];

// ===== DOM ELEMENTS =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const themeToggle = document.getElementById('theme-toggle');
const loadingScreen = document.getElementById('loading-screen');
const cursor = document.querySelector('.cursor');
const cursorTrailElement = document.querySelector('.cursor-trail');
const particleCanvas = document.getElementById('particle-canvas');

// ===== LOADING SCREEN =====
class LoadingManager {
    constructor() {
        this.progress = 0;
        this.status = [
            'Loading components...',
            'Initializing animations...',
            'Preparing content...',
            'Almost ready...',
            'Welcome!'
        ];
        this.currentStatusIndex = 0;
        this.init();
    }

    init() {
        this.updateProgress();
        this.updateStatus();
    }

    updateProgress() {
        const progressBar = document.querySelector('.progress-bar');
        const interval = setInterval(() => {
            this.progress += Math.random() * 15;
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(interval);
                setTimeout(() => this.hideLoading(), 500);
            }
            if (progressBar) {
                progressBar.style.width = `${this.progress}%`;
            }
        }, 200);
    }

    updateStatus() {
        const statusElement = document.querySelector('.loading-status');
        const statusInterval = setInterval(() => {
            if (this.currentStatusIndex < this.status.length - 1) {
                this.currentStatusIndex++;
                if (statusElement) {
                    statusElement.textContent = this.status[this.currentStatusIndex];
                }
            } else {
                clearInterval(statusInterval);
            }
        }, 600);
    }

    hideLoading() {
        document.body.style.overflow = 'auto';
        loadingScreen.classList.add('hidden');
        isLoading = false;
        
        // Initialize other components after loading
        setTimeout(() => {
            new TypingAnimation();
            new CounterAnimation();
            new SkillBarsAnimation();
        }, 300);
    }
}

// ===== CUSTOM CURSOR =====
class CustomCursor {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.trailX = 0;
        this.trailY = 0;
        
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Add hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .nav-link, .btn, .social-link, .project-link');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorTrailElement.classList.add('hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorTrailElement.classList.remove('hover');
            });
        });

        this.animate();
    }

    animate() {
        // Smooth cursor movement
        this.cursorX += (this.mouseX - this.cursorX) * 0.1;
        this.cursorY += (this.mouseY - this.cursorY) * 0.1;
        
        this.trailX += (this.mouseX - this.trailX) * 0.05;
        this.trailY += (this.mouseY - this.trailY) * 0.05;

        if (cursor) {
            cursor.style.left = `${this.cursorX}px`;
            cursor.style.top = `${this.cursorY}px`;
        }

        if (cursorTrailElement) {
            cursorTrailElement.style.left = `${this.trailX}px`;
            cursorTrailElement.style.top = `${this.trailY}px`;
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.connections = [];
        
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        document.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
    }

    createParticles() {
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: this.getRandomColor()
            });
        }
    }

    getRandomColor() {
        const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Subtle mouse interaction (much less aggressive)
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 50) {
                const force = (50 - distance) / 50;
                particle.x -= dx * force * 0.002;
                particle.y -= dy * force * 0.002;
            }
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
            
            // Draw connections
            for (let j = index + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = particle.color;
                    this.ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                    this.ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== TYPING ANIMATION =====
class TypingAnimation {
    constructor() {
        this.element = document.querySelector('.typing-text');
        this.words = this.element?.dataset.words?.split(',') || [];
        this.currentWordIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;
        
        if (this.element && this.words.length > 0) {
            this.init();
        }
    }

    init() {
        this.type();
    }

    type() {
        const currentWord = this.words[this.currentWordIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentWord.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            
            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
                setTimeout(() => this.type(), 500);
                return;
            }
        } else {
            this.element.textContent = currentWord.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            
            if (this.currentCharIndex === currentWord.length) {
                this.isDeleting = true;
                setTimeout(() => this.type(), this.pauseTime);
                return;
            }
        }
        
        setTimeout(() => this.type(), this.isDeleting ? this.deleteSpeed : this.typeSpeed);
    }
}

// ===== COUNTER ANIMATION =====
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }
}

// ===== SKILL BARS ANIMATION =====
class SkillBarsAnimation {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkillBar(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        this.skillBars.forEach(bar => observer.observe(bar));
    }

    animateSkillBar(element) {
        const width = element.dataset.width;
        setTimeout(() => {
            element.style.width = `${width}%`;
        }, Math.random() * 500);
    }
}

// ===== NAVIGATION MANAGER =====
class NavigationManager {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.setupScrollSpy();
        this.setupSmoothScrolling();
        this.setupMobileNav();
        this.setupScrollEffect();
    }

    setupScrollSpy() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    this.updateActiveNav(id);
                    currentSection = id;
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px'
        });

        this.sections.forEach(section => observer.observe(section));
    }

    updateActiveNav(activeId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Close mobile nav if open
                if (navLinks.classList.contains('active')) {
                    this.toggleMobileNav();
                }
            });
        });
    }

    setupMobileNav() {
        navToggle.addEventListener('click', () => this.toggleMobileNav());
        
        // Close nav when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
                this.toggleMobileNav();
            }
        });
    }

    toggleMobileNav() {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    }

    setupScrollEffect() {
        let lastScrollY = 0;
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            // Add scrolled class for navbar styling
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll
            if (scrollY > lastScrollY && scrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = scrollY;
        });
    }
}

// ===== THEME MANAGER =====
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupThemeToggle();
    }

    applyTheme() {
        document.body.className = `${this.currentTheme}-theme`;
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    setupThemeToggle() {
        themeToggle.addEventListener('click', () => {
            this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            this.applyTheme();
            localStorage.setItem('theme', this.currentTheme);
            
            // Add transition effect
            document.body.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        });
    }
}

// ===== CONTACT FORM MANAGER =====
class ContactFormManager {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.setupFormValidation();
            this.setupFormSubmission();
            this.setupInputEffects();
        }
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearErrors(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        switch (field.type) {
            case 'email':
                isValid = this.isValidEmail(value);
                message = isValid ? '' : 'Please enter a valid email address';
                break;
            case 'text':
            case 'textarea':
                isValid = value.length >= 2;
                message = isValid ? '' : 'This field must be at least 2 characters long';
                break;
        }

        this.setFieldState(field, isValid, message);
        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setFieldState(field, isValid, message) {
        const formGroup = field.closest('.form-group');
        
        // Remove existing error classes
        formGroup.classList.remove('error', 'success');
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        if (!isValid && message) {
            formGroup.classList.add('error');
            const errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            errorElement.style.color = 'var(--error-color)';
            errorElement.style.fontSize = '0.8rem';
            errorElement.style.marginTop = '0.5rem';
            errorElement.style.display = 'block';
            formGroup.appendChild(errorElement);
        } else if (isValid && field.value.trim() !== '') {
            formGroup.classList.add('success');
        }
    }

    clearErrors(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = this.form.querySelectorAll('input, textarea');
            let allValid = true;
            
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    allValid = false;
                }
            });

            if (allValid) {
                this.submitForm();
            }
        });
    }

    async submitForm() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.form.reset();
            
        } catch (error) {
            // Show error message
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            color: 'white',
            backgroundColor: type === 'success' ? 'var(--success-color)' : 'var(--error-color)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        });

        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    setupInputEffects() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Set placeholder attribute for label animation
            input.setAttribute('placeholder', ' ');
            
            // Add focus effects
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Parallax effect for hero section
        this.setupParallax();
        
        // Reveal animations for sections
        this.setupRevealAnimations();
        
        // Progress bar for reading
        this.setupProgressBar();
    }

    setupParallax() {
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (hero && scrolled < hero.offsetHeight) {
                heroContent.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    setupRevealAnimations() {
        const animatedElements = document.querySelectorAll(
            '.timeline-item, .project-card, .skill-category, .contact-item'
        );
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(50px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }

    setupProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        Object.assign(progressBar.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '0%',
            height: '3px',
            background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
            zIndex: '10000',
            transition: 'width 0.1s ease'
        });
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = `${scrollPercentage}%`;
        });
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeAnimations();
        this.setupIntersectionObserver();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }

    optimizeAnimations() {
        // Pause animations when not in viewport
        const animatedElements = document.querySelectorAll('[class*="animate"]');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                } else {
                    entry.target.style.animationPlayState = 'paused';
                }
            });
        });

        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    }

    setupIntersectionObserver() {
        // Optimize scroll-based animations
        let ticking = false;
        
        const optimizedScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Your scroll-based animations here
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', optimizedScroll, { passive: true });
    }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupAriaLabels();
        this.setupReducedMotion();
    }

    setupKeyboardNavigation() {
        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
            
            if (e.key === 'Escape') {
                // Close mobile nav if open
                if (navLinks.classList.contains('active')) {
                    document.querySelector('.nav-toggle').click();
                }
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupFocusManagement() {
        // Trap focus in mobile navigation
        const focusableElements = navLinks.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        navLinks.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    setupAriaLabels() {
        // Add dynamic aria labels
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const section = link.getAttribute('href').substring(1);
            link.setAttribute('aria-label', `Navigate to ${section} section`);
        });
    }

    setupReducedMotion() {
        // Respect prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.body.classList.add('reduce-motion');
        }

        prefersReducedMotion.addEventListener('change', () => {
            if (prefersReducedMotion.matches) {
                document.body.classList.add('reduce-motion');
            } else {
                document.body.classList.remove('reduce-motion');
            }
        });
    }
}

// ===== EASTER EGGS =====
class EasterEggs {
    constructor() {
        this.konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        this.userInput = [];
        this.init();
    }

    init() {
        this.setupKonamiCode();
        this.setupSecretCommands();
    }

    setupKonamiCode() {
        document.addEventListener('keydown', (e) => {
            this.userInput.push(e.code);
            
            if (this.userInput.length > this.konamiCode.length) {
                this.userInput.shift();
            }
            
            if (this.userInput.join('') === this.konamiCode.join('')) {
                this.activateSecretMode();
                this.userInput = [];
            }
        });
    }

    setupSecretCommands() {
        // Console commands
        window.showMeTheCode = () => {
            console.log(`
  _____ _   _                __        __    _  __      
 | ____| |_| |__   __ _ _ __  \ \      / /__ | |/ _| ___ 
 |  _| | __| '_ \ / _\` | '_ \  \ \ /\ / / _ \| | |_ / _ \
 | |___| |_| | | | (_| | | | |  \ V  V / (_) | |  _|  __/
 |_____|\__|_| |_|\__,_|_| |_|   \_/\_/ \___/|_|_|  \___|

         Thanks for checking out the source! 🚀
         
         Built with:
         🎨 Pure CSS3 with custom animations
         ⚡ Vanilla JavaScript (no frameworks!)
         🎯 Performance optimized
         ♿ Accessibility focused
         📱 Mobile-first responsive design
         
         Want to hire me? Let's talk! 💼
            `);
            return "🚀 Portfolio source info displayed above!";
        };
        
        window.changeTheme = (theme) => {
            if (['light', 'dark'].includes(theme)) {
                const themeManager = new ThemeManager();
                themeManager.currentTheme = theme;
                themeManager.applyTheme();
                localStorage.setItem('theme', theme);
            }
        };
    }

    activateSecretMode() {
        // Add rainbow effect to the page
        document.body.style.animation = 'rainbow 2s linear infinite';
        
        // Add rainbow keyframes if not exists
        if (!document.querySelector('#rainbow-style')) {
            const style = document.createElement('style');
            style.id = 'rainbow-style';
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Show secret message
        const message = document.createElement('div');
        message.innerHTML = '🎉 Secret mode activated! 🎉';
        Object.assign(message.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
            backgroundSize: '400% 400%',
            animation: 'rainbow 2s linear infinite',
            color: 'white',
            padding: '2rem',
            borderRadius: '1rem',
            fontSize: '2rem',
            fontWeight: 'bold',
            zIndex: '10000',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        });
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            document.body.style.animation = '';
            document.body.removeChild(message);
        }, 5000);
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen first
    new LoadingManager();
    
    // Initialize core components
    setTimeout(() => {
        // Custom cursor disabled per user preference
        // if (window.innerWidth > 768) {
        //     new CustomCursor();
        // }
        
        // Initialize particle system if canvas exists
        if (particleCanvas) {
            particleSystem = new ParticleSystem(particleCanvas);
        }
        
        // Initialize all managers
        new NavigationManager();
        new ThemeManager();
        new ContactFormManager();
        new ScrollAnimations();
        new PerformanceOptimizer();
        new AccessibilityManager();
        new EasterEggs();
        
        // Console welcome message
        console.log('%c🚀 Welcome to Ethan Wolfe\'s Portfolio!', 'color: #6366f1; font-size: 24px; font-weight: bold;');
        console.log('%cType showMeTheCode() to see build info!', 'color: #8b5cf6; font-size: 14px;');
        
    }, 500);
});

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LoadingManager,
        CustomCursor,
        ParticleSystem,
        TypingAnimation,
        NavigationManager,
        ThemeManager,
        ContactFormManager
    };
}