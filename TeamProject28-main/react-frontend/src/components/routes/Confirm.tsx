import { useState } from "react";
import { useOrder } from "../../context/OrderContext";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Confirm() {
  const navigate = useNavigate();
  // Destructure necessary functions and data from OrderContext
  const { order, clearOrder, increaseQuantity, decreaseQuantity, removeItem } =
    useOrder();

  // Local state for name, table number, and requests
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [requests, setRequests] = useState("");

  // Calculate subtotal, tax, and total
  const subtotal = order.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleConfirmOrder = async () => {
    if (!customerName || !tableNumber) {
      alert("Please fill in your name and table number");
      return;
    }

    try {
      // First add all items to the order
      for (const item of order) {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/orders/add?itemId=${
            item.id
          }&quantity=${item.quantity}`,
          {
            method: "POST",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to add items to order");
        }
      }

      // Then place the order with query parameters instead of JSON body
      const placeOrderUrl = new URL(
        `${import.meta.env.VITE_API_BASE_URL}/orders/place`
      );
      placeOrderUrl.searchParams.append("customerName", customerName);
      placeOrderUrl.searchParams.append("tableNumber", tableNumber);
      placeOrderUrl.searchParams.append("requests", requests);

      const response = await fetch(placeOrderUrl, {
        method: "POST",
      });

      if (response.ok) {
        clearOrder();
        alert("Order placed successfully!");
        setCustomerName("");
        setTableNumber("");
        setRequests("");
        navigate("/order-confirmation");
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-amber-900">
        Your Order
      </h1>

      {order.length === 0 ? (
        <p className="text-center mt-4">No items in your order.</p>
      ) : (
        <Card className="mt-6 p-6 shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl text-amber-900">
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Customer Details */}
              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold mb-2">Customer Info</h3>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="border p-2 rounded w-full"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-gray-700">
                    Table Number
                  </label>
                  <input
                    type="number"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="border p-2 rounded w-full"
                    placeholder="Enter your table number"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-gray-700">
                    Requests
                  </label>
                  <textarea
                    value={requests}
                    onChange={(e) => setRequests(e.target.value)}
                    rows={3}
                    className="border p-2 rounded w-full"
                    placeholder="Enter any special requests..."
                  />
                </div>
              </div>

              {/* Order Items List */}
              {order.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between p-4 border-b last:border-none"
                >
                  <div>
                    <h3 className="font-medium">
                      {item.name} (x{item.quantity})
                    </h3>
                  </div>
                  <div className="flex flex-col justify-between items-end space-y-2">
                    <p className="text-amber-900 font-semibold">
                      £{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <div className="flex space-x-1">
                      {/* Increase quantity */}
                      <Button
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => increaseQuantity(item.name)}
                      >
                        +
                      </Button>
                      {/* Decrease quantity */}
                      <Button
                        className="bg-yellow-500 hover:bg-yellow-600"
                        onClick={() => decreaseQuantity(item.name)}
                      >
                        -
                      </Button>
                      {/* Remove item */}
                      <Button
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => removeItem(item.name)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Order Summary */}
              <div className="pt-4 border-t">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>£{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Buttons for clearing and confirming order */}
              <div className="space-y-4">
                <Button
                  className="w-full bg-red-500 hover:bg-red-600"
                  onClick={clearOrder}
                >
                  Clear Order
                </Button>
                <Button
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={handleConfirmOrder}
                >
                  <Link
                    to="/order-confirmation"
                    className="text-white no-underline"
                  >
                    Confirm Order
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
