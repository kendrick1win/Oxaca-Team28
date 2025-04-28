package uk.ac.rhul.cs2860.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import uk.ac.rhul.cs2860.repository.OrderRepository;
import uk.ac.rhul.cs2860.repository.ItemRepository;
import uk.ac.rhul.cs2860.repository.OrderItemRepository;

import static org.mockito.Mockito.*;

@WebMvcTest(OrderController.class)
@AutoConfigureMockMvc(addFilters = false)
public class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderRepository orderRepository;

    @MockBean
    private ItemRepository itemRepository;

    @MockBean
    private OrderItemRepository orderItemRepository;

    @Test
    public void testTrackProgressOrderNotFound() throws Exception {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/orders/track-progress/1"))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testGetAllOrders() throws Exception {
        mockMvc.perform(get("/orders/all-orders"))
                .andExpect(status().isOk());
    }
}
