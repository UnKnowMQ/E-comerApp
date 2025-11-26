import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { useEffect } from 'react';
import axios from 'axios';
import { ModalContext } from "../ModalContext";
import { useContext } from "react";
import './products.css';
// ...existing code...
function Product_detail() {
   const [product, setProduct] = useState(null);
   const [images, setImages] = useState([]);
   const { showLogin, setShowLogin, showRegister, setShowRegister } = useContext(ModalContext);
   const API_BASE = import.meta.env.VITE_APP_API || (window && window.__VITE_APP_API__) || 'https://demo-ecommerce-deployment.onrender.com';

  const location = useLocation();
  const { id } = location.state || {};
  console.log("Product ID from state:", id);
  const navigate = useNavigate();
    useEffect(() => {

    axios.get(`${import.meta.env.VITE_APP_API}/product/get-product-by-id`, {
      params: { productId : id }, // query param

    })
      .then((res) => {
        const items = res.data?.data || [];
        setProduct(items);
      
      })
      .catch((err) => {
        console.error("Error products:", err);
      });
      axios.get(`${import.meta.env.VITE_APP_API}/product/get-image-by-id`, {
      params: { productId : id }, // query param

    })
      .then((res) => {
        const items = res.data?.data || [];
        console.log(items);
        setImages(items);
      
      })
      .catch((err) => {
        console.error("Error products:", err);
      });
  }, [id]);

  
 
  const handleToInstantBuy = async () => {
  const token = localStorage.getItem("jwt");

  try {
    const kq = await axios.post(
      `${import.meta.env.VITE_APP_API}/auth/introspect`,
      {},
      {
        headers: {
          "accept": "*/*",
          "Authorization": `Bearer ${token}`
        }
      }
    );

    console.log("Instant Buy clicked");

    if (kq.status === 200) {
      navigate('/Payment_info', { state: { id } });
    } else {
      window.alert("Vui lòng đăng nhập để mua hàng");
      setShowLogin(true);
    }
  } catch (err) {
    console.error("Lỗi introspect:", err);
    window.alert("Vui lòng đăng nhập để mua hàng");
    setShowLogin(true);
  }
};
const carouselId = 'productCarousel';

  // nếu dùng SSR, chặn render trên server
  if (typeof window === 'undefined') return null; 

 const handleToCart = async () => {
     const token = localStorage.getItem("jwt");
     const customerId = localStorage.getItem("username");

     // Nếu chưa login hoặc customerId không hợp lệ -> yêu cầu login
     if (!customerId || customerId === 'Unknown') {
       window.alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
       setShowLogin(true);
       return;
     }

     try {
       const res = await axios.post(
         `${import.meta.env.VITE_APP_API}/cart/create-cart`,
         {}, // body
         {
           params: {
             customerId,
             productId: id
           },
           headers: {
             "Content-Type": "application/json",
             "Authorization": `Bearer ${token}`
           }
         }
       );

       if (res.status === 200) {
         window.alert("Thêm vào giỏ hàng thành công");
       } else {
         window.alert("Thêm vào giỏ hàng thất bại");
       }
     } catch (err) {
       console.error("Lỗi thêm vào giỏ hàng:", err);
       window.alert("Đã xảy ra lỗi. Vui lòng thử lại.");
       // nếu lỗi do auth, bật modal login
       setShowLogin(true);
     }
   };
    return (
  
<div className="container py-5">
  <div className="row g-4">
    
    <div className="col-md-6">
      <div  id={carouselId} className="carousel slide" data-bs-ride={images.length > 1 ? "carousel" : undefined}>
        
       {/* indicators */}
      {images.length > 1 && (
        <div className="carousel-indicators">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              data-bs-target={`#${carouselId}`}
              data-bs-slide-to={idx}
              className={idx === 0 ? 'active' : ''}
              aria-current={idx === 0 ? 'true' : undefined}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
        <div className="carousel-inner rounded shadow">
          {images && images.length >= 1 && images.map((img, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <img src={img} className="d-block w-100" alt={`Slide ${index + 1}`}/>
            </div>
          ))}
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </div>

    <div className="col-md-6">
      <h2 className="fw-bold">{product?.productName}</h2>
      <p className="text-muted">Mã sản phẩm: {product?.productId}</p>
      
      <h3 className="text-danger fw-bold mb-3">{product?.price}</h3>
      
      <p>
        Bộ PC Gaming cao cấp dành cho game thủ và làm việc đồ họa. 
        Trang bị CPU Intel Core i7 thế hệ 13, RAM 32GB, SSD 1TB và card đồ họa RTX 4070 Super.
      </p>

      <ul className="list-group mb-3">
        <li className="list-group-item"><strong>CPU:</strong> Intel Core i7-13700KF</li>
        <li className="list-group-item"><strong>RAM:</strong> 32GB DDR5</li>
        <li className="list-group-item"><strong>GPU:</strong> NVIDIA RTX 4070 Super</li>
        <li className="list-group-item"><strong>SSD:</strong> 1TB NVMe</li>
        <li className="list-group-item"><strong>Nguồn:</strong> 750W 80 Plus Gold</li>
      </ul>

      <div className="d-flex gap-3">
        <button className="btn btn-danger btn-lg" style={{backgroundColor: '#dc3545'}} onClick={handleToCart}>
          <i className="bi bi-cart-plus"></i> Thêm vào giỏ
        </button>
        <button className="btn btn-success btn-lg " style={{backgroundColor: '#28a745'}} onClick={handleToInstantBuy}>
          <i className="bi bi-lightning-charge"></i> Mua ngay
        </button>
      </div>
    </div>
  </div>
</div>
    );
}

export default Product_detail;
