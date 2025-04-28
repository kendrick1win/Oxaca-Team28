package uk.ac.rhul.cs2860.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;

public class KitchenOrdersTest {

  @Test
  void testKitchenOrderProperties() {
    KitchenOrders ko = new KitchenOrders();
    assertNotNull(ko);

    Order order = new Order();
    order.setName("abc");
    order.setTableNumber(12);
    order.setTotal(new BigDecimal("2.99"));
    order.setOrderTime(LocalDateTime.of(2024, 4, 2, 15, 44, 0));
    order.setRequests("Request1");

    List<KitchenOrderItem> list = new ArrayList<>();
    KitchenOrderItem koi = new KitchenOrderItem();
    list.add(koi);


    KitchenOrders ko2 = new KitchenOrders(order);
    ko2.setId(1L);
    ko2.setName("qwerty");
    ko2.setConfirmedAt(LocalDateTime.of(2024, 4, 2, 15, 44, 0));
    ko2.setOrderTime(LocalDateTime.of(2024, 4, 2, 15, 34, 0));
    ko2.setRequests("Request11");
    ko2.setTableNumber(11);
    ko2.setTotal(new BigDecimal("2.99"));
    ko2.setKitchenOrderItems(list);

    assertEquals(1L, ko2.getId());
    assertEquals("qwerty", ko2.getName());
    assertEquals(LocalDateTime.of(2024, 4, 2, 15, 34, 0), ko2.getOrderTime());
    assertEquals(LocalDateTime.of(2024, 4, 2, 15, 44, 0), ko2.getConfirmedAt());
    assertEquals("Request11", ko2.getRequests());
    assertEquals(11, ko2.getTableNumber());
    assertEquals(new BigDecimal("2.99"), ko2.getTotal());
    assertEquals(list, ko2.getKitchenOrderItems());
  }
}