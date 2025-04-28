package uk.ac.rhul.cs2860.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;

public class OrderItemTest {

  @Test
  void checkOrderItemProperties() {
    Order order = new Order();
    order.setId(1L);
    Order order2 = new Order();
    order2.setId(2L);

    Item item = new Item();
    item.setName("Taco");
    Item item2 = new Item();
    item2.setName("Pizza");


    OrderItem oi = new OrderItem(order, item, 2);
    OrderItem oi2 = new OrderItem();
    assertNotNull(oi2);

    oi.setId(5L);
    oi.setItem(item);

    assertEquals(5L, oi.getId());
    assertEquals(1L, oi.getOrder().getId());
    assertEquals("Taco", oi.getItem().getName());

    oi.setOrder(order2);
    oi.setItem(item2);
    assertEquals(2L, oi.getOrder().getId());
    assertEquals("Pizza", oi.getItem().getName());

    assertEquals(2, oi.getQuantity());
    oi.setQuantity(1);
    assertEquals(1, oi.getQuantity());
  }
}
