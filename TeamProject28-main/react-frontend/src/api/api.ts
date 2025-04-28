import axios from "axios";

const API_BASE_URL = "http://localhost:2860"; // Replace with your backend URL if needed

export const addItemToOrder = async (itemId: number, quantity: number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders/add`, null, {
      params: { itemId, quantity },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding item to order:", error);
    throw error;
  }
};

export const viewCurrentOrder = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/orders/current`);
    return response.data;
  } catch (error) {
    console.error("Error viewing current order:", error);
    throw error;
  }
};

// ✅ Fixed the template literal issue
export const insertAssistanceAlert = async (tableNumber: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/assistance`, // Wrapped inside backticks
      null, // No request body needed since we're using query params
      {
        params: { tableNumber },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error inserting assistance alert:", error);
    throw error;
  }
};
