import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import serverless from "serverless-http";

dotenv.config();

const app = express();

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
app.post("/api/signup", async (req, res) => {
  const { email, password, role, name } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role, name } },
    });
    if (error) throw error;
    res.json({ user: data.user, message: "Signup successful" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    res.json({ session: data.session, user: data.user });
  } catch {
    res.status(401).json({ error: "Invalid email or password" });
  }
});

/* ================================
   PROFILES
   ================================ */
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

app.get("/api/profiles/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", req.params.id)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

app.delete("/api/profiles/:id", async (req, res) => {
  try {
    const { error } = await supabase.from("profiles").delete().eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ================================
   COURSES
   ================================ */
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

app.get("/api/courses", async (req, res) => {
  try {
    const { data, error } = await supabase.from("courses").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/courses/:id", async (req, res) => {
  try {
    const { error } = await supabase.from("courses").delete().eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ================================
   ENROLLMENTS
   ================================ */
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

app.get("/api/enrollments/:studentId", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("enrollments")
      .select("*, courses(title, description)")
      .eq("student_id", req.params.studentId);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/enrollments/:id", async (req, res) => {
  try {
    const { error } = await supabase.from("enrollments").delete().eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ================================
   REVIEWS
   ================================ */
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

app.get("/api/reviews/:courseId", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("rating, comment, student_id")
      .eq("course_id", req.params.courseId);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/reviews/:id", async (req, res) => {
  try {
    const { error } = await supabase.from("reviews").delete().eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ================================
   Export for Vercel
   ================================ */
export default serverless(app);
