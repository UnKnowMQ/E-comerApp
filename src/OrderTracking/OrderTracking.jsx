import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./OrderTracking.module.css";

const TABS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ thanh toán" },
  { key: "shipping", label: "Vận chuyển" },
  { key: "delivering", label: "Chờ giao hàng" },
  { key: "done", label: "Hoàn thành" },
  { key: "cancelled", label: "Đã hủy" },
  { key: "refund", label: "Trả hàng/Hoàn tiền" },
];

function getStatusClass(status) {
  switch (status) {
    case "done":
      return styles.statusDone;
    case "pending":
      return styles.statusPending;
    case "shipping":
    case "delivering":
      return styles.statusShipping;
    case "cancelled":
    case "refund":
      return styles.statusCancelled;
    default:
      return "";
  }
}

function getStatusLabel(status) {
  switch (status) {
    case "done":
      return "HOÀN THÀNH";
    case "pending":
      return "CHỜ THANH TOÁN";
    case "shipping":
      return "ĐANG VẬN CHUYỂN";
    case "delivering":
      return "CHỜ GIAO HÀNG";
    case "cancelled":
      return "ĐÃ HỦY";
    case "refund":
      return "TRẢ HÀNG/HOÀN TIỀN";
    default:
      return status?.toUpperCase() || "";
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN").format(price) + "₫";
}

function OrderTracking() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const userId = localStorage.getItem("customerId");

  const fetchOrders = async (pageNo = 1) => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API}/invoice/user/${userId}`,
        {
          params: {
            pageNo: pageNo,
            pageSize: 10,
            sortBy: "invoice_date",
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      setOrders(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page, userId]);

  const filteredOrders = orders.filter((order) => {
    const matchTab = activeTab === "all" || order.status === activeTab;
    const matchSearch =
      !searchTerm ||
      order.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.details?.some((d) =>
        d.productName?.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      String(order.orderCode).includes(searchTerm);
    return matchTab && matchSearch;
  });

  return (
    <div className={styles.orderContainer}>
      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className={styles.loading}>Đang tải đơn hàng...</div>
      ) : filteredOrders.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Chưa có đơn hàng nào</p>
        </div>
      ) : (
        filteredOrders.map((order) => (
          <div
            key={order.invoiceId}
            className={styles.orderCard}
            onClick={() => navigate(`/OrderDetail?invoiceId=${order.invoiceId}`)}
            style={{ cursor: "pointer" }}
          >
            {/* Header */}
            <div className={styles.orderHeader}>
              <div className={styles.shopInfo}>
                <span className={styles.shopBadge}>Mall</span>
                <span className={styles.shopName}>{order.shopName}</span>
                <button className={styles.chatBtn}>Chat</button>
              </div>
              <div className={styles.orderStatus}>
                <span className={`${styles.statusIcon} ${getStatusClass(order.status)}`}>
                  ✓ Giao hàng thành công
                </span>
                <span className={`${styles.statusLabel} ${getStatusClass(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
            </div>

            {/* Products */}
            {order.details?.map((item, idx) => (
              <div key={idx} className={styles.orderBody}>
                <div className={styles.productImagePlaceholder}>
                  <span>Ảnh SP</span>
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.productName}>{item.productName}</div>
                  <div className={styles.productQty}>x{item.quantity}</div>
                </div>
                <div className={styles.productPrice}>
                  <div className={styles.priceFinal}>
                    {formatPrice(item.unitPrice)}
                  </div>
                </div>
              </div>
            ))}

            {/* Footer */}
            <div className={styles.orderFooter}>
              <div className={styles.orderCode}>
                Mã đơn: {order.orderCode}
              </div>
              <div className={styles.totalAmount}>
                Thành tiền: <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className={styles.orderActions}>
                <button className={styles.btnBuyAgain}>Mua Lại</button>
                <button className={styles.btnContact}>Liên Hệ Người Bán</button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className={styles.pageBtn}
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderTracking;
