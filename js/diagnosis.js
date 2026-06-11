/* ══════════════════════════════════════════
   FITMATE — Style Diagnosis Flow
   ══════════════════════════════════════════ */

var diagStep = 1;
var diagAnswers = {};

function resetDiagnosis() {
  diagStep = 1;
  diagAnswers = {};
  document.querySelectorAll('.diagnosis-step').forEach(function(s) { s.classList.remove('active'); s.style.display = ''; });
  var firstStep = document.querySelector('.diagnosis-step[data-step="1"]');
  if (firstStep) firstStep.classList.add('active');
  document.querySelectorAll('.diagnosis-option').forEach(function(o) { o.classList.remove('selected'); });
  var nav = document.getElementById('diagNav');
  if (nav) nav.style.display = 'flex';
  // Hide result step
  var resultStep = document.querySelector('.diagnosis-step[data-step="result"]');
  if (resultStep) resultStep.style.display = 'none';
  updateDiagProgress();
}

function updateDiagProgress() {
  var pct = (diagStep / 5) * 100;
  var fill = document.getElementById('diagProgressFill');
  var text = document.getElementById('diagProgressText');
  if (fill) fill.style.width = pct + '%';
  if (text) text.textContent = diagStep + ' / 5';
}

function toggleOption(el) {
  var parent = el.closest('.diagnosis-options');
  var max = parseInt(parent.dataset.multi) || 1;
  if (el.classList.contains('selected')) {
    el.classList.remove('selected');
  } else {
    var selected = parent.querySelectorAll('.selected');
    if (selected.length >= max && max > 1) return;
    if (max === 1) parent.querySelectorAll('.selected').forEach(function(s) { s.classList.remove('selected'); });
    el.classList.add('selected');
  }
}

function selectSingle(el) {
  var parent = el.closest('.diagnosis-options');
  parent.querySelectorAll('.selected').forEach(function(s) { s.classList.remove('selected'); });
  el.classList.add('selected');
}

function diagNext() {
  var currentStep = document.querySelector('.diagnosis-step[data-step="' + diagStep + '"]');
  var selected = currentStep.querySelectorAll('.diagnosis-option.selected');
  if (!selected.length) { showToast('하나 이상 선택해주세요'); return; }
  diagAnswers[diagStep] = Array.from(selected).map(function(s) { return s.textContent; });

  if (diagStep >= 5) { showDiagResult(); return; }
  currentStep.classList.remove('active');
  diagStep++;
  document.querySelector('.diagnosis-step[data-step="' + diagStep + '"]').classList.add('active');
  updateDiagProgress();
}

function diagPrev() {
  if (diagStep <= 1) { navigate('landing'); return; }
  document.querySelector('.diagnosis-step[data-step="' + diagStep + '"]').classList.remove('active');
  diagStep--;
  document.querySelector('.diagnosis-step[data-step="' + diagStep + '"]').classList.add('active');
  updateDiagProgress();
}

function showDiagResult() {
  document.querySelectorAll('.diagnosis-step').forEach(function(s) { s.classList.remove('active'); });
  var resultStep = document.querySelector('.diagnosis-step[data-step="result"]');
  resultStep.style.display = 'block';
  resultStep.classList.add('active');
  document.getElementById('diagNav').style.display = 'none';

  var styles = diagAnswers[1] || ['미니멀'];
  var bodyType = (diagAnswers[3] || ['보통'])[0];
  var resultType = styles.join(' × ') + ' · ' + bodyType;

  document.getElementById('resultTitle').textContent = (currentUser ? currentUser.name : '회원') + '님의 스타일 진단 결과';
  document.getElementById('resultDesc').textContent = styles.join('과 ') + ' 스타일을 선호하시는 ' + bodyType + ' 체형이시네요. 아래 코디 방향을 참고해보세요.';
  document.getElementById('resultItems').innerHTML =
    '<div class="result-item"><div class="result-item-label">퍼스널 컬러</div><div class="result-item-value">가을 웜톤</div></div>' +
    '<div class="result-item"><div class="result-item-label">추천 핏</div><div class="result-item-value">레귤러 핏</div></div>' +
    '<div class="result-item"><div class="result-item-label">키 컬러</div><div class="result-item-value">베이지 / 카키</div></div>';

  // Save to user
  if (currentUser) {
    currentUser.diagResult = resultType;
    localStorage.setItem('fitmate_user', JSON.stringify(currentUser));
    var users = JSON.parse(localStorage.getItem('fitmate_users')) || [];
    var idx = users.findIndex(function(u) { return u.email === currentUser.email; });
    if (idx >= 0) { users[idx] = currentUser; localStorage.setItem('fitmate_users', JSON.stringify(users)); }
  }
}
