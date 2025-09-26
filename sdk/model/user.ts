import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: String,
  email: String,
  age: Number,
  favorite_genre: String,
});

export default mongoose.models.User || mongoose.model("User", userSchema);