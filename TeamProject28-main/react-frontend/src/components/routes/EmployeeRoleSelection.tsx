import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

// Declares the EmployeeRoleSelection component
export default function EmployeeRoleSelection() {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);

  // Fetch user role directly from Supabase
  useEffect(() => {
    const fetchRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userRole = user?.user_metadata?.role ?? null;
      setRole(userRole);
    };

    fetchRole();
  }, []);

  // Renders a role selection UI
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-lg text-center">
        <h1 className="mb-8 text-3xl font-bold text-amber-900">Select Your Role</h1>
        <div className="space-y-4">
          {/* Only show Manager button if role is manager */}
          {role === "manager" && (
            <Button
              onClick={() => navigate("/manager-dashboard")}
              className="w-full bg-amber-900 hover:bg-amber-800 text-white"
            >
              Manager
            </Button>
          )}
          <Button
            onClick={() => navigate("/change-menu")}
            className="w-full bg-amber-900 hover:bg-amber-800 text-white"
          >
            Waiter
          </Button>
          <Button
            onClick={() => navigate("/kitchen")}
            className="w-full bg-amber-900 hover:bg-amber-800 text-white"
          >
            Kitchen Staff
          </Button>
          <Button
            onClick={() => navigate("/update-name")}
            className="w-full bg-amber-900 hover:bg-amber-800 text-white"
          >
            Update Display Name
          </Button>
        </div>
      </div>
    </div>
  );
}
