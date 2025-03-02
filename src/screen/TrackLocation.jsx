// src/pages/TrackLocation.js
import React, { useState } from "react";
import { ref, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../utilities/firebaseConfig";

const TrackLocation = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(coords);
          if (auth.currentUser) {
            update(ref(db, `technicians/${auth.currentUser.uid}`), { location: coords });
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error.message);
          setLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Track Location</h2>
      <button onClick={getLocation} disabled={loading}>
        {loading ? "Updating..." : "Get Current Location"}
      </button>
      {location.lat && location.lng && (
        <p>
          Current Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </p>
      )}
      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
};

export default TrackLocation;
