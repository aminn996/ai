import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

export const useActivityLogger = () => {
  const { user } = useAuth();

  const logActivity = async (actionType: string, details?: any) => {
    if (!user) return;

    try {
      await supabase.from("activity_logs").insert({
        user_id: user.id,
        action_type: actionType,
        details: details || {},
      });
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  };

  return { logActivity };
};
