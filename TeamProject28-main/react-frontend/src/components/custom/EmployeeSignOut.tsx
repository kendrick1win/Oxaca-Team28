//Imports
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function EmployeeSignOut() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate("/"); // Redirect to login after logout
    }
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-6 text-center">
        <h1 className="mb-6 text-3xl font-bold text-amber-900">
          Logging Out...
        </h1>
        <p className="mb-6 text-gray-600">You're being securely signed out.</p>

        {/* Fallback button in case auto-logout fails */}
        <Button
          onClick={handleLogout}
          className="bg-amber-900 hover:bg-amber-800 text-white"
        >
          Click here if not redirected
        </Button>
      </div>
    </div>
  );
}
