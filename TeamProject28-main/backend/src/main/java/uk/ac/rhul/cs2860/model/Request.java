package uk.ac.rhul.cs2860.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "requests")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "table_number")
    private int tableNumber;

    private String request;

    @Column(name = "request_time")
    private LocalDateTime requestTime;

    private String status;

    // Constructors
    public Request() {}

    /**
     * Constructor to initialise a new Request object.
     *
     * @param {String, integer, String, LocalDateTime, String} name, taleNumber, request,
     *        requestTime, status - information about the request alongside when it was made and the
     *        status of the request.
     * 
     */
    public Request(String name, int tableNumber, String request, LocalDateTime requestTime, String status) {
        this.name = name;
        this.tableNumber = tableNumber;
        this.request = request;
        this.requestTime = requestTime;
        this.status = status;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getTableNumber() {
        return tableNumber;
    }

    public String getRequest() {
        return request;
    }

    public LocalDateTime getRequestTime() {
        return requestTime;
    }

    public String getStatus() {
        return status;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setTableNumber(int tableNumber) {
        this.tableNumber = tableNumber;
    }

    public void setRequest(String request) {
        this.request = request;
    }

    public void setRequestTime(LocalDateTime requestTime) {
        this.requestTime = requestTime;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}