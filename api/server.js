import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Supabase client
const supabase = createClient(
  "https://ebtwbgbkvimfdvolbyaa.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVidHdiZ2JrdmltZmR2b2xieWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjczNjUsImV4cCI6MjA3Mjc0MzM2NX0.WW_LpmgYwYbY2gt8deNifqxsKmylfhMzlroKlvZY4lU"
);

/* ================================
   AUTHENTICATION
   ================================ */

// Signup
// Signup
app.post("/api/signup", async (req, res) => {
  const { email, password, role, name } = req.body;

  try {
    // Step 1: Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role, name }
      }
    });

    if (error) throw error;

    const user = data.user;

    // Step 2: Insert into profiles
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: user.id, email, name, role }]);

    if (profileError) {
      console.error("Profile insert error:", profileError);
      return res
        .status(400)
        .json({ error: "Failed to insert profile", details: profileError });
    }

    res.json({ user, message: "Signup successful + profile created" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).json({ error: err.message });
  }
});


// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    res.json({ session: data.session, user: data.user });
  } catch (err) {
    res.status(401).json({ error: "Invalid email or password" });
  }
});

/* ================================
   PROFILES
   ================================ */

// Add profile
app.post("/api/profiles", async (req, res) => {
  const { id, role, name, email, bio } = req.body;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert([{ id, role, name, email, bio }])
      .select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get profile by id
app.get("/api/profiles/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Delete profile
app.delete("/api/profiles/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ================================
   COURSES
   ================================ */

// Add course
app.post("/api/courses", async (req, res) => {
  const { title, description, educatorId } = req.body;
  try {
    const { data, error } = await supabase
      .from("courses")
      .insert([{ title, description, educator_id: educatorId }])
      .select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all courses
app.get("/api/courses", async (req, res) => {
  try {
    const { data, error } = await supabase.from("courses").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete course
app.delete("/api/courses/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ================================
   ENROLLMENTS
   ================================ */

// Enroll student
app.post("/api/enrollments", async (req, res) => {
  const { studentId, courseId } = req.body;
  try {
    const { data, error } = await supabase
      .from("enrollments")
      .insert([{ student_id: studentId, course_id: courseId }])
      .select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get student enrollments
app.get("/api/enrollments/:studentId", async (req, res) => {
  const { studentId } = req.params;
  try {
    const { data, error } = await supabase
      .from("enrollments")
      .select("*, courses(title, description)")
      .eq("student_id", studentId);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove enrollment
app.delete("/api/enrollments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from("enrollments").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ================================
   REVIEWS
   ================================ */

// Add review
app.post("/api/reviews", async (req, res) => {
  const { courseId, studentId, rating, comment } = req.body;
  try {
    const { data, error } = await supabase
      .from("reviews")
      .insert([{ course_id: courseId, student_id: studentId, rating, comment }])
      .select();
    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get course reviews
app.get("/api/reviews/:courseId", async (req, res) => {
  const { courseId } = req.params;
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("rating, comment, student_id")
      .eq("course_id", courseId);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete review
app.delete("/api/reviews/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ================================
   Start server
   ================================ */

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});




// Search courses by query (title or description) and include educator info
app.get("/api/search-courses", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const { data, error } = await supabase
      .from("courses")
      .select(`
        id,
        title,
        description,
        educator_id,
        profiles (id, name, email, role)
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
