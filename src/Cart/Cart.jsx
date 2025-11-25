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
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  

  useEffect(() => {
        axios.get(`${import.meta.env.VITE_APP_API}/cart/get-cart-by-customer-id`, {
      params: { customerId : localStorage.getItem("username") }, // query param
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
    })
      .then((res) => {
        const items = res.data?.data || [];
        setCartItems(items);
      })
      .catch((err) => {
        console.error("Error category:", err);
      });

  }, []);
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.productResponse.price * item.quantity, 0);
    console.log("Total price:", total);
    setTotalPrice(total);

  }, [cartItems]);

  const handleRemoveItem = (itemId) => {
    const updatedItems = cartItems.filter(item => item.productResponse.id !== itemId);
    setCartItems(updatedItems);

     axios.delete(`${import.meta.env.VITE_APP_API}/cart/delete-cartItem-from-cart`, {
      params: { customerId : localStorage.getItem("username") 
      , productId : itemId
      }, // query param
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },
    })
      .then((res) => {
        const items = res.data?.data || [];
        console.log("Delete item response:", res.data);
      })
      .catch((err) => {
        console.error("Error category:", err);
      });
    
  }
  const handleToContinueShopping = () => {
    navigate('/Products');
  }
  const handleToCheckout = () => {

    navigate('/Payment_info');
  }

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
						<div className="col-lg-7">
							
						</div>
					</div>
				</div>
			</div>

		

		<div className="untree_co-section before-footer-section">
            <div className="container">
              <div className="row mb-5">
                <form className="col-md-12" method="post">
                  <div className="site-blocks-table">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="product-thumbnail">Ảnh</th>
                          <th className="product-name">Sản phẩm</th>
                          <th className="product-price">Giá</th>
                          <th className="product-quantity">Số lượng</th>
                          <th className="product-total">Tổng</th>
                          <th className="product-remove">Xoá</th>
                        </tr>
                      </thead>
                      <tbody>
                        
                        {cartItems.map((item) => (
                          <tr key={item.productResponse.id}>
                          <td className="product-thumbnail">
                          <img src={item.productResponse.imageUrl} alt="Image" className="img-fluid"/>
                          </td>
                          <td className="product-name">
                            <h2 className="h5 text-black">{item.productResponse.productName}</h2>
                          </td>
                          <td>{item.productResponse.price}</td>
                          <td>
                            <div className="input-group mb-3 d-flex align-items-center quantity-container" style={{maxWidth: '120px'}}>
                              <div className="input-group-prepend">
                                <button className="btn btn-outline-black decrease" type="button"><i class="bi bi-dash-circle-fill"></i></button>
                              </div>
                              <input type="text" className="form-control text-center quantity-amount" value="1" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1"/>
                              <div className="input-group-append">
                                <button className="btn btn-outline-black increase" type="button"><i class="bi bi-plus-circle-fill"></i></button>
                              </div>
                            </div>
        
                          </td>
                          <td  >{item.productResponse.price * item.quantity}</td>
                          <td ><button href="#" className="btn btn-danger btn-sm" onClick={() => handleRemoveItem(item.productResponse.id)} ><i class="bi bi-trash-fill"></i></button></td>
                        </tr>
                        ))}
                           
                      </tbody>
                    </table>
                  </div>
                </form>
              </div>
        
              <div className="row">
                <div className="col-md-6">
                  <div className="row mb-5">

                    <div className="col-md-6">
                      <button className="btn btn-outline-black btn-sm btn-block" onClick={handleToContinueShopping}>Tiếp tục mua sắm</button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <label className="text-black h4" for="coupon">Coupon</label>
                      <p>Enter your coupon code if you have one.</p>
                    </div>
                    <div className="col-md-8 mb-3 mb-md-0">
                      <input type="text" className="form-control py-3" id="coupon" placeholder="Coupon Code"/>
                    </div>
                    <div className="col-md-4">
                      <button className="btn btn-black">Apply Coupon</button>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 pl-5">
                  <div className="row justify-content-end">
                    <div className="col-md-7">
                      <div className="row">
                        <div className="col-md-12 text-right border-bottom mb-5">
                          <h3 className="text-black h4 text-uppercase">Tổng tiền</h3>
                        </div>
                      </div>
                      <div className="row mb-5">
                        <div className="col-md-6">
                          <span className="text-black">Total</span>
                        </div>
                        <div className="col-md-6 text-right">
                          <strong className="text-black">{totalPrice}đ</strong>
                        </div>
                      </div>
        
                      <div className="row">
                        <div className="col-md-12">
                          <button className="btn btn-black btn-lg py-3 btn-block" onClick={handleToCheckout} >Thanh toán</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
   
        
        </div>
    );
}

export default Cart;
