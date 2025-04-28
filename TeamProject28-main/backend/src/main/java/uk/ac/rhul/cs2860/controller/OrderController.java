package uk.ac.rhul.cs2860.controller;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.rhul.cs2860.model.Order;
import uk.ac.rhul.cs2860.model.SelectedItems;
import uk.ac.rhul.cs2860.repository.ItemRepository;
import uk.ac.rhul.cs2860.repository.OrderItemRepository;
import uk.ac.rhul.cs2860.repository.OrderRepository;

// Class handling POST, GET and PUT requests for orders.
@RestController
@RequestMapping("/orders")
@Transactional
public class OrderController {

    // Variables to inject repository items.
    private final ItemRepository itemRepository;
    private final OrderRepository orderRepository;
    private final SelectedItems selectedItems = new SelectedItems();
    private final OrderItemRepository orderItemRepository;

    // Constructor
    public OrderController(ItemRepository itemRepository, OrderRepository orderRepository,
            OrderItemRepository orderItemRepository) {
        this.itemRepository = itemRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    /**
     * addItemToOrder POST handler
     *
     * @param {Lond, integer} id, quantity - id and quantity of the item to be added to the order.
     * @return success message that the item has been added or a bad request response that the item
     *         could not be found.
     */
    @PostMapping("/add")
    public ResponseEntity<String> addItemToOrder(@RequestParam Long itemId, @RequestParam int quantity) {
        return itemRepository.findById(itemId)
                .map(item -> {
                    selectedItems.addItem(item, quantity);
                    return ResponseEntity.ok(quantity + "x " + item.getName() + " added to order.");
                })
                .orElse(ResponseEntity.badRequest().body("Item not found."));
    }

    /**
     * GET handler retrieving all items in the current order
     *
     * @return all items of the order.
     */
    @GetMapping("/current")
    public ResponseEntity<String> viewCurrentOrder() {
        return ResponseEntity.ok(selectedItems.toString());
    }

    /**
     * POST handler update order
     *
     * @param {String, Integer, String} customerName, tableNumber, requests - id and customerName of
     *        the order alongside any requests made
     * @return success message that the order has been made or a bad request response indicating
     *         that there are no items in the order.
     */
    @PostMapping("/place")
    @Transactional
    public ResponseEntity<String> placeOrder(@RequestParam String customerName, @RequestParam Integer tableNumber,
            @RequestParam(value = "requests", defaultValue = "None") String requests) {

        if (selectedItems.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("No items in order.");
        }

        Order order = new Order();
        order.setStatus("pending");
        order.setOrderTime(LocalDateTime.now());
        order.setName(customerName);
        order.setTableNumber(tableNumber);
        order.setRequests(requests);

        selectedItems.getItems().forEach((item, quantity) -> {
            order.addOrderItem(item, quantity);
        });

        Order savedOrder = orderRepository.save(order);
        selectedItems.clear();
        selectedItems.viewSelectedItems();
        return ResponseEntity.ok("Order placed successfully!");
    }

    /**
     * GET handler retrieving time since the order has been made.
     *
     * @param {Long} id - id of order.
     * @return success message of how long it has been, or a bad request response indicating that
     *         the order could not be found.
     */
    @GetMapping("/track-progress/{id}")
    public ResponseEntity<String> trackProgress(@PathVariable Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);

        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();

            if (order.getInitialOrderTime() == null) {
                return ResponseEntity.badRequest().body("Order timestamps are invalid.");
            }

            Duration duration = Duration.between(order.getInitialOrderTime(), LocalDateTime.now());

            long minutes = duration.toMinutes() % 60;
            long seconds = duration.toSeconds() % 60;

            String formatTime = String.format("%02d:%02d", minutes, seconds);

            if (minutes > 0) {
                return ResponseEntity
                        .ok("It has been " + formatTime + " minute(s) since the order has been made.");
            } else {
                return ResponseEntity
                        .ok("It has been " + formatTime + " seconds since the order has been made.");
            }
        }

