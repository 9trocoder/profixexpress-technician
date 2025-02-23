import React, { createContext, useState, useEffect } from "react";

export const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const initialData = JSON.parse(localStorage.getItem("bookData")) || {
    signup_step_1: {},
    signup_step_2: {},
    signup_step_3: {},
    signup_step_4: {},
  };

  const [bookData, setBookData] = useState(initialData);

  useEffect(() => {
    localStorage.setItem("bookData", JSON.stringify(bookData));
  }, [bookData]);

  return (
    <BookContext.Provider value={{ bookData, setBookData }}>
      {children}
    </BookContext.Provider>
  );
};
