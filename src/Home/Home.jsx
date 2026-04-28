import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Home.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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

import axios from 'axios';
import { useEffect } from 'react';

function Homepage() {
   const images = [
    "https://res.cloudinary.com/dhcsnzbdu/image/upload/v1759482283/Baner-LenovoLOQ_747x350-moi_kxuyyj.jpg",
    "https://res.cloudinary.com/dhcsnzbdu/image/upload/v1759481835/2f267f672ee4bf55a2fb3fd1bc85305a_r71jju.png",
    "https://res.cloudinary.com/dhcsnzbdu/image/upload/v1759482280/747x350-ASUS-VIVOBOOK_iwdlvh.jpg",
    "https://res.cloudinary.com/dhcsnzbdu/image/upload/v1759482282/PPE-LaptopRTX5000747x350_ysycjc.jpg"
  ];
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
useEffect(() => {
    axios.get(`${import.meta.env.VITE_APP_API}/product/get-top-product`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        const items = res.data?.data || [];
		console.log(items);
        setProducts(items);
      })
      .catch((err) => {
        console.error("Error products:", err);
      });
	}, []);


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: true,
  };
       
const handleToProductDetail = (id) => {
    
    navigate("/Product_detail", { state: { id }});

};
    
    return (
        <div>
			<div class="hero">
				<div class="container">
					<div class="row justify-content-between">
						<div class="col-lg-4">
							<div class="intro-excerpt">
								<p class="mb-4">Công nghệ trong tầm tay – Hàng mới 100% bảo hành uy tín</p>
								<p><a href="/Products" class="btn btn-warning">Khám phá các sản phẩm</a></p>
							</div>
						</div>
					 <div className="col-lg-8">
        <Slider {...settings}>
          {images.map((img, idx) => (
            <div key={idx}>
              <img src={img} alt={`slide-${idx}`} className="img-fluid rounded mx-auto d-block" style={{maxHeight: 350}} />
            </div>
          ))}
        </Slider>
      </div>  
					</div>
				</div>
			</div>

      <div class="product-section">
        <div class="container">
          <div class="row">

            <div class="col-md-12 col-lg-3 mb-5 mb-lg-0">
              <h2 class="mb-4 section-title">Chất lượng đảm bảo</h2>
              <p class="mb-4">Khám phá một số sản phẩm bán chạy </p>
            </div> 
            {products.map((product) => (
            <div class="col-12 col-md-4 col-lg-3 mb-5 mb-md-0" key={product.id} onClick={() => handleToProductDetail(product.id)}>
              <a class="product-item" onClick={() => handleToProductDetail(product.id)} >
                <img src={product.image} class="img-fluid product-thumbnail" alt={product.name}/>
                <h3 class="product-title">{product.name}</h3>
                <strong class="product-price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</strong>
                <span class="icon-cross">
                  <img src="images/cross.svg" class="img-fluid" alt="cross"/>
                </span>
              </a>
            </div> 
        ))}
            

          </div>
        </div>
		</div>
		</div>
    );

}

export default Homepage;
