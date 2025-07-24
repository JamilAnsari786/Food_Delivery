import foodModel from "../models/foodModel.js";
import fs from "fs";

// Add Food
const addFood = async (req, res) => {
  try {
    const image_filename = req.file?.filename || "";
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category || !image_filename) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const food = await new foodModel({
      name,
      description,
      price,
      category,
      image: image_filename,
    }).save();

    res.json({ success: true, message: "✅ Food added", data: food });
  } catch (error) {
    console.error("Add food error:", error.message);
    res.status(500).json({ success: false, message: "Error adding food" });
  }
};

// List Food
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("List food error:", error.message);
    res.status(500).json({ success: false, message: "Error fetching food" });
  }
};

// Remove Food
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) return res.status(404).json({ success: false, message: "Food not found" });

    fs.unlink(`uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Food removed" });
  } catch (error) {
    console.error("Remove food error:", error.message);
    res.status(500).json({ success: false, message: "Error removing food" });
  }
};

export { addFood, listFood, removeFood };
