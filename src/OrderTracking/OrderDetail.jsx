import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./OrderDetail.module.css";

const STEPS = [
  { key: "pending", label: "Đơn Hàng Đã Đặt", icon: "📋" },
  { key: "confirmed", label: "Đã Xác Nhận Thông Tin Thanh Toán", icon: "💰" },
  { key: "shipping", label: "Đã Giao Cho ĐVVC", icon: "🚚" },
  { key: "delivering", label: "Đã Nhận Được Hàng", icon: "📦" },
  { key: "done", label: "Đơn Hàng Đã Hoàn Thành", icon: "⭐" },
];

function getActiveStep(status) {
  switch (status) {
    case "pending":
      return 0;
    case "confirmed":
      return 1;
    case "shipping":
      return 2;
    case "delivering":
      return 3;
    case "done":
      return 4;
    case "cancelled":
      return -1;
    default:
      return 0;
  }
}

function getStatusTitle(status) {
  switch (status) {
    case "done":
      return "ĐƠN HÀNG ĐÃ HOÀN THÀNH";
    case "pending":
      return "CHỜ THANH TOÁN";
    case "confirmed":
      return "ĐÃ XÁC NHẬN THANH TOÁN";
    case "shipping":
      return "ĐANG VẬN CHUYỂN";
    case "delivering":
      return "ĐANG GIAO HÀNG";
    case "cancelled":
      return "ĐÃ HỦY";
    default:
      return status?.toUpperCase() || "";
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN").format(price) + "₫";
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function OrderDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const invoiceId = searchParams.get("invoiceId");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!invoiceId) return;
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_API}/invoice/${invoiceId}`,
          {
            params: { invoiceId },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );
        setOrder(res.data.data || null);
      } catch (err) {
        console.error("Failed to fetch order detail:", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [invoiceId]);

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}>Đang tải chi tiết đơn hàng...</div></div>;
  }

  if (!order) {
    return <div className={styles.container}><div className={styles.loading}>Không tìm thấy đơn hàng</div></div>;
  }

  const activeStep = getActiveStep(order.status);
  const progressWidth = activeStep >= 0 ? `${(activeStep / (STEPS.length - 1)) * 100}%` : "0%";

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate("/OrderTracking")}>
          ‹ TRỞ LẠI
        </button>
        <div className={styles.orderCodeTop}>
          <span>MÃ ĐƠN HÀNG. {order.orderCode}</span>
          <span className={styles.statusTitle}>{getStatusTitle(order.status)}</span>
        </div>
      </div>

      {/* Timeline */}
      {order.status !== "cancelled" && (
        <div className={styles.timelineSection}>
          <div className={styles.timeline}>
            <div className={styles.timelineProgress} style={{ width: progressWidth }}></div>
            {STEPS.map((step, idx) => (
              <div
                key={step.key}
                className={`${styles.timelineStep} ${idx <= activeStep ? styles.stepActive : ""}`}
              >
                <div className={styles.stepIcon}>{step.icon}</div>
                <div className={styles.stepLabel}>{step.label}</div>
                {idx === 0 && order.invoiceDate && (
                  <div className={styles.stepDate}>{formatDate(order.invoiceDate)}</div>
                )}
                {idx === activeStep && idx !== 0 && (
                  <div className={styles.stepDate}>{formatDate(order.invoiceDate)}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shipping Address */}
      <div className={styles.infoSection}>
        <div className={styles.sectionTitle}>Địa Chỉ Nhận Hàng</div>
        <div className={styles.addressInfo}>
          <h4>{order.username}</h4>
          <p>{order.shippingAddress}</p>
        </div>
      </div>

      {/* Products */}
      <div className={styles.productSection}>
        <div className={styles.productHeader}>
          <div className={styles.shopInfo}>
            <span className={styles.shopBadge}>Mall</span>
            <span className={styles.shopName}>{order.shopName}</span>
          </div>
        </div>

        {order.details?.map((item, idx) => (
          <div key={idx} className={styles.productItem}>
            <div className={styles.productImagePlaceholder}>
              <span>Ảnh SP</span>
            </div>
            <div className={styles.productInfo}>
              <div className={styles.productName}>{item.productName}</div>
              <div className={styles.productQty}>x{item.quantity}</div>
            </div>
            <div className={styles.productPrice}>
              <div className={styles.priceFinal}>{formatPrice(item.unitPrice)}</div>
            </div>
          </div>
        ))}

        <div className={styles.orderFooter}>
          <div className={styles.thankYou}>Cảm ơn bạn đã mua sắm tại ESHOP!</div>
          <div className={styles.totalRow}>
            Thành tiền: <span className={styles.totalAmount}>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className={styles.summarySection}>
        <div className={styles.summaryRow}>
          <span>Phương thức thanh toán</span>
          <span>{order.paymentMethod}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Ngày đặt hàng</span>
          <span>{formatDate(order.invoiceDate)}</span>
        </div>
        {order.note && (
          <div className={styles.summaryRow}>
            <span>Ghi chú</span>
            <span>{order.note}</span>
          </div>
        )}
        <div className={styles.summaryRow}>
          <span>Tổng tiền</span>
          <span className={styles.value}>{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.btnBuyAgain}>Mua Lại</button>
        <button className={styles.btnContact}>Liên Hệ Người Bán</button>
      </div>
    </div>
  );
}

export default OrderDetail;
