import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "bandleider" | "user";

export function useUserRole() {
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      setRoles((data?.map(r => r.role) || []) as AppRole[]);
      setLoading(false);
    };
    fetch();
  }, []);

  const canWrite = roles.includes("admin") || roles.includes("bandleider");

  return { roles, canWrite, loading };
}
