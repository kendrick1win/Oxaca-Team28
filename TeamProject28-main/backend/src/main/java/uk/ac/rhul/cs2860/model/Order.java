package uk.ac.rhul.cs2860.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer tableNumber;

    @Column(name = "order_time", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime orderTime;
    private LocalDateTime initialOrderTime;

    private BigDecimal total;
    private String status;
    private String requests;

    @Column(name = "payment")
    private String payment = "unpaid";

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    /**
     * add an item to the order and update the total price.
     *
     * @param {Item, integer} item, quantity - item and its amount to be added.
     */
    public void addOrderItem(Item item, int quantity) {
        OrderItem orderItem = new OrderItem(this, item, quantity);
        orderItems.add(orderItem);
        updateTotal(); // Update the total whenever an item is added
    }

    // Method to calculate and update the total
    private void updateTotal() {
        this.total = BigDecimal.ZERO; // Reset total to zero
        for (OrderItem orderItem : orderItems) {
            BigDecimal itemPrice = orderItem.getItem().getPrice();
            BigDecimal quantity = new BigDecimal(orderItem.getQuantity());
            this.total = this.total.add(itemPrice.multiply(quantity)); // Add to total
        }
    }

    // Method to change order status to canceled
    public void cancelOrder(){
      this.status = "canceled";
    }

    // Getters and Setters
    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(Integer tableNumber) {
        this.tableNumber = tableNumber;
    }

    public LocalDateTime getOrderTime() {
        return orderTime;
    }

    public void setOrderTime(LocalDateTime orderTime) {
      this.orderTime = orderTime;
    }

    public LocalDateTime getInitialOrderTime() {
      return initialOrderTime;
    }

    public void setInitialOrderTime(LocalDateTime initialOrderTime) {
      this.initialOrderTime = initialOrderTime;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRequests() {
        return requests;
    }

    public void setRequests(String requests) {
        this.requests = requests;
    }

    public String getPayment() {
        return payment;
    }

    public void setPayment(String payment) {
        this.payment = payment;
    }

}
