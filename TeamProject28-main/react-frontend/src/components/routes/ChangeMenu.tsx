import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Define the structure for our menu item data
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  category: string;
  imageUrl: string;
  quantity: number;
  allergens?: string;
  calories?: number;
}

export default function ChangeMenu() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch menu items from the backend when the component mounts
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/items/all`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        setError("Error fetching menu items. Please try again later.");
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  // State for new menu item form
  const [newMenuItem, setNewMenuItem] = useState<MenuItem>({
    id: 0,
    name: "",
    description: "",
    price: 0,
    available: true,
    category: "food",
    imageUrl: "",
    quantity: 0,
  });

  // State for editing
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Function to handle adding a new menu item
  const handleAddMenuItem = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMenuItem),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add menu item");
      }

      const addedMenuItem = await response.json();
      setMenuItems([...menuItems, addedMenuItem]); // Add the new item to the state
      setNewMenuItem({
        id: 0,
        name: "",
        description: "",
        price: 0,
        available: true,
        category: "food",
        imageUrl: "",
        quantity: 0,
      }); // Reset form
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("Failed to add menu item. Please try again.");
    }
  };

  // Function to handle removing a menu item
  const handleRemoveMenuItem = async (id: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/items/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete menu item");
      }

      setMenuItems(menuItems.filter((item) => item.id !== id)); // Remove the item from the state
    } catch (error) {
      console.error("Error deleting menu item:", error);
      alert("Failed to delete menu item. Please try again.");
    }
  };

  // Functions for editing
  const handleEditMenuItem = (item: MenuItem, index: number) => {
    setEditingMenuItem(item);
    setEditingIndex(index);
  };

  const handleUpdateMenuItem = async () => {
    if (editingMenuItem && editingIndex !== null) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/items/${editingMenuItem.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editingMenuItem),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update menu item");
        }

        const updatedMenuItem = await response.json();
        const updatedMenuItems = [...menuItems];
        updatedMenuItems[editingIndex] = updatedMenuItem;
        setMenuItems(updatedMenuItems); // Update the state with the edited item
        setEditingMenuItem(null);
        setEditingIndex(null);
      } catch (error) {
        console.error("Error updating menu item:", error);
        alert("Failed to update menu item. Please try again.");
      }
    }
  };

  // Loading and error states
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10 bg-white min-h-screen">
      {/* Tab Navigation */}
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
          onClick={() => navigate("/requests")}
          className="bg-red-600 hover:bg-red-700 text-white flex items-center"
        >
          <Bell className="h-5 w-5 mr-2" />
          View Help Requests
        </Button>
      </div>

      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-amber-900">
        Change Menu
      </h1>

      {/* Grid display of existing menu items */}
      <div className="grid grid-cols-3 gap-8">
        {menuItems.map((item, index) => (
          <div key={item.id} className="flex flex-col items-center">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="rounded-lg w-48 h-48 object-cover"
            />
            <h3 className="mt-2 text-xl font-bold text-amber-900">
              {item.name}
            </h3>
            <p className="text-gray-600">{item.description}</p>
            <p className="text-amber-600 font-bold">£{item.price.toFixed(2)}</p>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                onClick={() => handleEditMenuItem(item, index)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleRemoveMenuItem(item.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button with Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-amber-900 hover:bg-amber-800">
            <Plus className="h-8 w-8" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-amber-900">
              Add New Menu Item
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newMenuItem.name}
                onChange={(e) =>
                  setNewMenuItem({ ...newMenuItem, name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newMenuItem.description}
                onChange={(e) =>
                  setNewMenuItem({
                    ...newMenuItem,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={newMenuItem.price}
                onChange={(e) =>
                  setNewMenuItem({
                    ...newMenuItem,
                    price: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={newMenuItem.imageUrl}
                onChange={(e) =>
                  setNewMenuItem({ ...newMenuItem, imageUrl: e.target.value })
                }
              />
            </div>
            <Button
              className="w-full bg-amber-900 hover:bg-amber-800 text-white"
              onClick={handleAddMenuItem}
            >
              Add Menu Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editingMenuItem !== null}
        onOpenChange={() => setEditingMenuItem(null)}
      >
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-amber-900">Edit Menu Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editingMenuItem?.name || ""}
                onChange={(e) =>
                  setEditingMenuItem((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editingMenuItem?.description || ""}
                onChange={(e) =>
                  setEditingMenuItem((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-price">Price</Label>
              <Input
                id="edit-price"
                type="number"
                value={editingMenuItem?.price || 0}
                onChange={(e) =>
                  setEditingMenuItem((prev) =>
                    prev ? { ...prev, price: parseFloat(e.target.value) } : null
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-imageUrl">Image URL</Label>
              <Input
                id="edit-imageUrl"
                value={editingMenuItem?.imageUrl || ""}
                onChange={(e) =>
                  setEditingMenuItem((prev) =>
                    prev ? { ...prev, imageUrl: e.target.value } : null
                  )
                }
              />
            </div>
            <Button
              className="w-full bg-amber-900 hover:bg-amber-800 text-white"
              onClick={handleUpdateMenuItem}
            >
              Update Menu Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
