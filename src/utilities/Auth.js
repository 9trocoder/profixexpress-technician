import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db, get, ref, set } from "./firebaseConfig";
import { onDisconnect } from "firebase/database";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to get user role from Firebase
  const getUserRole = async (uid) => {
    const userRef = ref(db, `users/${uid}/role`);
    const snapshot = await get(userRef);
    return snapshot.exists() ? snapshot.val() : null;
  };

  // Function to update user's online status
  const updateUserStatus = async (user) => {
    if (!user) return;

    const userRef = ref(db, `users/${user.uid}/status`);

    // Set user as online
    await set(userRef, { online: true, lastSeen: Date.now() });

    // Mark user offline when they disconnect
    onDisconnect(userRef).set({ online: false, lastSeen: Date.now() });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const role = await getUserRole(user.uid);

        if (role !== "user") {
          await signOut(auth);
          setCurrentUser(null);
        } else {
          setCurrentUser(user);
          updateUserStatus(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const getUserRole = async (uid) => {
  const userRef = ref(db, "users/" + uid);
  const snapshot = await get(userRef);
  return snapshot.exists() ? snapshot.val().role : null;
};

export const signInWithSocial = async (provider) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userRef = ref(db, "users/" + user.uid);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      await set(userRef, {
        uid: user.uid,
        email: user.email,
        formCompleted: false,
        role: "user",
      });
    } else if (snapshot.val().role !== "user") {
      await signOut(auth);
      return { error: "Only users can sign in." };
    }

    return { user };
  } catch (error) {
    return { error: error.message };
  }
};
