//Imports
import { useState, useEffect } from "react";
import { useOrder } from "@/context/OrderContext";

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

export function FeaturedDishes() {
  const { addToOrder } = useOrder();
  const [currentMenu, setCurrentMenu] = useState<"food" | "drinks">("food");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);
  const [filters, setFilters] = useState({
    vegetarian: false,
    glutenFree: false,
    dairyFree: false,
  });

  // Fetch menu items from the backend.
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/items/all`
        );
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  const filteredItems = menuItems.filter((item) => {
    if (currentMenu !== item.category) return false;

    // Filtering applies only to the food menu
    if (currentMenu === "food") {
      const matchesVegetarian =
        !filters.vegetarian || item.name.toLowerCase().includes("veggie");
      const matchesGlutenFree =
        !filters.glutenFree || !item.allergens?.includes("wheat");
      const matchesDairyFree =
        !filters.dairyFree || !item.allergens?.includes("dairy");

      // Show items that match all selected filters
      return matchesVegetarian && matchesGlutenFree && matchesDairyFree;
    }

    return true;
  });

  // Apply fade-in effect on scroll.
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(".fade-in");
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
          el.classList.add("visible");
        } else {
          el.classList.remove("visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    // Trigger once on mount.
    // Trigger the scroll effect after the menu items are filtered
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredItems]);

  const handleFilterChange = (filterKey: keyof typeof filters) => {
    setFilters((prev) => ({ ...prev, [filterKey]: !prev[filterKey] }));
  };

  // Handle adding an item to the order.
  const handleAddToOrder = (item: MenuItem) => {
    addToOrder(item);
    setSelectedItems((prev) => [...prev, item]);
  };

  return (
    <section className="flex flex-col items-center justify-center p-10">
      {/* Switch Menu Button: Circular Icon Button */}
      <button
        onClick={() =>
          setCurrentMenu(currentMenu === "food" ? "drinks" : "food")
        }
        className="mb-8 p-4 bg-amber-500 text-white rounded-full shadow-md hover:bg-amber-600 transition-colors flex items-center justify-center fade-in"
      >
        {currentMenu === "food" ? (
          <>
            {/* Icon representing switch to Drinks */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v16h16"
              />
            </svg>
            Drinks
          </>
        ) : (
          <>
            {/* Icon representing switch to Food */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 4v16H4"
              />
            </svg>
            Food
          </>
        )}
      </button>

      <h1 className="mb-4 text-4xl font-extrabold text-amber-900 fade-in">
        {currentMenu === "food" ? "Food Menu" : "Drinks Menu"}
      </h1>

      {/* Show filters only for food */}
      {currentMenu === "food" && (
        <div className="mb-6 flex space-x-4 fade-in text-amber-900">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.vegetarian}
              onChange={() => handleFilterChange("vegetarian")}
              className="mr-2"
            />
            Vegetarian
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.glutenFree}
              onChange={() => handleFilterChange("glutenFree")}
              className="mr-2"
            />
            Gluten-Free
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.dairyFree}
              onChange={() => handleFilterChange("dairyFree")}
              className="mr-2"
            />
            Dairy-Free
          </label>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
        {filteredItems.map((item) => {
          // Count how many times this item has been added
          const count = selectedItems.filter((si) => si.id === item.id).length;
          return (
            <div
              key={item.id}
              className="relative group flex flex-col items-center pb-16 transition-transform duration-300 hover:scale-105 fade-in"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="rounded-lg w-[400px] h-[200px] object-cover"
              />
              <h3 className="mt-4 text-xl font-bold text-amber-900 text-center fade-in">
                {item.name}
              </h3>
              <p className="text-gray-600 text-center px-2 fade-in">
                {item.description}
              </p>
              <p className="text-amber-600 font-bold mt-2 fade-in">
                £{item.price.toFixed(2)}
              </p>
              {item.allergens && (
                <p className="text-gray-600 fade-in">
                  <strong>Allergens:</strong> {item.allergens}
                </p>
              )}
              {item.calories !== undefined && (
                <p className="text-gray-600 fade-in">
                  <strong>Calories:</strong> {item.calories}
                </p>
              )}

              {/* add to order */}
              <div
                className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 ${
                  count > 0
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                }`}
              >
                <button
                  onClick={() => handleAddToOrder(item)}
                  className={`px-6 py-2 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-110 ${
                    count > 0
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                  } text-white text-lg font-semibold`}
                >
                  {count > 0 ? "Added" : "Add to Order"}
                  {count > 0 && (
                    <span className="ml-2 bg-white text-amber-600 rounded-full px-2 py-1 text-xs">
                      {count}
                    </span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
