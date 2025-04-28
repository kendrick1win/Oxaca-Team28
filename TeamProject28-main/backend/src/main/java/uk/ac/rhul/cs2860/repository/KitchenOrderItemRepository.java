package uk.ac.rhul.cs2860.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import uk.ac.rhul.cs2860.model.KitchenOrderItem;

@Repository
public interface KitchenOrderItemRepository extends CrudRepository<KitchenOrderItem, Long> {
}