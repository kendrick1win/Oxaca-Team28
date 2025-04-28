package uk.ac.rhul.cs2860.controller;

import java.util.Arrays;
import java.util.Collections;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import uk.ac.rhul.cs2860.model.Item;
import uk.ac.rhul.cs2860.model.Order;
import uk.ac.rhul.cs2860.model.Request;
import uk.ac.rhul.cs2860.repository.ItemRepository;
import uk.ac.rhul.cs2860.repository.OrderRepository;
import uk.ac.rhul.cs2860.repository.RequestRepository;

@ExtendWith(MockitoExtension.class)
public class ManagerControllerTest {

    private MockMvc mockMvc;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private RequestRepository requestRepository;

    @Mock
    private ItemRepository itemRepository;

    @InjectMocks
    private ManagerController managerController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(managerController).build();
    }

    @Test
    void testGetDashboardData_WithTablesAndStock() throws Exception {
        Order order1 = new Order();
        order1.setTableNumber(1);
        order1.setName("Adyan U");
        order1.setStatus("Active");

        Order order2 = new Order();
        order2.setTableNumber(2);
        order2.setName("Denis V");
        order2.setStatus("Completed");

        Request request1 = new Request();
        request1.setTableNumber(1);
        request1.setStatus("Pending");

        Request request2 = new Request();
        request2.setTableNumber(2);
        request2.setStatus("Pending");

        Item item1 = new Item();
        item1.setId(1L);
        item1.setName("Chicken Tacos");
        item1.setAvailable(true);

        Item item2 = new Item();
        item2.setId(2L);
        item2.setName("Beef Quesadilla");
        item2.setAvailable(true);

        Item item3 = new Item();
        item3.setId(3L);
        item3.setName("Churros");
        item3.setAvailable(true);

        when(orderRepository.findAll()).thenReturn(Arrays.asList(order1, order2));
        when(requestRepository.findAll()).thenReturn(Arrays.asList(request1, request2));
        when(itemRepository.findAll()).thenReturn(Arrays.asList(item1, item2, item3));

        mockMvc.perform(get("/api/dashboard")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tables.length()").value(2))
                .andExpect(jsonPath("$.tables[0].tableNumber").value(1))
                .andExpect(jsonPath("$.tables[0].customerName").value("Adyan U"))
                .andExpect(jsonPath("$.tables[0].orderStatus").value("Active"))
                .andExpect(jsonPath("$.tables[0].requests.length()").value(1))
                .andExpect(jsonPath("$.tables[1].tableNumber").value(2))
                .andExpect(jsonPath("$.tables[1].customerName").value("Denis V"))
                .andExpect(jsonPath("$.tables[1].orderStatus").value("Completed"))
                .andExpect(jsonPath("$.tables[1].requests.length()").value(1))
                .andExpect(jsonPath("$.stock.length()").value(3))
                .andExpect(jsonPath("$.stock[0].itemId").value(1))
                .andExpect(jsonPath("$.stock[0].name").value("Chicken Tacos"))
                .andExpect(jsonPath("$.stock[0].available").value(true))
                .andExpect(jsonPath("$.stock[1].itemId").value(2))
                .andExpect(jsonPath("$.stock[1].name").value("Beef Quesadilla"))
                .andExpect(jsonPath("$.stock[1].available").value(true))
                .andExpect(jsonPath("$.stock[2].itemId").value(3))
                .andExpect(jsonPath("$.stock[2].name").value("Churros"))
                .andExpect(jsonPath("$.stock[2].available").value(true));
    }

    @Test
    void testGetDashboardData_WithEmptyData() throws Exception {
        when(orderRepository.findAll()).thenReturn(Collections.emptyList());
        when(requestRepository.findAll()).thenReturn(Collections.emptyList());
        when(itemRepository.findAll()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/dashboard")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tables.length()").value(0))
                .andExpect(jsonPath("$.stock.length()").value(0));
    }

    @Test
    void testGetDashboardData_FiltersSolvedRequests() throws Exception {
        Order order = new Order();
        order.setTableNumber(1);
        order.setName("Adyan U");
        order.setStatus("Active");

        Request solvedRequest = new Request();
        solvedRequest.setTableNumber(1);
        solvedRequest.setStatus("Solved");

        Request pendingRequest = new Request();
        pendingRequest.setTableNumber(1);
        pendingRequest.setStatus("Pending");

        Item item = new Item();
        item.setId(1L);
        item.setName("Horchata");
        item.setAvailable(true);

        when(orderRepository.findAll()).thenReturn(Collections.singletonList(order));
        when(requestRepository.findAll()).thenReturn(Arrays.asList(solvedRequest, pendingRequest));
        when(itemRepository.findAll()).thenReturn(Collections.singletonList(item));

        mockMvc.perform(get("/api/dashboard")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tables[0].requests.length()").value(1))
                .andExpect(jsonPath("$.stock[0].name").value("Horchata"));
    }

    @Test
    void testGetDashboardData_WithNoRequestsForTable() throws Exception {
        Order order = new Order();
        order.setTableNumber(1);
        order.setName("Denis V");
        order.setStatus("Active");

        Request request = new Request();
        request.setTableNumber(2);
        request.setStatus("Pending");

        Item item = new Item();
        item.setId(1L);
        item.setName("Jalapenos");
        item.setAvailable(true);

        when(orderRepository.findAll()).thenReturn(Collections.singletonList(order));
        when(requestRepository.findAll()).thenReturn(Collections.singletonList(request));
        when(itemRepository.findAll()).thenReturn(Collections.singletonList(item));

        mockMvc.perform(get("/api/dashboard")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tables[0].requests.length()").value(0))
                .andExpect(jsonPath("$.stock[0].name").value("Jalapenos"));
    }
}