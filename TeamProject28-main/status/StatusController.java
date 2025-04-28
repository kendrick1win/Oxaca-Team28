package uk.ac.rhul.cs2860.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import uk.ac.rhul.cs2860.model.Status;
import uk.ac.rhul.cs2860.repository.StatusRepository;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class StatusController {

    @Autowired
    private StatusRepository statusRepository;

    @GetMapping("/statuses")
    public List<Status> getAllStatuses() {
        return statusRepository.findAll();
    }

    @GetMapping("/status/{id}")
    public Optional<Status> getStatusById(@PathVariable Long id) {
        return statusRepository.findById(id);
    }

    @PutMapping("/status/{id}")
    public Status updateStatus(@PathVariable Long id, @RequestBody Status newStatus) {
        return statusRepository.findById(id).map(status -> {
            status.setStatus(newStatus.getStatus());
            return statusRepository.save(status);
        }).orElseThrow(() -> new RuntimeException("Order Status not found"));
    }
}
