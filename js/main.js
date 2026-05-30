/**
 * VM Pro Lab - Main JavaScript
 * Minimal vanilla JavaScript for interactions
 */

(function() {
  'use strict';

  // DOM Content Loaded - Initialize
  document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initHeader();
    initActiveNavLinks();
    initContactForm();
    initProjectsCarousel();
    initLazyLoadDevicon();
  });

  /**
   * Initialize Theme Toggle
   * - Reads localStorage for saved preference
   * - Applies data-theme attribute to <html>
   * - Persists user choice in localStorage under 'vm-theme'
   */
  function initThemeToggle() {
    const btn = document.querySelector('[data-theme-toggle]');
    if (!btn) return;

    function getSystemTheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function getEffectiveTheme() {
      return document.documentElement.getAttribute('data-theme') || getSystemTheme();
    }

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('vm-theme', theme);
      btn.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }

    // Set initial aria-label based on current effective theme
    const current = getEffectiveTheme();
    btn.setAttribute('aria-label', current === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');

    btn.addEventListener('click', function() {
      const next = getEffectiveTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

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
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 0) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
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

      activeLink.setAttribute('aria-current', 'page');

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
   * - Inline validation with aria-invalid and error messages
   * - Honeypot bot trap
   * - JSON POST to Cloudflare Worker (Resend-backed)
   * - Toast feedback + accessible fallback status
   */
  function initContactForm() {
    const form = document.getElementById('my-form');

    if (!form) return;

    const WORKER_URL = 'https://vmprolab-contact.velizfabianhoracio.workers.dev';

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const honeypotInput = document.getElementById('hp-website');

    const successToast = document.getElementById('success-toast');
    const errorToast = document.getElementById('error-toast');

    // Guard against multiple simultaneous submissions
    let isSubmitting = false;

    /**
     * Display or clear error for a field
     */
    function setFieldError(field, errorMessage) {
      const errorElement = document.getElementById(field.id + '-error');

      if (errorMessage) {
        field.setAttribute('aria-invalid', 'true');
        errorElement.textContent = errorMessage;
      } else {
        field.setAttribute('aria-invalid', 'false');
        errorElement.textContent = '';
      }
    }

    /**
     * Validate name field
     */
    function validateName() {
      const value = nameInput.value.trim();

      if (!value) {
        setFieldError(nameInput, 'El nombre es requerido');
        return false;
      }

      if (value.length < 2) {
        setFieldError(nameInput, 'El nombre debe tener al menos 2 caracteres');
        return false;
      }

      setFieldError(nameInput, '');
      return true;
    }

    /**
     * Validate email field
     */
    function validateEmail() {
      const value = emailInput.value.trim();

      if (!value) {
        setFieldError(emailInput, 'El email es requerido');
        return false;
      }

      // Basic email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setFieldError(emailInput, 'Por favor ingresa un email válido');
        return false;
      }

      setFieldError(emailInput, '');
      return true;
    }

    /**
     * Validate message field
     */
    function validateMessage() {
      const value = messageInput.value.trim();

      if (!value) {
        setFieldError(messageInput, 'El mensaje es requerido');
        return false;
      }

      if (value.length < 10) {
        setFieldError(messageInput, 'El mensaje debe tener al menos 10 caracteres');
        return false;
      }

      setFieldError(messageInput, '');
      return true;
    }

    /**
     * Validate entire form
     */
    function validateForm() {
      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isMessageValid = validateMessage();

      return isNameValid && isEmailValid && isMessageValid;
    }

    /**
     * Show success toast for 4s
     */
    function showSuccessToast() {
      if (!successToast) return;
      successToast.classList.add('show');
      setTimeout(function() { successToast.classList.remove('show'); }, 4000);
    }

    /**
     * Show error toast for 5s
     */
    function showErrorToast() {
      if (!errorToast) return;
      errorToast.classList.add('show');
      setTimeout(function() { errorToast.classList.remove('show'); }, 5000);
    }

    // Add blur event listeners for real-time validation
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    messageInput.addEventListener('blur', validateMessage);

    // Form submission handler
    form.addEventListener('submit', async function(event) {
      event.preventDefault();

      // Honeypot: silently abort if filled (bot detected)
      if (honeypotInput && honeypotInput.value) return;

      // Prevent multiple simultaneous submissions
      if (isSubmitting) return;

      // Validate form before submission
      if (!validateForm()) {
        // Focus first invalid field
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      isSubmitting = true;

      const button = document.getElementById('my-form-button');

      // Store original button text
      const originalButtonText = button.textContent;

      // Add aria-busy to form and loading state to button
      form.setAttribute('aria-busy', 'true');
      button.disabled = true;
      button.classList.add('btn-loading');

      // Wrap button text in span and add spinner
      button.innerHTML = '<span class="btn-text">' + originalButtonText + '</span><span class="btn-spinner" aria-hidden="true"></span>';

      try {
        const response = await fetch(WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: nameInput.value,
            email: emailInput.value,
            message: messageInput.value,
            website: honeypotInput ? honeypotInput.value : ''
          })
        });

        if (response.ok) {
          showSuccessToast();

          // Reset form and clear any validation states
          form.reset();
          setFieldError(nameInput, '');
          setFieldError(emailInput, '');
          setFieldError(messageInput, '');
        } else {
          showErrorToast();
        }
      } catch (error) {
        // Network error or CORS failure
        showErrorToast();
      } finally {
        isSubmitting = false;

        // Remove aria-busy and re-enable button
        form.setAttribute('aria-busy', 'false');
        button.disabled = false;
        button.classList.remove('btn-loading');
        button.textContent = originalButtonText;
      }
    });
  }

  /**
   * Initialize Projects Carousel (vanilla scroll-snap)
   * - Prev/next arrows scroll the track by one slide width
   * - Clickable pagination dots, built from the slides
   * - Active dot + arrow enabled/disabled state synced via IntersectionObserver
   * - Arrow-key navigation when the track region is focused
   * - No autoplay; respects prefers-reduced-motion for programmatic scrolls
   */
  function initProjectsCarousel() {
    const track = document.getElementById('projects-track');
    if (!track) return;

    const slides = Array.prototype.slice.call(track.querySelectorAll('.project-slide'));
    if (slides.length === 0) return;

    const wrapper = track.closest('.projects-carousel-wrapper');
    const prevBtn = wrapper ? wrapper.querySelector('.projects-carousel-arrow-prev') : null;
    const nextBtn = wrapper ? wrapper.querySelector('.projects-carousel-arrow-next') : null;
    const dotsContainer = wrapper ? wrapper.querySelector('.projects-carousel-dots') : null;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollBehavior = reduceMotion ? 'auto' : 'smooth';

    // Distance to advance per step = gap between consecutive slides (includes the gap)
    function getStep() {
      if (slides.length > 1) {
        return slides[1].getBoundingClientRect().left - slides[0].getBoundingClientRect().left;
      }
      return slides[0].getBoundingClientRect().width;
    }

    function scrollByStep(direction) {
      track.scrollBy({ left: direction * getStep(), behavior: scrollBehavior });
    }

    // Build pagination dots
    const dots = [];
    if (dotsContainer) {
      slides.forEach(function(slide, index) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'projects-carousel-dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Ir al proyecto ' + (index + 1));
        dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        dot.addEventListener('click', function() {
          slide.scrollIntoView({ behavior: scrollBehavior, inline: 'start', block: 'nearest' });
        });
        dotsContainer.appendChild(dot);
        dots.push(dot);
      });
    }

    let currentIndex = -1;
    let rafPending = false;

    // Arrows reflect the real scroll extent (works for any number of visible cards)
    function updateArrows() {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (prevBtn) prevBtn.disabled = track.scrollLeft <= 1;
      if (nextBtn) nextBtn.disabled = track.scrollLeft >= maxScroll - 1;
    }

    // Active dot = leftmost snapped slide (slides are uniform width per breakpoint)
    function syncState() {
      rafPending = false;
      const step = getStep();
      let index = step > 0 ? Math.round(track.scrollLeft / step) : 0;
      index = Math.max(0, Math.min(slides.length - 1, index));
      if (index !== currentIndex) {
        currentIndex = index;
        dots.forEach(function(dot, i) {
          dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
        });
      }
      updateArrows();
    }

    function requestSync() {
      if (!rafPending) {
        rafPending = true;
        window.requestAnimationFrame(syncState);
      }
    }

    track.addEventListener('scroll', requestSync, { passive: true });
    // Slide width (and therefore the step) changes across breakpoints; re-sync
    // on resize, and once more on full load so the initial state reflects the
    // settled layout.
    window.addEventListener('resize', requestSync);
    window.addEventListener('load', syncState);

    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        scrollByStep(-1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        scrollByStep(1);
      });
    }

    // Keyboard navigation when the carousel region is focused
    track.addEventListener('keydown', function(event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollByStep(-1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollByStep(1);
      }
    });

    // Click-drag to scroll (mouse pointers only; touch/pen keep native scrolling)
    let isDragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let dragMoved = false;

    track.addEventListener('pointerdown', function(event) {
      if (event.pointerType !== 'mouse') return;
      isDragging = true;
      dragMoved = false;
      dragStartX = event.clientX;
      dragStartScroll = track.scrollLeft;
      track.classList.add('is-dragging');
      track.setPointerCapture(event.pointerId);
    });

    track.addEventListener('pointermove', function(event) {
      if (!isDragging) return;
      const dx = event.clientX - dragStartX;
      if (Math.abs(dx) > 4) dragMoved = true;
      track.scrollLeft = dragStartScroll - dx;
    });

    function endDrag(event) {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove('is-dragging');
      if (event && event.pointerId != null && track.hasPointerCapture(event.pointerId)) {
        track.releasePointerCapture(event.pointerId);
      }
    }

    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);

    // Swallow the click that fires after a drag so card links don't open mid-pull
    track.addEventListener('click', function(event) {
      if (dragMoved) {
        event.preventDefault();
        event.stopPropagation();
        dragMoved = false;
      }
    }, true);

    syncState();
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
