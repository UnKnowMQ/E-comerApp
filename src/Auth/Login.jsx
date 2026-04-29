import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../Auth/Login.module.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import '../assets/vendor/bootstrap/css/bootstrap.min.css';
import '../assets/vendor/bootstrap-icons/bootstrap-icons.css';
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
import '../assets/vendor/bootstrap/js/bootstrap.bundle.min.js';
import '../assets/vendor/tinymce/tinymce.min.js';
import '../assets/vendor/quill/quill.js'
import '../assets/vendor/simple-datatables/simple-datatables.js'
import '../assets/js/main.js';
function Login() {
    const location = useLocation();
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    let navigate = useNavigate();
    const handleLoginChange = e => {
      setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = e => {
      setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

  const handleLoginSubmit = async (e) => {
    console.log("api:", import.meta.env || 'http://localhost:8036');
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API || 'http://localhost:8036'}/auth/login`,
        { email: loginData.email, password: loginData.password },
        { withCredentials: true }
      );
      
      console.log("response from login:", res.data);
      
      if (res.data.status === 200) {
        // Lưu refreshToken vào localStorage với tên "refreshtoken"
        // JWT sẽ được gen từ API refresh
        if (res.data.data.token) {
          localStorage.setItem("refreshtoken", res.data.data.token);
        }
        
        alert("Đăng nhập thành công!");
        navigate("/");
      } else {
        alert("Đăng nhập thất bại: " + res.data.message);
        return;
      }
    } catch (err) {
      alert("Login error: " + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  
  
  return (
     <div className="container">

      <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

              <div className="d-flex justify-content-center py-4">
                <a href="index.html" className="logo d-flex align-items-center w-auto">
                  <img src="assets/img/logo.png" alt=""/>
                  <span className="d-none d-lg-block text-primary">EShop</span>
                </a>
              </div>

              <div className="card mb-3">

                <div className="card-body">

                  <div className="pt-4 pb-2">
                    <h5 className="card-title text-center pb-0 fs-4">Đăng nhập</h5>
                  </div>

                  <form className="row g-3 needs-validation" noValidate onSubmit={handleLoginSubmit}>

                    <div className="col-12">
                      <label htmlFor="yourEmail" className="form-label">Email</label>
                      <div className="input-group has-validation">
                        <span className="input-group-text" id="inputGroupPrepend">@</span>
                        <input type="email" name="email" className="form-control" id="yourEmail" required onChange={handleLoginChange} value={loginData.email}/>
                        <div className="invalid-feedback">Vui lòng nhập email của bạn.</div>
                      </div>
                    </div>

                    <div className="col-12">
                      <label htmlFor="yourPassword" className="form-label">Mật khẩu</label>
                      <input type="password" name="password" className="form-control" id="yourPassword" required onChange={handleLoginChange} value={loginData.password}/>
                      <div className="invalid-feedback">Please enter your password!</div>
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="remember" value="true" id="rememberMe"/>
                        <label className="form-check-label" htmlFor="rememberMe">Nhớ tài khoản</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary w-100" type="submit">Đăng nhập</button>
                    </div>
          
                  </form>

                </div>
              </div>

             

            </div>
          </div>
        </div>

      </section>

    </div>
  )
}

export default Login;