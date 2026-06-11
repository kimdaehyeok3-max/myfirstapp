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
  var editHeight = document.getElementById('editHeight');
  var editWeight = document.getElementById('editWeight');
  var editTopSize = document.getElementById('editTopSize');
  var editBottomSize = document.getElementById('editBottomSize');
  var editStyle = document.getElementById('editStyle');
  
  if (editName) editName.value = currentUser.name || '';
  if (editPhone) editPhone.value = currentUser.phone || '';
  if (editGender) editGender.value = currentUser.gender || '';
  if (editAge) editAge.value = currentUser.age || '';
  if (editHeight) editHeight.value = currentUser.height || '';
  if (editWeight) editWeight.value = currentUser.weight || '';
  if (editTopSize) editTopSize.value = currentUser.topSize || '';
  if (editBottomSize) editBottomSize.value = currentUser.bottomSize || '';
  if (editStyle) editStyle.value = currentUser.style || '';

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
  if (document.getElementById('editHeight')) currentUser.height = document.getElementById('editHeight').value;
  if (document.getElementById('editWeight')) currentUser.weight = document.getElementById('editWeight').value;
  if (document.getElementById('editTopSize')) currentUser.topSize = document.getElementById('editTopSize').value;
  if (document.getElementById('editBottomSize')) currentUser.bottomSize = document.getElementById('editBottomSize').value;
  if (document.getElementById('editStyle')) currentUser.style = document.getElementById('editStyle').value;
  localStorage.setItem('fitmate_user', JSON.stringify(currentUser));
  // Update in users list too
  var users = JSON.parse(localStorage.getItem('fitmate_users')) || [];
  var idx = users.findIndex(function(u) { return u.email === currentUser.email; });
  if (idx >= 0) { users[idx] = currentUser; localStorage.setItem('fitmate_users', JSON.stringify(users)); }
  updateAuthUI();
  refreshMyPage();
  showToast('프로필이 저장되었습니다');
}

function cancelBooking(id) {
  if (!confirm('예약을 취소하시겠습니까?')) return;
  var idx = bookings.findIndex(function(b) { return b.id === id; });
  if (idx >= 0) {
    bookings[idx].status = 'cancelled';
    localStorage.setItem('fitmate_bookings', JSON.stringify(bookings));
    renderHistory();
    if (typeof showToast === 'function') showToast('예약이 취소되었습니다.');
  }
}

function openBookingDetail(id) {
  var b = bookings.find(function(item) { return item.id === id; });
  if (!b) return;
  var serviceNames = { online: '온라인 전용', offline: '오프라인 전용', combined: '온+오프 통합', delivery: '구매 대행' };
  var statusNames = { pending: '접수 완료', progress: '진행 중', complete: '완료', cancelled: '취소됨' };
  document.getElementById('bdService').textContent = serviceNames[b.service] || b.service;
  document.getElementById('bdNote').textContent = b.note || '없음';
  document.getElementById('bdStatus').textContent = statusNames[b.status] || b.status;
  document.getElementById('bdDate').textContent = new Date(b.date).toLocaleDateString('ko-KR');
  openModal('bookingDetail');
}

function openReviewModal(id) {
  document.getElementById('revBookingId').value = id;
  document.getElementById('revRating').value = '5';
  document.getElementById('revText').value = '';
  openModal('review');
}

function submitReview(e) {
  e.preventDefault();
  var id = parseInt(document.getElementById('revBookingId').value, 10);
  var b = bookings.find(function(item) { return item.id === id; });
  if (b) {
    b.review = {
      rating: document.getElementById('revRating').value,
      text: document.getElementById('revText').value,
      date: new Date().toISOString()
    };
    localStorage.setItem('fitmate_bookings', JSON.stringify(bookings));
    renderHistory();
    closeModal('review');
    if (typeof showToast === 'function') showToast('후기가 등록되었습니다. 감사합니다!');
  }
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
  var statusNames = { pending: '접수 완료', progress: '진행 중', complete: '완료', cancelled: '취소됨' };
  container.innerHTML = '<div class="history-list">' + userBookings.map(function(b) {
    var tagClass = b.service === 'online' ? 'online' : b.service === 'offline' ? 'offline' : 'combined';
    var actionButtons = '';
    if (b.status === 'pending') {
      actionButtons = '<button class="btn-outline" style="font-size:0.75rem;padding:4px 8px;min-height:unset;line-height:1;border-radius:4px;width:auto;" onclick="cancelBooking(' + b.id + '); event.stopPropagation();">예약 취소</button>';
    } else if (b.status === 'complete') {
      if (b.review) {
        actionButtons = '<span style="font-size:0.75rem;color:var(--primary);font-weight:600;">작성 완료</span>';
      } else {
        actionButtons = '<button class="btn-primary" style="font-size:0.75rem;padding:4px 8px;min-height:unset;line-height:1;border-radius:4px;width:auto;" onclick="openReviewModal(' + b.id + '); event.stopPropagation();">후기 작성</button>';
      }
    }
    return '<div class="history-item" style="cursor:pointer;" onclick="openBookingDetail(' + b.id + ')">' +
      '<div class="history-item-info">' +
        '<span class="history-item-type service-card-tag ' + tagClass + '">' + (serviceNames[b.service] || b.service) + '</span>' +
        '<div>' +
          '<div class="history-item-title">' + (serviceNames[b.service] || b.service) + ' 서비스</div>' +
          '<div class="history-item-date">' + new Date(b.date).toLocaleDateString('ko-KR') + '</div>' +
          (actionButtons ? '<div style="margin-top:6px;">' + actionButtons + '</div>' : '') +
        '</div>' +
      '</div>' +
      '<span class="history-item-status status-' + b.status + '">' + (statusNames[b.status]) + '</span>' +
    '</div>';
  }).join('') + '</div>';
}
