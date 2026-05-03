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
import Cart from "./Cart/Cart";
import Wallet from "./Wallet/wallet";
import QRCheckout from "./QRCheckout/QRCheckout";
import ShopRegister from "./ShopRegister/ShopRegister";
import EwalletConfirm from "./Payment/EwalletConfirm";
import OrderTracking from "./OrderTracking/OrderTracking";
import OrderDetail from "./OrderTracking/OrderDetail";
import ShopView from "./ShopView/ShopView";
//import NavBar from "./NavBar/NavBar";

function AppContent() {
  const location = useLocation();
  //const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

 
 useEffect(() => {
// ...existing code...
const tryRefreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    // Không có refreshToken, không làm gì cả
    return false;
  }
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_APP_API}/auth/refresh`,
      { refreshToken },
      { withCredentials: true }
    );
    if (res.data.status === 200 && res.data.data?.accessToken) {
      localStorage.setItem("jwt", res.data.data.accessToken);
      console.log("Access token refreshed successfully");
      return true;
    } else {
      localStorage.removeItem("jwt");
      localStorage.removeItem("refreshToken");
      return false;
    }
  } catch (err) {
    console.error("Refresh token failed:", err);
    return false;
  }
};

const checkAuth = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  // Chưa login, không làm gì
  if (!refreshToken) return;

  // Luôn gọi /auth/refresh để lấy accessToken mới nhất từ refreshToken
  const refreshed = await tryRefreshToken();
  if (!refreshed) return;

  // Introspect với accessToken vừa refresh để lấy thông tin user
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_APP_API}/auth/introspect?Authorization=check`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        withCredentials: true,
      }
    );

    if (res.data.status === 200) {
      console.log(res.data.data.userName);
      localStorage.setItem("username", res.data.data.userName);
      localStorage.setItem("phone", res.data.data.phone);
      localStorage.setItem("email", res.data.data.email);
      localStorage.setItem("roles", res.data.data.roles.join(","));
    }
  } catch (err) {
    console.error("Introspect error:", err);
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
        <Route path="/EwalletConfirm" element={<EwalletConfirm />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Wallet" element={<Wallet />} />
        <Route path="/QRCheckout" element={<QRCheckout />} />
        <Route path="/ShopRegister" element={<ShopRegister />} />
        <Route path="/OrderTracking" element={<OrderTracking />} />
        <Route path="/OrderDetail" element={<OrderDetail />} />
        <Route path="/ShopView" element={<ShopView />} />

      </Routes>
      <Footer />
    </>
        </ModalProvider>

  );
}

export default AppContent;
