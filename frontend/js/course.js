const inputBar = document.getElementById('courseSearch');
const divPush = document.getElementById('courseResults');

const getCourses = async (query = "python") => {
    try {
        const res = await fetch(`http://localhost:3000/api/search-courses?query=${query}`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const courses = await res.json();
        console.log(courses);

        // Clear previous results
        divPush.innerHTML = '';

        // Loop through courses and append to div
        courses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';
            courseCard.innerHTML = `
                <div class="course-info">
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-instructor">By ${course.instructor}</p>
                    <p class="course-description">${course.description}</p>
                    <button class="course-btn">View Course</button>
                </div>
            `;
            divPush.appendChild(courseCard);
        });

    } catch (err) {
        console.error("Fetch error:", err);
    }
};

// Call getCourses whenever the input changes
inputBar.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length > 0) {
        getCourses(query);
    } else {
        divPush.innerHTML = ''; // clear results if input is empty
    }
});
