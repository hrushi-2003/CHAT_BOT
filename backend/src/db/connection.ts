import mongoose from "mongoose";
export const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("mongodb connected successfully 🤟");
  } catch (error) {
    console.log("error in mongodb connection " + error);
  }
};
export const disconnect = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.log("could not disconnect mongodb connection");
  }
};
