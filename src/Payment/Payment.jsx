import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
function PaymentResult() {
  const location = useLocation();
  const navigate = useNavigate();

  // Có 2 luồng:
  // - Cổng thanh toán redirect về: /PaymentResult?status=...&orderCode=...
  // - Ví EWallet: navigate('/PaymentResult', { state: { invoiceId, checkoutStatus, message } })
  const query = new URLSearchParams(location.search);
  const statusFromQuery = query.get("status");
  const orderCode = query.get("orderCode");

  const invoiceId = location.state?.invoiceId;
  const checkoutStatus = location.state?.checkoutStatus;
  const message = location.state?.message;

  const normalizedStatus = useMemo(() => {
    const raw = (statusFromQuery ?? checkoutStatus ?? "").toString().trim();
    return raw.toLowerCase();
  }, [statusFromQuery, checkoutStatus]);

  const hasAnyStatus = Boolean((statusFromQuery && statusFromQuery.trim()) || (checkoutStatus && String(checkoutStatus).trim()));

  const isSuccess = useMemo(() => {
    // Các trạng thái backend có thể trả về
    return ["paid", "success", "shipping"].includes(normalizedStatus);
  }, [normalizedStatus]);
    
  // axios.get(
  //     `${import.meta.env.VITE_APP_API}/Order`, 
  //     {},
  //     {
  //       params: { status: status, orderCode: orderCode },
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  //         "Content-Type": "application/json"
  //       }
  //     }
  //   )
  //     .then((res) => {
  //       if(res.data.status === 200) {
  //         console.log("Payment update response:", res.data);
  //       } else {
  //         alert("Payment failed. Please try again.");
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Error processing payment:", err);
  //       alert("An error occurred while processing your payment. Please try again.");
  //     });

  return (
    <div className="container py-5 text-center">
      {!hasAnyStatus ? (
        <>
          <h2 className="mb-4">Đang xử lý thanh toán...</h2>
          <p className="text-muted">Không nhận được trạng thái thanh toán. Vui lòng thử lại hoặc quay về trang chủ.</p>
          <div className="d-flex justify-content-center gap-2 mt-3">
            <button className="btn btn-primary" onClick={() => navigate("/")}>Về trang chủ</button>
            <button className="btn btn-secondary" onClick={() => navigate("/Cart")}>Về giỏ hàng</button>
          </div>
        </>
      ) : isSuccess ? (
        <>
          <h2 className="text-success mb-4">Thanh toán thành công!</h2>
          <p>Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi.</p>
          {orderCode && <p className="text-muted mb-0">Mã đơn: {orderCode}</p>}
          <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
            Về trang chủ
          </button>
        </>
      ) : (
        <>
          <h2 className="text-danger mb-4">Thanh toán thất bại!</h2>
          <p>Trạng thái: {statusFromQuery || checkoutStatus || "UNKNOWN"}</p>
          <p className="text-muted">Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.</p>
          <div className="d-flex justify-content-center gap-2 mt-3">
            <button className="btn btn-secondary" onClick={() => navigate("/Cart")}>
              Về giỏ hàng
            </button>
            <button className="btn btn-outline-secondary" onClick={() => navigate("/Products")}>
            Quay lại
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default PaymentResult;