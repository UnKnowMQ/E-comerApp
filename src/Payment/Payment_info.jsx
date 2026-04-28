import React, { useState } from "react";
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
  const location = useLocation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [productName, setProductName] = useState("");
  const [paymentType, setPaymentType] = useState("QRPAY");
  

  const { id } = location.state || {};

  
  let total = 0;

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
    }
  }, [id]);
  if(id !== undefined) {
  products.forEach(product => {
    total += product.price;
  });
  console.log("Total price:", total);
}

// ...existing code...
const  handleToPayment = (e) => {
    e.preventDefault();
    if (username === "Guest") {
      setShowLogin(true);
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

  if(id === undefined) {
      useEffect(() => {
    // Clear previous products before fetching new one
    setProducts([]);
    axios.get(`${import.meta.env.VITE_APP_API}/cart/get-cart-by-customer-id`, {
      params: { customerId : localStorage.getItem("username") },
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
      },

    })
      .then((res) => {
        const items = res.data?.data || [];
        setProducts(items);
        console.log("Products in payment info:", items);
        })
      .catch((err) => {
        console.error("Error products:", err);
      });
  }, [id]);
  products.forEach(product => {
    total += product.price;
  });

  }
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
    products.map((item) => (
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
              <input id="debit" name="paymentMethod" type="radio" className="form-check-input"  onChange={paymentTypeChange} value={"QRPAY"} required/>
              <label className="form-check-label" for="debit">QR Pay</label>
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
