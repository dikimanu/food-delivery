import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    phone: ""
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    if (getTotalCartAmount() === 0) {
      alert("Your cart is empty!");
      return;
    }

    let orderItems = food_list
      .filter(item => cartItems[item._id] > 0)
      .map(item => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: cartItems[item._id],
      }));

    let orderData = {
       userId: localStorage.getItem("userId"),
      address: data,
      items: orderItems,
      amount: getTotalCartAmount(),
    };

    try {
      const response = await axios.post(
        `${url}/api/order/place`,
        orderData,
        { headers: { token } }
      );

      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        alert("Payment creation failed!");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    }
  };

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token, getTotalCartAmount()]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First name" required />
          <input name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last name" required />
        </div>

        <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address" required />
        <input name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" required />

        <div className="multi-fields">
          <input name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" required />
          <input name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" required />
        </div>

        <div className="multi-fields">
          <input name="pincode" onChange={onChangeHandler} value={data.pincode} type="text" placeholder="Pincode" required />
          <input name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" required />
        </div>

        <input name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone" required />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />

            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />

            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>

          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
