package uk.ac.rhul.cs2860.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import uk.ac.rhul.cs2860.model.Request;

@Repository
public interface RequestRepository extends CrudRepository<Request, Long> {
    List<Request> findAll();
}
