// App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppContent from "./AppContent.jsx";

function App() {
  // 👈 chạy lại mỗi khi đổi route

  return (
    
     <BrowserRouter>
      <AppContent />
    </BrowserRouter>

  );
}

export default App;
