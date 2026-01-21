/**
 * VM Pro Lab - Main JavaScript
 * Minimal vanilla JavaScript for interactions
 */

(function() {
  'use strict';

  // DOM Content Loaded - Initialize
  document.addEventListener('DOMContentLoaded', function() {
    console.log('VM Pro Lab initialized');

    initHeader();
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

})();
