import { supabase } from "../lib/supabaseClient.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id, role, name, email, bio } = req.body;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert([{ id, role, name, email, bio }])
        .select();
      if (error) throw error;
      res.status(200).json(data[0]);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  else if (req.method === "GET") {
    const { id } = req.query;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      res.status(200).json(data);
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  else if (req.method === "DELETE") {
    const { id } = req.query;
    try {
      const { error } = await supabase.from("profiles").delete().eq("id", id);
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
