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
  const [categories, setCategories] = useState([]);
  const [countdown, setCountdown] = useState({ h: 0, m: 0, s: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const end = new Date();
      end.setHours(23, 59, 59, 0);
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      return { h: Math.floor(diff / 3600), m: Math.floor((diff % 3600) / 60), s: diff % 60 };
    };
    setCountdown(calc());
    const timer = setInterval(() => setCountdown(calc()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_APP_API}/category/get-category`, {
     
    })
      .then((res) => {
        const items = res.data?.data || [];
        // Chỉ lấy danh mục gốc (parentId === null)
        setCategories(items.filter(c => c.parentId === null));
      })
      .catch((err) => {
        console.error("Error categories:", err);
      });
  }, []);

useEffect(() => {
    axios.get(`${import.meta.env.VITE_APP_API}/product/get-top-product?limit=10`, {
      headers: {
        "accept": "*/*",
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

      {/* Danh mục */}
      <div className={styles.categorySection}>
        <div className="container">
          <div className={styles.categoryHeader}>DANH MỤC</div>
          <div className={styles.categoryScroll}>
            <div className={styles.categoryGrid}>
              {categories.map((cat) => (
                <div
                  key={cat.category_id}
                  className={styles.categoryItem}
                  onClick={() => navigate(`/Products?categoryId=${cat.category_id}`)}
                >
                  <div className={styles.categoryImgWrap}>
                    {cat.categoryImg ? (
                      <img src={cat.categoryImg} alt={cat.category_name} />
                    ) : (
                      <i className="bi bi-grid" style={{ fontSize: 40, color: "#888" }}></i>
                    )}
                  </div>
                  <span className={styles.categoryName}>{cat.category_name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Flash Sale Section */}
      <div className={styles.flashSaleSection}>
        <div className="container">
          <div className={styles.flashSaleHeader}>
            <div className={styles.flashSaleTitle}>
              <span className={styles.flashIcon}>⚡</span>
              <span className={styles.flashText}>FLASH</span>
              <span className={styles.saleText}>&nbsp;SALE</span>
              <div className={styles.countdown}>
                <span className={styles.countBox}>{String(countdown.h).padStart(2, '0')}</span>
                <span className={styles.countSep}>:</span>
                <span className={styles.countBox}>{String(countdown.m).padStart(2, '0')}</span>
                <span className={styles.countSep}>:</span>
                <span className={styles.countBox}>{String(countdown.s).padStart(2, '0')}</span>
              </div>
            </div>
            <a href="/Products" className={styles.viewAll}>Xem tất cả &gt;</a>
          </div>
          <div className={styles.flashSaleScroll}>
            {products.map((product) => (
              <div key={product.id} className={styles.flashCard} onClick={() => handleToProductDetail(product.id)}>
                <div className={styles.flashImgWrap}>
                  <img src={product.img || product.image} alt={product.name} className={styles.flashImg} />
                  <span className={styles.likedBadge}>Yêu thích</span>
                  {product.discount != null && (
                    <span className={styles.discountBadge}>-{product.discount}%</span>
                  )}
                </div>
                <div className={styles.flashCardBody}>
                  <div className={styles.flashPrice}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                  </div>
                  <button className={styles.hotBtn}>ĐANG BÁN CHẠY</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
		</div>
    );

}

export default Homepage;
