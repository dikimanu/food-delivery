import mongoose from "mongoose";


export const connectDB = async () => {
  await mongoose.connect('mongodb+srv://dikimanu:dikimanu1@cluster0.wylyxro.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}