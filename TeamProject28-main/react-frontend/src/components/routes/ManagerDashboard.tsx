//Imports
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Defines the shape of a help request object
interface Request {
  id: number;
  request: string;
  status: string;
}

// Defines the shape of each table's data
interface TableData {
  tableNumber: number;
  customerName: string;
  orderStatus: string;
  requests: Request[];
}

// Defines the shape of a stock item
interface StockItem {
  itemId: number;
  name: string;
  available: boolean;
}

// Declares the ManagerDashboard component
const ManagerDashboard: React.FC = () => {
  const [tables, setTables] = useState<TableData[]>([]);
  const [stock, setStock] = useState<StockItem[]>([]);
  const navigate = useNavigate();

  // Fetches dashboard data when component mounts and on a 10-second interval
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:2860/api/dashboard");
        const data = await res.json();
        setTables(data.tables || []);
        setStock((data.stock || []).sort((a: StockItem, b: StockItem) => a.itemId - b.itemId));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboard();
    const interval = setInterval(fetchDashboard, 10000);  // Sets interval to refresh dashboard data every 10 seconds
    return () => clearInterval(interval);  // Clears interval when component unmounts
  }, []);

  
  // Renders the dashboard layout
  return (
    <div className="p-6 space-y-10 animate-fadeIn">
      {/* Manage Menu Button */}
      <div>
        <Button
          className="bg-amber-900 hover:bg-amber-800 text-white mr-4"
          onClick={() => navigate("/change-menu")}
        >
          Manage Menu
        </Button>

        {/* Add Employee Button */}
        <Button
          className="bg-amber-900 hover:bg-amber-800 text-white"
          onClick={() => navigate("/employee-signup?from=manager-dashboard")}
        >
          Add New Employee
        </Button>
      </div>

      {/* Table Overview */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Table Overview</h1>
        {tables.length === 0 ? (
          <p className="text-gray-500">No table data found.</p>
        ) : (
          tables.map((table) => (
            <Card key={table.tableNumber} className="mb-4">
              <CardHeader>
                <CardTitle>
                  Table {table.tableNumber} - {table.customerName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">
                  <span className="px-2 py-1 text-sm font-medium bg-gray-200 text-gray-700 rounded">
                    {table.orderStatus}
                  </span>
                </p>
                {table.requests.length > 0 ? (
                  <div>
                    <p className="font-semibold mb-1">Outstanding Requests:</p>
                    <ul className="list-disc list-inside text-sm">
                      {table.requests.map((req) => (
                        <li key={req.id}>{req.request}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No outstanding requests
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Stock Overview */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Stock Status</h1>
        {stock.length === 0 ? (
          <p className="text-gray-500">No stock data found.</p>
        ) : (
          stock.map((item) => (
            <Card key={item.itemId} className="mb-3">
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span>Status:</span>
                {item.available ? (
                  <span className="text-green-600 text-lg">✅</span>
                ) : (
                  <span className="text-red-600 text-lg">❌</span>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
