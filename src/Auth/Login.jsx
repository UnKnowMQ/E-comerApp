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
    const [rightPanelActive, setRightPanelActive] = useState(false);
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [registerData, setRegisterData] = useState({
      username: '',
      email: '',
      password: '',
      retypePassword: '',
      birthday: '',
      phone: ''
    });    
    let navigate = useNavigate();
    const handleLoginChange = e => {
      setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = e => {
      setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

  const handleLoginSubmit = async e => {
    e.preventDefault();
    try {
    const res = await axios.post('http://localhost:8099/auth/login', loginData, {
      withCredentials: true
    });        if (res.data.status === 200) {
              navigate('/');
              console.log("Login successful"); 
              alert("Đăng nhập thành công");
            } else {
              alert("Đăng nhập không thành công, vui lòng kiểm tra lại tài khoản hoặc mật khẩu.");

        }
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  
  const handleRegisterSubmit = async e => {
  e.preventDefault();
  if (registerData.password !== registerData.retypePassword) {
    alert('Mật khẩu nhập lại không khớp!');
    return;
  }
  try {
    const res = await axios.post('http://localhost:8099/auth/register', registerData, {
      withCredentials: true
    });
    // Xử lý kết quả đăng ký
    if (res.status === 200) {
      alert('Đăng ký thành công!');
      setRightPanelActive(false); // Quay lại đăng nhập sau khi đăng ký thành công
    } else {
      alert('Đăng ký không thành công, vui lòng thử lại.');
    }
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
  };
    useEffect(() => {
    if(location.state?.type === 'register'){
        setRightPanelActive(true);
    } else {
        setRightPanelActive(false);
    }
  },[location.state]);
  return (
     <div className="container">

      <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

              <div className="d-flex justify-content-center py-4">
                <a href="index.html" className="logo d-flex align-items-center w-auto">
                  <img src="assets/img/logo.png" alt=""/>
                  <span className="d-none d-lg-block">NiceAdmin</span>
                </a>
              </div>

              <div className="card mb-3">

                <div className="card-body">

                  <div className="pt-4 pb-2">
                    <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                    <p className="text-center small">Enter your username & password to login</p>
                  </div>

                  <form className="row g-3 needs-validation" novalidate>

                    <div className="col-12">
                      <label for="yourUsername" className="form-label">Username</label>
                      <div className="input-group has-validation">
                        <span className="input-group-text" id="inputGroupPrepend">@</span>
                        <input type="text" name="username" className="form-control" id="yourUsername" required/>
                        <div className="invalid-feedback">Please enter your username.</div>
                      </div>
                    </div>

                    <div className="col-12">
                      <label for="yourPassword" className="form-label">Password</label>
                      <input type="password" name="password" className="form-control" id="yourPassword" required/>
                      <div className="invalid-feedback">Please enter your password!</div>
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="remember" value="true" id="rememberMe"/>
                        <label className="form-check-label" for="rememberMe">Remember me</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary w-100" type="submit">Login</button>
                    </div>
                    <div className="col-12">
                      <p className="small mb-0">Don't have account? <a href="pages-register.html">Create an account</a></p>
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