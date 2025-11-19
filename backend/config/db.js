import mongoose from "mongoose";


export const connectDB = async () => {
  await mongoose.connect('mongodb+srv://dikimanu:dikimanu1@cluster0.wylyxro.mongodb.net/?appName=Cluster0/food-del').then(()=>console.log("DB Connected"));
}