import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;

    if (!userId || !items || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing order data" });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // Delivery logic
    let deliveryFee = 2;
    let total = amount + deliveryFee;
    if (total < 50) {
      deliveryFee = 50 - amount;
      total = 50;
    }

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: deliveryFee * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:5173/verify?success=true",
      cancel_url: "http://localhost:5173/verify?success=false",
    });

    // Save order before payment (optional — change based on flow)
    await new orderModel({
      userId,
      items,
      amount: total,
      address,
      payment: false,
    }).save();

    // Clear cart after placing order
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.status(200).json({
      success: true,
      message: "Order placed",
      session_url: session.url,
    });
  } catch (error) {
    console.error("Place order error:", error.message);
    res.status(500).json({ success: false, message: "An error occurred while placing your order." });
  }
};

export { placeOrder };
