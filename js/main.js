/**
 * VM Pro Lab - Main JavaScript
 * Minimal vanilla JavaScript for interactions
 */

(function() {
  'use strict';

  // DOM Content Loaded - Initialize
  document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    initActiveNavLinks();
    initContactForm();
    initLazyLoadDevicon();
  });

  /**
   * Initialize Header functionality
   * - Sticky header with shadow on scroll
   * - Mobile menu toggle
   * - Focus trap for mobile menu
   * - ESC key handler
   * - Prevent background scrolling
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
      // Focus trap variables
      let focusableElements = [];
      let firstFocusableElement = null;
      let lastFocusableElement = null;

      /**
       * Close menu helper function
       */
      function closeMenu() {
        menu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');

        // Remove focus trap
        document.removeEventListener('keydown', trapFocus);

        // Re-enable background scrolling
        document.body.style.overflow = '';

        // Return focus to toggle button
        menuToggle.focus();
      }

      /**
       * Open menu helper function
       */
      function openMenu() {
        menu.classList.add('active');
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Cerrar menú de navegación');

        // Get all focusable elements in menu
        focusableElements = menu.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length > 0) {
          firstFocusableElement = focusableElements[0];
          lastFocusableElement = focusableElements[focusableElements.length - 1];

          // Focus first link in menu
          firstFocusableElement.focus();
        }

        // Add focus trap
        document.addEventListener('keydown', trapFocus);

        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
      }

      /**
       * Focus trap function
       * Keeps focus within the mobile menu when open
       */
      function trapFocus(event) {
        // Handle ESC key to close menu
        if (event.key === 'Escape') {
          closeMenu();
          return;
        }

        // Handle TAB key for focus trap
        if (event.key !== 'Tab') return;

        if (event.shiftKey) {
          // Shift + Tab: moving backwards
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            event.preventDefault();
          }
        } else {
          // Tab: moving forwards
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            event.preventDefault();
          }
        }
      }

      // Menu toggle click handler
      menuToggle.addEventListener('click', function() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      // Close menu when clicking on navigation links
      navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
          closeMenu();
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', function(event) {
        const isClickInsideMenu = menu.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        const isMenuOpen = menu.classList.contains('active');

        if (!isClickInsideMenu && !isClickOnToggle && isMenuOpen) {
          closeMenu();
        }
      });
    }
  }

  /**
   * Initialize Active Navigation Link indicator
   * - Uses IntersectionObserver to detect which section is in view
   * - Updates aria-current and adds visually hidden text for screen readers
   */
  function initActiveNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = [];

    // Map each nav link to its target section
    navLinks.forEach(function(link) {
      const section = document.querySelector(link.getAttribute('href'));
      if (section) {
        sections.push({ link: link, section: section });
      }
    });

    if (sections.length === 0) return;

    /**
     * Set a single link as the active nav item.
     * Removes previous active state and adds aria-current + sr text.
     */
    function setActiveLink(activeLink) {
      sections.forEach(function(item) {
        item.link.removeAttribute('aria-current');
        const indicator = item.link.querySelector('[data-sr-indicator]');
        if (indicator) indicator.remove();
      });

      activeLink.setAttribute('aria-current', 'true');

      const span = document.createElement('span');
      span.className = 'visually-hidden';
      span.setAttribute('data-sr-indicator', '');
      span.textContent = ', sección actual';
      activeLink.appendChild(span);
    }

    // Observe sections — active when crossing the top 40% of the viewport
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          sections.forEach(function(item) {
            if (item.section === entry.target) {
              setActiveLink(item.link);
            }
          });
        }
      });
    }, {
      rootMargin: '-40% 0px -50% 0px'
    });

    sections.forEach(function(item) {
      observer.observe(item.section);
    });
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
          // Add loading state
          technologiesSection.classList.add('devicon-loading');

          // Load Devicon CSS
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css';

          // Add loaded state when CSS is ready
          link.onload = function() {
            technologiesSection.classList.remove('devicon-loading');
            technologiesSection.classList.add('devicon-loaded');
          };

          document.head.appendChild(link);
          deviconLoaded = true;

          // Disconnect observer after loading
          observer.disconnect();
        }
      });
    }, {
      // Load 300px before section enters viewport (increased for smoother UX)
      rootMargin: '300px'
    });

    // Start observing
    observer.observe(technologiesSection);
  }

})();
