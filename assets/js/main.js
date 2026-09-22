// Lisa Premium Charcoal — site interactions
document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
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

  // Only one FAQ item open at a time
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

  // Contact form -> mailto fallback (no backend configured yet)
  var quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();
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

      window.location.href = mailto;
    });
  }

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
