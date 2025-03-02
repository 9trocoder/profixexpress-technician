// src/pages/Reviews.js
import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { Link } from "react-router-dom";
import { auth, db } from "../utilities/firebaseConfig";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const technicianId = auth.currentUser.uid;
    const reviewsRef = ref(db, "reviews");
    onValue(reviewsRef, (snapshot) => {
      if (snapshot.exists()) {
        const allReviews = Object.entries(snapshot.val()).map(([id, review]) => ({ id, ...review }));
        const myReviews = allReviews.filter(review => review.technicianId === technicianId);
        setReviews(myReviews);
      }
    });
  }, []);

  return (
    <div>
      <h2>My Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map(review => (
          <div key={review.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <p><strong>User:</strong> {review.userName}</p>
            <p><strong>Rating:</strong> {review.rating}</p>
            <p>{review.comment}</p>
          </div>
        ))
      ) : (
        <p>No reviews available.</p>
      )}
      <Link to="/dashboard">Back to Dashboard</Link>
    </div>
  );
};

export default Reviews;
