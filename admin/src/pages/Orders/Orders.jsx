import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");

      if (response.data.success) {
        setOrders(response.data.data);
        console.log(response.data.data);
      } else {
        toast.error("Failed to load orders");
      }

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching orders");
    }
  };

const statusHandler =async (event,orderId) =>{
const response = await axios.post(url+"/api/order/status",{
  orderId, status:event.target.value
})
if (response.data.success) {
  await fetchAllOrders();
}
}

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='order add'>
      <h3>Orders Page</h3>

      <div className='order-list'>
        {orders.length === 0 && (
          <p>No orders found</p>
        )}

        {orders.map((order, index) => (
          <div key={order._id || index} className="order-item">
            <img src={assets.parcel_icon} alt="parcel" />

            <div>
              {/* FOOD ITEMS */}
              <p className='order-item-food'>
                {order.items?.map((item, i) => (
                  i === order.items.length - 1
                    ? `${item.name} x ${item.quantity}`
                    : `${item.name} x ${item.quantity}, `
                ))}
              </p>

              {/* CUSTOMER NAME */}
              <p className='order-item-name'>
                {order.address.firstName + " " + order.address.lastName}
              </p>

              {/* ADDRESS */}
              <div className="order-item-address">
                <p>{order.address.street},</p>
                <p>
                  {order.address.city}, {order.address.state}, {order.address.country} - {order.address.pincode}
                </p>
              </div>

              {/* PHONE */}
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>

            {/* TOTAL ITEMS */}
            <p>Items: {order.items?.length || 0}</p>

            {/* AMOUNT */}
            <p>${order.amount}</p>

            {/* ORDER STATUS */}
            <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
