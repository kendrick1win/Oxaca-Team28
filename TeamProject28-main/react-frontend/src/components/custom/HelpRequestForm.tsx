//Imports
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpRequestForm() {
  const [name, setName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [requestText, setRequestText] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!name || !tableNumber || !requestText) {
      setMessage("Please fill in all required fields.");
      return;
    }

    // Prepare the payload for the server
    const payload = {
      name: name,
      tableNumber: parseInt(tableNumber),
      request: requestText
      // status and requestTime can be handled by the backend if you prefer
    };

    try {
      // IMPORTANT: Update the URL to match your controller’s @PostMapping("/add") endpoint
      const response = await fetch("http://localhost:2860/requests/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setMessage("Help request sent! A waiter will be with you shortly.");
        // Clear the form fields on success
        setName("");
        setTableNumber("");
        setRequestText("");
      } else {
        setMessage("Failed to send help request.");
      }
    } catch (error) {
      console.error("Error sending help request:", error);
      setMessage("Error sending help request.");
    }
  };

  return (
    <div className="w-full max-w-md p-4">
      <h1 className="text-3xl font-bold text-center text-amber-900 mb-6">
        Request Help
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
                htmlFor="name"
                className="block text-lg font-semibold text-gray-700"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
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
                htmlFor="tableNumber"
                className="block text-lg font-semibold text-gray-700"
              >
                Table Number
              </label>
              <input
                type="number"
                id="tableNumber"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                required
                className="mt-2 px-4 py-2 border border-gray-300 rounded-lg w-full"
                placeholder="Enter your table number"
              />
            </div>

            {/* Request Field */}
            <div>
              <label
                htmlFor="request"
                className="block text-lg font-semibold text-gray-700"
              >
                Request
              </label>
              <textarea
                id="request"
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                required
                className="mt-2 px-4 py-2 border border-gray-300 rounded-lg w-full"
                placeholder="Describe your request in detail"
              />
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Submit Request
              </Button>
            </div>
          </form>

          {/* Confirmation / Error Message */}
          {message && (
            <div className="mt-4 p-4 bg-green-200 text-green-800 border border-green-400 rounded-md">
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
