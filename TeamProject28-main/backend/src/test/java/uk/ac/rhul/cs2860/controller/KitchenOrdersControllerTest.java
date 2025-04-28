package uk.ac.rhul.cs2860.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import uk.ac.rhul.cs2860.model.KitchenOrderItem;
import uk.ac.rhul.cs2860.model.KitchenOrders;
import uk.ac.rhul.cs2860.model.Order;
import uk.ac.rhul.cs2860.repository.KitchenOrderItemRepository;
import uk.ac.rhul.cs2860.repository.KitchenOrdersRepository;
import uk.ac.rhul.cs2860.repository.OrderRepository;

@ExtendWith(MockitoExtension.class)
public class KitchenOrdersControllerTest {

    private MockMvc mockMvc;

    @Mock
    private OrderRepository orderRepository;
    
    @Mock
    private KitchenOrdersRepository kitchenOrdersRepository;
    
    @Mock
    private KitchenOrderItemRepository kitchenOrderItemRepository;
    
    @InjectMocks
    private KitchenOrdersController kitchenOrdersController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(kitchenOrdersController).build();
    }

    @Test
    void testConfirmOrder_Success() throws Exception {
        Order order = new Order();
        order.setId(1L);
        KitchenOrders kitchenOrder = new KitchenOrders(order);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(kitchenOrdersRepository.save(any(KitchenOrders.class))).thenReturn(kitchenOrder);
        doNothing().when(orderRepository).deleteById(1L);

        mockMvc.perform(post("/kitchen-orders/confirm/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Order confirmed and moved to kitchen"));
    }

    @Test
    void testConfirmOrder_NotFound() throws Exception {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(post("/kitchen-orders/confirm/1"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Order not found"));
    }

    @Test
    void testGetAllKitchenOrders() throws Exception {
        KitchenOrders order1 = new KitchenOrders();
        KitchenOrders order2 = new KitchenOrders();

        when(kitchenOrdersRepository.findAll()).thenReturn(List.of(order1, order2));

        mockMvc.perform(get("/kitchen-orders/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").exists())
                .andExpect(jsonPath("$[1]").exists());
    }

    @Test
    void testGetKitchenOrderById_Found() throws Exception {
        KitchenOrders kitchenOrder = new KitchenOrders();
        when(kitchenOrdersRepository.findById(1L)).thenReturn(Optional.of(kitchenOrder));

        mockMvc.perform(get("/kitchen-orders/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetKitchenOrderById_NotFound() throws Exception {
        when(kitchenOrdersRepository.findById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/kitchen-orders/1"))
                .andExpect(status().isNotFound());
    }
}
