// auth.js - Supabase Authentication
document.addEventListener("DOMContentLoaded", () => {
  (async () => {
    try {
      console.log("🔄 Auth.js starting...");

      const supabaseUrl = "https://ebtwbgbkvimfdvolbyaa.supabase.co";
      const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVidHdiZ2JrdmltZmR2b2xieWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjczNjUsImV4cCI6MjA3Mjc0MzM2NX0.WW_LpmgYwYbY2gt8deNifqxsKmylfhMzlroKlvZY4lU";

      if (!window.supabase) {
        console.error("❌ Supabase library not loaded");
        return;
      }

      const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
      console.log("✅ Supabase client created");

      // DOM elements
      const msg = document.getElementById("message");
      const authContainer = document.getElementById("auth-container");
      const welcomeContainer = document.getElementById("welcome-container");
      const welcomeMsg = document.getElementById("welcome-msg");
      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");
      const loginBtn = document.getElementById("loginBtn");
      const signupBtn = document.getElementById("signupBtn");
      const logoutBtn = document.getElementById("logout");

      function showMessage(text, type = "info") {
        if (!msg) return;
        msg.textContent = text;
        msg.className = type; // CSS: success, error, loading
        console.log(`📢 ${text}`);
      }

      function setButtonsDisabled(disabled) {
        if (loginBtn) loginBtn.disabled = disabled;
        if (signupBtn) signupBtn.disabled = disabled;
      }

      function validateInputs() {
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
          showMessage("❌ Please fill in both email and password", "error");
          return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          showMessage("❌ Please enter a valid email", "error");
          return false;
        }

        if (password.length < 6) {
          showMessage("❌ Password must be at least 6 characters", "error");
          return false;
        }

        return { email, password };
      }

      // Create profile if not exists
      async function createUserProfile(user) {
        try {
          const { data: existingProfile, error: fetchError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (fetchError && fetchError.code !== "PGRST116") {
            console.error("❌ Error fetching profile:", fetchError);
            return;
          }

          if (!existingProfile) {
            const { error: profileError } = await supabase.from("profiles").insert([
              { id: user.id, role: "student", name: user.email.split("@")[0] }
            ]);
            if (profileError) console.error("❌ Profile creation error:", profileError);
            else console.log("✅ Profile created");
          } else {
            console.log("✅ Profile already exists");
          }
        } catch (err) {
          console.error("❌ Profile creation exception:", err);
        }
      }

      async function handleSignUp() {
        try {
          const inputs = validateInputs();
          if (!inputs) return;

          const { email, password } = inputs;
          setButtonsDisabled(true);
          showMessage("🔄 Signing up...", "loading");

          const { data, error } = await supabase.auth.signUp({ email, password });
          console.log("Signup response:", { data, error });

          if (error) {
            showMessage("❌ " + error.message, "error");
            return;
          }

          showMessage("✅ Signup successful! You can now log in.", "success");
          clearForm();
        } catch (err) {
          console.error("❌ Signup exception:", err);
          showMessage("❌ Error: " + err.message, "error");
        } finally {
          setButtonsDisabled(false);
        }
      }

      async function handleLogin() {
        try {
          const inputs = validateInputs();
          if (!inputs) return;

          const { email, password } = inputs;
          setButtonsDisabled(true);
          showMessage("🔄 Logging in...", "loading");

          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          console.log("Login response:", { data, error });

          if (error) {
            showMessage("❌ " + error.message, "error");
            return;
          }

          if (data.user) {
            showMessage("✅ Logged in successfully!", "success");
            await createUserProfile(data.user);
            showWelcome(data.user.email);
          } else {
            showMessage("❌ Login failed", "error");
          }
        } catch (err) {
          console.error("❌ Login exception:", err);
          showMessage("❌ Error: " + err.message, "error");
        } finally {
          setButtonsDisabled(false);
        }
      }

      async function handleLogout() {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) showMessage("❌ Logout failed: " + error.message, "error");
          else showAuth();
        } catch (err) {
          console.error("❌ Logout exception:", err);
          showMessage("❌ Error: " + err.message, "error");
        }
      }

      function showWelcome(email) {
        authContainer.style.display = "none";
        welcomeContainer.style.display = "block";
        welcomeMsg.textContent = `Welcome, ${email}!`;
        clearForm();
      }

      function showAuth() {
        authContainer.style.display = "block";
        welcomeContainer.style.display = "none";
        showMessage("");
      }

      function clearForm() {
        emailInput.value = "";
        passwordInput.value = "";
      }

      // Auto-login
      const { data: { user } } = await supabase.auth.getUser();
      if (user) showWelcome(user.email);

      // Auth state listener
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          createUserProfile(session.user);
          showWelcome(session.user.email);
        } else if (event === "SIGNED_OUT") {
          showAuth();
        }
      });

      // Event listeners
      loginBtn.addEventListener("click", handleLogin);
      signupBtn.addEventListener("click", handleSignUp);
      logoutBtn.addEventListener("click", handleLogout);

      // Enter key triggers login
      [emailInput, passwordInput].forEach(input => {
        input.addEventListener("keypress", e => {
          if (e.key === "Enter") handleLogin();
        });
      });

      console.log("✅ Auth.js initialized successfully");
    } catch (error) {
      console.error("❌ Fatal error in auth.js:", error);
      const msgElement = document.getElementById("message");
      if (msgElement) {
        msgElement.textContent = "❌ Authentication system failed. Check console.";
        msgElement.className = "error";
      }
    }
  })();
});
