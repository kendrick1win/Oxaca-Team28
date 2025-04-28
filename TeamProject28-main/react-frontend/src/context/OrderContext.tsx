// Imports
import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";

// Defines the structure of a menu item in the order
type MenuItem = {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  quantity: number;
};

// Defines the shape of the context state and functions
type OrderContextType = {
  order: MenuItem[]; // List of ordered menu items
  addToOrder: (item: MenuItem) => void; // Adds an item to the order
  clearOrder: () => void; // Clears all items from the order
  increaseQuantity: (name: string) => void; // Increases quantity of an item
  decreaseQuantity: (name: string) => void; // Decreases quantity of an item
  removeItem: (name: string) => void; // Removes item from the order
  cartItemsCount: number; // Tracks total number of items in cart
};

// Creates the order context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Provides the order context to its children
export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<MenuItem[]>([]); // Stores the current order list
  const [cartItemsCount, setCartItemsCount] = useState(0); // Tracks total item count in cart

  // Adds a menu item to the order or increases its quantity if it already exists
  const addToOrder = (item: MenuItem) => {
    setOrder((prevOrder) => {
      const existingItem = prevOrder.find(
        (orderItem) => orderItem.name === item.name
      );
      if (existingItem) {
        // Increments quantity if item is already in the order
        return prevOrder.map((orderItem) =>
          orderItem.name === item.name
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        );
      } else {
        // Adds new item to the order
        return [...prevOrder, { ...item, quantity: 1 }];
      }
    });
    setCartItemsCount((prevCount) => prevCount + 1); // Updates total cart count
  };

  // Clears all items from the order
  const clearOrder = () => {
    setOrder([]);
    setCartItemsCount((prevCount) => prevCount - prevCount); // Resets cart item count
  };

  // Increases the quantity of a specific item
  const increaseQuantity = (name: string) => {
    setOrder((prevOrder) =>
      prevOrder.map((item) =>
        item.name === name ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    setCartItemsCount((prevCount) => prevCount + 1);
  };

  // Decreases the quantity of a specific item (if greater than 1)
  const decreaseQuantity = (name: string) => {
    setOrder((prevOrder) =>
      prevOrder.map((item) =>
        item.name === name && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
    setCartItemsCount((prevCount) => prevCount - 1);
  };

  // Removes an item completely from the order
  const removeItem = (name: string) => {
    setOrder((prevOrder) => {
      const itemToRemove = prevOrder.find((item) => item.name === name);
      if (itemToRemove) {
        setCartItemsCount((prevCount) => prevCount - itemToRemove.quantity);
      }
      return prevOrder.filter((item) => item.name !== name);
    });
  };

  // Returns the context provider with its values
  return (
    <OrderContext.Provider
      value={{
        order,
        addToOrder,
        clearOrder,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        cartItemsCount,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

// Defines a custom hook for consuming the OrderContext
export function useOrder() {
  const context = useContext(OrderContext);

  if (!context) {
    // Throws error if hook is used outside of provider
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
