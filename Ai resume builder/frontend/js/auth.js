// Authentication Module
function checkAuthRedirect() {
    if (localStorage.getItem('token')) {
        window.location.href = 'dashboard.html';
    }
}

function checkStrength(password) {
    const bar = document.getElementById('strengthBar');
    if (!bar) return;
    if (!password) {
        bar.style.width = '0%';
        return;
    }
    if (password.length < 4) {
        bar.style.width = '25%';
        bar.style.background = '#ef4444';
    } else if (password.length < 6) {
        bar.style.width = '50%';
        bar.style.background = '#f59e0b';
    } else if (password.length < 10) {
        bar.style.width = '75%';
        bar.style.background = '#3b82f6';
    } else {
        bar.style.width = '100%';
        bar.style.background = '#10b981';
    }
}

function fillDemo() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    if (emailInput) emailInput.value = 'arjunsingh9708916@gmail.com';
    if (passwordInput) passwordInput.value = 'Arjun@303109';
}

function showAlert(msg, type = 'error') {
    const box = document.getElementById('alertBox');
    if (box) {
        box.innerHTML = `<div class="alert alert-${type === 'error' ? 'error' : 'success'}">${msg}</div>`;
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const btn = document.getElementById('loginBtn');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    btn.textContent = 'Logging in...';
    btn.disabled = true;

    try {
        const data = await API.post('/api/auth/login', { email, password });
        if (data && data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                id: data.userId,
                name: data.name,
                email: data.email
            }));
            showAlert('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 600);
        } else {
            showAlert(data.message || 'Invalid email or password. Please try again.', 'error');
            btn.textContent = 'Login to ResumeAI';
            btn.disabled = false;
        }
    } catch (e) {
        showAlert('Unable to connect to server. Please check your network and try again.', 'error');
        btn.textContent = 'Login to ResumeAI';
        btn.disabled = false;
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const btn = document.getElementById('registerBtn');
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long', 'error');
        return;
    }

    btn.textContent = 'Creating account...';
    btn.disabled = true;

    try {
        const data = await API.post('/api/auth/register', { name, email, password });
        if (data && data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                id: data.userId,
                name: data.name,
                email: data.email
            }));
            showAlert('Account created successfully! Redirecting to dashboard...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 600);
        } else {
            showAlert(data.message || 'Registration failed. Email may already be in use.', 'error');
            btn.textContent = 'Create Account';
            btn.disabled = false;
        }
    } catch (e) {
        showAlert('Unable to connect to server. Please check backend connection.', 'error');
        btn.textContent = 'Create Account';
        btn.disabled = false;
    }
}