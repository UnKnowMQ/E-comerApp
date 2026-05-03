import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ShopView.module.css";

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN").format(price) + "₫";
}

function formatJoinDate(dateStr) {
  if (!dateStr) return "";
  const created = new Date(dateStr);
  const now = new Date();
  const diffYears = now.getFullYear() - created.getFullYear();
  if (diffYears > 0) return `${diffYears} Năm Trước`;
  const diffMonths =
    (now.getFullYear() - created.getFullYear()) * 12 +
    (now.getMonth() - created.getMonth());
  if (diffMonths > 0) return `${diffMonths} Tháng Trước`;
  return "Mới tham gia";
}

function ShopView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const shopId = searchParams.get("shopId");

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!shopId) return;
    const fetchShop = async () => {
      setLoading(true);
      try {
        const [shopRes, productsRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_APP_API}/shop/productId/${shopId}`,
            { params: { productId: shopId } }
          ),
          axios.get(
            `${import.meta.env.VITE_APP_API}/product/shopProduct`,
            { params: { shopId } }
          ),
        ]);
        setShop(shopRes.data.data || null);
        setProducts(productsRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch shop:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [shopId]);

  const filteredProducts = products.filter((p) => {
    if (activeTab === "all") return true;
    return p.category_name === activeTab;
  }).filter((p) =>
    !searchTerm || p.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(products.map((p) => p.category_name).filter(Boolean))];

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}>Đang tải thông tin shop...</div></div>;
  }

  if (!shop) {
    return <div className={styles.container}><div className={styles.loading}>Không tìm thấy shop</div></div>;
  }

  return (
    <div className={styles.container}>
      {/* Shop Header */}
      <div className={styles.shopHeader}>
        <div className={styles.shopBanner}>
          <div className={styles.shopProfile}>
            {shop.logo ? (
              <img src={shop.logo} alt={shop.shopName} className={styles.shopLogo} />
            ) : (
              <div className={styles.shopLogoPlaceholder}>
                {shop.shopName?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <div className={styles.shopNameHeader}>{shop.shopName}</div>
            <div className={styles.shopOnline}>Online</div>
            <div className={styles.shopActions}>
              <button className={styles.btnFollow}>+ Theo Dõi</button>
              <button className={styles.btnChat}>💬 Chat</button>
            </div>
          </div>
        </div>

        <div className={styles.shopStats}>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>📦</span>
            Sản Phẩm: <span className={styles.statValue}>{shop.totalProducts || products.length}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>👥</span>
            Người Theo Dõi: <span className={styles.statValue}>{shop.totalFollowers || 0}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>⭐</span>
            Đánh Giá: <span className={styles.statValue}>{shop.rating || "Chưa có"}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>🕐</span>
            Tham Gia: <span className={styles.statValue}>{formatJoinDate(shop.createdAt)}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>📍</span>
            Địa chỉ: <span className={styles.statValue}>{shop.shopAddress || "Chưa cập nhật"}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>🏪</span>
            Loại hình: <span className={styles.statValue}>{shop.businessType || "Chưa cập nhật"}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "all" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("all")}
        >
          TẤT CẢ SẢN PHẨM
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.tab} ${activeTab === cat ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className={styles.shopSearch}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Tìm trong Shop này"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className={styles.searchBtn}>🔍</button>
      </div>

      {/* Description */}
      {shop.description && (
        <div className={styles.shopDescription}>{shop.description}</div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className={styles.emptyState}>Chưa có sản phẩm nào</div>
      ) : (
        <div className={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={styles.productCard}
              onClick={() => navigate(`/Product_detail?id=${product.id}`)}
            >
              {product.imageUrl && product.imageUrl.length > 0 ? (
                <img
                  src={product.imageUrl[0]}
                  alt={product.productName}
                  className={styles.productImage}
                />
              ) : (
                <div className={styles.productImagePlaceholder}>Ảnh SP</div>
              )}
              <div className={styles.productCardBody}>
                <div className={styles.productName}>{product.productName}</div>
                <div className={styles.productPrice}>{formatPrice(product.price)}</div>
                {product.saleVolume && (
                  <div className={styles.productSold}>Đã bán {product.saleVolume}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShopView;
