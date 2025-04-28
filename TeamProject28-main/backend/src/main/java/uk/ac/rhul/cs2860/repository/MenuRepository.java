package uk.ac.rhul.cs2860.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import uk.ac.rhul.cs2860.model.Menu;

@Repository
public interface MenuRepository extends CrudRepository<Menu, Long> {
    List<Menu> findByCategory(String category);

    @NonNull
    List<Menu> findAll();
}
