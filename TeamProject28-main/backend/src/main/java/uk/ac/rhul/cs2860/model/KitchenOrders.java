package uk.ac.rhul.cs2860.model;

import jakarta.persistence.CascadeType;
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
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "kitchen_orders")
public class KitchenOrders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Integer tableNumber;
    private LocalDateTime orderTime;
    private BigDecimal total;
    private String requests;

    @OneToMany(mappedBy = "kitchenOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<KitchenOrderItem> kitchenOrderItems = new ArrayList<>();

    private LocalDateTime confirmedAt;

    // Constructor
    public KitchenOrders() {
    }

    /**
     * Constructor to initialise a new KitchenOrder object.
     *
     * @param {Order} order - the order to added to the kitchen.
     */
    public KitchenOrders(Order order) {
        this.name = order.getName();
        this.tableNumber = order.getTableNumber();
        this.orderTime = order.getOrderTime();
        this.total = order.getTotal();
        this.requests = order.getRequests();
        this.confirmedAt = LocalDateTime.now();

    }

    // Getters and setters
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

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getRequests() {
        return requests;
    }

    public void setRequests(String requests) {
        this.requests = requests;
    }

    public LocalDateTime getConfirmedAt() {
        return confirmedAt;
    }

    public void setConfirmedAt(LocalDateTime confirmedAt) {
        this.confirmedAt = confirmedAt;
    }

    public List<KitchenOrderItem> getKitchenOrderItems() {
        return kitchenOrderItems;
    }

    public void setKitchenOrderItems(List<KitchenOrderItem> kitchenOrderItems) {
        this.kitchenOrderItems = kitchenOrderItems;
    }

}