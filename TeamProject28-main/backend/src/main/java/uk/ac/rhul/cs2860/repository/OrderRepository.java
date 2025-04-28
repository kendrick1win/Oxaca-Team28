package uk.ac.rhul.cs2860.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import uk.ac.rhul.cs2860.model.Order;

public interface OrderRepository extends CrudRepository<Order, Long> {
    List<Order> findByStatusNot(String status);

    List<Order> findByPayment(String payment);
}
