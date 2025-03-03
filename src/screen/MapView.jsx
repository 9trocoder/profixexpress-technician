// src/pages/MapView.js
import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { ref, onValue } from "firebase/database";
import { db } from "../utilities/firebaseConfig";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

// Fallback center in case geolocation fails
const fallbackCenter = { lat: 6.458985, lng: 3.601521 };

const MapView = () => {
  const [tasks, setTasks] = useState([]);
  const [center, setCenter] = useState(fallbackCenter);
  const [mapInstance, setMapInstance] = useState(null);

  // Load the Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCeirrtXS_SjOfBcSX_-uetXg0jtsawF-s",
    // You can add libraries if needed: libraries: ["places"]
  });

  // Use browser geolocation to update the center
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("Obtained current location:", newCenter);
          setCenter(newCenter);
        },
        (error) => {
          console.error("Error obtaining current location:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.error("Geolocation not supported by this browser.");
    }
  }, []);

  // When the map instance is available and the center updates, pan to the new center
  useEffect(() => {
    if (mapInstance && center) {
      mapInstance.panTo(center);
    }
  }, [mapInstance, center]);

  // Fetch tasks from Firebase (that have a location)
  useEffect(() => {
    const tasksRef = ref(db, "jobs");
    onValue(tasksRef, (snapshot) => {
      if (snapshot.exists()) {
        const tasksData = Object.entries(snapshot.val()).map(([id, task]) => ({
          id,
          ...task,
        }));
        const tasksWithLocation = tasksData.filter((task) => task.location);
        setTasks(tasksWithLocation);
      }
    });
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={16}
      onLoad={(map) => setMapInstance(map)}
    >
      {tasks.map((task) => (
        <Marker
          key={task.id}
          position={{ lat: task.location.lat, lng: task.location.lng }}
          label={task.title}
        />
      ))}
    </GoogleMap>
  );
};

export default MapView;
