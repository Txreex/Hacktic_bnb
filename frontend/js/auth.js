// auth.js
document.addEventListener("DOMContentLoaded", () => {
  // Supabase client (make sure the CDN script is loaded first)
  const supabaseUrl = "https://ebtwbgbkvimfdvolbyaa.supabase.co";
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVidHdiZ2JrdmltZmR2b2xieWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjczNjUsImV4cCI6MjA3Mjc0MzM2NX0.WW_LpmgYwYbY2gt8deNifqxsKmylfhMzlroKlvZY4lU";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

  // DOM elements
  const msg = document.getElementById("message");
  const authContainer = document.getElementById("auth-container");
  const welcomeContainer = document.getElementById("welcome-container");
  const welcomeMsg = document.getElementById("welcome-msg");
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const logoutBtn = document.getElementById("logout");

  // Signup
  async function handleSignUp() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      msg.textContent = "❌ " + error.message;
      return;
    }

    msg.textContent = "✅ Check your email to confirm signup!";
  }

  // Login
  async function handleLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      msg.textContent = "❌ " + error.message;
      return;
    }

    msg.textContent = "✅ Logged in!";

    // Create profile if not exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (!existingProfile) {
      const { error: profileError } = await supabase.from("profiles").insert([
        { id: data.user.id, role: "student", name: email }
      ]);
      if (profileError) msg.textContent = "❌ Profile creation error: " + profileError.message;
    }

    showWelcome(data.user.email);
  }

  // Logout
  async function handleLogout() {
    await supabase.auth.signOut();
    showAuth();
  }

  // Show welcome screen
  function showWelcome(email) {
    authContainer.style.display = "none";
    welcomeContainer.style.display = "block";
    welcomeMsg.textContent = "Welcome, " + email;
  }

  // Show login/signup screen
  function showAuth() {
    authContainer.style.display = "block";
    welcomeContainer.style.display = "none";
    msg.textContent = "";
  }

  // Auto-login if already signed in
  (async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      showWelcome(user.email);
    }
  })();

  // Attach event listeners
  loginBtn.addEventListener("click", handleLogin);
  signupBtn.addEventListener("click", handleSignUp);
  logoutBtn.addEventListener("click", handleLogout);
});
