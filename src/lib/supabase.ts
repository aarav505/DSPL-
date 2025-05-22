
import { createClient } from '@supabase/supabase-js';

// Use the values from the connected Supabase project
export const supabase = createClient(
  "https://gmeciakrvqiilfluctgk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtZWNpYWtydnFpaWxmbHVjdGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MjgyNTIsImV4cCI6MjA2MzQwNDI1Mn0.B4El0nrJhySOiWJvitTTqCJPgP-5xqBIb1F2eMkk6uw"
);
