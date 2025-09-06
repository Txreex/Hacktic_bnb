import {
  addCourse,
  getCourses,
  removeCourse,
  addProfile,
  getProfile,
  enrollStudent,
  getStudentEnrollments,
  addReview,
  getCourseReviews
} from "./helpers/db.js";

async function runDemo() {
  try {
    // Example UUIDs (replace with real ones from Supabase)
    const educatorId = "cfb3d86d-1baf-4f13-94ce-1f8f1fa4e6d2";
    const studentId = "db28f47e-8fc7-4c2e-b31d-b0c4f8f5c9ee";

    // Add a course
    const newCourse = await addCourse("Physics 101", "Basics of Mechanics", educatorId);
    console.log("✅ Added course:", newCourse);

    // Get all courses
    const courses = await getCourses();
    console.log("📚 Courses:", courses);

    // Enroll a student
    const enrollment = await enrollStudent(studentId, newCourse.id);
    console.log("✅ Enrolled student:", enrollment);

    // Get student enrollments
    const studentEnrollments = await getStudentEnrollments(studentId);
    console.log("🎓 Student's courses:", studentEnrollments);

    // Add a review
    const review = await addReview(newCourse.id, studentId, 5, "Great course!");
    console.log("⭐ Review added:", review);

    // Get course reviews
    const reviews = await getCourseReviews(newCourse.id);
    console.log("💬 Course reviews:", reviews);

    // Remove the course (cleanup)
    await removeCourse(newCourse.id);
    console.log("🗑️ Course removed");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

runDemo();
