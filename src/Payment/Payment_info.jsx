import React, { useMemo, useState } from "react";
import styles from '../Payment/Payment_info.module.css';
import pic from '../assets/vite-vite-logo.png';
import { FaPlus, FaMinus, FaUser } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import vnpay_logo from '../assets/vnpay_logo.png';
import momo_logo from '../assets/MoMo_Logo.png';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useContext } from "react";
import { ModalContext } from "../ModalContext";

import { useNavigate } from "react-router-dom";
// ...existing code...

function PaymentInfo() {
    const { setShowLogin } = useContext(ModalContext);

  const navigate = useNavigate();

const [username, setUsername] = useState(localStorage.getItem("username") || "Guest");
  const [comboCounts, setComboCounts] = useState({
    beta: 0,
    sweet: 0,
  });

  const handleIncrement = (key) => {
    setComboCounts({ ...comboCounts, [key]: comboCounts[key] + 1 });
  };

  const handleDecrement = (key) => {
    if (comboCounts[key] > 0) {
      setComboCounts({ ...comboCounts, [key]: comboCounts[key] - 1 });
    }
  };

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const location = useLocation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [productName, setProductName] = useState("");
  const [paymentType, setPaymentType] = useState("QRPAY");
  const [shopId, setShopId] = useState(null);
  const [multiShopCart, setMultiShopCart] = useState(false);
  

  const { id } = location.state || {};
  const isSingleProduct = id !== undefined;

  const total = useMemo(() => {
    if (isSingleProduct) {
      return (products || []).reduce((sum, p) => sum + (Number(p.price) || 0), 0);
    }
    return (cartItems || []).reduce(
      (sum, item) => sum + (Number(item.productResponse?.price) || 0) * (Number(item.quantity) || 0),
      0
    );
  }, [isSingleProduct, products, cartItems]);

  console.log("Product ID from state:", id);
useEffect(() => {
    const token = localStorage.getItem("jwt");
    if(id !== undefined) {
    // Clear previous products before fetching new one
    setProducts([]);
    axios.get(`${import.meta.env.VITE_APP_API}/product/get-product-by-id`, {
      params: { productId : id }, // query param

    })
      .then((res) => {
        const items = res.data?.data || [];
        setProducts([items]);
        })
      .catch((err) => {
        console.error("Error products:", err);
      });

    axios.get(`${import.meta.env.VITE_APP_API}/shop/productId/${id}`, {
      params: { productId: id },
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setShopId(res.data?.data?.shopId ?? null);
      })
      .catch((err) => {
        console.error("Error shop by productId:", err);
        setShopId(null);
      });
    }
  }, [id]);

  useEffect(() => {
    if (id !== undefined) return;

    axios.get(`${import.meta.env.VITE_APP_API}/cart/get-cart-by-customer-id`, {
      params: { customerId: localStorage.getItem("username") },
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => {
        const items = res.data?.data || [];
        setCartItems(items);
      })
      .catch((err) => {
        console.error("Error cart:", err);
        setCartItems([]);
      });
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (id !== undefined) return;
    if (!cartItems || cartItems.length === 0) {
      setShopId(null);
      setMultiShopCart(false);
      return;
    }

    // checkout hiện chỉ hỗ trợ 1 shopId, nên kiểm tra giỏ hàng có nhiều shop không
    const productIds = cartItems
      .map((x) => x?.productResponse?.id)
      .filter(Boolean);

    const fetchShopIds = async () => {
      try {
        const results = await Promise.all(
          productIds.map((pid) =>
            axios.get(`${import.meta.env.VITE_APP_API}/shop/productId/${pid}`, {
              params: { productId: pid },
              headers: {
                accept: "*/*",
                Authorization: `Bearer ${token}`,
              },
            })
          )
        );

        const ids = results
          .map((r) => r.data?.data?.shopId)
          .filter((x) => x !== null && x !== undefined);

        const unique = Array.from(new Set(ids));
        if (unique.length === 1) {
          setShopId(unique[0]);
          setMultiShopCart(false);
        } else {
          setShopId(null);
          setMultiShopCart(true);
        }
      } catch (err) {
        console.error("Error shopId from cart:", err);
        setShopId(null);
        setMultiShopCart(false);
      }
    };

    fetchShopIds();
  }, [id, cartItems]);

// ...existing code...
const  handleToPayment = (e) => {
    e.preventDefault();
    if (username === "Guest") {
      setShowLogin(true);
      return;
    }

    // Thanh toán bằng Ví EWallet
    if (paymentType === "EWALLET") {
      if (!shopId) {
        if (multiShopCart) {
          alert("Giỏ hàng có sản phẩm từ nhiều shop. Vui lòng thanh toán từng shop.");
          return;
        }
        alert("Không lấy được shopId để checkout. Vui lòng thử lại.");
        return;
      }

      const token = localStorage.getItem("jwt");
      const expiredAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      const orderCode = Math.floor(Date.now() * 1000 + Math.random() * 1000);
      const paymentId = `ew_${Math.random().toString(36).slice(2, 12)}`;

      const payload = {
        invoiceRequest: {
          invoice_id: Math.floor(Math.random() * 2147483647),
          invoice_date: new Date().toISOString().slice(0, 10),
          total_amount: total,
          payment_method: "EWALLET",
          shipping_address: address,
          invoice_status: "pending",
          note: "Thanh toán đơn hàng",
          order_code: orderCode,
          payment_id: paymentId,
          customerId: Number(localStorage.getItem("customerId")),
          expired_at: expiredAt,
          shopId: shopId,
        },
      };

      axios
        .post(`${import.meta.env.VITE_APP_API}/checkout`, payload, {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.data?.status === 200) {
            navigate("/EwalletConfirm", { state: { checkout: res.data.data } });
          } else {
            alert(res.data?.message || "Checkout thất bại");
          }
        })
        .catch((err) => {
          console.error("Error checkout:", err);
          alert(err.response?.data?.message || err.message || "Checkout thất bại");
        });
      return;
    }

const paymentData = {
      productName : products[0].productName,
      description : "Thanh toan don hang",
      username : username,
      returnUrl : `${import.meta.env.VITE_APP_FE_ENDPOINT}/PaymentResult`,
      price : total,
      cancelUrl : `${import.meta.env.VITE_APP_FE_ENDPOINT}/PaymentResult`,
      invoiceRequest: {
        total_amount: total,
        invoice_date: new Date().toISOString(),
        payment_method: paymentType,
        shipping_address: address,
        invoice_status: "pending",
        note: "string",
        payment_id: Math.floor(Math.random() * 1000000), // Generate a random payment ID
        customerId: localStorage.getItem("customerId"),
      },
      productRequestDTO: {
    id: id,
    productId: products[0].productId,
    productName: products[0].productName,
    slug: products[0].slug,
    price: products[0].price,
    quantity: 1,
    warranty: products[0].warranty,
  }
    };
    if (id === undefined) {
    // Add your payment processing logic here
    paymentData.productRequestDTO = {};
    paymentData.productName = "Multiple Products";
    paymentData.invoiceRequest.total_amount = total;
    paymentData.invoiceRequest.customerId = localStorage.getItem("customerId");


  }

    console.log("Payment Data:", paymentData.cancelUrl);
    // Thêm headers vào đây
    axios.post(
      `${import.meta.env.VITE_APP_API}/Order/create`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json"
        }
      }
    )
      .then((res) => {
        if(res.data.message === "success") {
          console.log("Payment response:", res.data);
          window.location.href = res.data.data.checkoutUrl;
        } else {
          alert("Payment failed. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Error processing payment:", err);
        alert("An error occurred while processing your payment. Please try again.");
      });
  };
    
    
