import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
function PaymentResult() {
  const location = useLocation();
  const navigate = useNavigate();

  // Giả sử backend redirect về với query ?status=success hoặc ?status=fail
  const query = new URLSearchParams(location.search);
  const status = query.get("status");
  const orderCode = query.get("orderCode");
  const paymentData = {
      status : status,
      orderCode : orderCode,   
    };
  axios.put(
      "http://localhost:8036/invoice/set-checkout-result", 
      {},
      {
        params: { status: status, orderCode: orderCode },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json"
        }
      }
    )
      .then((res) => {
        if(res.data.status === 200) {
          console.log("Payment update response:", res.data);
        } else {
          alert("Payment failed. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Error processing payment:", err);
        alert("An error occurred while processing your payment. Please try again.");
      });

  return (
    <div className="container py-5 text-center">
      {status === "PAID" ? (
        <>
          <h2 className="text-success mb-4">Thanh toán thành công!</h2>
          <p>Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi.</p>
          <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
            Về trang chủ
          </button>
        </>
      ) : (
        <>
          <h2 className="text-danger mb-4">Thanh toán thất bại!</h2>
          <p>Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.</p>
          <button className="btn btn-secondary mt-3" onClick={() => navigate("/Products")}>
            Quay lại
          </button>
        </>
      )}
    </div>
  );
}

export default PaymentResult;