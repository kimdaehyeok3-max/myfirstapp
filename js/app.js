/* ══════════════════════════════════════════
   FITMATE — App Core
   State, Routing, Initialization
   ══════════════════════════════════════════ */

// ── State (shared across all JS modules) ──
var currentUser = JSON.parse(localStorage.getItem('fitmate_user')) || null;
var bookings = JSON.parse(localStorage.getItem('fitmate_bookings')) || [];

// ── Path Helper ──
function isInPagesDir() {
  var path = window.location.pathname.replace(/\\/g, '/');
  return path.includes('/pages/');
}

// ── Navigation ──
function navigate(page) {
  var inPages = isInPagesDir();

  if (page === 'landing') {
    window.location.href = inPages ? '../index.html' : 'index.html';
    return;
  }

  // All other pages are in /pages/ folder
  var target = page + '.html';
  window.location.href = inPages ? target : 'pages/' + target;
}

function scrollToSection(id) {
  var inPages = isInPagesDir();

  // Close mobile menu if open
  var nav = document.getElementById('nav');
  if (nav) nav.classList.remove('mobile-open');

  // If on landing page, just scroll
  if (!inPages) {
    var el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
  }

  // From another page, navigate to landing with hash
  var landingUrl = inPages ? '../index.html' : 'index.html';
  window.location.href = landingUrl + '#' + id;
}

function requireLogin(page) {
  if (!currentUser) {
    localStorage.setItem('fitmate_redirect', page);
    openModal('login');
    return;
  }
  navigate(page);
}

function toggleDarkMode() {
  var isDark = document.body.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.body.removeAttribute('data-theme');
    localStorage.removeItem('fitmate_theme');
  } else {
    document.body.setAttribute('data-theme', 'dark');
    localStorage.setItem('fitmate_theme', 'dark');
  }
}

// ── Initialization ──
document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('fitmate_theme') === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
  }

  var pageId = document.body.getAttribute('data-page');

  // Redirect to landing if accessing protected pages while logged out
  if ((pageId === 'mypage' || pageId === 'booking') && !currentUser) {
    localStorage.setItem('fitmate_redirect', pageId);
    localStorage.setItem('fitmate_toast', '로그인이 필요한 서비스입니다.');
    window.location.href = isInPagesDir() ? '../index.html' : 'index.html';
    return;
  }

  // Show pending toast if present
  var pendingToast = localStorage.getItem('fitmate_toast');
  if (pendingToast) {
    if (typeof showToast === 'function') {
      showToast(pendingToast);
    }
    localStorage.removeItem('fitmate_toast');
  }

  // Auto-open login modal if there's a pending redirect
  if (pageId === 'landing' && localStorage.getItem('fitmate_redirect') && !currentUser) {
    if (typeof openModal === 'function') {
      openModal('login');
    }
  }

  // Update auth UI
  if (typeof updateAuthUI === 'function') updateAuthUI();

  // Init UI effects
  if (typeof initScrollAnimations === 'function') initScrollAnimations();
  if (typeof initNavScroll === 'function') initNavScroll();
  if (typeof initModalOverlayClose === 'function') initModalOverlayClose();

  // Prefill forms if logged in
  if (currentUser && typeof prefillForms === 'function') prefillForms();

  // Handle hash scrolling (from cross-page navigation)
  if (window.location.hash) {
    var hash = window.location.hash.substring(1);
    setTimeout(function() {
      var el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }

  // Page-specific initialization
  if (pageId === 'mypage' && typeof refreshMyPage === 'function') refreshMyPage();
  if (pageId === 'diagnosis' && typeof resetDiagnosis === 'function') resetDiagnosis();
});
