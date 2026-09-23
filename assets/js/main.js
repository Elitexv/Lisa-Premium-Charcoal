// Lisa Premium Charcoal — site interactions
document.addEventListener('DOMContentLoaded', function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Mobile nav toggle ----------
  var navToggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  var mobileNavClose = document.querySelector('.mobile-nav-close');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileNavClose && mobileNav) {
    mobileNavClose.addEventListener('click', function () {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- FAQ: only one open at a time ----------
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  // ---------- Toast notifications ----------
  function showToast(message) {
    var toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 4000);
  }

  // ---------- Contact form: native validation + mailto fallback ----------
  var quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!quoteForm.reportValidity()) {
        return;
      }

      var data = new FormData(quoteForm);
      var name = data.get('name') || '';
      var company = data.get('company') || '';
      var country = data.get('country') || '';
      var product = data.get('product') || '';
      var quantity = data.get('quantity') || '';
      var message = data.get('message') || '';
      var email = data.get('email') || '';
      var phone = data.get('phone') || '';

      var subject = 'Charcoal Export Inquiry from ' + (company || name || 'Website Visitor');
      var body =
        'Name: ' + name + '\n' +
        'Company: ' + company + '\n' +
        'Country: ' + country + '\n' +
        'Email: ' + email + '\n' +
        'Phone: ' + phone + '\n' +
        'Product of Interest: ' + product + '\n' +
        'Estimated Quantity: ' + quantity + '\n\n' +
        'Message:\n' + message;

      var mailto = 'mailto:lisapremiumcharcoal@gmail.com' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      showToast('Opening your email app to send your inquiry…');
      setTimeout(function () {
        window.location.href = mailto;
      }, 400);
    });
  }

  // ---------- Back to top ----------
  var backToTop = document.querySelector('.back-to-top');
  if (!backToTop) {
    backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.type = 'button';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    document.body.appendChild(backToTop);
  }
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });

  var backToTopTicking = false;
  window.addEventListener('scroll', function () {
    if (backToTopTicking) return;
    backToTopTicking = true;
    requestAnimationFrame(function () {
      backToTop.classList.toggle('is-visible', window.scrollY > 500);
      backToTopTicking = false;
    });
  });

  // ---------- Animated stat counters ----------
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count-to'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;

    if (prefersReduced) {
      el.textContent = target + suffix;
      return;
    }

    var duration = 1400;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  // ---------- Motion: scroll reveal ----------
  function initMotion() {
    var immediate = document.querySelectorAll('.hero .hero-copy, .hero .hero-visual, .page-header .container');
    immediate.forEach(function (el) { el.classList.add('reveal', 'reveal-immediate'); });

    document.querySelectorAll('.section-head, .cta-banner, .contact-info-card, .map-embed, #quote-form, .hero-copy, .hero-visual')
      .forEach(function (el) {
        if (!el.classList.contains('reveal-immediate')) el.classList.add('reveal');
      });

    var staggerContainers = document.querySelectorAll('.grid, .steps, .faq-list, .region-list, .value-grid, .stats-bar');
    staggerContainers.forEach(function (container) {
      container.classList.add('reveal-stagger');
      Array.prototype.forEach.call(container.children, function (child, i) {
        child.style.transitionDelay = (Math.min(i, 6) * 70) + 'ms';
      });
    });

    if (prefersReduced) {
      document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) { el.classList.add('is-visible'); });
      document.querySelectorAll('[data-count-to]').forEach(animateCounter);
      return;
    }

    // Fire the above-the-fold group right after first paint
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        immediate.forEach(function (el, i) {
          setTimeout(function () { el.classList.add('is-visible'); }, i * 120);
        });
      });
    });

    var scrollTargets = document.querySelectorAll('.reveal:not(.reveal-immediate), .reveal-stagger:not(.reveal-immediate)');
    if (!('IntersectionObserver' in window)) {
      scrollTargets.forEach(function (el) { el.classList.add('is-visible'); });
      document.querySelectorAll('[data-count-to]').forEach(animateCounter);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    scrollTargets.forEach(function (el) { observer.observe(el); });

    var counterEls = document.querySelectorAll('[data-count-to]');
    if (counterEls.length) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counterEls.forEach(function (el) { counterObserver.observe(el); });
    }
  }

  initMotion();

  // ---------- Footer year ----------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
