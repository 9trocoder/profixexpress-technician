// src/pages/ServicePricing.js
import React, { useState } from "react";
import { ref, set } from "firebase/database";
import { auth, db } from "../utilities/firebaseConfig";

const ServicePricing = () => {
  const [pricing, setPricing] = useState({ service: "", price: "" });

  const handleChange = (e) => {
    setPricing({ ...pricing, [e.target.name]: e.target.value });
  };

  const savePricing = () => {
    if (auth.currentUser) {
      set(ref(db, `technicians/${auth.currentUser.uid}/pricing/${pricing.service}`), { price: pricing.price });
      alert("Pricing updated!");
    }
  };

  return (
    <div>
      <h2>Set Service Pricing</h2>
      <input type="text" name="service" placeholder="Service Name" onChange={handleChange} />
      <input type="number" name="price" placeholder="Price ($)" onChange={handleChange} />
      <button onClick={savePricing}>Save Pricing</button>
    </div>
  );
};

export default ServicePricing;
