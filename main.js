/**
 * JFV Motomecánica - Main JavaScript File
 * This file contains all the scripts for enhancing the user experience on the website
 * Author: JFV Motomecánica
 * Last Updated: April 16, 2025
 */

// Execute code when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initFormValidation();
    initServiceCardsEffects();
    initLazyLoading();
    initScrollAnimations();
    createScrollTopButton();
    initMobileMenu();
});

/**
 * Navigation functionality
 * Handles smooth scrolling for anchor links
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Apply smooth scroll only for links to sections on the same page
            if(targetId && targetId.startsWith('#')) {
                e.preventDefault();
                if(targetId === '#') return;
            
                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                    // Scroll smoothly with 100px offset from the top
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Form validation
 * Validates contact form fields before submission
 */
function initFormValidation() {
    const contactForm = document.querySelector('form#contact-form');
    if(!contactForm) return; // Exit if no form exists on the page
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre');
        const email = document.getElementById('email');
        const mensaje = document.getElementById('mensaje');
        const asunto = document.getElementById('asunto');
        let isValid = true;
        
        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        
        // Validate fields
        if(!nombre || !nombre.value.trim()) {
            showError(nombre, 'El nombre es obligatorio');
            isValid = false;
        }
        
        if(!email || !email.value.trim()) {
            showError(email, 'El correo electrónico es obligatorio');
            isValid = false;
        } else if(!isValidEmail(email.value)) {
            showError(email, 'Por favor ingresa un correo electrónico válido');
            isValid = false;
        }
        
        if(!mensaje || !mensaje.value.trim()) {
            showError(mensaje, 'El mensaje es obligatorio');
            isValid = false;
        }
        
        if(asunto && asunto.value === '') {
            showError(asunto, 'Por favor selecciona un asunto');
            isValid = false;
        }
        
        // If form is valid, show success message
        if(isValid) {
            showSuccessMessage(contactForm);
        }
    });
    
    // Helper function to display error messages
    function showError(input, message) {
        if(!input) return;
        
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error-message');
        errorDiv.textContent = message;
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
        input.classList.add('input-error');
        
        // Remove error when user starts typing
        input.addEventListener('input', function() {
            this.classList.remove('input-error');
            const nextSibling = this.nextSibling;
            if(nextSibling && nextSibling.classList && nextSibling.classList.contains('error-message')) {
                nextSibling.remove();
            }
        }, {once: true});
    }
    
    // Helper function to display success message
    function showSuccessMessage(form) {
        // Check if we're using Bootstrap validation or custom validation
        const formSuccess = document.getElementById('form-success');
        
        if(formSuccess) {
            // For Bootstrap form
            formSuccess.classList.remove('d-none');
            form.reset();
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formSuccess.classList.add('d-none');
            }, 5000);
        } else {
            // For custom form
            const successMessage = document.createElement('div');
            successMessage.classList.add('success-message');
            successMessage.textContent = '¡Mensaje enviado con éxito! Te contactaremos pronto.';
            form.appendChild(successMessage);
            
            // Reset form
            form.reset();
            
            // Remove message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        }
    }
    
    // Helper function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

/**
 * Service cards effects
 * Adds hover effects to service cards
 */
function initServiceCardsEffects() {
    const serviceCards = document.querySelectorAll('.servicio, .service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover-effect');
        });
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover-effect');
        });
    });
}

/**
 * Lazy loading for images
 * Loads images only when they become visible in the viewport
 */
function initLazyLoading() {
    if('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        if(lazyImages.length === 0) return;
    
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('fade-in');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

/**
 * Scroll animations
 * Activates animations when elements appear in the viewport
 */
function initScrollAnimations() {
    if('IntersectionObserver' in window) {
        const elementsToAnimate = document.querySelectorAll('.slide-up, .fade-in, .bounce-in, .rotate-in');
        if(elementsToAnimate.length === 0) return;
        
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2 // Activate when at least 20% of element is visible
        });
        
        elementsToAnimate.forEach(element => animationObserver.observe(element));
    }
}

/**
 * Back to top button
 * Creates a button that appears when scrolling and allows returning to the top of the page
 */
function createScrollTopButton() {
    // Check if button already exists
    if(document.querySelector('.scroll-top-btn')) return;
    
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.classList.add('scroll-top-btn');
    button.setAttribute('aria-label', 'Volver arriba');
    document.body.appendChild(button);
    
    // Show/hide the button based on scroll position
    window.addEventListener('scroll', () => {
        if(window.scrollY > 300) {
            button.classList.add('show');
        } else {
            button.classList.remove('show');
        }
    });
    
    // Scroll smoothly to the top when clicked
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Mobile menu functionality
 * Handles the hamburger menu for mobile devices
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if(!menuToggle || !mainNav) return;
    
    // Toggle menu on hamburger button click
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('show');
    });
    
    // Close menu when clicking on a menu item (on mobile)
    const navLinks = document.querySelectorAll('#main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if(window.innerWidth <= 768) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('show');
            }
        });
    });
    
    // Adjust menu when window is resized
    window.addEventListener('resize', function() {
        if(window.innerWidth > 768) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('show');
        }
    });
}