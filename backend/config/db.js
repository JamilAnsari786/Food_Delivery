import mongoose from 'mongoose'

export const connectDB = async ()=>{
  await mongoose.connect('mongodb+srv://jamilansari828:jamilansari8282@cluster0.l0qery3.mongodb.net/food_dell').then(()=>console.log("DB Connected"));
}
