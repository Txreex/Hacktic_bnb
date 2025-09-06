// signup.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const userType = document.getElementById("userType");
  const terms = document.getElementById("terms");

  const strengthBar = document.getElementById("strengthBar");
  const strengthText = document.getElementById("strengthText");

  // Utility: show error
  function setError(input, message) {
    const group = input.closest(".form-group");
    group.classList.add("error");
    group.classList.remove("success");
    group.querySelector(".error-message").textContent = message;
  }

  // Utility: show success
  function setSuccess(input) {
    const group = input.closest(".form-group");
    group.classList.remove("error");
    group.classList.add("success");
  }

  // Password strength checker
  function checkPasswordStrength(pwd) {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    strengthBar.className = "strength-bar"; // reset

    switch (strength) {
      case 0:
      case 1:
        strengthBar.classList.add("weak");
        strengthText.textContent = "Weak";
        break;
      case 2:
        strengthBar.classList.add("fair");
        strengthText.textContent = "Fair";
        break;
      case 3:
        strengthBar.classList.add("good");
        strengthText.textContent = "Good";
        break;
      case 4:
        strengthBar.classList.add("strong");
        strengthText.textContent = "Strong";
        break;
    }
  }

  password.addEventListener("input", (e) => {
    checkPasswordStrength(e.target.value);
  });

  // Toggle password visibility
  window.togglePassword = function (id) {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
  };

  // Validate email
  function isValidEmail(mail) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  }

  // Submit handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    if (fullName.value.trim() === "") {
      setError(fullName, "Please enter your full name");
      isValid = false;
    } else {
      setSuccess(fullName);
    }

    if (!isValidEmail(email.value.trim())) {
      setError(email, "Please enter a valid email address");
      isValid = false;
    } else {
      setSuccess(email);
    }

    if (password.value.length < 8) {
      setError(password, "Password must be at least 8 characters");
      isValid = false;
    } else {
      setSuccess(password);
    }

    if (confirmPassword.value !== password.value || confirmPassword.value === "") {
      setError(confirmPassword, "Passwords do not match");
      isValid = false;
    } else {
      setSuccess(confirmPassword);
    }

    if (userType.value === "") {
      setError(userType, "Please select your role");
      isValid = false;
    } else {
      setSuccess(userType);
    }

    if (!terms.checked) {
      alert("You must agree to the Terms of Service and Privacy Policy");
      isValid = false;
    }

    if (isValid) {
      // Save user to localStorage (demo only)
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const exists = users.find((u) => u.email === email.value.trim());
      if (exists) {
        alert("User with this email already exists!");
        return;
      }

      users.push({
        name: fullName.value.trim(),
        email: email.value.trim(),
        password: password.value, // In real apps, NEVER store plain password!
        role: userType.value,
      });

      localStorage.setItem("users", JSON.stringify(users));

      alert("Signup successful! Redirecting to login...");
      window.location.href = "login.html";
    }
  });
});
