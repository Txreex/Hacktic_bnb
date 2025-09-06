document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('courseSearch');

    // Search when Enter is pressed
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchCourses();
        }
    });

    // Optional: load all courses initially
    searchCourses('');
});

async function searchCourses(query = '') {
    query = query || document.getElementById('courseSearch').value.trim();

    try {
        const response = await fetch(`http://localhost:3000/api/search-courses?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const courses = await response.json();

        const courseResults = document.getElementById('courseResults');
        courseResults.innerHTML = ''; // clear previous results

        if (!courses || courses.length === 0) {
            courseResults.innerHTML = '<p>No courses found.</p>';
            return;
        }

        courses.forEach(course => {
            const card = document.createElement('div');
            card.className = 'course-card';
            card.innerHTML = `
                <div class="course-info">
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-instructor">By ${course.profiles?.name || 'Unknown'}</p>
                    <p class="course-description">${course.description}</p>
                    <button class="course-btn">View Course</button>
                </div>
            `;
            courseResults.appendChild(card);
        });

    } catch (err) {
        console.error('Failed to fetch search results:', err);
    }
}
