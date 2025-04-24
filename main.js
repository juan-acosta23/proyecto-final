/**
 * JFV Motomecánica - Archivo JavaScript Principal
 * Este archivo contiene todos los scripts para mejorar la experiencia del usuario en el sitio web
 * Autor: JFV Motomecánica
 * Última actualización: 16 de abril de 2025
 */

// Ejecuta el código cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa todos los componentes
    initNavigation();
    initFormValidation();
    initServiceCardsEffects();
    initLazyLoading();
    initScrollAnimations();
    createScrollTopButton();
    initMobileMenu();
});

/**
 * Funcionalidad de navegación
 * Maneja el desplazamiento suave para los enlaces de anclaje
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Aplica desplazamiento suave solo para enlaces a secciones en la misma página
            if(targetId && targetId.startsWith('#')) {
                e.preventDefault();
                if(targetId === '#') return;
            
                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                    // Desplaza suavemente con un offset de 100px desde la parte superior
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
 * Validación de formularios
 * Valida los campos del formulario de contacto antes del envío
 */
function initFormValidation() {
    const contactForm = document.querySelector('form#contact-form');
    if(!contactForm) return; // Sale si no existe un formulario en la página
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre');
        const email = document.getElementById('email');
        const mensaje = document.getElementById('mensaje');
        const asunto = document.getElementById('asunto');
        let isValid = true;
        
        // Elimina mensajes de error anteriores
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        
        // Valida los campos
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
        
        // Si el formulario es válido, muestra un mensaje de éxito
        if(isValid) {
            showSuccessMessage(contactForm);
        }
    });
    
    // Función auxiliar para mostrar mensajes de error
    function showError(input, message) {
        if(!input) return;
        
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error-message');
        errorDiv.textContent = message;
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
        input.classList.add('input-error');
        
        // Elimina el error cuando el usuario comienza a escribir
        input.addEventListener('input', function() {
            this.classList.remove('input-error');
            const nextSibling = this.nextSibling;
            if(nextSibling && nextSibling.classList && nextSibling.classList.contains('error-message')) {
                nextSibling.remove();
            }
        }, {once: true});
    }
    
    // Función auxiliar para mostrar mensaje de éxito
    function showSuccessMessage(form) {
        // Verifica si estamos usando validación de Bootstrap o personalizada
        const formSuccess = document.getElementById('form-success');
        
        if(formSuccess) {
            // Para formulario Bootstrap
            formSuccess.classList.remove('d-none');
            form.reset();
            
            // Oculta el mensaje después de 5 segundos
            setTimeout(() => {
                formSuccess.classList.add('d-none');
            }, 5000);
        } else {
            // Para formulario personalizado
            const successMessage = document.createElement('div');
            successMessage.classList.add('success-message');
            successMessage.textContent = '¡Mensaje enviado con éxito! Te contactaremos pronto.';
            form.appendChild(successMessage);
            
            // Reinicia formulario
            form.reset();
            
            // Elimina mensaje después de 5 segundos
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        }
    }
    
    // Función auxiliar para validar formato de email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

/**
 * Efectos para tarjetas de servicios
 * Añade efectos al pasar el mouse sobre las tarjetas de servicios
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
 * Carga diferida de imágenes
 * Carga las imágenes solo cuando se vuelven visibles en la pantalla
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
 * Animaciones al desplazar
 * Activa animaciones cuando los elementos aparecen en la pantalla
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
            threshold: 0.2 // Activa cuando al menos el 20% del elemento es visible
        });
        
        elementsToAnimate.forEach(element => animationObserver.observe(element));
    }
}

/**
 * Botón para volver arriba
 * Crea un botón que aparece al desplazarse y permite volver al inicio de la página
 */
function createScrollTopButton() {
    // Verifica si el botón ya existe
    if(document.querySelector('.scroll-top-btn')) return;
    
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.classList.add('scroll-top-btn');
    button.setAttribute('aria-label', 'Volver arriba');
    document.body.appendChild(button);
    
    // Muestra/oculta el botón según la posición de desplazamiento
    window.addEventListener('scroll', () => {
        if(window.scrollY > 300) {
            button.classList.add('show');
        } else {
            button.classList.remove('show');
        }
    });
    
    // Desplaza suavemente hacia arriba al hacer clic
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Funcionalidad del menú móvil
 * Maneja el menú hamburguesa para dispositivos móviles
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if(!menuToggle || !mainNav) return;
    
    // Alterna el menú al hacer clic en el botón hamburguesa
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('show');
    });
    
    // Cierra el menú al hacer clic en un elemento del menú (en móvil)
    const navLinks = document.querySelectorAll('#main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if(window.innerWidth <= 768) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('show');
            }
        });
    });
    
    // Ajusta el menú cuando se cambia el tamaño de la ventana
    window.addEventListener('resize', function() {
        if(window.innerWidth > 768) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('show');
        }
    });
}
