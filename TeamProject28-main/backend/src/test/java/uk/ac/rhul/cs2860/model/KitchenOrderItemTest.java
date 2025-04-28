package uk.ac.rhul.cs2860.model;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;

public class KitchenOrderItemTest {

  @Test
  void testKOIproperties() {
    Item item = new Item();
    item.setName("Taco");

    KitchenOrderItem koi = new KitchenOrderItem();

    koi.setId(1L);
    koi.setItem(item);
    koi.setQuantity(2);
    koi.setKitchenOrder(new KitchenOrders());

    assertEquals(1l, koi.getId());
    assertEquals("Taco", koi.getItem().getName());
    assertEquals(2, koi.getQuantity());
    assertNotNull(koi.getKitchenOrder());
  }
}
