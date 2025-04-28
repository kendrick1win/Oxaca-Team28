package uk.ac.rhul.cs2860.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import uk.ac.rhul.cs2860.model.Assistance;
import uk.ac.rhul.cs2860.repository.AssistanceRepository;

import static org.mockito.Mockito.*;

@WebMvcTest(AssistanceController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AssistanceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AssistanceRepository assistanceRepository;

    @Test
    public void testCreateAssistance() throws Exception {
        Assistance assistance = new Assistance(1, LocalDateTime.now());

        when(assistanceRepository.save(any(Assistance.class))).thenReturn(assistance);

        mockMvc.perform(post("/api/assistance")
                .param("tableNumber", "1"))
                .andExpect(status().isOk());
    }
}
