// AppContent.jsx
import React from "react";
import axios from "axios";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Homepage from "./Home/Home";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import Products from "./Shop/Products";
import Ranking from "./Ranking/Ranking";
import Theater from "./Theater/Theater";
import Member from "./Member/Member";
import Product_detail from "./Shop/Product_detail";
import Booking from "./Booking/Booking";
import PaymentInfo from "./Payment/Payment_info";
import Login from "./Auth/Login";
import Up from "./up";
import Filter from "./Search/Filter";
import { ModalProvider } from "./ModalContext";
import PaymentResult from "./Payment/Payment";
import Cart from "./Cart/cart";
//import NavBar from "./NavBar/NavBar";

function AppContent() {
  const location = useLocation();
  //const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

 
 useEffect(() => {
// ...existing code...
const checkAuth = async () => {
  try {
    const res = await axios.post(
      'http://localhost:8036/auth/introspect',
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        withCredentials: true,
      }
    );

    if (res.data.status !== 200) {
      localStorage.removeItem("jwt");
      return;
    } else {
      console.log(res.data.data.userName);
      localStorage.setItem("username", res.data.data.userName); // Refresh token expiration
      return;
    }
  } catch (err) {
    console.error(err);
  }
};
// ...existing code...

  checkAuth();
}, [location.pathname]);
  return (
        <ModalProvider>

    <>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/Ranking" element={<Ranking />} />
        <Route path="/Theater" element={<Theater />} />
        <Route path="/Member" element={<Member />} />
        <Route path="/Product_detail" element={<Product_detail />} />
        <Route path="/Booking" element={<Booking />} />
        <Route path="/Payment_info" element={<PaymentInfo />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/up" element={<Up />} />
        <Route path="/Filter" element={<Filter />} />
        <Route path="/PaymentResult" element={<PaymentResult />} />
        <Route path="/Cart" element={<Cart />} />
      </Routes>
      <Footer />
    </>
        </ModalProvider>

  );
}

export default AppContent;
