//Imports
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";

// Declares the EmployeeSignUp component
export default function EmployeeSignUp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [error, setError] = useState("");

  // Handles the sign-up form submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      const params = new URLSearchParams(location.search);
      const redirectPath =
        params.get("from") === "manager-dashboard"
          ? "/manager-dashboard"
          : "/employee-login";

      navigate(redirectPath);
    }
  };

  // Renders the sign-up form
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form
        onSubmit={handleSignUp}
        className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-lg"
      >
        <h1 className="mb-6 text-3xl font-bold text-center text-amber-900">
          Create Employee Account
        </h1>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <Button
          type="submit"
          className="w-full bg-amber-900 hover:bg-amber-800 text-white"
        >
          Sign Up
        </Button>
      </form>
    </div>
  );
}
