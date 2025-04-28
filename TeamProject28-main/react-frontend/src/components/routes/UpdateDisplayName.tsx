import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function UpdateDisplayName() {
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Load current name from session metadata on mount
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      const name = data?.user?.user_metadata?.full_name;
      if (name) setDisplayName(name);
    };

    loadUser();
  }, []);

  // Handle submission of updated name to Supabase
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Update user metadata with new display name
    const { error } = await supabase.auth.updateUser({
      data: { full_name: displayName },
    });

    // Show feedback based on success or failure
    if (error) {
      setMessage("Failed to update display name. Please try again.");
    } else {
      setMessage("Display name updated successfully.");
      setTimeout(() => navigate("/employee-role"), 1500);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      {/* Display name update form */}
      <form
        onSubmit={handleUpdate}
        className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-lg"
      >
        <h1 className="mb-6 text-2xl font-bold text-center text-amber-900">
          Update Display Name
        </h1>

        {/* Feedback message */}
        {message && (
          <p className="mb-4 text-center text-sm text-gray-700">{message}</p>
        )}

        {/* Input field for new display name */}
        <label htmlFor="displayName" className="block text-sm font-medium mb-2">
          New Display Name
        </label>
        <Input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter your name"
          required
          disabled={loading}
        />

        {/* Submit button */}
        <Button
          type="submit"
          className="mt-6 w-full bg-amber-900 hover:bg-amber-800 text-white"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Name"}
        </Button>
      </form>
    </div>
  );
}
