import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://ebtwbgbkvimfdvolbyaa.supabase.co",
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVidHdiZ2JrdmltZmR2b2xieWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjczNjUsImV4cCI6MjA3Mjc0MzM2NX0.WW_LpmgYwYbY2gt8deNifqxsKmylfhMzlroKlvZY4lU
);
