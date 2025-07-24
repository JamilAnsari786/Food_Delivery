import userModel from "../models/userModel.js";

// ➕ Add to Cart
const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const cart = user.cartData || {};
    cart[itemId] = (cart[itemId] || 0) + 1;

    user.cartData = cart;
    await user.save();

    res.json({ success: true, message: "Item added to cart", cartData: cart });
  } catch (error) {
    console.error("Add to cart error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ➖ Remove from Cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const cart = user.cartData || {};

    if (cart[itemId]) {
      cart[itemId] -= 1;
      if (cart[itemId] <= 0) {
        delete cart[itemId];
      }

      user.cartData = cart;
      await user.save();

      res.json({ success: true, message: "Item removed from cart", cartData: cart });
    } else {
      res.json({ success: false, message: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Remove from cart error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 🛍️ Get Cart (on page reload)
const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const cart = user.cartData || {};
    res.status(200).json({ success: true, cartData: cart });
  } catch (error) {
    console.error("Get cart error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { addToCart, removeFromCart, getCart };
