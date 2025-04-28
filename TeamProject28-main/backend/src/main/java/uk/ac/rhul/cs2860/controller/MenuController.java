package uk.ac.rhul.cs2860.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.rhul.cs2860.model.Menu;
import uk.ac.rhul.cs2860.repository.MenuRepository;

// class handling GET requests for the menu.
@RestController
@RequestMapping("/api")
public class MenuController {

    @Autowired
    private MenuRepository menuRepository;

    /**
     * GET handler retrieving all items on the menu
     *
     * @return all items in the menu.
     */
    @GetMapping("/menu")
    public List<Menu> getAllMenuItems() {
        return menuRepository.findAll();
    }

    /**
     * GET handler retrieving items by category
     *
     * @param {String} category -category that the items are filtered by.
     * @return all items of the specified category.
     */
    @GetMapping("/menu/{category}")
    public List<Menu> getMenuItemsByCategory(@PathVariable String category) {
        return menuRepository.findByCategory(category);
    }
}
