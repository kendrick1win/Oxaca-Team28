package uk.ac.rhul.cs2860.model;

import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

public class AssistanceTest {

  @Test
  void createAssistanceObject() {
    Assistance assist = new Assistance();
    Assistance assist2 = new Assistance(2, LocalDateTime.of(2024, 4, 2, 14, 33, 0));

    assertEquals(2, assist2.getTableNumber());
    assertEquals(LocalDateTime.of(2024, 4, 2, 14, 33, 0), assist2.getAssistanceTime());
    
    assist.setTableNumber(5);
    assist.setAssistanceTime(LocalDateTime.of(2024, 4, 2, 14, 36, 0));

    assertEquals(5, assist.getTableNumber());
    assertEquals(LocalDateTime.of(2024,4,2, 14,36,0), assist.getAssistanceTime());
  }
}
