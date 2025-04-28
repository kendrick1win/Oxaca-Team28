package uk.ac.rhul.cs2860.model;

import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;

public class RequestTest {

  @Test
  void checkRequestProperties() {
    Request request = new Request();
    assertNotNull(request);

    request.setId(1L);
    request.setName("abc");
    request.setRequest("Request1");
    request.setTableNumber(12);
    request.setRequestTime(LocalDateTime.of(2024, 4, 2, 15, 52, 0));
    request.setStatus("pending");

    assertEquals(1L, request.getId());
    assertEquals("abc", request.getName());
    assertEquals(12, request.getTableNumber());
    assertEquals("Request1", request.getRequest());
    assertEquals(LocalDateTime.of(2024, 4, 2, 15, 52, 0), request.getRequestTime());
    assertEquals("pending", request.getStatus());

    Request request2 =
        new Request("abc", 12, "Request1", LocalDateTime.of(2024, 4, 2, 15, 52, 0), "pending");
    assertEquals("abc", request2.getName());
    assertEquals(12, request2.getTableNumber());
    assertEquals("Request1", request2.getRequest());
    assertEquals(LocalDateTime.of(2024, 4, 2, 15, 52, 0), request2.getRequestTime());
    assertEquals("pending", request2.getStatus());
  }
}
