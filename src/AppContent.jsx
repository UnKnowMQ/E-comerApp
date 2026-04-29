// AppContent.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Homepage from "./Home/Home";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import Products from "./Products/Products";
import Ranking from "./Ranking/Ranking";
import Theater from "./Theater/Theater";
import Member from "./Member/Member";
import Product_add from "./Products/Product_detail";
import TicketCanelRequest from "./Booking/Booking";
import PaymentInfo from "./Payment/Payment_info";
import Login from "./Auth/Login";
import Up from "./up";
import Filter from "./Search/Filter";
import NavBar from "./NavBar/NavBar";
import Product_edit from "./Products/Products_edit";
import Shop from "./Shop/Shop";  
import ShopVerification from "./Shop/Shop_Verification";
import ShopOrders from "./Shop/ShopOrders";
import ShopProducts from "./Products/ShopProducts";
import ShopProduct_add from "./Products/ShopProduct_add";
import ProductApproval from "./Products/ProductApproval";
import Theater_add from "./Theater/Theater_add";
import Theater_edit from "./Theater/Theater_edit";
import UserProfile from "./UserProfile/UserProfile";

function AppContent() {
  const location = useLocation();


  const navigate = useNavigate();
  // Kiểm tra xác thực người dùng
const [user, setUser] = React.useState(null);

 useEffect(() => {
  const tryRefreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshtoken");
    if (!refreshToken) {
      localStorage.removeItem("jwt");
      console.log("No refresh token found");
      return false;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API || 'http://localhost:8036'}/auth/refresh`,
        { refreshToken },
        { withCredentials: true }
      );
      console.log("Refresh response:", res.data);
      if (res.data.status === 200 && res.data.data?.accessToken) {
        // Lưu accessToken vào localStorage với tên "jwt"
        localStorage.setItem("jwt", res.data.data.accessToken);
        console.log("Access token refreshed successfully");
        return true;
      } else {
        localStorage.removeItem("jwt");
        localStorage.removeItem("refreshtoken");
        console.log("Refresh failed: status", res.data.status);
        return false;
      }
    } catch (err) {
      localStorage.removeItem("jwt");
      localStorage.removeItem("refreshtoken");
      console.error("Refresh token failed:", err);
      return false;
    }
  };

  const checkAuth = async () => {
    try {
      let jwt = localStorage.getItem("jwt");
      
      // Nếu không có JWT nhưng có refreshtoken, thử refresh để gen JWT
      if (!jwt) {
        const refreshToken = localStorage.getItem("refreshtoken");
        if (refreshToken) {
          console.log("No JWT found, attempting to refresh token first");
          const refreshed = await tryRefreshToken();
          if (refreshed) {
            jwt = localStorage.getItem("jwt");
            console.log("JWT generated from refresh token");
          } else {
            console.log("Failed to refresh token, redirecting to Login");
            navigate('/Login');
            return;
          }
        } else {
          console.log("No JWT and no refresh token found, redirecting to Login");
          navigate('/Login');
          return;
        }
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API || 'http://localhost:8036'}/auth/introspect`,
        {},
        {
          headers: { Authorization: `Bearer ${jwt}` },
          withCredentials: true,
        }
      );

      if (res.data.status !== 200) {
        console.log("Introspect status not 200, attempting refresh");
        // Token hết hạn, thử refresh
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          console.log("Token refreshed, checking auth again");
          // Gọi lại checkAuth sau khi refresh thành công
          await checkAuth();
        } else {
          navigate('/Login');
        }
        return;
      } else {
        console.log("User data:", res.data.data);
        console.log("User role:", res.data.data.role);
        console.log("User role type:", typeof res.data.data.role);
        localStorage.setItem("username", res.data.data.userName);
        
        // Kiểm tra quyền Manager sau khi accessToken hợp lệ
        console.log("Checking role: role is", res.data.data.role, "comparing with Manager");
        if (res.data.data.role !== "Admin" && res.data.data.role !== "Seller") {
          console.log("Role check failed! User role is not Admin or Seller");
          const email = res.data.data.email || localStorage.getItem("username") || "tài khoản";
          alert(`Tài khoản ${email} không có quyền truy cập trang này. Chỉ Admin hoặc Seller mới có thể truy cập.`);
          localStorage.removeItem("jwt");
          localStorage.removeItem("refreshtoken");
          localStorage.removeItem("username");
          navigate('/Login');
          return;
        }
        
        console.log("Auth successful for Admin or Seller:", res.data.data.userName);
        setUser(res.data);
        return;
      }
    } catch (err) {
      // Lỗi introspect (thường là 401 - token hết hạn)
      console.error("Introspect error:", err.response?.status, err.message);
      
      // Nếu lỗi 401 (Unauthorized), thử refresh token
      if (err.response?.status === 401) {
        console.log("Got 401, attempting to refresh token");
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          console.log("Token refreshed after 401, checking auth again");
          // Gọi lại checkAuth sau khi refresh thành công
          await checkAuth();
        } else {
          console.log("Refresh token failed, redirecting to Login");
          alert("Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.");
          setUser(null);
          navigate('/Login');
        }
      } else {
        // Lỗi khác
        console.log("Non-401 error, redirecting to Login");
        alert("Có lỗi xảy ra. Vui lòng đăng nhập lại.");
        setUser(null);
        navigate('/Login');
      }
    }
  };

  checkAuth();
}, [location.pathname]);

// Chỉ lưu khi user thay đổi
useEffect(() => {
  if (user) {
    localStorage.setItem('user', JSON.stringify({user}));
  }
}, [user]);

  // const existing = localStorage.getItem('user');

  // if (!existing) {
 // }

  
  // Ẩn navbar nếu là trang login
  const shouldHideNavbar = location.pathname === '/Login';
  const shouldHideHeader = location.pathname === '/Login' || location.pathname === '/up';
  return (
    <>
      { !shouldHideHeader &&< Header />}
      { !shouldHideNavbar &&< NavBar />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/Ranking" element={<Ranking />} />
        <Route path="/Theater" element={<Theater />} />
        <Route path="/Member" element={<Member />} />
        <Route path="/Product_add" element={<Product_add />} />
        <Route path="/TicketCanelRequest" element={<TicketCanelRequest />} />
        <Route path="/Payment_info" element={<PaymentInfo />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/up" element={<Up />} />
        <Route path="/Filter" element={<Filter />} />
        <Route path="/Products_edit" element={<Product_edit />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/Shop_Verification" element={<ShopVerification />} />
        <Route path="/ShopOrders" element={<ShopOrders />} />
        <Route path="/ShopProducts" element={<ShopProducts />} />
        <Route path="/ShopProduct_add" element={<ShopProduct_add />} />
        <Route path="/ProductApproval" element={<ProductApproval />} />
        <Route path="/Theater_add" element={<Theater_add/>}/>
        <Route path="/Theater_edit" element={<Theater_edit/>}/>
        <Route path="/UserProfile" element={<UserProfile/>}/>

      </Routes>
      <Footer />
    </>
  );
}

export default AppContent;
