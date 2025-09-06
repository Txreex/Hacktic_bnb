
// --------------------------
// USER NAVBAR
// --------------------------
const divProfile = document.getElementById("userMenu");

// Get current user from localStorage (saved after login/signup)
const currentUser = JSON.parse(localStorage.getItem("user")); // { id: 'user-id' }

async function fetchUserProfile(userId) {
  try {
    const res = await fetch(`http://localhost:3000/api/profiles/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch profile");
    const profile = await res.json();
    return profile;
  } catch (err) {
    console.error("Error fetching profile:", err);
    return null;
  }
}

// Update Navbar
async function updateNavbar() {
  if (!currentUser) {
    divProfile.innerHTML = `
      <a href="#" class="btn btn-primary" onclick="showPage('login')">Login</a>
      <a href="#" class="btn" onclick="showPage('signup')">Sign Up</a>
    `;
    return;
  }

  const profile = await fetchUserProfile(currentUser.id);
  if (!profile) return;

  divProfile.innerHTML = `
    <span style="margin-right: 1rem;">Hello, ${profile.name}</span>
    <button class="btn" onclick="logoutUser()">Logout</button>
  `;
}

// Logout
function logoutUser() {
  localStorage.removeItem("user");
  location.reload(); // reload to reset navbar
}

// --------------------------
// PAGE SWITCHING
// --------------------------
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll(".page").forEach((page) => {
    page.style.display = "none";
  });

  // Show the requested page
  const target = document.getElementById(pageId);
  if (target) {
    target.style.display = "block";
  }

  // Focus search if opening courses
  if (pageId === "courses") {
    const searchInput = document.getElementById("courseSearch");
    if (searchInput) searchInput.focus();
  }
}

// --------------------------
// COURSE SEARCH
// --------------------------
async function searchCourses() {
  const query = document.getElementById("courseSearch").value.trim();
  const resultsDiv = document.getElementById("courseResults");

  if (!query) {
    resultsDiv.innerHTML = "<p>Start typing to search for courses...</p>";
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:3000/api/courses?search=${encodeURIComponent(query)}`
    );
    if (!res.ok) throw new Error("Failed to fetch courses");

    const courses = await res.json();
    if (courses.length === 0) {
      resultsDiv.innerHTML = "<p>No courses found.</p>";
      return;
    }

    resultsDiv.innerHTML = courses
      .map(
        (c) => `
        <div class="course-card">
          <h3>${c.title}</h3>
          <p>${c.description}</p>
        </div>
      `
      )
      .join("");
  } catch (err) {
    console.error("Error searching courses:", err);
    resultsDiv.innerHTML = "<p>Error loading courses. Try again later.</p>";
  }
}

// --------------------------
// BROWSE COURSES TOGGLE
// --------------------------
document.addEventListener("DOMContentLoaded", () => {
  const browseBtn = document.getElementById("browseBtn");
  const navSearch = document.getElementById("navSearch");

  if (browseBtn && navSearch) {
    browseBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (navSearch.style.display === "none") {
        navSearch.style.display = "block"; // show input
        document.getElementById("navCourseSearch").focus();
      } else {
        navSearch.style.display = "none"; // hide input
      }
    });
  }
});

// --------------------------
// INITIALIZE
// --------------------------
updateNavbar();
showPage("home"); // default

// Expose functions globally so inline onclick works
window.showPage = showPage;
window.logoutUser = logoutUser;
window.searchCourses = searchCourses;
const searchInput = document.getElementById("courseSearch");
const searchResults = document.getElementById("searchResults");

searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (query.length === 0) {
        searchResults.innerHTML = ""; // clear when empty
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/api/search-courses?query=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Failed to fetch courses");

        const courses = await res.json();

        // Render results
        searchResults.innerHTML = courses.map(course => `
            <div class="course-card">
                <div class="course-header">
                    <div class="course-title">${course.title}</div>
                    <div class="course-instructor">by ${course.profiles?.name || "Unknown"}</div>
                </div>
                <div class="course-body">
                    <p>${course.description}</p>
                    <button class="btn btn-primary" style="margin-top: 1rem; width: 100%;">Enroll Now</button>
                </div>
            </div>
        `).join("");
    } catch (err) {
        console.error("❌ Search error:", err);
        searchResults.innerHTML = `<p style="color:red;">Failed to load courses.</p>`;
    }
});


// Retrieve user data from localStorage or sessionStorage
const storedData = localStorage.getItem('userData') || sessionStorage.getItem('userData');

if (storedData) {
    const user = JSON.parse(storedData);
    const userId = user.id;
    console.log("Current user ID: ", userId);

    // Now you can use userId in API requests or for page personalization
    // Example: fetch user-specific courses
    fetch(`http://localhost:3000/api/user-courses?userId=${userId}`)
        .then(res => res.json())
        .then(data => console.log(data));
} else {
    console.log("User not logged in");
}

document.addEventListener('DOMContentLoaded', () => {
  const userMenu = document.getElementById('userMenu');
  const profileDropdown = document.getElementById('profileDropdown');

  // Toggle dropdown on click
  userMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.style.display =
      profileDropdown.style.display === 'block' ? 'none' : 'block';
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    profileDropdown.style.display = 'none';
  });
});
