"use client";
import React, { useState } from "react";
const ReviewPage = () => {
  const [review, setReview] = useState({
    movie_id: "",
    user_id: "",
    rating: "",
    comment: "",
  });
  const handleReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
      const data = await res.json();
      alert("review added");
      setReview({
        movie_id: "",
        user_id: "",
        rating: "",
        comment: "",
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <h1>add review</h1>
      <form onSubmit={handleReview} className="flex flex-col">
        <input
          type="text"
          placeholder="movie_id"
          onChange={(e) => setReview({ ...review, movie_id: e.target.value })}
        />
        <input
          type="text"
          placeholder="user_id"
          onChange={(e) => setReview({ ...review, user_id: e.target.value })}
        />
        <input
          type="text"
          placeholder="rating"
          value={review.rating}
          onChange={(e) =>
            setReview({ ...review, rating: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="comment"
          onChange={(e) => setReview({ ...review, comment: e.target.value })}
        />
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default ReviewPage;
