import mongoose, { Schema } from "mongoose";
const movieSchema=new Schema({
    title: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    rating: {type:Number},
    director: { type: String },
    description: { type: String },
},
{
    timestamps: true
}
)
const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);
export default Movie;