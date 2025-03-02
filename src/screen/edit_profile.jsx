// src/pages/EditProfile.js
import React, { useState, useEffect } from "react";
import { ref, get, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../utilities/firebaseConfig";

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: "", service: "" });
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const profileRef = ref(db, `technicians/${user.uid}`);
      get(profileRef).then((snapshot) => {
        if (snapshot.exists()) {
          setProfile(snapshot.val());
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (user) {
      await update(ref(db, `technicians/${user.uid}`), profile);
      navigate("/dashboard");
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSave}>
        <input type="text" name="name" value={profile.name} onChange={handleChange} required />
        <select name="service" value={profile.service} onChange={handleChange} required>
          <option value="">Select Service</option>
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="carpentry">Carpentry</option>
        </select>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditProfile;
