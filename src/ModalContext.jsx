import React, { createContext, useState } from "react";

export const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <ModalContext.Provider value={{ showLogin, setShowLogin, showRegister, setShowRegister }}>
      {children}
    </ModalContext.Provider>
  );
}