// ...existing code...
    const paymentTypeChange = (event) => {
    setPaymentType(event.target.value);
  }
  return (
  <main className="container">
    <div className="py-5 text-center">
      <h2>Thông tin thanh toán</h2>
      <p className="lead">Vui lòng điền đầy đủ thông tin thanh toán</p>
    </div>

    <div className="row g-5">
      <div className="col-md-5 col-lg-4 order-md-last">
        <h4 className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-primary">Giỏ hàng của bạn</span>
          <span className="badge bg-primary rounded-pill">{products.length}</span>
        </h4>
        <ul className="list-group mb-3">
  {id !== undefined ? (
    products.map((product) => (
      <li key={product.id} className="list-group-item d-flex justify-content-between lh-sm">
        <div>
          <h6 className="my-0">{product.productName}</h6>
          <small className="text-body-secondary">Brief description</small>
        </div>
        <span className="text-body-secondary">{product.price}</span>
      </li>
    ))
  ) : (
    cartItems.map((item) => (
      <li key={item.productResponse.id} className="list-group-item d-flex justify-content-between lh-sm">
        <div>
          <h6 className="my-0">{item.productResponse.productName} x {item.quantity}</h6>
          <small className="text-body-secondary">Brief description</small>
        </div>
        <span className="text-body-secondary">{item.productResponse.price * item.quantity}</span>
      </li>
    ))
  )}
  <li className="list-group-item d-flex justify-content-between bg-body-tertiary">
    <div className="text-success">
      <h6 className="my-0">Promo code</h6>
      <small>EXAMPLECODE</small>
    </div>
    <span className="text-success">−$5</span>
  </li>
  <li className="list-group-item d-flex justify-content-between">
    <span>Total (VNĐ)</span>
    <strong>{total}</strong>
  </li>
</ul>

        <form className="card p-2"> 
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Promo code"/>
            <button type="submit" className="btn btn-secondary">Giảm giá</button>
          </div>
        </form>
      </div>
      <div className="col-md-7 col-lg-8">
        <h4 className="mb-3">Thông tin nhận hàng</h4>
        <form className="needs-validation" novalidate onSubmit={handleToPayment} >
          <div className="row g-3">
            <div className="col-sm-6">
              <label for="firstName" className="form-label">Họ</label>
              <input type="text" className="form-control" id="firstName" placeholder="" value={firstName} required   onChange={e => setFirstName(e.target.value)} />
              <div className="invalid-feedback">
                Valid first name is required.
              </div>
            </div>

            <div className="col-sm-6">
              <label for="lastName" className="form-label">Tên</label>
              <input type="text" className="form-control" id="lastName" placeholder="" value={lastName} required   onChange={e => setLastName(e.target.value)}  />
              <div className="invalid-feedback">
                Valid last name is required.
              </div>
            </div>

            <div className="col-12">
              <label for="username" className="form-label">Username</label>
              <div className="input-group has-validation">
                <span className="input-group-text">@</span>
                <input type="text" className="form-control" id="username" placeholder="Username" required value={username}  />
              <div className="invalid-feedback">
                  Your username is required.
                </div>
              </div>
            </div>

            <div className="col-12">
              <label for="email" className="form-label">Email <span className="text-body-secondary">(Optional)</span></label>
              <input type="email" className="form-control" id="email" placeholder="you@example.com"  value={email}  onChange={e => setEmail(e.target.value)}
 />
              <div className="invalid-feedback">
                Please enter a valid email address for shipping updates.
              </div>
            </div>

            <div className="col-12">
              <label for="address" className="form-label">Địa chỉ</label>
              <input type="text" className="form-control" id="address" placeholder="1234 Main St" required value={address}   onChange={e => setAddress(e.target.value)}
  />
              <div className="invalid-feedback">
                Please enter your shipping address.
              </div>
            </div>

          </div>

          <hr className="my-4"/>



          <h4 className="mb-3">Payment</h4>

          <div className="my-3">
            <div className="form-check">
              <input id="credit" name="paymentMethod" type="radio" className="form-check-input" onChange={paymentTypeChange} value={"COD"}  required/>
              <label className="form-check-label" for="credit">Ship COD</label>
            </div>
            <div className="form-check">
              <input id="debit" name="paymentMethod" type="radio" className="form-check-input"  onChange={paymentTypeChange} value={"EWALLET"} required/>
              <label className="form-check-label" for="debit">Ví EWallet</label>
            </div>

          </div>
         

          <hr className="my-4"/>

          <button className="w-100 btn btn-primary btn-lg" type="submit" >Thanh toán</button>
        </form>
      </div>
    </div>
    </main>

  );
}

export default PaymentInfo;
