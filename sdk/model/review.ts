// models/Review.ts
import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
  movie_id: { type: Schema.Types.ObjectId, ref: "Movie" },
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  rating: String,
  comment: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
