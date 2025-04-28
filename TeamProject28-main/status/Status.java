package uk.ac.rhul.cs2860.model;

import jakarta.persistence.*;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

@Entity
@Table(name = "order_status")
public class Status {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    public Status() {
        this.createdAt = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
    }

    public Status(Order order, String status) {
        this.order = order;
        this.status = status;
        this.createdAt = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.lastUpdated = LocalDateTime.now();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public long getTimeElapsedMinutes() {
        return Duration.between(lastUpdated, LocalDateTime.now()).toMinutes();
    }

    @Override
    public String toString() {
        return "Order ID: " + order.getId() + ", Status: " + status +
               ", Last Updated: " + getTimeElapsedMinutes() + " min ago";
    }

    // console prints for testing
    private static List<Status> orderList = new ArrayList<>();
    private static List<Status> completedOrders = new ArrayList<>();
    private static int orderCounter = 1; // order id tests

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Kitchen Staff Backend");
        while (true) {
            System.out.println("\n-------------------------");
            displayOrders();
            System.out.println("\nMenu:");
            System.out.println("1. Create a new order");
            System.out.println("2. Change order status");
            System.out.println("3. Exit");
            System.out.print("Choose an option: ");
            int choice = scanner.nextInt();
            scanner.nextLine();
            System.out.println("-------------------------");

            switch (choice) {
                case 1:
                    createNewOrder(scanner);
                    break;
                case 2:
                    changeOrderStatus(scanner);
                    break;
                case 3:
                    System.out.println("Exiting the program. Goodbye!");
                    scanner.close();
                    return;
                default:
                    System.out.println("Invalid option. Please try again.");
            }
        }
    }

    private static void createNewOrder(Scanner scanner) {
        System.out.print("Enter order description: ");
        String description = scanner.nextLine();
        Order order = new Order(orderCounter++, description);
        Status newStatus = new Status(order, "Pending");
        orderList.add(newStatus);
        System.out.println("Order created: " + newStatus);
        System.out.println("-------------------------");
    }

    private static void changeOrderStatus(Scanner scanner) {
        System.out.print("Enter the Order ID to update: ");
        int orderId = scanner.nextInt();
        scanner.nextLine(); // Consume newline

        Status orderToUpdate = null;
        for (Status status : orderList) {
            if (status.getOrder().getId() == orderId) {
                orderToUpdate = status;
                break;
            }
        }

        if (orderToUpdate == null) {
            System.out.println("Order not found.");
            System.out.println("-------------------------");
            return;
        }

        System.out.println("Current status: " + orderToUpdate.getStatus() +
                           " (Last updated: " + orderToUpdate.getTimeElapsedMinutes() + " min ago)");
        System.out.print("Enter new status (preparing/completed): ");
        String newStatus = scanner.nextLine().toLowerCase();

        if (newStatus.equals("preparing") || newStatus.equals("completed")) {
            orderToUpdate.setStatus(newStatus);
            System.out.println("Order status updated: " + orderToUpdate);
            if (newStatus.equals("completed")) {
                completedOrders.add(orderToUpdate);
                orderList.remove(orderToUpdate);
            }
        } else {
            System.out.println("Invalid status. Only 'preparing' or 'completed' are allowed.");
        }
        System.out.println("-------------------------");
    }

    private static void displayOrders() {
        System.out.println("\nCurrent Orders:");
        for (Status status : orderList) {
            System.out.println(status);
        }

        System.out.println("\nCompleted Orders:");
        for (Status status : completedOrders) {
            System.out.println(status);
        }
    }
}
