import { supabase } from "../lib/supabaseClient.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      res.status(200).json({ session: data.session, user: data.user });
    } catch (err) {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
