import React, { createContext, useEffect, useState } from "react";
import { GiConsoleController } from "react-icons/gi";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("formData");
    return savedData ? JSON.parse(savedData) : {};
  });

   // Update data and save it in localStorage
   const updateData = (newData) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, ...newData };
      localStorage.setItem("formData", JSON.stringify(updatedData)); // Save to storage
      return updatedData;
    });
  };

  // Load stored data from localStorage when the app starts
  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
      console.log(formData);
    }
  }, []);
  console.log(formData);

  return (
    <DataContext.Provider value={{ formData, updateData }}>
      {children}
    </DataContext.Provider>
  );
};
