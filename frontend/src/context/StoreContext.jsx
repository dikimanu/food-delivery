import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "https://food-delivery-backend-bn5j.onrender.com"; //ttp://localhost:8000
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  // -------------------------
  // ADD TO CART
  // -------------------------
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
    }
  };

  // -------------------------
  // REMOVE FROM CART
  // -------------------------
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] - 1,
    }));

    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };

  // -------------------------
  // CALCULATE TOTAL AMOUNT
  // -------------------------
  const getTotalCartAmount = () => {
    let total = 0;

    for (const itemId in cartItems) {
      const itemQuantity = cartItems[itemId];

      if (itemQuantity > 0) {
        const itemInfo = food_list.find(
          (product) => product._id.toString() === itemId.toString()
        );

        if (itemInfo) total += itemInfo.price * itemQuantity;
      }
    }

    return total;
  };

  // -------------------------
  // FETCH FOOD LIST FROM API
  // -------------------------
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);

      if (response.data.success) {
        setFoodList(response.data.data);
      }
    } catch (error) {
      console.log("Error fetching food list", error);
    }
  };

  // -------------------------
  // LOAD CART FROM BACKEND
  // -------------------------
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token } }
      );
      setCartItems(response.data.cartData);
    } catch (error) {
      console.log("Error loading cart", error);
    }
  };

  // -------------------------
  // ON COMPONENT LOAD
  // -------------------------
  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();

      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    };

    loadData();
  }, []);

  // -------------------------
  // CONTEXT VALUE
  // -------------------------
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    setFoodList,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
