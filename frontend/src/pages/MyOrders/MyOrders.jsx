import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setData(response.data.data);
      } else {
        console.log("Failed to fetch orders");
      }
    } catch (error) {
      console.log("Error loading orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      <div className="container">
        {data.length === 0 && (
          <p className="empty-text">You have no orders yet.</p>
        )}

        {data.map((order, index) => (
          <div key={index} className="my-orders-order">
            <img src={assets.parcel_icon} alt="order icon" />

            <p>
              {order.items
                .map((item) => `${item.name} x${item.quantity}`)
                .join(", ")}
            </p>

            <p>${order.amount}.00</p>

            <p>Items: {order.items.length}</p>

            <p>
              <span className="status-dot">&#x25cf;</span>{" "}
              <b>{order.status}</b>
            </p>

            <button onClick={fetchOrders} className="track-btn">Track Order</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
