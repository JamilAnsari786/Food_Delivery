import React, { useEffect, useState } from "react";
import "./Order.css";
import axios from "axios";

const Order = () => {
  const url = "http://localhost:4000"; 
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${url}/api/order/admin/orders`);
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err.message);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="order-page">
      <h2>All Paid Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Items</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.userId}</td>
                <td>${order.amount}</td>
                <td>{order.status}</td>
                <td>{new Date(order.date).toLocaleString()}</td>
                <td>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <p>{order.address.firstName} {order.address.lastName}</p>
                  <p>{order.address.street}, {order.address.city}</p>
                  <p>{order.address.state}, {order.address.zipcode}</p>
                  <p>{order.address.country}</p>
                  <p>{order.address.phone}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Order;
