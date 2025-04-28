package uk.ac.rhul.cs2860.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.rhul.cs2860.model.Item;
import uk.ac.rhul.cs2860.repository.ItemRepository;

// class for handling POST, GET and DELETE requests for items
@RestController
@RequestMapping("/items")
public class ItemController {
    private final ItemRepository itemRepository;

    public ItemController(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    /**
     * addItem POST handler
     *
     * @param {Map<String,String>} params - the item to be added.
     * @return a saved item object
     */
    @PostMapping("/addItem")
    public ResponseEntity<?> addItem(@RequestBody Map<String, String> params) {
        try {
            if (!params.containsKey("name") || !params.containsKey("price") || !params.containsKey("category")) {
                return ResponseEntity.badRequest().body("Missing required fields: name, price, or category.");
            }

            Item item = new Item();
            item.setName(params.get("name"));
            item.setDescription(params.getOrDefault("description", ""));
            item.setPrice(new BigDecimal(params.get("price")));
            item.setAvailable(Boolean.parseBoolean(params.getOrDefault("available", "true")));
            item.setCategory(params.get("category"));

            item.setAllergens(params.getOrDefault("allergens", "None"));
            item.setProtein(Double.parseDouble(params.getOrDefault("protein", "0")));
            item.setCarbohydrates(Double.parseDouble(params.getOrDefault("carbohydrates",
                    "0")));
            item.setFat(Double.parseDouble(params.getOrDefault("fat", "0")));

            Item savedItem = itemRepository.save(item);
            return ResponseEntity.ok(savedItem);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding item: " + e.getMessage());
        }
    }


    /**
     * GET handler retrieving all items from the menu
     *
     * @return success message indicating retrieval of all items
     */
    @GetMapping("/all")
    public ResponseEntity<List<Item>> getAllItems() {
        List<Item> items = (List<Item>) itemRepository.findAll();
        return ResponseEntity.ok(items);
    }


    /**
     * GET handler to retrieve item by category
     *
     * @param {String} category - category to filter the items by.
     * @return filtered items or a bad request response if no items are found.
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Item>> getItemsByCategory(@PathVariable String category) {
        List<Item> items = itemRepository.findByCategory(category);
        if (items.isEmpty()) {
            return ResponseEntity.notFound().build(); // Use 404 if no items found
        }
        return ResponseEntity.ok(items);
    }

    /**
     * Delete an item by ID if it exists
     *
     * @param {Long} id - id of item to be deleted
     * @return success message indicating item is successfully removed or a bad request response if
     *         item is not found.
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        Optional<Item> item = itemRepository.findById(id);
        if (item.isPresent()) {
            itemRepository.deleteById(id);
            return ResponseEntity.ok("Item deleted successfully.");
        } else {
            return ResponseEntity.badRequest().body("Item not found with ID: " + id);
        }
    }
}
