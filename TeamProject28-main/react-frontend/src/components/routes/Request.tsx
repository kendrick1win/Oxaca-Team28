//Imports
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNotification } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

// Defines the shape of a request object
type Request = {
  id: number;
  name: string;
  tableNumber: number;
  request: string;
  requestTime: number;
  status: string;
  displayTime?: number;
  frozenTime?: number;
};

// Declares the Requests component
export default function Requests() {
  const [requests, setRequests] = useState<Request[]>([]);   // Manages the state of all fetched requests
  const [error, setError] = useState<string | null>(null);   // Stores any error messages during fetch or operations
  const [editRequestId, setEditRequestId] = useState<number | null>(null);  // Stores the ID of a request being edited
  const [newRequestText, setNewRequestText] = useState<string>("");  // Stores the input value for the edited request text
  const [currentTime, setCurrentTime] = useState(Date.now());  // Stores the input value for the edited request text
  const navigate = useNavigate();

  const { notifications, clearNotifications } = useNotification();

  // Updates currentTime every second to reflect real-time timers
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetches requests once on initial component mount
  useEffect(() => {
    fetchRequests();
  }, []);

  // Displays notifications via toast and clears them
  useEffect(() => {
    if (notifications.length > 0) {
      notifications.forEach((notif) => toast(notif.message));
      clearNotifications();
    }
  }, [notifications]); // Removed `clearNotifications` to prevent unnecessary re-renders

  // Fetches all help requests from the server
  async function fetchRequests() {
    try {
      const response = await fetch("http://localhost:2860/requests/all-requests");
      if (!response.ok) {
        throw new Error("Failed to fetch requests.");
      }
      const data: Request[] = await response.json();
      const now = Date.now();
      setRequests(data.map((req) => ({ ...req, displayTime: now })));
      setError(null);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Error fetching requests.");
    }
  }

  // Formats milliseconds into hh:mm:ss
  function formatElapsedTime(elapsedMs: number) {
    const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  // Sends a PUT request to mark a help request as solved
  async function handleConfirm(requestId: number) {
    try {
      const response = await fetch(`http://localhost:2860/requests/mark-solved/${requestId}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to mark as solved.");
      }

      toast.success(`Request #${requestId} marked as solved!`);

      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? { ...req, status: "Solved", frozenTime: req.displayTime ? currentTime - req.displayTime : 0 }
            : req
        )
      );
    } catch (error) {
      console.error("Error marking request as solved:", error);
      toast.error("Error marking request as solved.");
    }
  }

  // Sends a DELETE request to remove a help request
  async function removeRequest(requestId: number) {
    try {
      const response = await fetch(`http://localhost:2860/requests/${requestId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove request.");
      }

      toast.success(`Request #${requestId} removed!`);
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error("Error removing request:", error);
      toast.error("Error removing request.");
    }
  }

  // Enables editing mode for a given request
  function startEdit(request: Request) {
    setEditRequestId(request.id);
    setNewRequestText(request.request);
  }

  // Saves the edited request by sending a PUT request to the server
  async function saveEdit() {
    if (!editRequestId) return;
    try {
      const updatedRequest = { request: newRequestText };
      const response = await fetch(`http://localhost:2860/requests/${editRequestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRequest),
      });

      if (!response.ok) {
        throw new Error("Failed to update request.");
      }

      toast.success(`Request #${editRequestId} updated!`);
      setRequests((prev) =>
        prev.map((req) => (req.id === editRequestId ? { ...req, request: newRequestText } : req))
      );
      setEditRequestId(null);
      setNewRequestText("");
    } catch (err) {
      console.error("Error updating request:", err);
      toast.error("Error updating request.");
    }
  }

  // Renders the component UI
  return (
    <>
      <div className="container mx-auto px-4 py-10 bg-white min-h-screen">
        <div className="flex justify-center mb-6 space-x-4">
          <Button onClick={() => navigate("/change-menu")} size="lg" className="bg-amber-900 text-white">
            Change Menu
          </Button>
          <Button onClick={() => navigate("/orders")} size="lg" className="bg-amber-900 text-white">
            Orders
          </Button>
          <Button onClick={() => navigate("/requests")} className="bg-red-600 text-white flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            View Help Requests
          </Button>
        </div>

        <h1 className="text-3xl font-bold text-amber-900 mb-6">Requests</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {requests.map((request) => {
          const elapsed =
            request.status === "Solved" && request.frozenTime !== undefined
              ? request.frozenTime
              : request.displayTime
              ? currentTime - request.displayTime
              : 0;

          return (
            <div key={request.id} className="border border-gray-200 rounded-md p-4 mb-4 shadow-sm w-full max-w-xl">
              <h2 className="text-xl font-bold mb-2 text-amber-900">Request #{request.id}</h2>
              <ul className="mb-4">
                <li><strong>Name:</strong> {request.name}</li>
                <li><strong>Table #:</strong> {request.tableNumber}</li>
                <li><strong>Request:</strong> {request.request}</li>
                <li><strong>Timer:</strong> {formatElapsedTime(elapsed)}</li>
                <li><strong>Status:</strong> {request.status}</li>
              </ul>

              {editRequestId === request.id ? (
                <div className="mb-4">
                  <label className="block mb-1 font-semibold text-gray-700">Edit Request:</label>
                  <input
                    type="text"
                    value={newRequestText}
                    onChange={(e) => setNewRequestText(e.target.value)}
                    className="border p-2 rounded w-full mb-2"
                  />
                  <Button onClick={saveEdit} className="mr-2 bg-amber-900 text-white">Save</Button>
                  <Button onClick={() => setEditRequestId(null)} className="bg-gray-400">Cancel</Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={() => startEdit(request)} className="bg-amber-500 text-white">Edit</Button>
                  {request.status !== "Solved" && (
                    <Button onClick={() => handleConfirm(request.id)} className="bg-amber-900 text-white">
                      Mark as Solved
                    </Button>
                  )}
                  <Button onClick={() => removeRequest(request.id)} className="bg-red-600 text-white">Remove</Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <ToastContainer position="bottom-center" autoClose={6000} />
    </>
  );
}
