import React, { useState, useEffect } from "react";
import { ref, get, update } from "firebase/database";
import { auth, db, storage } from "../utilities/firebaseConfig";
import { getDownloadURL, uploadBytes, ref as storageRef } from "firebase/storage";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedServices, setSelectedServices] = useState({});
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snapshot = await get(ref(db, "categories"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          let servicesList = [];

          Object.values(data).forEach((category) => {
            if (category.services) {
              Object.values(category.services).forEach((service) => {
                servicesList.push(service.name);
              });
            }
          });

          setAllServices(servicesList);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    const fetchTechnicianData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snapshot = await get(ref(db, `technicians/${user.uid}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setName(data.name || "");
          setBio(data.bio || "");
          setExperience(data.experience || "");
          setImageUrl(data.profileImage || "");
          setSelectedServices(data.services || {});
        }
      } catch (error) {
        console.error("Error fetching technician data:", error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchServices();
      await fetchTechnicianData();
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleServiceSelection = (e) => {
    const selected = e.target.value;
    if (selected && !selectedServices[selected]) {
      setSelectedServices((prev) => ({
        ...prev,
        [selected]: "",
      }));
    }
  };

  const handlePriceChange = (service, price) => {
    setSelectedServices((prev) => ({
      ...prev,
      [service]: price,
    }));
  };

  const handleRemoveService = (service) => {
    setSelectedServices((prev) => {
      const updatedServices = { ...prev };
      delete updatedServices[service];
      return updatedServices;
    });
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    const user = auth.currentUser;
    if (!user) return;
    try {
      const imageRef = storageRef(storage, `profiles/${user.uid}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      setImageUrl(url);
      await update(ref(db, `technicians/${user.uid}`), { profileImage: url });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleUpdateField = async (field, value) => {
    if (!value.trim()) return;
    const user = auth.currentUser;
    if (!user) return;
    try {
      await update(ref(db, `technicians/${user.uid}`), { [field]: value });
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  const handleServiceUpdate = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await update(ref(db, `technicians/${user.uid}`), { services: selectedServices });
    } catch (error) {
      console.error("Error updating services:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Profile</h2>

      <div>
        <label>Full Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => handleUpdateField("name", name)}
        />
      </div>

      <div>
        <label>Bio:</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          onBlur={() => handleUpdateField("bio", bio)}
        />
      </div>

      <div>
        <label>Years of Experience:</label>
        <input
          type="number"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          onBlur={() => handleUpdateField("experience", experience)}
        />
      </div>

      <div>
        <label>Profile Image:</label>
        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} />
        {imageUrl && <img src={imageUrl} alt="Profile" width="100" />}
      </div>

      <h3>Select Services & Prices</h3>
      <select onChange={handleServiceSelection}>
        <option value="">-- Select a Service --</option>
        {allServices.map((service) => (
          <option key={service} value={service}>
            {service}
          </option>
        ))}
      </select>

      {Object.keys(selectedServices).length > 0 && (
        <div>
          {Object.keys(selectedServices).map((service) => (
            <div key={service} style={{ marginBottom: "10px" }}>
              <label>{service}:</label>
              <input
                type="number"
                placeholder="Enter Price"
                value={selectedServices[service]}
                onChange={(e) => handlePriceChange(service, e.target.value)}
              />
              <button onClick={() => handleRemoveService(service)}>Remove</button>
            </div>
          ))}
          <button onClick={handleServiceUpdate}>Update Services</button>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
