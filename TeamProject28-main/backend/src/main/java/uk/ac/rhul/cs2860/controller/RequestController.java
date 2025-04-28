package uk.ac.rhul.cs2860.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.rhul.cs2860.model.Request;
import uk.ac.rhul.cs2860.repository.RequestRepository;

// Class for handling POST, GET, PUT and DELETE requests for requests.
@RestController
@RequestMapping("/requests")
public class RequestController {

    @Autowired
    private RequestRepository requestRepository;

    /**
     * addRequest POST handler
     *
     * @param {Request} newRequest - request to be added.
     * @return a saved request object.
     */
    @PostMapping("/add")
    public Request addRequest(@RequestBody Request newRequest) {
        if (newRequest.getStatus() == null || newRequest.getStatus().isBlank()) {
            newRequest.setStatus("Pending");
        }
        if (newRequest.getRequestTime() == null) {
            newRequest.setRequestTime(LocalDateTime.now());
        }
        return requestRepository.save(newRequest);
    }

    /**
     * GET handler retrieving all requests
     *
     * @return all requests found.
     */
    @GetMapping("/all-requests")
    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }

    /**
     * GET handler retrieving request with a specific id.
     *
     * @param {Long} id - id of request to be retrieved.
     * @return request or throws exception if id/request is not found.
     */
    @GetMapping("/id/{id}")
    public Request getRequestById(@PathVariable Long id) {
        Optional<Request> request = requestRepository.findById(id);
        if (request.isPresent()) {
            return request.get();
        }
        throw new RuntimeException("Request not found with id " + id);
    }

    /**
     * createRequest POST handler
     *
     * @param {Request} newRequest - request to be created
     * @return a saved request object.
     */
    @PostMapping("")
    public Request createRequest(@RequestBody Request newRequest) {
        return requestRepository.save(newRequest);
    }

    /**
     * PUT handler to update request
     *
     * @param {Long, Request} id, updatedRequest - id and request of the order to be updated
     * @return a saved request object or throws exception if order is not found.
     */
    @PutMapping("/{id}")
    public Request updateRequest(@PathVariable Long id, @RequestBody Request updatedRequest) {
        Optional<Request> optionalRequest = requestRepository.findById(id);
        if (optionalRequest.isPresent()) {
            Request request = optionalRequest.get();
            request.setName(updatedRequest.getName());
            request.setTableNumber(updatedRequest.getTableNumber());
            request.setRequest(updatedRequest.getRequest());
            request.setRequestTime(updatedRequest.getRequestTime());
            request.setStatus(updatedRequest.getStatus());
            return requestRepository.save(request);
        }
        throw new RuntimeException("Request not found with id " + id);
    }

    /**
     * DELETE handler to remove a specific request
     *
     * @param {Long} id - id of order to be deleted.
     */
    @DeleteMapping("/{id}")
    public void deleteRequest(@PathVariable Long id) {
        requestRepository.deleteById(id);
    }

    /**
     * PUT handler to update request to solved.
     *
     * @param {Long} id - id of request to update.
     * @return a saved request object or throws an exception if request is not found.
     */
    @PutMapping("/mark-solved/{id}")
    public Request markAsSolved(@PathVariable Long id) {
        Optional<Request> optionalRequest = requestRepository.findById(id);
        if (optionalRequest.isPresent()) {
            Request request = optionalRequest.get();
            request.setStatus("Solved");
            return requestRepository.save(request);
        }
        throw new RuntimeException("Request not found with id " + id);
    }
}
