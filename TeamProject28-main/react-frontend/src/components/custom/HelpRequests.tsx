//Imports
import { useHelpRequest } from "../../context/HelpRequestContext";
import { Button } from "@/components/ui/button";

export default function HelpRequests() {
  // Access help requests and the function to resolve them from the context
  const { requests, resolveRequest } = useHelpRequest();

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <h1 className="mb-6 text-4xl font-extrabold text-amber-900">
        Customer Help Requests
      </h1>
      {requests.length > 0 ? (
        <div className="grid gap-4">
          {/* Sort requests by ID (oldest first) before mapping */}
          {requests
            .slice() // Create a copy of the array to avoid mutating state
            .sort((a, b) => a.id - b.id) // Sort by ID (oldest first)
            .map((request) => (
              <div
                key={request.id}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow"
              >
                <div>
                  <p className="text-lg font-semibold">
                    Table {request.tableNumber} - {request.name}
                  </p>
                  <p className="text-gray-600">Requested at {request.time}</p>
                </div>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => resolveRequest(request.id)}
                >
                  Mark as Resolved
                </Button>
              </div>
            ))}
        </div>
      ) : (
        <p className="text-lg text-gray-600">No active help requests.</p>
      )}
    </div>
  );
}
