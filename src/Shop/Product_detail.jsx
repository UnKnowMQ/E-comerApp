import React, { useMemo, useState } from 'react';
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
  const [shop, setShop] = useState(null);
  const [specs, setSpecs] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
   const { showLogin, setShowLogin, showRegister, setShowRegister } = useContext(ModalContext);
   const API_BASE = import.meta.env.VITE_APP_API || (window && window.__VITE_APP_API__) || 'https://demo-ecommerce-deployment.onrender.com';

  const location = useLocation();
  const { id } = location.state || {};
  console.log("Product ID from state:", id);
  const navigate = useNavigate();
    useEffect(() => {

    if (!id) return;

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
        setActiveImageIndex(0);
      
      })
      .catch((err) => {
        console.error("Error products:", err);
      });

      axios.get(`${import.meta.env.VITE_APP_API}/shop/productId/${id}`, {
        params: { productId: id },
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          setShop(res.data?.data || null);
        })
        .catch((err) => {
          console.error("Error shop:", err);
        });

      axios.get(`${import.meta.env.VITE_APP_API}/specification/product/${id}`, {
        params: { productId: id },
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          const data = res.data?.data;
          const rawItems = Array.isArray(data) ? data : (data?.items || []);
          const normalized = rawItems
            .map((x) => {
              const label = x?.specificationName ?? x?.name ?? x?.key ?? x?.title ?? x?.attributeName;
              const value = x?.specificationValue ?? x?.value ?? x?.content ?? x?.attributeValue;
              if (!label || value === null || value === undefined) return null;
              return { label: String(label), value: String(value) };
            })
            .filter(Boolean);
          setSpecs(normalized);
        })
        .catch((err) => {
          console.error("Error specifications:", err);
          setSpecs([]);
        });
  }, [id]);

  
 
  const addToCart = async () => {
    const token = localStorage.getItem("jwt");
    const customerId = localStorage.getItem("username");

    if (!customerId || customerId === 'Unknown') {
      setShowLogin(true);
      return false;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_API}/cart/create-cart`,
        {},
        {
          params: {
            customerId,
            productId: id,
          },
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      return res.status === 200;
    } catch (err) {
      console.error("Lỗi thêm vào giỏ hàng:", err);
      setShowLogin(true);
      return false;
    }
  };

  const handleToInstantBuy = async () => {
    // Mua ngay = thêm vào giỏ hàng rồi chuyển sang trang giỏ hàng
    const ok = await addToCart();
    if (ok) {
      navigate('/Cart');
    } else {
      window.alert("Vui lòng đăng nhập để mua hàng");
    }
  };
const carouselId = 'productCarousel';

  // nếu dùng SSR, chặn render trên server
  if (typeof window === 'undefined') return null; 

 const handleToCart = async () => {
     const ok = await addToCart();
     if (ok) {
       window.alert("Thêm vào giỏ hàng thành công");
     } else {
       window.alert("Thêm vào giỏ hàng thất bại");
     }
   };

   const activeImage = useMemo(() => {
     if (!images || images.length === 0) return null;
     return images[Math.min(activeImageIndex, images.length - 1)];
   }, [images, activeImageIndex]);

   const ratingValue = typeof product?.rating === 'number' ? product.rating : null;
   const ratingCount = typeof product?.numberRating === 'number' ? product.numberRating : null;
   const soldCount = typeof product?.saleVolume === 'number' ? product.saleVolume : null;

   const formattedPrice = typeof product?.price === 'number'
     ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)
     : (product?.price ?? '');

   const formatDateTime = (value) => {
     if (!value) return null;
     const d = new Date(value);
     if (Number.isNaN(d.getTime())) return String(value);
     return d.toLocaleString('vi-VN');
   };

   const specifications = useMemo(() => {
     const apiSpecs = Array.isArray(specs) ? specs : [];
     const baseSpecs = product
       ? [
           { label: 'Danh mục', value: product.category_name },
           { label: 'Bảo hành', value: product.warranty },
           { label: 'Kho', value: typeof product.quantity === 'number' ? new Intl.NumberFormat('vi-VN').format(product.quantity) : product.quantity },
           { label: 'Tình trạng', value: product.status },
           { label: 'Ngày tạo', value: formatDateTime(product.created_at || product.createdAt) },
           { label: 'Cập nhật', value: formatDateTime(product.updated_at || product.updatedAt) },
         ]
       : [];

     const cleanedBase = baseSpecs.filter((s) => s.value !== null && s.value !== undefined && String(s.value).trim() !== '');
     const seen = new Set(apiSpecs.map((s) => s.label.trim().toLowerCase()));
     const merged = [...apiSpecs];
     for (const s of cleanedBase) {
       const key = s.label.trim().toLowerCase();
       if (!seen.has(key)) merged.push({ label: s.label, value: String(s.value) });
     }
     return merged;
   }, [specs, product]);

    return (

<div className="container py-4">
  <div className="pd-breadcrumb mb-3">
    <span className="text-primary" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Shopee</span>
    <span className="mx-2">&gt;</span>
    <span className="text-muted">{product?.category_name || 'Danh mục'}</span>
    <span className="mx-2">&gt;</span>
    <span className="text-muted pd-breadcrumb-last">{product?.productName || ''}</span>
  </div>

  <div className="pd-main card border-0 shadow-sm">
    <div className="card-body">
      <div className="row g-4">
        {/* Gallery */}
        <div className="col-12 col-lg-5">
          <div className="pd-gallery">
            <div className="pd-main-image">
              {activeImage ? (
                <img src={activeImage} alt={product?.productName || 'product'} />
              ) : (
                <div className="pd-image-placeholder">No image</div>
              )}
            </div>

            {images?.length > 0 && (
              <div className="pd-thumbs mt-3">
                {images.slice(0, 6).map((img, idx) => (
                  <button
                    key={img + idx}
                    type="button"
                    className={`pd-thumb ${idx === activeImageIndex ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`thumb-${idx}`}
                  >
                    <img src={img} alt={`thumb-${idx}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="col-12 col-lg-7">
          <h4 className="fw-semibold mb-2">{product?.productName}</h4>

          <div className="pd-rating-row mb-3">
            {ratingValue != null && (
              <div className="pd-rating">
                <span className="pd-rating-number">{ratingValue.toFixed(1)}</span>
                <span className="pd-stars" aria-label="rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star ${ratingValue >= i + 1 ? 'text-warning' : 'text-secondary'}`}
                    />
                  ))}
                </span>
              </div>
            )}

            {ratingCount != null && (
              <div className="pd-rating-sep">
                <span className="pd-stat-number">{new Intl.NumberFormat('vi-VN').format(ratingCount)}</span>
                <span className="pd-stat-label">Đánh Giá</span>
              </div>
            )}

            {soldCount != null && (
              <div className="pd-rating-sep">
                <span className="pd-stat-number">Đã Bán {new Intl.NumberFormat('vi-VN').format(soldCount)}</span>
              </div>
            )}
          </div>

          <div className="pd-price-box mb-3">
            <div className="pd-price text-danger">{formattedPrice}</div>
          </div>

          <div className="pd-row mb-2">
            <div className="pd-row-label">Vận Chuyển</div>
            <div className="pd-row-value text-muted">Không hỗ trợ</div>
          </div>

          <div className="pd-row mb-3">
            <div className="pd-row-label">Số Lượng</div>
            <div className="pd-row-value">
              <div className="pd-qty">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <input
                  className="form-control form-control-sm pd-qty-input"
                  value={quantity}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (Number.isFinite(v)) setQuantity(Math.max(1, v));
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
                <span className="ms-2 text-muted">Còn Hàng</span>
              </div>
            </div>
          </div>

          <div className="d-flex gap-3">
            <button className="btn btn-outline-danger px-4" onClick={handleToCart}>
              <i className="fas fa-shopping-cart me-2"></i>
              Thêm Vào Giỏ Hàng
            </button>
            <button className="btn btn-danger px-5" onClick={handleToInstantBuy}>
              Mua Ngay
            </button>
          </div>

          {product?.description && (
            <div className="mt-4">
              <div className="fw-semibold mb-1">Mô tả</div>
              <div className="text-muted">{product.description}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>

  {/* Shop card */}
  {shop && (
    <div className="pd-shop card border-0 shadow-sm mt-4">
      <div className="card-body">
        <div className="row align-items-center g-3">
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-3">
              <div className="pd-shop-logo">
                {shop.logo ? (
                  <img src={shop.logo} alt={shop.shopName} />
                ) : (
                  <div className="pd-shop-logo-placeholder">{(shop.shopName || 'S').slice(0, 1).toUpperCase()}</div>
                )}
              </div>
              <div>
                <div className="fw-semibold">{shop.shopName}</div>
                <div className="text-muted" style={{ fontSize: 12 }}>Online gần đây</div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="pd-shop-stats">
              <div><span className="text-muted">Đánh Giá</span> <span className="text-danger">{shop.rating ?? '-'}</span></div>
              <div><span className="text-muted">Sản Phẩm</span> <span className="text-danger">{shop.totalProducts ?? '-'}</span></div>
              <div><span className="text-muted">Người Theo Dõi</span> <span className="text-danger">{shop.totalFollowers ?? '-'}</span></div>
            </div>
          </div>

          <div className="col-12 col-md-4 d-flex gap-2 justify-content-md-end">
            <button type="button" className="btn btn-outline-danger">
              <i className="fas fa-comment-dots me-2"></i>
              Chat Ngay
            </button>
            <button type="button" className="btn btn-outline-secondary">
              Xem Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Specification */}
  <div className="card border-0 shadow-sm mt-4">
    <div className="card-body">
      <div className="fw-semibold mb-3">Chi tiết sản phẩm</div>
      {specifications.length === 0 ? (
        <div className="text-muted">Chưa có thông tin chi tiết.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm mb-0">
            <tbody>
              {specifications.map((s) => (
                <tr key={s.label}>
                  <td style={{ width: 180 }} className="text-muted">{s.label}</td>
                  <td>{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>

  {/* Description */}
  <div className="card border-0 shadow-sm mt-4">
    <div className="card-body">
      <div className="fw-semibold mb-2">Mô tả sản phẩm</div>
      {product?.description ? (
        <div className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>{product.description}</div>
      ) : (
        <div className="text-muted">Chưa có mô tả sản phẩm.</div>
      )}
    </div>
  </div>
</div>
    );
}

export default Product_detail;
