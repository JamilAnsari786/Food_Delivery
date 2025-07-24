import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder } from "../controllers/orderController.js";
import orderModel from "../models/orderModel.js";

const orderRouter = express.Router();

// Place order (user must be authenticated)
orderRouter.post("/place", authMiddleware, placeOrder);

// Admin: Get all paid orders
orderRouter.get("/admin/orders", async (req, res) => {
  try {
    const orders = await orderModel.find({ payment: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Admin order fetch error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default orderRouter;
