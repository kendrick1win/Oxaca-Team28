//Imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

// Declares the EmployeeLogin component
export default function EmployeeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handles form submission for login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents default form behavior
    setLoading(true);
    setError("");

    try {
      // Authenticates user using Supabase with email and password
      const { data, error: supabaseError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      // Throws error if login fails
      if (supabaseError) throw supabaseError;

      // Redirects to role selection page if login succeeds
      if (data.user) {
        navigate("/employee-role");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Invalid login credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  // Renders the login form UI
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-lg"
      >
        <h1 className="mb-6 text-3xl font-bold text-center text-amber-900">
          Employee Login
        </h1>

        {/* Error message display */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {/* Email input */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-2 text-lg font-medium text-gray-900"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>

        {/* Password input */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-lg font-medium text-gray-900"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
          />
        </div>

        {/* Sign in button */}
        <Button
          type="submit"
          className="w-full bg-amber-900 hover:bg-amber-800 text-white"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>

        {/* Sign up link removed intentionally */}
      </form>
    </div>
  );
}
