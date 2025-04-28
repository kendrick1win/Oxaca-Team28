import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Hook to get user and role from metadata
export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data } = await supabase.auth.getUser();
      const userRole = data?.user?.user_metadata?.role;
      setRole(userRole || null);
      setLoading(false);
    };

    fetchUserRole();
  }, []);

  return { role, loading };
}
