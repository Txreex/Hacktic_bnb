import { supabase } from "../lib/supabaseClient.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { title, description, educatorId } = req.body;
    try {
      const { data, error } = await supabase
        .from("courses")
        .insert([{ title, description, educator_id: educatorId }])
        .select();
      if (error) throw error;
      res.status(200).json(data[0]);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  else if (req.method === "GET") {
    try {
      const { data, error } = await supabase.from("courses").select("*");
      if (error) throw error;
      res.status(200).json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  else if (req.method === "DELETE") {
    const { id } = req.query;
    try {
      const { error } = await supabase.from("courses").delete().eq("id", id);
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
