package uk.ac.rhul.cs2860.repository;

import uk.ac.rhul.cs2860.model.Assistance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssistanceRepository extends JpaRepository<Assistance, Long> {
}
