// src/pages/LiveLocation.js
import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader
} from "@react-google-maps/api";
import { auth, db } from "../utilities/firebaseConfig";
import { ref, set } from "firebase/database";

const containerStyle = {
  width: "100%",
  height: "400px"
};

const defaultCenter = { lat: 37.7749, lng: -122.4194 };

const LiveLocation = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCeirrtXS_SjOfBcSX_-uetXg0jtsawF-s",
    // If AdvancedMarkerElement is supported, you can try adding "marker" library:
    libraries: ["marker"]
  });

  const [position, setPosition] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const newPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          console.log("Obtained new position:", newPosition);
          setPosition(newPosition);
          if (auth.currentUser) {
            set(ref(db, `technicians/${auth.currentUser.uid}/location`), newPosition);
          }
        },
        (error) => {
          console.error("Error obtaining geolocation:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading Maps...</p>;

  return (
    <div>
      <h2>Live Location Tracking</h2>
      {position ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={position || defaultCenter}
          zoom={13}
        >
          <Marker
            position={position}
            onClick={() => setInfoOpen(true)}
            // You can customize the marker icon if needed:
            // icon={{ url: "your-custom-icon-url.png", scaledSize: new window.google.maps.Size(30, 30) }}
          />
          {infoOpen && (
            <InfoWindow position={position} onCloseClick={() => setInfoOpen(false)}>
              <div>Your Live Location</div>
            </InfoWindow>
          )}
        </GoogleMap>
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
};

export default LiveLocation;
