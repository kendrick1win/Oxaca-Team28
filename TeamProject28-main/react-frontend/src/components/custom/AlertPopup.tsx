import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface AlertPopupProps {
  onSubmit: (tableNumber: string) => void;
  onClose: () => void;
}

// Declares the Alertpopup component
export default function AlertPopup({ onSubmit, onClose }: AlertPopupProps) {
  const [tableNumber, setTableNumber] = useState("");

  const handleSubmit = () => {
    onSubmit(tableNumber);
  };

  return (
    // Full-screen fixed container with semi-transparent backdrop.
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 border rounded shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Enter Table Number</h2>
        <input
          type="text"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          placeholder="Table Number"
          className="p-2 border rounded w-full mb-4"
        />
        <div className="flex gap-2 justify-end">
          <Button onClick={handleSubmit}>Submit</Button>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
