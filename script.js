// 로그인 페이지로 이동하는 함수
function goToLogin() {
    window.location.href = 'login.html';
}

// 회원가입 페이지로 이동하는 함수
function goToSignup() {
    window.location.href = 'signup.html';
}

// 회원가입 폼 제출 시 동작하는 함수
function handleSignup(event) {
    event.preventDefault(); // 페이지가 새로고침 되는 기본 제출 동작 방지

    // 입력된 항목 값 가져오기
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    // 비밀번호 확인 검사
    if (password !== passwordConfirm) {
        alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
        return;
    }

    // 데이터를 저장할 객체 구성
    const userData = {
        name: name,
        email: email,
        password: password
    };

    // LocalStorage에서 기존 사용자 목록을 가져와서 새 사용자를 추가
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(userData);

    // 변경된 목록을 문자열로 변환하여 LocalStorage에 다시 저장
    localStorage.setItem('users', JSON.stringify(users));

    alert(name + "님 환영합니다! 회원가입이 완료되었습니다.\n로그인 페이지로 이동합니다.");
    window.location.href = 'login.html'; // 가입 후 로그인 페이지로 이동
}

// 로그인 폼 제출 시 동작하는 함수
function handleLogin(event) {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    // 이메일과 비밀번호가 모두 일치하는 유저 데이터 찾기
    const foundUser = users.find(user => user.email === email && user.password === password);

    if (foundUser) {
        // 로그인 성공: 현재 로그인된 유저 정보를 식별하기 위한 데이터 셋팅
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        alert("로그인에 성공했습니다!");
        window.location.href = 'dashboard.html'; // 완성 시 전환될 화면
    } else {
        // 로그인 실패
        alert("이메일이나 비밀번호가 올바르지 않거나 가입되어 있지 않습니다.");
    }
}
