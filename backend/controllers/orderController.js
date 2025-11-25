import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// PLACE ORDER
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5174/"; //ttp://localhost:5174/

  try {
    // 1️⃣ Save order in database
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();

    // 2️⃣ Empty user's cart
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // 3️⃣ Stripe Line Items
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",             // ⬅ SAFE & works everywhere
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add delivery charge
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Charges" },
        unit_amount: 200, // $2.00
      },
      quantity: 1,
    });

    // 4️⃣ Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    return res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.log("🔥 STRIPE ERROR:", error);
    return res.json({ success: false, message: error.message });
  }
};

// GET USER ORDERS
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};

// VERIFY ORDER
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment successful" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment cancelled" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error verifying payment" });
  }
};

// ADMIN: LIST ALL ORDERS
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};
const updateStatus = async (req,res) => {
try {
  await  orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
  res.json({success:true,message:"Status Updated"})
} catch (error) {
  console.log(error);
  res.json({success:false,message:"Error"})
}
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
