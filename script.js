/**
 * orb - Club Social para Artistas Emergentes
 * Static JavaScript - Vanilla JS, no dependencies
 */

(function() {
  'use strict';

  // ===== Safe DOM Element Selection =====
  function getElement(id) {
    return document.getElementById(id);
  }

  function getElements(selector) {
    return document.querySelectorAll(selector);
  }

  // ===== DOM Elements =====
  const header = getElement('header');
  const menuToggle = getElement('menuToggle');
  const navMobile = getElement('navMobile');
  const eventItems = getElements('.event-item');
  const venueNavBtns = getElements('.venue-nav-btn');
  const manifestoQuote = getElement('manifestoQuote');
  const manifestoText = getElement('manifestoText');

  // ===== Header Scroll Effect =====
  function handleScroll() {
    if (!header) return;
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // ===== Mobile Menu Toggle =====
  if (menuToggle && navMobile) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navMobile.classList.toggle('open');
    });

    // Close menu when clicking a link
    const mobileLinks = navMobile.querySelectorAll('a');
    mobileLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        navMobile.classList.remove('open');
      });
    });
  }

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== Events Interactive Gallery =====
  if (eventItems.length > 0) {
    const featuredImage = document.getElementById('eventFeaturedImage');
    const featuredTitle = document.getElementById('eventFeaturedTitle');
    const featuredDate = document.getElementById('eventFeaturedDate');
    const featuredTime = document.getElementById('eventFeaturedTime');
    const featuredCategory = document.getElementById('eventFeaturedCategory');

    eventItems.forEach(function(item) {
      item.addEventListener('click', function() {
        // Remove active class from all items
        eventItems.forEach(function(el) {
          el.classList.remove('active');
        });
        
        // Add active class to clicked item
        this.classList.add('active');

        // Update featured event
        const data = this.dataset;
        
        if (featuredImage) {
          featuredImage.style.opacity = '0';
          setTimeout(function() {
            featuredImage.src = data.image;
            featuredImage.alt = data.title;
            featuredImage.style.opacity = '1';
          }, 300);
        }
        
        if (featuredTitle) featuredTitle.textContent = data.title;
        if (featuredDate) featuredDate.textContent = data.date;
        if (featuredTime) featuredTime.textContent = data.time;
        if (featuredCategory) featuredCategory.textContent = data.category;
      });
    });
  }

  // ===== Venue Space Navigator =====
  if (venueNavBtns.length > 0) {
    const venueMainImage = document.getElementById('venueMainImage');
    const venueMainTitle = document.getElementById('venueMainTitle');
    const venueMainDescription = document.getElementById('venueMainDescription');
    const venueMainCapacity = document.getElementById('venueMainCapacity');

    venueNavBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        // Remove active class from all buttons
        venueNavBtns.forEach(function(el) {
          el.classList.remove('active');
        });
        
        // Add active class to clicked button
        this.classList.add('active');

        // Update main venue display
        const data = this.dataset;
        
        if (venueMainImage) {
          venueMainImage.style.opacity = '0';
          venueMainImage.style.transform = 'scale(1.05)';
          setTimeout(function() {
            venueMainImage.src = data.image;
            venueMainImage.alt = data.name;
            venueMainImage.style.opacity = '1';
            venueMainImage.style.transform = 'scale(1)';
          }, 300);
        }
        
        if (venueMainTitle) venueMainTitle.textContent = data.name;
        if (venueMainDescription) venueMainDescription.textContent = data.description;
        if (venueMainCapacity) venueMainCapacity.textContent = 'Capacidad: ' + data.capacity;
      });
    });
  }

  // ===== Manifesto Section Animation =====
  function handleManifestoAnimation() {
    const manifestoSection = document.getElementById('manifiesto');
    if (!manifestoSection) return;

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          if (manifestoQuote) manifestoQuote.classList.add('visible');
          if (manifestoText) manifestoText.classList.add('visible');
        }
      });
    }, { threshold: 0.3 });

    observer.observe(manifestoSection);
  }

  handleManifestoAnimation();

  // ===== Scroll Reveal Animation =====
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.fade-in-up');
    
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  initScrollReveal();

  // ===== Lazy Load Images =====
  function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      return;
    }

    // Fallback for browsers that don't support native lazy loading
    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(function(img) {
      imageObserver.observe(img);
    });
  }

  initLazyLoad();

  // ===== Artist Card Hover Effect (Touch Devices) =====
  function initTouchHover() {
    const artistCards = document.querySelectorAll('.artist-card');
    
    if (!('ontouchstart' in window)) return;

    artistCards.forEach(function(card) {
      card.addEventListener('touchstart', function() {
        // Remove hover state from other cards
        artistCards.forEach(function(c) {
          if (c !== card) c.classList.remove('touch-hover');
        });
        // Toggle hover state on this card
        this.classList.toggle('touch-hover');
      });
    });

    // Remove hover state when touching outside
    document.addEventListener('touchstart', function(e) {
      if (!e.target.closest('.artist-card')) {
        artistCards.forEach(function(card) {
          card.classList.remove('touch-hover');
        });
      }
    });
  }

  initTouchHover();

  // ===== Preload Critical Images =====
  function preloadImages() {
    const criticalImages = [
      'assets/hero-nightclub.jpg',
      'assets/cosmic-pillars.jpg'
    ];

    criticalImages.forEach(function(src) {
      const img = new Image();
      img.src = src;
    });
  }

  // Preload after page load
  window.addEventListener('load', preloadImages);

  // ===== Performance: Throttle Scroll Events =====
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function() {
          inThrottle = false;
        }, limit);
      }
    };
  }

  // Apply throttle to scroll handler if needed for heavy operations
  // window.addEventListener('scroll', throttle(heavyScrollHandler, 100), { passive: true });

  // ===== Image Error Handling =====
  function initImageErrorHandling() {
    const images = getElements('img');
    images.forEach(function(img) {
      img.addEventListener('error', function() {
        // Set a fallback background color if image fails to load
        this.style.backgroundColor = '#1a1a1a';
        this.style.minHeight = '200px';
        this.alt = 'Imagen no disponible';
      });
    });
  }

  initImageErrorHandling();

  // ===== Console Message =====
  console.log('%c orb ', 'background: #4d9de0; color: #0a0a0a; font-size: 24px; font-weight: bold; padding: 10px 20px;');
  console.log('%c Club Social para Artistas Emergentes ', 'color: #999; font-size: 12px;');

})();
