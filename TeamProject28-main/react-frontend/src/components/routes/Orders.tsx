import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNotification } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

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

type Order = {
  id: number;
  name: string;
  tableNumber: number;
  orderTime: string;
  total: number;
  status: string;
  requests: string;
  payment: string;
  orderItems: {
    id: number;
    item: MenuData;
    quantity: number;
  }[];
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [progressOrders, setProgressOrders] = useState<Order[]>([]);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [readyOrders, setReadyOrders] = useState<Order[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<Order[]>([]);

  const [menuItems, setMenuItems] = useState<MenuData[]>([]);

  // Get notifications and clear function from global context.
  const { notifications, clearNotifications } = useNotification();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"food" | "drinks">(
    "food"
  );
  const [selectedItem, setSelectedItem] = useState<MenuData | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Log orders whenever it changes
  useEffect(() => {
    console.log("orders:", orders);
  }, [orders]);
  // Log orders whenever it changes
  useEffect(() => {
    console.log("In-progress:", progressOrders);
  }, [progressOrders]);
  // Log orders whenever it changes
  useEffect(() => {
    console.log("Customer placed:", customerOrders);
  }, []);

  // When the Orders page mounts, display all notifications and then clear them.
  useEffect(() => {
    if (notifications.length > 0) {
      notifications.forEach((notif) => {
        toast(notif.message);
      });
      clearNotifications();
    }
  }, [notifications, clearNotifications]);

  async function fetchOrders() {
    try {
      const response = await fetch("http://localhost:2860/orders/all-orders");
      if (!response.ok) {
        setError("Failed to fetch orders.");
        return;
      }
      const data = await response.json();
      console.log(data);

      const progressOrders = data.filter(
        (order: Order) => order.status === "in-progress"
      );

      const customerOrders = data.filter(
        (order: Order) => order.status === "pending"
      );

      const readyOrders = data.filter(
        (order: Order) => order.status === "ready"
      );

      const deliveredOrders = data.filter(
        (order: Order) => order.status === "delivered"
      );

      setProgressOrders(progressOrders);
      setCustomerOrders(customerOrders);
      setReadyOrders(readyOrders);
      setDeliveredOrders(deliveredOrders);

      setOrders(data);
      setError(null);
      console.log("orders: " + orders);
      //console.log("orders name: " + orders.name);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Error fetching orders.");
    }
  }
  async function handleConfirm(orderId: number) {
    try {
      const response = await fetch(
        `http://localhost:2860/orders/in-progress/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        toast.error("Failed to mark order as In-Progress");
        return;
      }

      toast.success("Order marked as In-Progress");

      // Refresh the orders list
      fetchOrders();
    } catch (err) {
      console.error("Error marking order as ready:", err);
      toast.error("Error marking order as ready");
    }
  }

  async function deliveredOrderStatus(orderId: number) {
    try {
      const response = await fetch(
        `http://localhost:2860/orders/delivered/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        toast.error("Failed to mark order as Delivered");
        return;
      }

      toast.success("Order marked as Delivered");

      // Refresh the orders list
      fetchOrders();
    } catch (err) {
      console.error("Error marking order as ready:", err);
      toast.error("Error marking order as ready");
    }
  }

  async function cancelOrder(orderId: number) {
    try {
      const response = await fetch(
        `http://localhost:2860/orders/cancel/${orderId}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        toast.error("Failed to cancel order.");
        return;
      }

      toast.success(`Order #${orderId} canceled successfully.`);
      fetchOrders();
    } catch (err) {
      console.error("Error canceling order:", err);
      toast.error("Error canceling order.");
    }
  }

  function startEdit(order: Order) {
    setEditOrder(order);
    setIsEditModalOpen(true);
  }

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/items/all`
        );
        if (!response.ok) throw new Error("Failed to fetch menu items");

        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    }
    fetchMenuItems();
  }, []);

  async function addItemToOrder() {
    if (!editOrder || !selectedItem || quantity <= 0) return;

    // Add the selected item to the current order
    const updatedOrder = {
      ...editOrder,
      orderItems: [
        ...editOrder.orderItems,
        { id: Date.now(), item: selectedItem, quantity },
      ],
    };

    // Optimistically update the state
    setOrders((prevOrders) =>
      prevOrders.map((o) => (o.id === editOrder.id ? updatedOrder : o))
    );

    // Reset the form fields
    setSelectedItem(null);
    setQuantity(1);

    // Send the updated order to the backend
    try {
      const response = await fetch(
        `http://localhost:2860/orders/update/${editOrder.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedOrder), // Send the updated order
        }
      );

      if (!response.ok) {
        toast.error("Failed to update the order.");
        return;
      }

      toast.success("Item added to order successfully.");
      fetchOrders(); // Refresh the orders list to reflect the updated order
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Error updating the order.");
    }
  }

  return (
    <>
      <div className="container mx-auto px-4 py-10 bg-white min-h-screen">
        <div className="flex justify-center mb-6 space-x-4">
          <Button
            onClick={() => navigate("/change-menu")}
            size="lg"
            className="bg-amber-900 hover:bg-amber-800 text-white"
          >
            Change Menu
          </Button>
          <Button
            onClick={() => navigate("/orders")}
            size="lg"
            className="bg-amber-900 hover:bg-amber-800 text-white"
          >
            Orders
          </Button>
          <Button
            onClick={() => navigate("/employee-role")}
            size="lg"
            className="bg-amber-900 hover:bg-amber-800 text-white"
          >
            Change To Kitchen Page
          </Button>
          <Button
            onClick={() => navigate("/requests")}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center"
          >
            <Bell className="h-5 w-5 mr-2" />
            View Help Requests
          </Button>
        </div>

        <h1 className="text-3xl font-bold text-amber-900 mb-6 text-center">
          Waiter Orders
        </h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Display message if there are no orders */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 divide-x divide-gray-200 [&>div]:px-4 shadow-sm">
          {orders.length === 0 && (
            <p className="text-gray-500">No orders available.</p>
          )}

          {/* Customer Placed Orders Column */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-amber-900 mb-6">
              (Customer Placed)
            </h1>
            {customerOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-md p-4 mb-4 shadow-sm w-full max-w-xl"
              >
                <h2 className="text-xl font-bold mb-2 text-amber-900">
                  Order #{order.id}
                </h2>
                <div className="mb-2">
                  <strong>Name:</strong> {order.name}
                </div>
                <div className="mb-2">
                  <strong>Table Number:</strong> {order.tableNumber}
                </div>
                <div className="mb-2">
                  <strong>Special Requests:</strong>{" "}
                  {order.requests || "No special requests"}
                </div>
                <div className="mb-2">
                  <strong>Status:</strong>{" "}
                  {order.status || "No special requests"}
                </div>
                <div className="mb-2">
                  <strong>Payment: </strong>{order.payment}
                </div>
                <ul className="mb-4">
                  {order.orderItems.map((orderItem) => (
                    <li
                      key={orderItem.id}
                      className="border-b pb-2 flex justify-between"
                    >
                      <div>
                        <strong>{orderItem.item.name}</strong> (x
                        {orderItem.quantity})
                      </div>
                      <div>
                        £
                        {(orderItem.item.price * orderItem.quantity).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => startEdit(order)}
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleConfirm(order.id)}
                    className="bg-green-500 hover:bg-green-700 text-white"
                  >
                    Confirm
                  </Button>
                  <Button
                    onClick={() => cancelOrder(order.id)}
                    className="bg-red-500 hover:bg-red-700 text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-amber-900 mb-6">
              (In-Progress)
            </h1>
            {orders.length === 0 && (
              <p className="text-gray-500">No orders available.</p>
            )}

            {progressOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-md p-4 mb-4 shadow-sm w-full max-w-xl"
              >
                <h2 className="text-xl font-bold mb-2 text-amber-900">
                  Order #{order.id}
                </h2>
                <div className="mb-2">
                  <strong>Name:</strong> {order.name}
                </div>
                <div className="mb-2">
                  <strong>Table Number:</strong> {order.tableNumber}
                </div>
                <div className="mb-2">
                  <strong>Special Requests:</strong>{" "}
                  {order.requests || "No special requests"}
                </div>
                <div className="mb-2">
                  <strong>Status:</strong>{" "}
                  {order.status || "No special requests"}
                </div>
                <div className="mb-2">
                  <strong>Payment: </strong>{order.payment}
                </div>
                <ul className="mb-4">
                  {order.orderItems.map((orderItem) => (
                    <li
                      key={orderItem.id}
                      className="border-b pb-2 flex justify-between"
                    >
                      <div>
                        <strong>{orderItem.item.name}</strong> (x
                        {orderItem.quantity})
                      </div>
                      <div>
                        £
                        {(orderItem.item.price * orderItem.quantity).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-amber-900 mb-6">(Ready)</h1>
            {orders.length === 0 && (
              <p className="text-gray-500">No orders available.</p>
            )}

            {readyOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-md p-4 mb-4 shadow-sm w-full max-w-xl"
              >
                <h2 className="text-xl font-bold mb-2 text-amber-900">
                  Order #{order.id}
                </h2>
                <div className="mb-2">
                  <strong>Name:</strong> {order.name}
                </div>
                <div className="mb-2">
                  <strong>Table Number:</strong> {order.tableNumber}
                </div>
                <div className="mb-2">
                  <strong>Special Requests:</strong>{" "}
                  {order.requests || "No special requests"}
                </div>
                <div className="mb-2">
                  <strong>Status:</strong>{" "}
                  {order.status || "No special requests"}
                </div>
                <div className="mb-2">
                  <strong>Payment: </strong>{order.payment}
                </div>
                <ul className="mb-4">
                  {order.orderItems.map((orderItem) => (
                    <li
                      key={orderItem.id}
                      className="border-b pb-2 flex justify-between"
                    >
                      <div>
                        <strong>{orderItem.item.name}</strong> (x
                        {orderItem.quantity})
                      </div>
                      <div>
                        £
                        {(orderItem.item.price * orderItem.quantity).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-2 justify-center">
                  <Button
                    onClick={() => deliveredOrderStatus(order.id)}
                    size="lg"
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Mark as Delivered
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-amber-900 mb-6">
              (Delivered)
            </h1>
            {orders.length === 0 && (
              <p className="text-gray-500">No orders available.</p>
            )}

            {deliveredOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-md p-4 mb-4 shadow-sm w-full max-w-xl"
              >
                <h2 className="text-xl font-bold mb-2 text-amber-900">
                  Order #{order.id}
                </h2>
                <div className="mb-2">
                  <strong>Name:</strong> {order.name}
                </div>
                <div className="mb-2">
                  <strong>Table Number:</strong> {order.tableNumber}
                </div>
                <div className="mb-2">
                  <strong>Special Requests:</strong>{" "}
                  {order.requests || "No special requests"}
                </div>
                <div className="mb-2">
                  <strong>Status:</strong>{" "}
                  {order.status || "No special requests"}
                </div>
                <div className="mb-2">
                  <strong>Payment: </strong>{order.payment}
                </div>
                <ul className="mb-4">
                  {order.orderItems.map((orderItem) => (
                    <li
                      key={orderItem.id}
                      className="border-b pb-2 flex justify-between"
                    >
                      <div>
                        <strong>{orderItem.item.name}</strong> (x
                        {orderItem.quantity})
                      </div>
                      <div>
                        £
                        {(orderItem.item.price * orderItem.quantity).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>
              Modify food and drink items in the order.
            </DialogDescription>
          </DialogHeader>

          <div className="flex space-x-2 mb-2">
            <Button
              onClick={() => setSelectedCategory("food")}
              className="bg-amber-900 hover:bg-amber-800 text-white"
            >
              Food
            </Button>
            <Button
              onClick={() => setSelectedCategory("drinks")}
              className="bg-amber-900 hover:bg-amber-800 text-white"
            >
              Drinks
            </Button>
          </div>

          <Select
            onChange={(e) =>
              setSelectedItem(
                menuItems.find((item) => item.name === e.target.value) || null
              )
            }
          >
            {menuItems
              .filter((item) => item.category === selectedCategory)
              .map((item) => (
                <SelectItem key={item.id} value={item.name}>
                  {item.name} (£{item.price.toFixed(2)})
                </SelectItem>
              ))}
          </Select>

          <Input
            type="number"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
          <Button
            onClick={addItemToOrder}
            className="bg-green-500 hover:bg-green-700 text-white"
          >
            Add to Order
          </Button>
        </DialogContent>
      </Dialog>
      <ToastContainer position="bottom-center" autoClose={6000} />
    </>
  );
}