        return ResponseEntity.badRequest().body("Order not found.");
    }

    /**
     * PUT handler to update order status to cancel.
     *
     * @param {Long} id - id of order to update.
     * @return success message that the order status has been updated or a bad request response
     *         indicating that the order could not be found.
     */
    @PutMapping("/cancel/{id}")
    @Transactional
    public ResponseEntity<String> cancelOrder(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(order -> {
                    if ("canceled".equalsIgnoreCase(order.getStatus())) {
                        return ResponseEntity.badRequest().body("Order is already canceled.");
                    }
                    order.setStatus("canceled");
                    orderRepository.save(order);
                    return ResponseEntity.ok("Order canceled successfully.");
                })
                .orElse(ResponseEntity.badRequest().body("Order not found."));
    }

    /**
     * GET handler retrieving all orders that aren't cancelled.
     *
     * @return all non-cancelled orders.
     */
    @GetMapping("/all-orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderRepository.findByStatusNot("canceled");
        return ResponseEntity.ok(orders);
    }

    /**
     * PUT handler to update order status to ready..
     *
     * @param {Long} id - id of order to update.
     * @return success message that the order status has been updated or a bad request response
     *         indicating that the order could not be found.
     */
    @PutMapping("/ready/{id}")
    public ResponseEntity<String> orderIsReady(@PathVariable Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);

        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();

            if ("ready".equalsIgnoreCase(order.getStatus())) {
                return ResponseEntity.badRequest().body("Order " + id + " is already set to ready.");
            } else if ("canceled".equalsIgnoreCase(order.getStatus())) {
                return ResponseEntity.badRequest()
                        .body("Order is canceled, can not set status to ready.");
            }

            order.setStatus("ready");
            orderRepository.save(order);
            return ResponseEntity.ok("Order " + id + " is set to ready.");
        }

        return ResponseEntity.badRequest().body("Order not found.");
    }

    /**
     * PUT handler to update order status to pending.
     *
     * @param {Long} id - id of order to update.
     * @return success message that the order status has been updated or a bad request response
     *         indicating that the order could not be found.
     */
    @PutMapping("/pending/{id}")
    public ResponseEntity<String> orderIsPending(@PathVariable Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);

        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();

            if ("pending".equalsIgnoreCase(order.getStatus())) {
                return ResponseEntity.badRequest().body("Order " + id + " is already set to pending.");
            } else if ("canceled".equalsIgnoreCase(order.getStatus())) {
                return ResponseEntity.badRequest()
                        .body("Order is canceled, can not set status to pending.");
            }

            order.setStatus("pending");
            orderRepository.save(order);
            return ResponseEntity.ok("Order " + id + " is set to pending.");
        }

        return ResponseEntity.badRequest().body("Order not found.");
    }

    /**
     * PUT handler to update order status to in-progress.
     *
     * @param {Long} id - id of order to update.
     * @return success message that the order status has been updated or a bad request response
     *         indicating that the order could not be found.
     */
    @PutMapping("/in-progress/{id}")
    public ResponseEntity<String> orderIsInProgress(@PathVariable Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);

        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();

            if ("in-progress".equalsIgnoreCase(order.getStatus())) {
                return ResponseEntity.badRequest().body("Order " + id + " is already set to in-progress.");
            } else if ("canceled".equalsIgnoreCase(order.getStatus())) {
                return ResponseEntity.badRequest()
                        .body("Order is canceled, can not set status to in-progress.");
            }

            order.setStatus("in-progress");
            orderRepository.save(order);
            return ResponseEntity.ok("Order " + id + " is set to in-progress.");
        }

        return ResponseEntity.badRequest().body("Order not found.");
    }

    /**
     * PUT handler to update order status to confirmed.
     *
     * @param {Long} id - id of order to update.
     * @return success message that the order status has been updated or a bad request response
     *         indicating that the order could not be found.
     */
    @PutMapping("/confirmed/{id}")
    public ResponseEntity<String> confirmOrder(@PathVariable Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);

        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();

            if ("confirmed".equalsIgnoreCase(order.getStatus())) {
                return ResponseEntity.badRequest().body("Order " + id + " is already set to confirmed.");
            } else if ("canceled".equalsIgnoreCase(order.getStatus())) {
                return ResponseEntity.badRequest()
                        .body("Order is canceled, can not set status to confirmed.");
            }

            order.setStatus("confirm");
            orderRepository.save(order);
            return ResponseEntity.ok("Order " + id + " is set to confirmed.");
        }

        return ResponseEntity.badRequest().body("Order not found.");
    }

    /**
     * PUT handler to update order status to cooking.
     *
     * @param {Long} id - id of order to update.
     * @return success message that the order status has been updated or a bad request response
     *         indicating that the order could not be found.
     */
    @PutMapping("/cooking/{id}")
    public ResponseEntity<String> orderIsCooking(@PathVariable Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);

        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();

            if ("cooking".equalsIgnoreCase(order.getStatus())) {
                return ResponseEntity.badRequest().body("Order " + id + " is already set to cooking.");
            } else if ("canceled".equalsIgnoreCase(order.getStatus())) {
                return ResponseEntity.badRequest()
                        .body("Order is canceled, can not set status to cooking.");
            }

            order.setStatus("cooking");
            orderRepository.save(order);
            return ResponseEntity.ok("Order " + id + " is set to cooking.");
        }

        return ResponseEntity.badRequest().body("Order not found.");
    }

    /**
     * PUT handler to update order status to delivered.
     *
     * @param {Long} id - id of order to update.
     * @return success message that the order status has been updated or a bad request response
     *         indicating that the order could not be found.
     */
    @PutMapping("/delivered/{id}")
    public ResponseEntity<String> orderIsDelivered(@PathVariable Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);

        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();

            if ("delivered".equalsIgnoreCase(order.getStatus())) {
                return ResponseEntity.badRequest().body("Order " + id + " is already set to delivered.");
            } else if ("canceled".equalsIgnoreCase(order.getStatus())) {
                return ResponseEntity.badRequest()
                        .body("Order is canceled, can not set status to delivered.");
            }

            order.setStatus("delivered");
            orderRepository.save(order);
            return ResponseEntity.ok("Order " + id + " is set to delivered.");
        }

        return ResponseEntity.badRequest().body("Order not found.");
    }

    /**
     * PUT handler to update order.
     *
     * @param {Long, Order} id, updatedOrder - id of order to update, and the new order.
     * @return success message indicating that the order has been updated or a bad request response
     *         indicating that the order could not be found.
     */
    @PutMapping("/update/{id}")
    @Transactional
    public ResponseEntity<String> updateOrder(@PathVariable Long id, @RequestBody Order updatedOrder) {
        Optional<Order> existingOrderOpt = orderRepository.findById(id);

        if (!existingOrderOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Order not found.");
        }

        Order existingOrder = existingOrderOpt.get();

        // Update the order fields as needed
        existingOrder.setName(updatedOrder.getName());
        existingOrder.setTableNumber(updatedOrder.getTableNumber());
        existingOrder.setRequests(updatedOrder.getRequests());

        // Remove existing items
        existingOrder.getOrderItems().clear();

        // Add the updated items
        updatedOrder.getOrderItems().forEach(orderItem -> {
            existingOrder.addOrderItem(orderItem.getItem(), orderItem.getQuantity());
        });

        orderRepository.save(existingOrder);

        return ResponseEntity.ok("Order updated successfully.");
    }

    /**
     * GET handler to retrieve all unpaid orders.
     *
     * @return all unpaid orders.
     */
    @GetMapping("/unpaid")
    public ResponseEntity<List<Order>> getUnpaidOrders() {
        List<Order> orders = orderRepository.findByPayment("unpaid");
        return ResponseEntity.ok(orders);
    }

    /**
     * PUT handler to update order to paid.
     *
     * @param {Long} id - id of order to update.
     * @return success message that the order has been set to paid or a bad request response
     *         indicating that the order could not be found.
     */
    @PutMapping("/pay/{id}")
    public ResponseEntity<String> payForOrder(@PathVariable Long id) {
        Optional<Order> orderOpt = orderRepository.findById(id);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setPayment("paid");
            orderRepository.save(order);
            return ResponseEntity.ok("Payment updated to 'paid' for order " + id);
        }
        return ResponseEntity.badRequest().body("Order not found.");
    }
}
