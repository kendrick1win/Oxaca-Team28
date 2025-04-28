package uk.ac.rhul.cs2860.controller;

import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.rhul.cs2860.model.KitchenOrderItem;
import uk.ac.rhul.cs2860.model.KitchenOrders;
import uk.ac.rhul.cs2860.model.Order;
import uk.ac.rhul.cs2860.repository.KitchenOrderItemRepository;
import uk.ac.rhul.cs2860.repository.KitchenOrdersRepository;
import uk.ac.rhul.cs2860.repository.OrderItemRepository;
import uk.ac.rhul.cs2860.repository.OrderRepository;

// class for handling POST and GET requests for kitchen orders.
@RestController
@RequestMapping("/kitchen-orders")
public class KitchenOrdersController {

    private final OrderRepository orderRepository;
    private final KitchenOrdersRepository kitchenOrdersRepository;
    private final KitchenOrderItemRepository kitchenOrderItemRepository;

    // Constructor
    public KitchenOrdersController(OrderRepository orderRepository,
            KitchenOrdersRepository kitchenOrdersRepository,
            OrderItemRepository orderItemRepository,
            KitchenOrderItemRepository kitchenOrderItemRepository) {
        this.orderRepository = orderRepository;
        this.kitchenOrdersRepository = kitchenOrdersRepository;
        this.kitchenOrderItemRepository = kitchenOrderItemRepository;
    }

    /**
     * confirmOrder POST handler.
     *
     * @param {Long} orderId - id of the order to be confirmed
     * @return success message indicating order's confirmed or a bad request response if order is
     *         not found.
     */
    @PostMapping("/confirm/{orderId}")
    public ResponseEntity<String> confirmOrder(@PathVariable Long orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);

        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            KitchenOrders kitchenOrder = new KitchenOrders(order);

            KitchenOrders savedKitchenOrder = kitchenOrdersRepository.save(kitchenOrder);

            order.getOrderItems().forEach(orderItem -> {
                KitchenOrderItem kitchenOrderItem = new KitchenOrderItem();
                kitchenOrderItem.setKitchenOrder(savedKitchenOrder);
                kitchenOrderItem.setItem(orderItem.getItem());
                kitchenOrderItem.setQuantity(orderItem.getQuantity());
                kitchenOrderItemRepository.save(kitchenOrderItem);
            });

            // Delete original order
            orderRepository.deleteById(orderId);
            return ResponseEntity.ok("Order confirmed and moved to kitchen");
        }

        return ResponseEntity.badRequest().body("Order not found");
    }

    /**
     * GET handler to return all kitchen orders.
     *
     * @return all kitchen orders
     */
    @GetMapping("/all")
    public ResponseEntity<Iterable<KitchenOrders>> getAllKitchenOrders() {
        Iterable<KitchenOrders> kitchenOrders = kitchenOrdersRepository.findAll();
        return ResponseEntity.ok(kitchenOrders);
    }

    /**
     * GET handler to retrieve specified order.
     *
     * @param {Long} id - id of order to be retrieved.
     * @return success message that order is found or a bad request response that the order is not
     *         found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<KitchenOrders> getKitchenOrderById(@PathVariable Long id) {
        Optional<KitchenOrders> kitchenOrder = kitchenOrdersRepository.findById(id);
        return kitchenOrder.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}