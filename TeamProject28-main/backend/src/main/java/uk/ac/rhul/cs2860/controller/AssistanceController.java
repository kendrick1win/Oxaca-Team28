package uk.ac.rhul.cs2860.controller;

import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import uk.ac.rhul.cs2860.model.Assistance;
import uk.ac.rhul.cs2860.repository.AssistanceRepository;

// Class for handling POST request for assistance
@RestController
@RequestMapping("/api/assistance")
public class AssistanceController {

    @Autowired
    private AssistanceRepository assistanceRepository;

    /**
     * createAssistance POST handler
     *
     * @param {integer} tableNumber - table number of the customer who requires assistance.
     * @return a saved assistance object.
     */
    @PostMapping
    public ResponseEntity<Assistance> createAssistance(@RequestParam("tableNumber") int tableNumber) {
        Assistance assistance = new Assistance(tableNumber, LocalDateTime.now());
        Assistance savedAssistance = assistanceRepository.save(assistance);
        return ResponseEntity.ok(savedAssistance);
    }
}
