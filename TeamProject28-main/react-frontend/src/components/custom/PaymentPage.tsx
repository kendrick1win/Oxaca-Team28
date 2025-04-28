//Imp[orts
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

// Defines validation schema using zod
const paymentSchema = z.object({
  orderId: z.string().nonempty("Order selection is required"),
  cardHolderName: z.string().min(2, "Name must be at least 2 characters"),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, "Card number must be exactly 16 digits"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format"),
  cvv: z.string().regex(/^\d{3}$/, "CVV must be exactly 3 digits"),
});

// Defines the type of form data inferred from the schema
type PaymentFormData = z.infer<typeof paymentSchema>;

// Declares the PaymentPage component
export default function PaymentPage() {
  // Stores the list of unpaid orders
  const [orders, setOrders] = useState<
    Array<{ id: number; name: string; tableNumber: number; total: number; payment: string }>
  >([]);

  // Initializes form methods using react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  // Fetches all orders and filters unpaid ones when the component mounts
  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("http://localhost:2860/orders/all-orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        // Filtering unpaid orders
        const unpaidOrders = data.filter(
          (order: any) => order.payment === "unpaid"
        );
        setOrders(unpaidOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
    fetchOrders();
  }, []);

  // Handles form submission and payment logic
  const onSubmit = async (data: PaymentFormData) => {
    try {
      // Mark the order as paid with endpoint
      const response = await fetch(
        `http://localhost:2860/orders/pay/${data.orderId}`,
        { method: "PUT" }
      );
      if (!response.ok) {
        throw new Error("Payment failed");
      }

      // Displays success toast and resets the form
      toast.success("Payment processed successfully and status updated!");
      reset();
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Payment failed. Please try again.");
    }
  };

  // Renders the payment form
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Payment</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="orderId">Select Order</Label>
          <select
            id="orderId"
            {...register("orderId")}
            className="mt-1 block w-full border p-2 rounded"
          >
            <option value="">Select an order</option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                Order #{order.id} - {order.name} (Table {order.tableNumber}) - Total: £{order.total.toFixed(2)}
              </option>
            ))}
          </select>
          {errors.orderId && (
            <p className="text-red-500 text-sm">{errors.orderId.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="cardHolderName">Card Holder Name</Label>
          <Input
            id="cardHolderName"
            placeholder="Name on card"
            {...register("cardHolderName")}
          />
          {errors.cardHolderName && (
            <p className="text-red-500 text-sm">
              {errors.cardHolderName.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="16-digit card number"
            {...register("cardNumber")}
          />
          {errors.cardNumber && (
            <p className="text-red-500 text-sm">{errors.cardNumber.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="expiryDate">Expiry Date (MM/YY)</Label>
          <Input id="expiryDate" placeholder="MM/YY" {...register("expiryDate")} />
          {errors.expiryDate && (
            <p className="text-red-500 text-sm">{errors.expiryDate.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="cvv">CVV</Label>
          <Input id="cvv" placeholder="3-digit CVV" {...register("cvv")} />
          {errors.cvv && (
            <p className="text-red-500 text-sm">{errors.cvv.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
          Pay Now
        </Button>
      </form>
    </div>
  );
}
