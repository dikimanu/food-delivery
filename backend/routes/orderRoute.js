import express from "express";
import authMiddleware from "../middleware/auth.js";
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

// PLACE ORDER (Protected)
orderRouter.post("/place", authMiddleware, placeOrder);

// VERIFY PAYMENT (❗ Should be NOT protected)
orderRouter.post("/verify", verifyOrder);

// USER ORDERS (Protected)
orderRouter.post("/userorders", authMiddleware, userOrders);

// ADMIN: LIST ALL ORDERS (Optional: Add admin auth later)
orderRouter.get("/list", listOrders);

orderRouter.post("/status",updateStatus)

export default orderRouter;
