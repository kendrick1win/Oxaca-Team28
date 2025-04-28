package uk.ac.rhul.cs2860.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "assistance")
public class Assistance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "table_number")
    private int tableNumber;
    
    @Column(name = "assistance_time")
    private LocalDateTime assistanceTime;

    // Constructors
    public Assistance() {
    }

    /**
     * Constructor to initialise a new Assistance object.
     *
     * @param {int, LocalDateTime} tableNumber, assistanceTime - number of the table that requires
     *        assistance, and the time of assistance.
     */
    public Assistance(int tableNumber, LocalDateTime assistanceTime) {
        this.tableNumber = tableNumber;
        this.assistanceTime = assistanceTime;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public int getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(int tableNumber) {
        this.tableNumber = tableNumber;
    }

    public LocalDateTime getAssistanceTime() {
        return assistanceTime;
    }

    public void setAssistanceTime(LocalDateTime assistanceTime) {
        this.assistanceTime = assistanceTime;
    }
}
