package uk.ac.rhul.cs2860.model;

import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class ItemTest {
    private Item item;

    @BeforeEach
    void beforeEach() {
        item = new Item();
        item.setId(1L);
        item.setName("Burrito");
        item.setDescription("A Delicious Burrito.");
        item.setPrice(new BigDecimal("8.99"));
        item.setAvailable(true);
        item.setCategory("mains");
        item.setAllergens("gluten, milk");
        item.setProtein(30);
        item.setCarbohydrates(50);
        item.setFat(20);
        item.setImageUrl("image");
    }

    @Test
    public void createItemTest() {
      Item item2 = new Item("Taco", new BigDecimal("2.99"));
      assertEquals("Taco", item2.getName(), "Name is incorrect.");
      assertEquals(new BigDecimal("2.99"), item2.getPrice(), "Price is incorrect");
    }

    @Test
    public void idTest() {
        assertEquals(1L, item.getId(), "ID should be 1");
    }

    @Test
    public void nameTest() {
        assertEquals("Burrito", item.getName(), "The name should be 'Burrito'");
    }

    @Test
    public void descriptionTest() {
        assertEquals("A Delicious Burrito.", item.getDescription(), "Description does not match expected value");
    }

    @Test
    public void priceTest() {
        assertEquals(new BigDecimal("8.99"), item.getPrice(), "Price does not match expected value");
    }

    @Test
    public void availableTest() {
        assertTrue(item.getAvailable(), "Burrito should be available");
    }

    @Test
    public void categoryTest() {
        assertEquals("mains", item.getCategory(), "Category should be 'mains'");
    }

    @Test
    public void allergensTest() {
        assertEquals("gluten, milk", item.getAllergens(), "Allergens should be 'gluten, milk'");
    }

    @Test
    public void caloriesCalculationTest() {
        assertEquals(500, item.getCalories(), "Calories calculation is incorrect");
    }

    @Test
    public void imageUrlTest() {
        assertEquals("image", item.getImageUrl());
    }

    @Test
    public void macronutrientTest() { // testing the protein/fat/carbs variables
      assertEquals(30, item.getProtein(), "Protein amount is incorrect.");
      assertEquals(50, item.getCarbohydrates(), "Carbs amount is incorrect.");
      assertEquals(20, item.getFat(), "Fat amount is incorrect.");
    }

}
