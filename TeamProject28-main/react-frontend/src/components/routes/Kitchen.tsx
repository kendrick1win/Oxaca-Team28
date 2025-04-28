"use client";

//Imports
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotification } from "@/context/NotificationContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Defines the structure of a menu item
type MenuData = {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  category: string;
  imageUrl?: string;
  isVegetarian?: boolean;
  allergens?: string;
};

// Defines the structure of an order
type Order = {
  id: number;
  name: string;
  tableNumber: number;
  orderTime: string;
  total: number;
  status: string;
  requests: string;
  orderItems: {
    id: number;
    item: MenuData;
    quantity: number;
  }[];
};

// Declares the KitchenOrders component
export default function KitchenOrders() {
  const [orders, setOrders] = useState<Order[]>([]); // Stores active kitchen orders
  const [currentTime, setCurrentTime] = useState(Date.now()); // Tracks current time for elapsed calculation
  const { addNotification } = useNotification(); // Accesses notification handler from context
  const navigate = useNavigate(); // Provides route navigation

  // Update current time every second to trigger re-render for real time tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  
  // Fetches kitchen orders on initial render
  useEffect(() => {
    fetchKitchenOrders();
  }, []);

  // Log orders whenever they change
  useEffect(() => {
    console.log("orders:", orders);
  }, [orders]);

  // Fetches orders that are "in-progress" or "confirm" status
  const fetchKitchenOrders = async () => {
    try {
      const response = await fetch("http://localhost:2860/orders/all-orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      console.log(data);

      const readyOrders = data.filter(
        (order: Order) =>
          order.status === "in-progress" || order.status === "confirm"
      );
      setOrders(readyOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Sends request to mark an order as "confirmed"
  const confirmOrderStatus = async (orderId: number) => {
    try {
      const response = await fetch(
        `http://localhost:2860/orders/confirmed/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        toast.error("Failed to mark order as confirmed");
        return;
      }

      toast.success("Order marked as confirmed");

      // Refresh the orders list
      fetchKitchenOrders();
    } catch (err) {
      console.error("Error marking order as confirmed:", err);
      toast.error("Error marking order as confirmed");
    }
  };

  // Sends request to mark an order as "ready"
  const readyOrderStatus = async (orderId: number) => {
    try {
      const response = await fetch(
        `http://localhost:2860/orders/ready/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        toast.error("Failed to mark order as ready");
        return;
      }

      toast.success("Order marked as ready");

      // Refresh the orders list
      fetchKitchenOrders();
    } catch (err) {
      console.error("Error marking order as ready:", err);
      toast.error("Error marking order as ready");
    }
  };

  // Renders kitchen dashboard UI
  return (
    <div className="mt-10">
      <div className="flex justify-center">
        <Button
          onClick={() => navigate("/employee-role")}
          size="lg"
          className="bg-amber-900 hover:bg-amber-800 text-white"
        >
          Change To Waiters Page
        </Button>
      </div>
      <h1 className="text-3xl font-bold text-amber-900 mb-6 text-center mt-7">
        Kitchen Orders
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map((order) => {
          const orderDate = new Date(order.orderTime);
          const elapsedMs = currentTime - orderDate.getTime();
          const minutesElapsed = elapsedMs / 60000;

          let timeColor = "text-green-500"; // less than 1 minute
          if (minutesElapsed >= 3) {
            timeColor = "text-red-500"; // 3 minutes or more
          } else if (minutesElapsed >= 1) {
            timeColor = "text-amber-500"; // between 1 and 3 minutes.
          }

          let elapsedStr = "";
          if (elapsedMs < 60000) {
            elapsedStr = `${Math.floor(elapsedMs / 1000)} seconds ago`;
          } else {
            const mins = Math.floor(elapsedMs / 60000);
            const secs = Math.floor((elapsedMs % 60000) / 1000);
            elapsedStr = `${mins} minute${
              mins !== 1 ? "s" : ""
            } ${secs} seconds ago`;
          }

          return (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="text-amber-900">
                  Order #{order.id}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Customer:</strong> {order.name}
                </p>
                <p>
                  <strong>Table:</strong> {order.tableNumber}
                </p>
                <p>
                  <strong>Items:</strong>
                </p>
                <ul className="ml-4">
                  {order.orderItems.map((orderItem) => (
                    <li key={orderItem.id}>
                      <strong>{orderItem.item.name}</strong> (X
                      {orderItem.quantity})
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
                <p>
                  <strong>Elapsed Time:</strong>{" "}
                  <span className={timeColor}>{elapsedStr}</span>
                </p>
                <div className="mt-4 flex gap-2 justify-center">
                  <Button
                    onClick={() => confirmOrderStatus(order.id)}
                    size="lg"
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    Confirm
                  </Button>

                  <Button
                    onClick={() => readyOrderStatus(order.id)}
                    size="lg"
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Mark as Ready
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
