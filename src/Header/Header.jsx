import React, { useState, useEffect,useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

import '../assets/vendor/boxicons/css/boxicons.min.css';
import '../assets/vendor/quill/quill.snow.css';
import '../assets/vendor/quill/quill.bubble.css';
import '../assets/vendor/remixicon/remixicon.css';
import '../assets/vendor/simple-datatables/style.css';
import '../assets/css/style.css';


import '../assets/vendor/apexcharts/apexcharts.min.js';
import '../assets/vendor/echarts/echarts.min.js';
import '../assets/vendor/chart.js/chart.umd.js';
import '../assets/vendor/php-email-form/validate.js';
import '../assets/vendor/tinymce/tinymce.min.js';
import '../assets/vendor/quill/quill.js'
import '../assets/vendor/simple-datatables/simple-datatables.js'
import '../assets/js/main.js';

import './Header.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { ModalContext } from "../ModalContext";
import { useContext } from "react";

// ...existing code...
function Header() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null); // null = chưa login
  const [registerForm, setRegisterForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    date_of_birth: "",
    phone: "",
    gender: "nam",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_API}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
            console.log("response from login:", res.data);
      if (res.data.status == 200) {
      alert("Đăng nhâp thành công!" + res);
      setUser(res.data.data); // Cập nhật user state
      setShowLogin(false);
      } else {
        alert("Đăng nhập thất bại: " + res.data.message);
        return;
      }
      // Lưu accessToken vào localStorage, refreshToken vào sessionStorage
          localStorage.setItem("jwt", res.data.data.token);
          if (res.data.data.refreshToken) {
            sessionStorage.setItem("refreshToken", res.data.data.refreshToken);
          }
    } catch (err) {
      alert("Login error: " + (err.response?.data?.message || err.message));
    }
  };
  const handleRegister = async (e) => {

    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      alert("Mật khẩu không khớp!"); 
      return;
    }
    try {
      const payload = {
        ...registerForm,
        gender: registerForm.gender === "nữ" ? false : true,
      };
      const res = await axios.post(`${import.meta.env.VITE_APP_API}/auth/register`, payload, {
        withCredentials: true,
      });
      if (res.data.status !== 200) {
        alert("Đăng ký thất bại: " + res.data.message);
        return;
      }
      alert("Đăng ký thành công!");
      setRegisterForm({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        date_of_birth: "",
        phone: "",
        gender: "nam",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      alert("Đăng ký thất bại: " + (err.response?.data?.message || err.message));
    }
  };


const { showLogin, setShowLogin, showRegister, setShowRegister } = useContext(ModalContext);


 useEffect(() => {
const checkAuth = async () => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_APP_API}/auth/introspect`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        withCredentials: true,
      }
    );

    if (res.data.status !== 200) {
      setUser(null);
      return;
    } else {
      localStorage.setItem("username", res.data.data.userName);
      localStorage.setItem("customerId", res.data.data.customerId);
      console.log("Authenticated user:", res.data.data);
      setUser(res.data.data);
      return;
    }
  } catch (err) {
    console.error('Not authenticated');
    setUser(null);
  }
};
// ...existing code...

  checkAuth();
}, [location.pathname]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div>
      <nav className="custom-navbar navbar navbar-expand-md navbar-dark bg-dark" arial-label="Furni navigation bar">
        <div className="container">
          <a className="navbar-brand" href="/">ESHOP<span>.</span></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsFurni" aria-controls="navbarsFurni" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarsFurni">
            <ul className="custom-navbar-nav navbar-nav ms-auto mb-2 mb-md-0 ">
              		<ul class="custom-navbar-nav navbar-nav ms-auto mb-2 mb-md-0 ">
						<li class="nav-item active">
							<a class="nav-link" href="/">Trang chủ</a>
						</li>
						<li><a class="nav-link" href="/Products">Của hàng</a></li>
						<li><a class="nav-link" href="about.html">About us</a></li>
						<li><a class="nav-link" href="services.html">Dịch vụ</a></li>

					</ul>
            </ul>
          <ul className="custom-navbar-cta navbar-nav mb-2 mb-md-0 ms-5">
      {!user ? (
        <>
          <li
            className="btn btn-warning btn-sm me-3"
            id="lbutton"
            onClick={() => setShowLogin(true)}
          >
            <span
              className="nav-link text-black fw-bold"
              style={{ cursor: "pointer" }}
            >
              Đăng nhập
            </span>
          </li>
          <li
            className="btn btn-warning btn-sm"
            id="rbutton"
            onClick={() => setShowRegister(true)}
          >
            <span
              className="nav-link text-black fw-bold"
              style={{ cursor: "pointer" }}
            >
              Đăng ký
            </span>
          </li>
        </>
      ) : (
        <li className="nav-item dropdown" id="userDropdown" ref={dropdownRef}>
          <button
            id="userBtn"
            className="btn btn-secondary border-0 d-flex align-items-center"
            onClick={() => setOpen(!open)}
          >
            <i className="bi bi-person-circle me-1"></i> {user.userName}
          </button>
          {open && (
            <ul className="dropdown-menu dropdown-menu-end show mt-2">
              <li>
                <button className="dropdown-item">Thông tin cá nhân</button>
              </li>
              <li>
                <button className="dropdown-item">Đổi mật khẩu</button>
              </li>
              <li>
                <a className="dropdown-item" href="/Wallet" style={{textDecoration: 'none', color: 'inherit'}}>
                  <i className="bi bi-wallet2 me-2"></i>Ví của tôi
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setUser(null);
                    localStorage.removeItem("jwt");
                    localStorage.removeItem("username");
                  }}
                >
                  Đăng xuất
                </button>
              </li>
            </ul>
          )}
        </li>
      )}
      <li className="ms-4 mt-1">
        <a className="nav-link" href="/cart">
          <i class="bi bi-cart fs-4 text-black"></i>
        </a>
      </li>
    </ul>
          </div>
        </div>

        {/* Login Modal */}
        <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
          <Form onSubmit={handleLogin}>
            <Modal.Header closeButton>
              <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="loginEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="loginPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <div className="text-center mt-3">
                Bạn không có tài khoản?{' '}
                <span
                  style={{ color: 'blue', cursor: 'pointer' }}
                  onClick={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                  }}
                >
                  Đăng ký
                </span>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" type="submit" className="w-100">
                Login
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Register Modal */}
        <Modal show={showRegister} onHide={() => setShowRegister(false)} centered>
          <Form onSubmit={handleRegister}>
            <Modal.Header closeButton>
              <Modal.Title>Register</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="registerUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" required value={registerForm.username}
                  onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })} />
              </Form.Group>
              <div className="row">
                <Form.Group className="mb-3 col-md-6" controlId="registerFirstname">
                  <Form.Label>Tên</Form.Label>
                  <Form.Control type="text" required value={registerForm.firstName}
                    onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3 col-md-6" controlId="registerLastname">
                  <Form.Label>Họ đệm</Form.Label>
                  <Form.Control type="text" required value={registerForm.lastName}
                    onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })} />
                </Form.Group>
              </div>
              <Form.Group className="mb-3" controlId="registerEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" required value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="registerDateOfBirth">
                <Form.Label>Ngày Sinh</Form.Label>
                <Form.Control type="date" required value={registerForm.date_of_birth}
                  onChange={(e) => setRegisterForm({ ...registerForm, date_of_birth: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="registerPhone">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control type="text" required value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Giới tính</Form.Label>
                <Form.Select value={registerForm.gender}
                  onChange={(e) => setRegisterForm({ ...registerForm, gender: e.target.value })}>
                  <option value="nam">Nam</option>
                  <option value="nữ">Nữ</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="registerPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" required value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="registerConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" required value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })} />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" type="submit" className="w-100">
                Register
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </nav>
    </div>
  );
}
export default Header;
