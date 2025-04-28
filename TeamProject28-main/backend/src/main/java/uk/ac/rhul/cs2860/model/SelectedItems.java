package uk.ac.rhul.cs2860.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SelectedItems {
    private Map<Item, Integer> items;

    // Constructor
    public SelectedItems() {
        this.items = new HashMap<>();
    }

    // Removes all items
    public void clear() {
        this.items.clear();
    }

    // Getter and setter
    public Map<Item, Integer> getItems() {
        return items;
    }

    public void setItems(Map<Item, Integer> items) {
        this.items = items;
    }

    /**
     * retrieves only the quantities of the selected items.
     *
     * @return list of the quantity of selected items.
     */
    public List<Integer> getQuantities() {
        return new ArrayList<>(items.values());
    }

    // Add item
    public void addItem(Item item, int quantity) {
        items.put(item, items.getOrDefault(item, 0) + quantity);
    }

    /**
     * Removes a specified item.
     *
     * @param {Item, integer} item, quantity - item and the amount to be removed.
     * 
     */
    public void removeItem(Item item, int quantity) {
        if (items.containsKey(item)) {
            int currentQuantity = items.get(item);
            if (currentQuantity <= quantity) {
                items.remove(item);
            } else {
                items.put(item, currentQuantity - quantity);
            }
        }
    }

    /**
     * Returns the total price of the items.
     *
     * @return the total price of items.
     */
    public double calculateTotalPrice() {
        return items.entrySet().stream()
                .mapToDouble(entry -> entry.getKey().getPrice().doubleValue() * entry.getValue())
                .sum();
    }

    // view all items
    public void viewSelectedItems() {
        items.forEach((item, quantity) -> System.out.println(item.getName() + " x" + quantity));
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        items.forEach((item, quantity) -> sb.append(quantity).append("x ").append(item.getName()).append("\n"));
        sb.append("Total: £").append(calculateTotalPrice());
        return sb.toString();
    }
}
