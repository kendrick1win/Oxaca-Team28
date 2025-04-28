package uk.ac.rhul.cs2860.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

public class MenuTest {

    @Test
    void MenuItemCorrectProperties() {
        Menu menuItem = new Menu();
        menuItem.setId(1L);
        menuItem.setName("Tacos");
        menuItem.setDescription(
                "Soft or crispy tortillas filled with marinated meat of your choice, topped with fresh pineapple, cilantro, and zesty salsa.");
        menuItem.setPrice(9.99);
        menuItem.setCategory("Food");
        menuItem.setImageUrl("/images/tacos.png");
        menuItem.setAvailable(true);
        menuItem.setIsVegetarian(false);
        menuItem.setAllergens("Milk, cheese, beans.");
        menuItem.setCalories(100);

        assertEquals(1L, menuItem.getId());
        assertEquals("Tacos", menuItem.getName());
        assertEquals(
                "Soft or crispy tortillas filled with marinated meat of your choice, topped with fresh pineapple, cilantro, and zesty salsa.",
                menuItem.getDescription());
        assertEquals(9.99, menuItem.getPrice());
        assertEquals("/images/tacos.png", menuItem.getImageUrl());
        assertEquals("Food", menuItem.getCategory());

        assertEquals(true, menuItem.getAvailable());
        assertEquals(false, menuItem.getIsVegetarian());
        assertEquals("Milk, cheese, beans.", menuItem.getAllergens());
        assertEquals(100, menuItem.getCalories());
    }
}
