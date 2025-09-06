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
