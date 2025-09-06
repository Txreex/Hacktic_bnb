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

// Form validation
function validateForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;
    
    let isValid = true;
    
    // Clear previous errors
    clearErrors();
    
    // Email validation
    if (!email) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        showSuccess('email');
    }
    
    // Password validation
    if (!password) {
        showError('password', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        isValid = false;
    } else {
        showSuccess('password');
    }
    
    // User type validation
    if (!userType) {
        showError('userType', 'Please select a user type');
        isValid = false;
    } else {
        showSuccess('userType');
    }
    
    return isValid;
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
    
    // Create or update error message
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
    
    // Remove error message if exists
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Clear all errors
function clearErrors() {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('error', 'success');
        const errorElement = group.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    });
}

// Handle form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
        const loginBtn = document.querySelector('.login-btn');
        
        // Show loading state
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        
        // Simulate login process
        setTimeout(() => {
            // Get form data
            const email = document.getElementById('email').value;
            const userType = document.getElementById('userType').value;
            const remember = document.getElementById('remember').checked;
            
            // Store user data (in real app, this would be handled by backend)
            const userData = {
                email: email,
                userType: userType,
                loginTime: new Date().toISOString()
            };
            
            if (remember) {
                localStorage.setItem('userData', JSON.stringify(userData));
            } else {
                sessionStorage.setItem('userData', JSON.stringify(userData));
            }
            
            // Remove loading state
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
            
        }, 2000); // Simulate 2 second loading
    }
});

// Real-time validation
document.getElementById('email').addEventListener('blur', function() {
    const email = this.value;
    if (email && !isValidEmail(email)) {
        showError('email', 'Please enter a valid email address');
    } else if (email) {
        showSuccess('email');
    }
});

document.getElementById('password').addEventListener('input', function() {
    const password = this.value;
    if (password && password.length >= 6) {
        showSuccess('password');
    }
});

document.getElementById('userType').addEventListener('change', function() {
    if (this.value) {
        showSuccess('userType');
    }
});

// Social login handlers
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const provider = this.classList.contains('google-btn') ? 'Google' : 'GitHub';
        
        // Add loading effect
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
        
        // Show success states
        showSuccess('email');
        showSuccess('password');
        showSuccess('userType');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Focus on email field
    document.getElementById('email').focus();
    
    // Check if user is already logged in
    const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    if (userData) {
        // Optional: Auto-redirect or show "already logged in" message
        console.log('User already logged in');
    }
});