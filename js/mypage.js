/* ══════════════════════════════════════════
   FITMATE — My Page
   Profile, History, Settings
   ══════════════════════════════════════════ */

function refreshMyPage() {
  if (!currentUser) return;
  var avatar = document.getElementById('mypageAvatar');
  var name = document.getElementById('mypageName');
  var email = document.getElementById('mypageEmail');
  if (avatar) avatar.textContent = currentUser.name.charAt(0);
  if (name) name.textContent = currentUser.name;
  if (email) email.textContent = currentUser.email;

  var editName = document.getElementById('editName');
  var editPhone = document.getElementById('editPhone');
  var editGender = document.getElementById('editGender');
  var editAge = document.getElementById('editAge');
  if (editName) editName.value = currentUser.name || '';
  if (editPhone) editPhone.value = currentUser.phone || '';
  if (editGender) editGender.value = currentUser.gender || '';
  if (editAge) editAge.value = currentUser.age || '';

  var typeEl = document.getElementById('mypageType');
  if (typeEl && currentUser.diagResult) {
    typeEl.textContent = currentUser.diagResult;
  }
  renderHistory();
}

function switchMyTab(el, tab) {
  document.querySelectorAll('.mypage-tab').forEach(function(t) { t.classList.remove('active'); });
  var target = document.getElementById('mytab-' + tab);
  if (target) target.classList.add('active');
  document.querySelectorAll('.mypage-sidebar-menu a').forEach(function(a) { a.classList.remove('active'); });
  el.classList.add('active');
}

function handleProfileUpdate(e) {
  e.preventDefault();
  currentUser.name = document.getElementById('editName').value;
  currentUser.phone = document.getElementById('editPhone').value;
  currentUser.gender = document.getElementById('editGender').value;
  currentUser.age = document.getElementById('editAge').value;
  localStorage.setItem('fitmate_user', JSON.stringify(currentUser));
  // Update in users list too
  var users = JSON.parse(localStorage.getItem('fitmate_users')) || [];
  var idx = users.findIndex(function(u) { return u.email === currentUser.email; });
  if (idx >= 0) { users[idx] = currentUser; localStorage.setItem('fitmate_users', JSON.stringify(users)); }
  updateAuthUI();
  refreshMyPage();
  showToast('프로필이 저장되었습니다');
}

function renderHistory() {
  var container = document.getElementById('historyList');
  if (!container) return;
  var userBookings = bookings.filter(function(b) { return b.email === (currentUser ? currentUser.email : ''); });
  if (!userBookings.length) {
    container.innerHTML = '<div class="history-empty"><div style="font-size:2rem">📋</div><p>아직 이용 내역이 없습니다</p></div>';
    return;
  }
  var serviceNames = { online: '온라인 전용', offline: '오프라인 전용', combined: '온+오프 통합', delivery: '구매 대행' };
  var statusNames = { pending: '접수 완료', progress: '진행 중', complete: '완료' };
  container.innerHTML = '<div class="history-list">' + userBookings.map(function(b) {
    var tagClass = b.service === 'online' ? 'online' : b.service === 'offline' ? 'offline' : 'combined';
    return '<div class="history-item">' +
      '<div class="history-item-info">' +
        '<span class="history-item-type service-card-tag ' + tagClass + '">' + (serviceNames[b.service] || b.service) + '</span>' +
        '<div>' +
          '<div class="history-item-title">' + (serviceNames[b.service] || b.service) + ' 서비스</div>' +
          '<div class="history-item-date">' + new Date(b.date).toLocaleDateString('ko-KR') + '</div>' +
        '</div>' +
      '</div>' +
      '<span class="history-item-status status-' + b.status + '">' + (statusNames[b.status]) + '</span>' +
    '</div>';
  }).join('') + '</div>';
}
