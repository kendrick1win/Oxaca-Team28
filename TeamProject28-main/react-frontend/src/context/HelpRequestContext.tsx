// Imports React core utilities
import { createContext, useContext, useState, ReactNode } from "react";

// Defines the shape of a help request object
type HelpRequest = {
  id: number;
  tableNumber: number;
  time: string;
  name: string;
};

// Defines the context type for managing help requests
type HelpRequestContextType = {
  requests: HelpRequest[]; // Stores current help requests
  addRequest: (name: string, tableNumber: number) => void; // Adds a new help request
  resolveRequest: (id: number) => void; // Removes a resolved help request
};

// Creates the HelpRequest context
const HelpRequestContext = createContext<HelpRequestContextType | undefined>(
  undefined
);

// Provides the HelpRequest context to child components
export function HelpRequestProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<HelpRequest[]>([]); // Stores help requests in local state

  // Adds a new help request with time, name, and table number
  const addRequest = (name: string, tableNumber: number) => {
    const newRequest: HelpRequest = {
      id: Date.now(), // Generates a unique ID based on timestamp
      tableNumber: tableNumber,
      time: new Date().toLocaleTimeString(), // Captures the time of request
      name: name, // Adds name to the request
    };
    setRequests((prevRequests) => [...prevRequests, newRequest]); // Updates request list
  };

  // Removes a request by filtering it out using its ID
  const resolveRequest = (id: number) => {
    setRequests((prevRequests) =>
      prevRequests.filter((request) => request.id !== id)
    );
  };

  // Returns the context provider with its exposed values
  return (
    <HelpRequestContext.Provider
      value={{ requests, addRequest, resolveRequest }}
    >
      {children}
    </HelpRequestContext.Provider>
  );
}

// Defines a custom hook for accessing the HelpRequest context
export function useHelpRequest() {
  const context = useContext(HelpRequestContext);

  if (!context) {
    // Throws an error if the hook is used outside the provider
    throw new Error(
      "useHelpRequest must be used within a HelpRequestProvider"
    );
  }

  return context;
}
