package uk.ac.rhul.cs2860.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import uk.ac.rhul.cs2860.model.Order;
import uk.ac.rhul.cs2860.model.Request;
import uk.ac.rhul.cs2860.model.Item;

import uk.ac.rhul.cs2860.repository.OrderRepository;
import uk.ac.rhul.cs2860.repository.RequestRepository;
import uk.ac.rhul.cs2860.repository.ItemRepository;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class ManagerController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private ItemRepository itemRepository;

    @GetMapping
    public Map<String, Object> getDashboardData() {
        Map<String, Object> dashboard = new HashMap<>();

        // Group orders by table
        List<Map<String, Object>> tableSummaries = new ArrayList<>();
        Iterable<Order> orders = orderRepository.findAll();
        List<Request> allRequests = requestRepository.findAll();

        Map<Integer, List<Request>> requestsByTable = allRequests.stream()
            .filter(r -> !"Solved".equalsIgnoreCase(r.getStatus()))
            .collect(Collectors.groupingBy(Request::getTableNumber));

        for (Order order : orders) {
            Map<String, Object> summary = new HashMap<>();
            summary.put("tableNumber", order.getTableNumber());
            summary.put("customerName", order.getName());
            summary.put("orderStatus", order.getStatus());
            summary.put("requests", requestsByTable.getOrDefault(order.getTableNumber(), new ArrayList<>()));
            tableSummaries.add(summary);
        }

        dashboard.put("tables", tableSummaries);

        // Stock overview
        List<Map<String, Object>> stock = new ArrayList<>();
        itemRepository.findAll().forEach(item -> {
            Map<String, Object> itemData = new HashMap<>();
            itemData.put("itemId", item.getId());
            itemData.put("name", item.getName());
            itemData.put("available", item.getAvailable());
            stock.add(itemData);
        });

        dashboard.put("stock", stock);

        return dashboard;
    }
}
