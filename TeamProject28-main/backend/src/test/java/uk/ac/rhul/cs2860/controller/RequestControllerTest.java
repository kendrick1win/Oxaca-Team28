package uk.ac.rhul.cs2860.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import uk.ac.rhul.cs2860.model.Request;
import uk.ac.rhul.cs2860.repository.RequestRepository;

import static org.mockito.Mockito.*;

@WebMvcTest(RequestController.class)
@AutoConfigureMockMvc(addFilters = false)
public class RequestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RequestRepository requestRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testAddRequest() throws Exception {
        Request request = new Request("John", 1, "Need help", LocalDateTime.now(), "Pending");

        when(requestRepository.save(any(Request.class))).thenReturn(request);

        mockMvc.perform(post("/requests/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetAllRequests() throws Exception {
        mockMvc.perform(get("/requests/all-requests"))
                .andExpect(status().isOk());
    }
}