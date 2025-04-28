package uk.ac.rhul.cs2860.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

public class OrderTest {

  @Test
  void checkOrderProperties() {
    Order order = new Order();

    order.setId(1L);
    order.setName("abc");
    order.setStatus("pending");
    order.setTableNumber(12);
    order.setRequests("Request1");
    order.setInitialOrderTime(LocalDateTime.of(2024, 4,2,14,49,0));
    order.setOrderTime(LocalDateTime.of(2024, 4, 2, 14, 59, 0));

    assertEquals(1l, order.getId());
    assertEquals("abc", order.getName());
    assertEquals("pending", order.getStatus());

    order.cancelOrder();
    assertEquals("canceled", order.getStatus());

    assertEquals(12, order.getTableNumber());
    assertEquals("Request1", order.getRequests());
    assertEquals(LocalDateTime.of(2024, 4, 2, 14, 49, 0), order.getInitialOrderTime());
    assertEquals(LocalDateTime.of(2024, 4, 2, 14, 59, 0), order.getOrderTime());


    assertEquals("unpaid", order.getPayment());
    order.setPayment("Paid");
    assertEquals("Paid", order.getPayment());

    Item item = new Item();
    item.setName("Taco");
    item.setPrice(new BigDecimal("2.99"));

    order.addOrderItem(item, 1);

    OrderItem oi = new OrderItem();
    List<OrderItem> list = new ArrayList<OrderItem>();
    list.add(oi);

    order.setOrderItems(list);

    assertEquals(list, order.getOrderItems());

    assertEquals(new BigDecimal("2.99"), order.getTotal());
    order.setTotal(new BigDecimal("3.99"));
    assertEquals(new BigDecimal("3.99"), order.getTotal());
  }
}
