package uk.ac.rhul.cs2860.model;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;

public class SelectedItemsTest {

  @Test
  void checkSelectedItemsProperties() {
    SelectedItems st = new SelectedItems();
    assertNotNull(st);

    Item item = new Item();
    item.setName("Taco");
    item.setPrice(new BigDecimal("2.99"));
    assertEquals(0, st.getItems().size());

    st.addItem(item, 2);
    assertNotNull(st.getItems());
    assertEquals(1, st.getItems().size());

    assertEquals(1, st.getQuantities().size());

    Map<Item, Integer> items = new HashMap<>();
    items.put(item, 2);

    st.setItems(items);

    assertEquals(5.98, st.calculateTotalPrice());
    assertNotNull(st.toString());
    st.viewSelectedItems();

    st.removeItem(item, 1);
    assertEquals(1, st.getItems().size());
    st.removeItem(item, 1);
    assertEquals(0, st.getItems().size());

    st.clear();
    assertEquals(0, st.getItems().size());
  }
}