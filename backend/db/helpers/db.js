import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ebtwbgbkvimfdvolbyaa.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVidHdiZ2JrdmltZmR2b2xieWFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzE2NzM2NSwiZXhwIjoyMDcyNzQzMzY1fQ.OTIt48WKSmG5Wm3ui1TvSKgHJRzWg67lHNFaagq3ehI";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ================================s
   PROFILES (students & educators)
   ================================ */

// Add profile
export async function addProfile(id, role, name, bio = "") {
  const { data, error } = await supabase
    .from("profiles")
    .insert([{ id, role, name, bio }])
    .select();
  if (error) throw error;
  return data[0];
}

// Get a profile by id
export async function getProfile(id) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

// Remove a profile
export async function removeProfile(id) {
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) throw error;
  return true;
}

/* ================================
   COURSES
   ================================ */

// Add course
export async function addCourse(title, description, educatorId) {
  const { data, error } = await supabase
    .from("courses")
    .insert([{ title, description, educator_id: educatorId }])
    .select();
  if (error) throw error;
  return data[0];
}

// Get all courses
export async function getCourses() {
  const { data, error } = await supabase.from("courses").select("*");
  if (error) throw error;
  return data;
}

// Remove a course
export async function removeCourse(courseId) {
  const { error } = await supabase.from("courses").delete().eq("id", courseId);
  if (error) throw error;
  return true;
}

/* ================================
   ENROLLMENTS
   ================================ */

// Enroll a student in a course
export async function enrollStudent(studentId, courseId) {
  const { data, error } = await supabase
    .from("enrollments")
    .insert([{ student_id: studentId, course_id: courseId }])
    .select();
  if (error) throw error;
  return data[0];
}

// Get all enrollments for a student
export async function getStudentEnrollments(studentId) {
  const { data, error } = await supabase
    .from("enrollments")
    .select("*, courses(title, description)")
    .eq("student_id", studentId);
  if (error) throw error;
  return data;
}

// Remove enrollment
export async function removeEnrollment(enrollmentId) {
  const { error } = await supabase.from("enrollments").delete().eq("id", enrollmentId);
  if (error) throw error;
  return true;
}

/* ================================
   REVIEWS
   ================================ */

// Add a review
export async function addReview(courseId, studentId, rating, comment = "") {
  const { data, error } = await supabase
    .from("reviews")
    .insert([{ course_id: courseId, student_id: studentId, rating, comment }])
    .select();
  if (error) throw error;
  return data[0];
}

// Get reviews for a course
export async function getCourseReviews(courseId) {
  const { data, error } = await supabase
    .from("reviews")
    .select("rating, comment, student_id")
    .eq("course_id", courseId);
  if (error) throw error;
  return data;
}

// Remove review
export async function removeReview(reviewId) {
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
  if (error) throw error;
  return true;
}
