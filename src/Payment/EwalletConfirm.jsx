import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function EwalletConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const checkout = location.state?.checkout;

  const [wallet, setWallet] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const totalAmount = checkout?.totalAmount ?? 0;
  const canPay = wallet?.balance != null && Number(wallet.balance) >= Number(totalAmount);

  const formattedTotal = useMemo(() => {
    const v = Number(totalAmount);
    if (!Number.isFinite(v)) return String(totalAmount ?? "");
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
  }, [totalAmount]);

  useEffect(() => {
    const customerId = localStorage.getItem("customerId");
    const token = localStorage.getItem("jwt");
    if (!customerId || !token) return;

    setLoadingWallet(true);
    axios
      .get(`${import.meta.env.VITE_APP_API}/wallet/information/${customerId}`, {
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setWallet(res.data || null);
      })
      .catch((err) => {
        console.error("Error wallet:", err);
        setWallet(null);
      })
      .finally(() => {
        setLoadingWallet(false);
      });
  }, []);

  const handleCancel = async () => {
    // Nếu backend có API hủy, có thể thêm ở đây.
    navigate(-1);
  };

  const handleConfirm = async () => {
    if (!checkout?.invoiceId) return;

    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("jwt");
      const res = await axios.post(
        `${import.meta.env.VITE_APP_API}/checkout/wallet`,
        Number(checkout.invoiceId),
        {
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data?.status === 200) {
        navigate("/PaymentResult", {
          state: {
            invoiceId: checkout.invoiceId,
            checkoutStatus: res.data?.data,
            message: res.data?.message,
          },
        });
      } else {
        setError(res.data?.message || "Xác nhận thất bại");
      }
    } catch (err) {
      console.error("Confirm checkout failed:", err);
      setError(err.response?.data?.message || err.message || "Xác nhận thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (!checkout) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">
          Không có thông tin checkout. Vui lòng quay lại trang thanh toán.
        </div>
        <button className="btn btn-secondary" onClick={() => navigate("/Payment_info")}>Quay lại</button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row g-3">
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="mb-3">Xác nhận thanh toán bằng Ví EWallet</h5>

              <div className="mb-2 d-flex justify-content-between">
                <span className="text-muted">Shop</span>
                <span className="fw-semibold">{checkout.shopName || checkout.shopId}</span>
              </div>
              <div className="mb-2 d-flex justify-content-between">
                <span className="text-muted">Mã hóa đơn</span>
                <span className="fw-semibold">#{checkout.invoiceId}</span>
              </div>
              <div className="mb-2 d-flex justify-content-between">
                <span className="text-muted">Tổng tiền</span>
                <span className="text-danger fw-bold">{formattedTotal}</span>
              </div>

              <hr />

              <div className="fw-semibold mb-2">Sản phẩm</div>
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Tên</th>
                      <th style={{ width: 90 }}>SL</th>
                      <th style={{ width: 140 }} className="text-end">Đơn giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(checkout.details || []).map((d) => (
                      <tr key={d.productId}>
                        <td>{d.productName}</td>
                        <td>{d.quantity}</td>
                        <td className="text-end">
                          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(d.unitPrice) || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="mb-3">Thông tin ví</h6>

              {loadingWallet ? (
                <div className="text-muted">Đang tải thông tin ví...</div>
              ) : wallet ? (
                <>
                  <div className="mb-2 d-flex justify-content-between">
                    <span className="text-muted">Chủ ví</span>
                    <span className="fw-semibold">{wallet.fullName || checkout.username}</span>
                  </div>
                  <div className="mb-2 d-flex justify-content-between">
                    <span className="text-muted">Số dư</span>
                    <span className="fw-semibold">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(wallet.balance) || 0)}
                    </span>
                  </div>

                  {!canPay && (
                    <div className="alert alert-warning mt-3 mb-0">
                      Số dư ví không đủ để thanh toán.
                    </div>
                  )}
                </>
              ) : (
                <div className="text-muted">Không lấy được thông tin ví.</div>
              )}

              <div className="d-grid gap-2 mt-4">
                <button
                  className="btn btn-danger"
                  onClick={handleConfirm}
                  disabled={submitting || loadingWallet || !wallet || !canPay}
                >
                  {submitting ? "Đang xác nhận..." : "Xác nhận thanh toán"}
                </button>
                <button className="btn btn-outline-secondary" onClick={handleCancel} disabled={submitting}>
                  Hủy thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EwalletConfirm;
