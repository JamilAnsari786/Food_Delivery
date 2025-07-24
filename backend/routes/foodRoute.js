import express from 'express';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';
import multer from 'multer';
import path from 'path';

// Image Storage Engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // ✅ relative to project root
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });


const foodRouter = express.Router();
foodRouter.post("/add", upload.single("image"), addFood);

foodRouter.get('/list',listFood)
foodRouter.post('/remove',removeFood)

export default foodRouter;
