document.addEventListener("DOMContentLoaded", () => {
  const supabaseUrl = "https://YOUR_SUPABASE_URL";
  const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";
  const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

  const form = document.getElementById("signupForm");
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const message = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "";

    if (passwordInput.value !== confirmPasswordInput.value) {
      message.textContent = "Passwords do not match!";
      message.style.color = "red";
      return;
    }

    message.textContent = "Creating account...";
    const { data, error } = await supabase.auth.signUp({
      email: emailInput.value,
      password: passwordInput.value
    });

    if (error) {
      message.textContent = `Error: ${error.message}`;
      message.style.color = "red";
    } else {
      message.textContent = "Sign up successful! Please check your email to confirm.";
      message.style.color = "green";

      // Optionally create a profile in the 'profiles' table
      await supabase.from("profiles").insert([
        { id: data.user.id, name: fullNameInput.value }
      ]);
    }
  });
});
