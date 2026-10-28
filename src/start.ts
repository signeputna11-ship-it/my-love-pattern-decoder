import { createStart } from "@tanstack/react-start";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

// Sends the signed-in user's bearer token with every server function call.
// Without this, functions behind requireSupabaseAuth answer 401.
export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
}));
