/* ══════════════════════════════════════════
   FITMATE — Authentication
   Login, Register, Logout, Modal, Dropdown
   ══════════════════════════════════════════ */

// ── Register ──
function handleRegister(e) {
  e.preventDefault();
  var name = document.getElementById('regName').value.trim();
  var email = document.getElementById('regEmail').value.trim();
  var pw = document.getElementById('regPw').value;
  var pwc = document.getElementById('regPwConfirm').value;
  var errEl = document.getElementById('regError');

  if (pw !== pwc) {
    errEl.textContent = '비밀번호가 일치하지 않습니다';
    errEl.style.display = 'block';
    return;
  }

  // Check existing users
  var users = JSON.parse(localStorage.getItem('fitmate_users')) || [];
  if (users.find(function(u) { return u.email === email; })) {
    errEl.textContent = '이미 가입된 이메일입니다';
    errEl.style.display = 'block';
    return;
  }

  var user = {
    name: name,
    email: email,
    pw: pw,
    phone: '',
    gender: '',
    age: '',
    diagResult: null,
    createdAt: new Date().toISOString()
  };
  users.push(user);
  localStorage.setItem('fitmate_users', JSON.stringify(users));

  currentUser = user;
  localStorage.setItem('fitmate_user', JSON.stringify(user));
  updateAuthUI();
  closeModal('register');
  showToast(name + '님, 가입을 환영합니다!');

  // Redirect if pending redirect exists
  var redirectPage = localStorage.getItem('fitmate_redirect');
  if (redirectPage) {
    localStorage.removeItem('fitmate_redirect');
    navigate(redirectPage);
  }
}

// ── Login ──
function handleLogin(e) {
  e.preventDefault();
  var email = document.getElementById('loginEmail').value.trim();
  var pw = document.getElementById('loginPw').value;
  var users = JSON.parse(localStorage.getItem('fitmate_users')) || [];
  var user = users.find(function(u) { return u.email === email && u.pw === pw; });

  if (!user) {
    document.getElementById('loginError').style.display = 'block';
    return;
  }

  currentUser = user;
  localStorage.setItem('fitmate_user', JSON.stringify(user));
  updateAuthUI();
  closeModal('login');
  showToast(user.name + '님, 환영합니다!');

  // Redirect if pending redirect exists
  var redirectPage = localStorage.getItem('fitmate_redirect');
  if (redirectPage) {
    localStorage.removeItem('fitmate_redirect');
    navigate(redirectPage);
  }
}

// ── Logout ──
function logout() {
  currentUser = null;
  localStorage.removeItem('fitmate_user');
  updateAuthUI();
  navigate('landing');
  showToast('로그아웃되었습니다');
}

// ── Auth UI Update ──
function updateAuthUI() {
  var authDiv = document.getElementById('navAuth');
  var userDiv = document.getElementById('navUser');
  if (!authDiv || !userDiv) return;

  if (currentUser) {
    authDiv.style.display = 'none';
    userDiv.classList.add('active');
    document.getElementById('navAvatar').textContent = currentUser.name.charAt(0);
  } else {
    authDiv.style.display = 'flex';
    userDiv.classList.remove('active');
  }
}

// ── Prefill Forms ──
function prefillForms() {
  var fields = [
    ['bookName', 'name'], ['bookEmail', 'email'],
    ['bpName', 'name'], ['bpEmail', 'email']
  ];
  fields.forEach(function(pair) {
    var el = document.getElementById(pair[0]);
    if (el && currentUser[pair[1]]) el.value = currentUser[pair[1]];
  });
}

// ── Modal ──
function openModal(type) {
  var modal = document.getElementById(type + 'Modal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Close mobile menu if open
    var nav = document.getElementById('nav');
    if (nav) nav.classList.remove('mobile-open');
  }
}

function closeModal(type) {
  var modal = document.getElementById(type + 'Modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  // Reset errors
  document.querySelectorAll('.form-error').forEach(function(e) { e.style.display = 'none'; });
}

function switchModal(from, to) {
  closeModal(from);
  setTimeout(function() { openModal(to); }, 200);
}

// ── Dropdown ──
function toggleDropdown() {
  var dd = document.getElementById('navDropdown');
  if (dd) dd.classList.toggle('open');
}

function closeDropdown() {
  var dd = document.getElementById('navDropdown');
  if (dd) dd.classList.remove('open');
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('.nav-user')) closeDropdown();
});
