//Imports
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TrackOrderFormProps = {
  onSubmit: (name: string, tableNumber: string) => void;
};

// Defines props expected by TrackOrderForm
export default function TrackOrderForm({ onSubmit }: TrackOrderFormProps) {
  const [name, setName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [message, setMessage] = useState("");

  // Handles form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !tableNumber) {
      setMessage("Please fill in both fields.");
      return;
    }

    // Pass these values back up to the parent
    onSubmit(name, tableNumber);

    // Clear the form
    setName("");
    setTableNumber("");
    setMessage("");
  };

  // Renders the form UI
  return (
    <div className="w-full max-w-md p-4">
      <h1 className="text-3xl font-bold text-center text-amber-900 mb-6">
        Order Tracking
      </h1>

      <Card className="mx-auto max-w-3xl shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl text-amber-900">
            Enter Your Information
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="trackName"
                className="block text-lg font-semibold text-gray-700"
              >
                Your Name
              </label>
              <input
                type="text"
                id="trackName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2 px-4 py-2 border border-gray-300 rounded-lg w-full"
                placeholder="Enter your name"
              />
            </div>

            {/* Table Number Field */}
            <div>
              <label
                htmlFor="trackTableNumber"
                className="block text-lg font-semibold text-gray-700"
              >
                Table Number
              </label>
              <input
                type="number"
                id="trackTableNumber"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                required
                className="mt-2 px-4 py-2 border border-gray-300 rounded-lg w-full"
                placeholder="Enter your table number"
              />
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Track
              </Button>
            </div>
          </form>

          {/* Message */}
          {message && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded-md">
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
