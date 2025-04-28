package uk.ac.rhul.cs2860.controller;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;

import uk.ac.rhul.cs2860.model.Item;
import uk.ac.rhul.cs2860.repository.ItemRepository;

@ExtendWith(MockitoExtension.class)
public class ItemControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ItemRepository itemRepository;

    @InjectMocks
    private ItemController itemController;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(itemController).build();
    }

    @Test
    void testAddItem_Success() throws Exception {
        Map<String, String> requestBody = Map.of(
                "name", "Tacos",
                "price", "8.99",
                "category", "Mexican"
        );

        Item item = new Item();
        item.setName("Tacos");
        item.setPrice(new BigDecimal("8.99"));
        item.setCategory("Mexican");

        when(itemRepository.save(any(Item.class))).thenReturn(item);

        mockMvc.perform(post("/items/addItem")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Tacos"))
                .andExpect(jsonPath("$.price").value(8.99))
                .andExpect(jsonPath("$.category").value("Mexican"));
    }

    @Test
    void testGetAllItems() throws Exception {
        Item item1 = new Item();
        item1.setId(1L);
        item1.setName("Tacos");
        item1.setDescription("A fiesta in your mouth! Crispy shells packed with seasoned meat and fresh toppings.");
        item1.setPrice(new BigDecimal("8.99"));
        item1.setAvailable(true);
        item1.setCategory("Mexican");
        item1.setAllergens("None");
        item1.setProtein(12.0);
        item1.setCarbohydrates(30.0);
        item1.setFat(8.0);

        Item item2 = new Item();
        item2.setId(2L);
        item2.setName("Burrito");
        item2.setDescription("A handheld explosion of flavors! Stuffed with rice, beans, and juicy meats.");
        item2.setPrice(new BigDecimal("10.99"));
        item2.setAvailable(true);
        item2.setCategory("Mexican");
        item2.setAllergens("None");
        item2.setProtein(15.0);
        item2.setCarbohydrates(50.0);
        item2.setFat(12.0);

        List<Item> items = Arrays.asList(item1, item2);

        when(itemRepository.findAll()).thenReturn(items);

        mockMvc.perform(get("/items/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Tacos"))
                .andExpect(jsonPath("$[1].name").value("Burrito"));
    }

    @Test
    void testGetItemsByCategory_Found() throws Exception {
        Item item = new Item();
        item.setId(1L);
        item.setName("Tacos");
        item.setDescription("A street-food sensation! Bursting with bold spices and fresh ingredients.");
        item.setPrice(new BigDecimal("8.99"));
        item.setAvailable(true);
        item.setCategory("Mexican");
        item.setAllergens("None");
        item.setProtein(12.0);
        item.setCarbohydrates(30.0);
        item.setFat(8.0);

        List<Item> items = List.of(item);

        when(itemRepository.findByCategory("Mexican")).thenReturn(items);

        mockMvc.perform(get("/items/category/Mexican"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Tacos"));
    }

    @Test
    void testGetItemsByCategory_NotFound() throws Exception {
        when(itemRepository.findByCategory("NonExistentCategory")).thenReturn(List.of());

        mockMvc.perform(get("/items/category/NonExistentCategory"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteItem_Success() throws Exception {
        Item item = new Item();
        item.setId(1L);
        item.setName("Tacos");
        item.setDescription("Crunchy, spicy, and oh-so-addictive!");
        item.setPrice(new BigDecimal("8.99"));
        item.setAvailable(true);
        item.setCategory("Mexican");
        item.setAllergens("None");
        item.setProtein(12.0);
        item.setCarbohydrates(30.0);
        item.setFat(8.0);

        when(itemRepository.findById(1L)).thenReturn(Optional.of(item));
        doNothing().when(itemRepository).deleteById(1L);

        mockMvc.perform(delete("/items/delete/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Item deleted successfully."));
    }

    @Test
    void testDeleteItem_NotFound() throws Exception {
        when(itemRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(delete("/items/delete/1"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Item not found with ID: 1"));
    }
}
