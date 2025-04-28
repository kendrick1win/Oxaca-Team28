package uk.ac.rhul.cs2860.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import uk.ac.rhul.cs2860.model.Status;
import java.util.List;
import java.util.Optional;

@Repository
public interface StatusRepository extends CrudRepository<Status, Long> {
    
    Optional<Status> findById(Long id);
    
    List<Status> findAll();
}