// Password toggle functionality
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        eyeIcon.textContent = '👁️';
    }
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show error state
function showError(fieldName, message) {
    const formGroup = document.getElementById(fieldName).closest('.form-group');
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

// Show success state
function showSuccess(fieldName) {
    const formGroup = document.getElementById(fieldName).closest('.form-group');
    formGroup.classList.add('success');
    formGroup.classList.remove('error');
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) errorElement.remove();
}

// Clear all errors
function clearErrors() {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('error', 'success');
        const errorElement = group.querySelector('.error-message');
        if (errorElement) errorElement.remove();
    });
}

// Form validation
function validateForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;

    let isValid = true;
    clearErrors();

    if (!email) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        showSuccess('email');
    }

    if (!password) {
        showError('password', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        isValid = false;
    } else {
        showSuccess('password');
    }

    if (!userType) {
        showError('userType', 'Please select a user type');
        isValid = false;
    } else {
        showSuccess('userType');
    }

    return isValid;
}

// API base URL
const API_BASE = "http://localhost:3000/api";

// Handle form submission
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!validateForm()) return;

    const loginBtn = document.querySelector('.login-btn');
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Login failed");

        // Save session info
        const userData = {
            email: data.user.email,
            id: data.user.id,
            role: data.user.user_metadata.role,
            session: data.session
        };

        if (remember) {
            localStorage.setItem('userData', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('userData', JSON.stringify(userData));
        }

        alert("Login successful! Redirecting to dashboard...");
        window.location.href = 'dashboard.html';

    } catch (err) {
        alert(`Login error: ${err.message}`);
    } finally {
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
    }
});

// Real-time validation
document.getElementById('email').addEventListener('blur', function() {
    const email = this.value;
    if (email && !isValidEmail(email)) showError('email', 'Please enter a valid email address');
    else if (email) showSuccess('email');
});

document.getElementById('password').addEventListener('input', function() {
    const password = this.value;
    if (password && password.length >= 6) showSuccess('password');
});

document.getElementById('userType').addEventListener('change', function() {
    if (this.value) showSuccess('userType');
});

// Social login handlers
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const provider = this.classList.contains('google-btn') ? 'Google' : 'GitHub';
        this.style.transform = 'translateY(-1px)';
        this.style.opacity = '0.8';
        setTimeout(() => {
            this.style.transform = '';
            this.style.opacity = '';
            alert(`${provider} login would be implemented here`);
        }, 200);
    });
});

// Auto-fill demo credentials
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        document.getElementById('email').value = 'demo@eduhub.com';
        document.getElementById('password').value = 'demo123';
        document.getElementById('userType').value = 'student';
        showSuccess('email');
        showSuccess('password');
        showSuccess('userType');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('email').focus();
    const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    if (userData) console.log('User already logged in');
});

const userData = {
    email: data.user.email,
    id: data.user.id,
    role: data.user.user_metadata.role,
    session: data.session
};

if (remember) {
    localStorage.setItem('userData', JSON.stringify(userData));
} else {
    sessionStorage.setItem('userData', JSON.stringify(userData));
}
