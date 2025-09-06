import { supabase } from "../lib/supabaseClient.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, role, name } = req.body;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role, name } }
      });

      if (error) throw error;
      res.status(200).json({ user: data.user, message: "Signup successful" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
