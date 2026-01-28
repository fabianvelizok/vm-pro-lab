/**
 * VM Pro Lab - Main JavaScript
 * Minimal vanilla JavaScript for interactions
 */

(function() {
  'use strict';

  // DOM Content Loaded - Initialize
  document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    initContactForm();
    initLazyLoadDevicon();
  });

  /**
   * Initialize Header functionality
   * - Sticky header with shadow on scroll
   * - Mobile menu toggle
   */
  function initHeader() {
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('[data-menu]');
    const navLinks = document.querySelectorAll('.nav-link');

    // Add shadow to header on scroll
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 0) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });

    // Mobile menu toggle - Event delegation
    if (menuToggle && menu) {
      menuToggle.addEventListener('click', function() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

        // Toggle menu
        menu.classList.toggle('active');
        menuToggle.classList.toggle('active');

        // Update ARIA attribute
        menuToggle.setAttribute('aria-expanded', !isExpanded);

        // Update button label
        menuToggle.setAttribute('aria-label',
          !isExpanded ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
        );
      });

      // Close menu when clicking on navigation links
      navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
          menu.classList.remove('active');
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', function(event) {
        const isClickInsideMenu = menu.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        const isMenuOpen = menu.classList.contains('active');

        if (!isClickInsideMenu && !isClickOnToggle && isMenuOpen) {
          menu.classList.remove('active');
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
        }
      });
    }
  }

  /**
   * Initialize Contact Form functionality
   * - Formspree async submission
   * - Form validation and feedback
   */
  function initContactForm() {
    const form = document.getElementById('my-form');

    if (!form) return;

    form.addEventListener('submit', async function(event) {
      event.preventDefault();

      const status = document.getElementById('my-form-status');
      const button = document.getElementById('my-form-button');
      const formData = new FormData(event.target);

      // Disable button during submission
      button.disabled = true;
      button.textContent = 'Enviando...';

      try {
        const response = await fetch(event.target.action, {
          method: form.method,
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Success message
          status.innerHTML = '¡Gracias por tu mensaje! Te responderemos pronto.';
          status.style.color = '#10B981';
          status.style.marginTop = '1rem';
          status.style.fontWeight = '600';
          form.reset();
        } else {
          // Handle Formspree validation errors
          const data = await response.json();

          if (data.errors) {
            status.innerHTML = data.errors.map(function(error) {
              return error.message;
            }).join(', ');
          } else {
            status.innerHTML = 'Hubo un problema al enviar el formulario. Intenta nuevamente.';
          }

          status.style.color = '#EF4444';
          status.style.marginTop = '1rem';
          status.style.fontWeight = '600';
        }
      } catch (error) {
        // Network error
        status.innerHTML = 'Hubo un problema al enviar el formulario. Intenta nuevamente.';
        status.style.color = '#EF4444';
        status.style.marginTop = '1rem';
        status.style.fontWeight = '600';
      } finally {
        // Re-enable button
        button.disabled = false;
        button.textContent = 'Enviar mensaje';
      }
    });
  }

  /**
   * Lazy load Devicon CSS
   * - Loads Devicon CSS only when Technologies section is near viewport
   * - Prevents render-blocking for better FCP/LCP scores
   */
  function initLazyLoadDevicon() {
    const technologiesSection = document.querySelector('#technologies');

    if (!technologiesSection) return;

    // Check if Devicon is already loaded
    let deviconLoaded = false;

    // Create Intersection Observer
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !deviconLoaded) {
          // Load Devicon CSS
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css';

          // Add font-display: swap optimization
          link.onload = function() {
            // Inject font-display override
            const style = document.createElement('style');
            style.textContent = `
              @font-face {
                font-family: 'devicon';
                font-display: swap;
                src: url('https://cdn.jsdelivr.net/gh/devicons/devicon@latest/fonts/devicon.ttf') format('truetype');
              }
            `;
            document.head.appendChild(style);
          };

          document.head.appendChild(link);
          deviconLoaded = true;

          // Disconnect observer after loading
          observer.disconnect();
        }
      });
    }, {
      // Load 200px before section enters viewport
      rootMargin: '200px'
    });

    // Start observing
    observer.observe(technologiesSection);
  }

})();
