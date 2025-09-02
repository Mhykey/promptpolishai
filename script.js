// Detect current page
const currentPage = window.location.pathname.split("/").pop();

// ----------------------
// SUPABASE INIT
// ----------------------
const { createClient } = supabase;
const SUPABASE_URL = "https://uzrmqlmgdvdezvonqyoq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6cm1xbG1nZHZkZXp2b25xeW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MjkyODksImV4cCI6MjA3MjAwNTI4OX0.8f9FKe-FbkU3RqeSxJk9uHc3ooqSivsyezmayUxlQyY";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ----------------------
// AUTH STATE HANDLER
// ----------------------
async function updateNavbar() {
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  if (!loginBtn || !logoutBtn) return;

  const { data: { user } } = await supabaseClient.auth.getUser();
  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
  } else {
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
  }
}

// Auth state listener for dynamic updates
supabaseClient.auth.onAuthStateChange((event, session) => {
  updateNavbar();
});

// Call on load as well
document.addEventListener("DOMContentLoaded", updateNavbar);

// ----------------------
// COMMON NAVBAR HANDLERS
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  const navbarLoginBtn = document.getElementById("login-btn");
  if (navbarLoginBtn) {
    navbarLoginBtn.addEventListener("click", () => {
      showToast(" Redirecting to Login/Signup page...", { type: "info", icon: true });
      window.location.href = "login.html";
    });
  }

  const navbarLogoutBtn = document.getElementById("logout-btn");
  if (navbarLogoutBtn) {
    navbarLogoutBtn.addEventListener("click", async () => {
      await supabaseClient.auth.signOut();
      showToast(" Logged out successfully!", { type: "success", icon: true });
      updateNavbar();
      window.location.href = "index.html";
    });
  }
});

// ----------------------
// INDEX / HOME PAGE LOGIC
// ----------------------
if (currentPage === "index.html" || currentPage === "") {
  const inputPrompt = document.getElementById("input-prompt");
  const styleSelect = document.getElementById("style-select");
  const generateBtn = document.getElementById("generate-btn");
  const polishedText = document.getElementById("polished-text");
  const copyBtn = document.getElementById("copy-btn");
  const historyDiv = document.getElementById("history");
  const subscribeBtn = document.getElementById("subscribe-btn");

  let history = [];
  let usedCount = parseInt(localStorage.getItem("freeUsedCount") || "0");
  const FREE_LIMIT = 3;

  async function enablePremiumOptions() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (user) {
      const options = styleSelect.options;
      for (let opt of options) {
        if (opt.disabled) opt.disabled = false;
      }
    }
  }
  enablePremiumOptions();

  if (generateBtn) {
    generateBtn.addEventListener("click", async () => {
      const prompt = inputPrompt.value.trim();
      const style = styleSelect.value;

      if (!prompt) {
        showToast(" Please enter a prompt first.", { type: "error", icon: true });
        return;
      }

      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user && usedCount >= FREE_LIMIT) {
        showToast(" Free limit reached. Redirecting to login...", { type: "error", icon: true });
        window.location.href = "login.html";
        return;
      }

      polishedText.classList.remove("show");
      polishedText.textContent = "Polishing…";

      try {
        const res = await fetch("https://promptbackend.onrender.com/api/refine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: prompt,
            tone: style,
            userType: ["persuasive", "concise", "creative"].includes(style) ? "paid" : "free"
          })
        });

        const data = await res.json();

        if (!res.ok || data.error) {
          polishedText.textContent = data.error || "Error polishing prompt.";
          return;
        }

        if (!user) {
          usedCount++;
          localStorage.setItem("freeUsedCount", usedCount);
        }

        polishedText.textContent = data.refined;
        setTimeout(() => polishedText.classList.add("show"), 50);

        history.unshift(data.refined);
        updateHistory();

        subscribeBtn.style.display = (!user && ["persuasive", "concise", "creative"].includes(style))
          ? "block"
          : "none";

      } catch (err) {
        polishedText.textContent = "Network error. Is the backend running?";
        console.error(err);
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const text = polishedText.textContent;
      if (!text) {
        showToast(" Nothing to copy yet!", { type: "error", icon: true });
        return;
      }
      navigator.clipboard.writeText(text).then(() => {
        showToast(" Prompt copied to clipboard!", { type: "success", icon: true });
      });
    });
  }

  function updateHistory() {
    historyDiv.innerHTML = "<h3>History:</h3>";
    history.forEach((item, index) => {
      const p = document.createElement("p");
      p.textContent = `${index + 1}. ${item}`;
      historyDiv.appendChild(p);
    });
  }
}

// ----------------------
// ABOUT PAGE LOGIC
// ----------------------
if (currentPage === "about.html") {
  const ctaBtn = document.querySelector(".cta button");
  if (ctaBtn) {
    ctaBtn.addEventListener("click", () => {
      showToast(" Taking you to Pricing to get started...", { type: "info", icon: true });
      window.location.href = "pricing.html";
    });
  }
}

// ----------------------
// CONTACT PAGE LOGIC
// ----------------------
if (currentPage === "contact.html") {
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        showToast(" Please fill in all fields.", { type: "error", icon: true });
        return;
      }

      // Simulate sending delay so it feels real
      showToast("Sending your message...", { type: "success", icon: true });

      setTimeout(() => {
        // Pretend it was sent successfully
        window.location.href = "thankyou.html";
      }, 1200); // 1.2 seconds delay
    });
  }
}


// ----------------------
// LOGIN / SIGNUP PAGE LOGIC
// ----------------------
if (currentPage === "login.html") {
  document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById("auth-form-element");
    if (authForm) {
      authForm.addEventListener("submit", (e) => e.preventDefault());
    }

    const signupBtn = document.getElementById("auth-signup-btn");
    const loginBtn = document.getElementById("auth-login-btn");

    if (signupBtn) {
      signupBtn.addEventListener("click", async () => {
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
          showToast(" Please fill in email and password.", { type: "error", icon: true });
          return;
        }

        const { error } = await supabaseClient.auth.signUp({ email, password });
        if (error) {
          showToast("Signup failed: " + error.message, { type: "error", icon: true });
        } else {
          showToast(" Signup successful! Please check your email to confirm.", { type: "success", icon: true });
        }
      });
    }

    if (loginBtn) {
      loginBtn.addEventListener("click", async () => {
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!email || !password) {
          showToast(" Please fill in email and password.", { type: "error", icon: true });
          return;
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) {
          showToast("Login failed: " + error.message, { type: "error", icon: true });
        } else {
          showToast(" Welcome back, " + email + "!", { type: "success", icon: true });
          // Delay to ensure session persistence
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1000);
        }
      });
    }
  });
}

// ----------------------
// Reusable toast
// ----------------------
function showToast(message, { type = 'success', duration = 3000, icon = false } = {}) {
  const el = document.getElementById('toast');
  if (!el) return;

  const iconHtml = icon
    ? `<span class="toast__icon">${type === 'success' ? '✓' : type === 'error' ? '!' : ''}</span>`
    : '';

  el.className = `toast toast--${type}`;
  el.innerHTML = `
    ${iconHtml}
    <span class="toast__msg">${message}</span>
    <button class="toast__close" aria-label="Close">&times;</button>
  `;

  requestAnimationFrame(() => el.classList.add('show'));

  const close = () => el.classList.remove('show');
  el.querySelector('.toast__close')?.addEventListener('click', close, { once: true });

  clearTimeout(el._timer);
  el._timer = setTimeout(close, duration);
}

