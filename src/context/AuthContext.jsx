import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("ph_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const loginWithGoogle = () => {
    const dummyUser = {
      uid: "google-12345",
      name: "Kaushal Patel",
      email: "kaushal@example.com",
      phone: "+1 (555) 234-5678",
      addresses: [
        "123 Broadway, Apt 4B, New York, NY 10006",
        "456 Park Avenue, Manhattan, NY 10022"
      ],
      photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
    };
    setUser(dummyUser);
    localStorage.setItem("ph_user", JSON.stringify(dummyUser));
    return dummyUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ph_user");
  };

  const updateProfile = (updatedData) => {
    if (!user) return;
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem("ph_user", JSON.stringify(newUser));
  };

  const addAddress = (newAddress) => {
    if (!user) return;
    const newAddresses = [...user.addresses, newAddress];
    updateProfile({ addresses: newAddresses });
  };

  const removeAddress = (indexToRemove) => {
    if (!user) return;
    const newAddresses = user.addresses.filter((_, idx) => idx !== indexToRemove);
    updateProfile({ addresses: newAddresses });
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, updateProfile, addAddress, removeAddress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
