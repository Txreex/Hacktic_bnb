import { supabase } from "../lib/supabaseClient.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { courseId, studentId, rating, comment } = req.body;
    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert([{ course_id: courseId, student_id: studentId, rating, comment }])
        .select();
      if (error) throw error;
      res.status(200).json(data[0]);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  else if (req.method === "GET") {
    const { courseId } = req.query;
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("rating, comment, student_id")
        .eq("course_id", courseId);
      if (error) throw error;
      res.status(200).json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  else if (req.method === "DELETE") {
    const { id } = req.query;
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
