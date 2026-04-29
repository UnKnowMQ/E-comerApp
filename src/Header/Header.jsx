import React, { useState, useEffect,useContext } from 'react';
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
import ProfileDropdown from './ProfileDropdown.jsx';
function Header() {
  const navigate = useNavigate();
  const handleSignOut = () => {
  axios.post('http://localhost:8099/auth/logout', null, {
    withCredentials: true
  })
    .then(() => {
      navigate('/Login');
    })
    .catch((err) => console.error(err));
};
const [user,setUser] = useState(null);




    return (
        <div>
           <header id="header" className="header fixed-top d-flex align-items-center">

    <div className="d-flex align-items-center justify-content-between">
      <a href="/" className="logo d-flex align-items-center">
        <img src="assets/img/logo.png" alt=""/>
        <span className="d-none d-lg-block text-primary">EShop</span>
      </a>
      <i className="bi bi-list toggle-sidebar-btn"></i>
    </div>

    <div className="search-bar">
      <form className="search-form d-flex align-items-center" method="POST" action="#">
        <input type="text" name="query" placeholder="Search" title="Enter search keyword"/>
        <button type="submit" title="Search"><i className="bi bi-search"></i></button>
      </form>
    </div>

    <nav className="header-nav ms-auto">
      <ul className="d-flex align-items-center">

        <li className="nav-item d-block d-lg-none">
          <a className="nav-link nav-icon search-bar-toggle " href="#">
            <i className="bi bi-search"></i>
          </a>
        </li>

        <li className="nav-item dropdown">

          <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
            <i className="bi bi-bell"></i>
            <span className="badge bg-primary badge-number">4</span>
          </a>

          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
            <li className="dropdown-header">
              You have 4 new notifications
              <a href="#"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
            </li>
            <li>
              <hr className="dropdown-divider"/>
            </li>

            <li className="notification-item">
              <i className="bi bi-exclamation-circle text-warning"></i>
              <div>
                <h4>Lorem Ipsum</h4>
                <p>Quae dolorem earum veritatis oditseno</p>
                <p>30 min. ago</p>
              </div>
            </li>

            <li>
              <hr className="dropdown-divider"/>
            </li>

            <li className="notification-item">
              <i className="bi bi-x-circle text-danger"></i>
              <div>
                <h4>Atque rerum nesciunt</h4>
                <p>Quae dolorem earum veritatis oditseno</p>
                <p>1 hr. ago</p>
              </div>
            </li>

            <li>
              <hr className="dropdown-divider"/>
            </li>

            <li className="notification-item">
              <i className="bi bi-check-circle text-success"></i>
              <div>
                <h4>Sit rerum fuga</h4>
                <p>Quae dolorem earum veritatis oditseno</p>
                <p>2 hrs. ago</p>
              </div>
            </li>

            <li>
              <hr className="dropdown-divider"/>
            </li>

            <li className="notification-item">
              <i className="bi bi-info-circle text-primary"></i>
              <div>
                <h4>Dicta reprehenderit</h4>
                <p>Quae dolorem earum veritatis oditseno</p>
                <p>4 hrs. ago</p>
              </div>
            </li>

            <li>
              <hr className="dropdown-divider"/>
            </li>
            <li className="dropdown-footer">
              <a href="#">Show all notifications</a>
            </li>

          </ul>

        </li>

        <li className="nav-item dropdown">

          <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
            <i className="bi bi-chat-left-text"></i>
            <span className="badge bg-success badge-number">3</span>
          </a>

          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
            <li className="dropdown-header">
              You have 3 new messages
              <a href="#"><span className="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
            </li>
            <li>
              <hr className="dropdown-divider"/>
            </li>

            <li className="message-item">
              <a href="#">
                <img src="assets/img/messages-1.jpg" alt="" className="rounded-circle"/>
                <div>
                  <h4>Maria Hudson</h4>
                  <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                  <p>4 hrs. ago</p>
                </div>
              </a>
            </li>
            <li>
              <hr className="dropdown-divider"/>
            </li>

            <li className="message-item">
              <a href="#">
                <img src="assets/img/messages-2.jpg" alt="" className="rounded-circle"/>
                <div>
                  <h4>Anna Nelson</h4>
                  <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                  <p>6 hrs. ago</p>
                </div>
              </a>
            </li>
            <li>
              <hr className="dropdown-divider"/>
            </li>

            <li className="message-item">
              <a href="#">
                <img src="assets/img/messages-3.jpg" alt="" className="rounded-circle"/>
                <div>
                  <h4>David Muldon</h4>
                  <p>Velit asperiores et ducimus soluta repudiandae labore officia est ut...</p>
                  <p>8 hrs. ago</p>
                </div>
              </a>
            </li>
            <li>
              <hr className="dropdown-divider"/>
            </li>

            <li className="dropdown-footer">
              <a href="#">Show all messages</a>
            </li>

          </ul>

        </li>

<ProfileDropdown handleSignOut={handleSignOut} />

      </ul>
    </nav>

  </header>
</div>
    );
}

export default Header;
