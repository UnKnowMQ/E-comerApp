import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
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
function Cart () {

  const [cartItems, setCartItems] = useState([]);
  const [shopMap, setShopMap] = useState({}); // productId -> shop info
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_APP_API}/cart/get-cart-by-customer-id`, {
      params: { customerId: localStorage.getItem("username") },
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
    })
      .then(async (res) => {
        const items = res.data?.data || [];
        setCartItems(items);

        // Fetch shop info for each product
        const map = {};
        await Promise.all(
          items.map(async (item) => {
            const productId = item.productResponse.id;
            try {
              const shopRes = await axios.get(
                `${import.meta.env.VITE_APP_API}/shop/productId/${productId}`,
                {
                  params: { productId },
                  headers: { "Content-Type": "application/json" },
                }
              );
              map[productId] = shopRes.data?.data || null;
            } catch {
              map[productId] = null;
            }
          })
        );
        setShopMap(map);
      })
      .catch((err) => console.error("Error cart:", err));
  }, []);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.productResponse.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cartItems]);

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.productResponse.id !== itemId));
    axios.delete(`${import.meta.env.VITE_APP_API}/cart/delete-cartItem-from-cart`, {
      params: { customerId: localStorage.getItem("username"), productId: itemId },
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
    }).catch((err) => console.error("Error delete:", err));
  };

  // Group items by shopId from shopMap
  const groupedByShop = cartItems.reduce((acc, item) => {
    const shop = shopMap[item.productResponse.id];
    const shopId = shop?.shopId ?? 'unknown';
    const shopName = shop?.shopName ?? 'Cửa hàng';
    if (!acc[shopId]) acc[shopId] = { shopId, shopName, shop, items: [] };
    acc[shopId].items.push(item);
    return acc;
  }, {});

  const shopGroups = Object.values(groupedByShop);

  const getShopTotal = (items) =>
    items.reduce((sum, item) => sum + item.productResponse.price * item.quantity, 0);

  const handleCheckoutShop = (items) => {
    navigate('/Payment_info', { state: { cartItems: items } });
  };

  return (
    <div>
      <div className="hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>Giỏ hàng</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="untree_co-section before-footer-section">
        <div className="container">

          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-cart-x" style={{ fontSize: 48, color: '#ccc' }}></i>
              <p className="mt-3 text-muted">Giỏ hàng trống</p>
              <button className="btn btn-primary mt-2" onClick={() => navigate('/Products')}>Mua sắm ngay</button>
            </div>
          ) : (
            <>
              {shopGroups.map((group) => {
                const shopTotal = getShopTotal(group.items);
                return (
                  <div key={group.shopId} className="mb-4 border rounded" style={{ overflow: 'hidden' }}>
                    {/* Shop header */}
                    <div className="d-flex align-items-center px-3 py-2" style={{ background: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                      <i className="bi bi-shop me-2 text-danger"></i>
                      <span className="fw-semibold">{group.shopName}</span>
                      {group.shop && (
                        <button
                          className="btn btn-link btn-sm ms-2 p-0"
                          style={{ fontSize: 12, color: '#fff' }}
                          onClick={() => navigate(`/ShopView?shopId=${group.shopId}`)}
                        >
                          Xem shop
                        </button>
                      )}
                    </div>

                    {/* Items table */}
                    <div className="site-blocks-table px-3">
                      <table className="table mb-0">
                        <thead>
                          <tr>
                            <th style={{ width: 80 }}>Ảnh</th>
                            <th>Sản phẩm</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Tổng</th>
                            <th>Xoá</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.items.map((item) => (
                            <tr key={item.productResponse.id}>
                              <td>
                                <img src={item.productResponse.imageUrl} alt="" className="img-fluid" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 4 }} />
                              </td>
                              <td className="align-middle">
                                <span className="fw-semibold">{item.productResponse.productName}</span>
                              </td>
                              <td className="align-middle">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.productResponse.price)}
                              </td>
                              <td className="align-middle">
                                <div className="input-group" style={{ maxWidth: 110 }}>
                                  <button className="btn btn-outline-secondary btn-sm" type="button"
                                    onClick={() => setCartItems(cartItems.map(ci =>
                                      ci.productResponse.id === item.productResponse.id
                                        ? { ...ci, quantity: Math.max(1, ci.quantity - 1) }
                                        : ci
                                    ))}>
                                    <i className="bi bi-dash"></i>
                                  </button>
                                  <input type="text" className="form-control form-control-sm text-center" readOnly value={item.quantity} style={{ width: 36 }} />
                                  <button className="btn btn-outline-secondary btn-sm" type="button"
                                    onClick={() => setCartItems(cartItems.map(ci =>
                                      ci.productResponse.id === item.productResponse.id
                                        ? { ...ci, quantity: ci.quantity + 1 }
                                        : ci
                                    ))}>
                                    <i className="bi bi-plus"></i>
                                  </button>
                                </div>
                              </td>
                              <td className="align-middle text-danger fw-semibold">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.productResponse.price * item.quantity)}
                              </td>
                              <td className="align-middle">
                                <button className="btn btn-danger btn-sm" onClick={() => handleRemoveItem(item.productResponse.id)}>
                                  <i className="bi bi-trash-fill"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Shop footer: total + checkout */}
                    <div className="d-flex justify-content-end align-items-center gap-3 px-3 py-2" style={{ background: '#fff8f8', borderTop: '1px solid #dee2e6' }}>
                      <span className="text-muted">Tổng shop:</span>
                      <span className="fw-bold text-danger fs-5">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shopTotal)}
                      </span>
                      <button
                        className="btn btn-danger px-4"
                        style={{ backgroundColor: '#dc3545', borderColor: '#dc3545', color: '#fff' }}
                        onClick={() => handleCheckoutShop(group.items)}
                      >
                        Thanh toán
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Overall total + continue */}
              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                <button className="btn btn-outline-secondary" onClick={() => navigate('/Products')}>
                  <i className="bi bi-arrow-left me-2"></i>Tiếp tục mua sắm
                </button>
                <div className="text-end">
                  <div className="text-muted mb-1">Tổng tất cả</div>
                  <div className="fw-bold text-danger fs-4">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Cart;
