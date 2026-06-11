/* ══════════════════════════════════════════
   FITMATE — Booking
   Handles booking form submissions
   ══════════════════════════════════════════ */

// ── Landing CTA Booking Form ──
function handleBooking(e) {
  e.preventDefault();
  var booking = {
    id: Date.now(),
    name: document.getElementById('bookName').value,
    phone: document.getElementById('bookPhone').value,
    email: document.getElementById('bookEmail').value,
    service: document.getElementById('bookService').value,
    note: document.getElementById('bookNote').value,
    status: 'pending',
    date: new Date().toISOString()
  };
  bookings.push(booking);
  localStorage.setItem('fitmate_bookings', JSON.stringify(bookings));
  document.getElementById('bookingForm').style.display = 'none';
  document.getElementById('bookSuccess').style.display = 'block';
  showToast('예약이 완료되었습니다!');
}

// ── Dedicated Booking Page Form ──
function handleBookingPage(e) {
  e.preventDefault();
  var booking = {
    id: Date.now(),
    name: document.getElementById('bpName').value,
    phone: document.getElementById('bpPhone').value,
    email: document.getElementById('bpEmail').value,
    service: document.getElementById('bpService').value,
    preferDate: document.getElementById('bpDate').value,
    note: document.getElementById('bpNote').value,
    status: 'pending',
    date: new Date().toISOString()
  };
  bookings.push(booking);
  localStorage.setItem('fitmate_bookings', JSON.stringify(bookings));
  document.getElementById('bpSuccess').style.display = 'block';
  e.target.style.display = 'none';
  showToast('예약이 완료되었습니다!');
}
