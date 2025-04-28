package uk.ac.rhul.cs2860.repository;

import org.springframework.data.repository.CrudRepository;
import uk.ac.rhul.cs2860.model.Item;
import java.util.List;

public interface ItemRepository extends CrudRepository<Item, Long> {
    List<Item> findByCategory(String category);
}
