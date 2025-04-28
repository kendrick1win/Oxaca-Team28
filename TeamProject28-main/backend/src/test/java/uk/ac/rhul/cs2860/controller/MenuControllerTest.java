package uk.ac.rhul.cs2860.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;

import uk.ac.rhul.cs2860.model.Menu;
import uk.ac.rhul.cs2860.repository.MenuRepository;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

@WebMvcTest(MenuController.class)
@AutoConfigureMockMvc(addFilters = false)
public class MenuControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private MenuRepository menuRepository;

    @Test
    public void testGetAllMenuItems() throws Exception {
        Menu item = new Menu();
        item.setName("Pizza");

        when(menuRepository.findAll()).thenReturn(List.of(item));

        mockMvc.perform(get("/api/menu"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Pizza"));
    }

    @Test
    public void testGetMenuItemsByCategory() throws Exception {
        Menu item = new Menu();
        item.setName("Burger");
        item.setCategory("Fast Food");

        when(menuRepository.findByCategory("Fast Food")).thenReturn(Arrays.asList(item));

        mockMvc.perform(get("/api/menu/Fast Food"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Burger"));
    }
}
