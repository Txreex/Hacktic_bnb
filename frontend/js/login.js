document.addEventListener("DOMContentLoaded", () => {
  if (!window.supabase) {
    console.error("Supabase library not loaded yet");
    return;
  }

  const supabaseUrl = "https://YOUR_SUPABASE_URL";
  const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";
  const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const message = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "Logging in...";
    const email = emailInput.value;
    const password = passwordInput.value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      message.textContent = `Error: ${error.message}`;
      message.style.color = "red";
    } else {
      message.textContent = "Login successful!";
      message.style.color = "green";
      window.location.href = "dashboard.html";
    }
  });
});
