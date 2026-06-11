/* ══════════════════════════════════════════
   FITMATE — UI Utilities
   Toast, Scroll Animations, Nav Effects
   ══════════════════════════════════════════ */

// ── Toast ──
function showToast(msg) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(function() { toast.classList.remove('show'); }, 3000);
}

// ── Scroll Animations ──
function initScrollAnimations() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(function(el) { observer.observe(el); });
}

// ── Nav scroll effect ──
function initNavScroll() {
  var nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', function() {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  });
}

// ── Modal overlay click close ──
function initModalOverlayClose() {
  document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });
}

// ── Mobile toggle ──
function toggleMobile() {
  var nav = document.getElementById('nav');
  if (nav) {
    nav.classList.toggle('mobile-open');
  }
}

// Close mobile menu on window resize
window.addEventListener('resize', function() {
  var nav = document.getElementById('nav');
  if (nav && window.innerWidth > 768) {
    nav.classList.remove('mobile-open');
  }
});
