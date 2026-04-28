import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import axios from 'axios';
import { DataTable } from 'simple-datatables';
import '../assets/vendor/bootstrap/css/bootstrap.min.css';
import '../assets/vendor/bootstrap-icons/bootstrap-icons.css';
import '../assets/vendor/boxicons/css/boxicons.min.css';
import '../assets/vendor/quill/quill.snow.css';
import '../assets/vendor/quill/quill.bubble.css';
import '../assets/vendor/remixicon/remixicon.css';
import '../assets/vendor/simple-datatables/style.css';
import '../assets/css/style.css';

import '../Shop/products.css';
import '../assets/vendor/apexcharts/apexcharts.min.js';
import '../assets/vendor/echarts/echarts.min.js';
import '../assets/vendor/chart.js/chart.umd.js';
import '../assets/vendor/php-email-form/validate.js';
import '../assets/vendor/bootstrap/js/bootstrap.bundle.min.js';
import '../assets/vendor/tinymce/tinymce.min.js';
import '../assets/vendor/quill/quill.js'
import '../assets/vendor/simple-datatables/simple-datatables.js'
import '../assets/js/main.js';

function Products () {

      const [products, setProducts] = useState([]);
      const [filter, setFilter] = useState([""]);
      const [page, setPage] = useState(1); // trang hiện tại
      const [brand, setBrand] = useState("");
      const [brands, setBrands] = useState([]);
      const [totalPages, setTotalPages] = useState(1);
      const [category, setCategory] = useState("");
      const [categories, setCategories] = useState([]);
      const [sort, setSort] = useState("");

      const location = useLocation();
      const categoryIdFromQuery = new URLSearchParams(location.search).get('categoryId');
      const selectedCategoryId = categoryIdFromQuery ? Number(categoryIdFromQuery) : null;

      const categoriesById = useMemo(() => {
        const map = new Map();
        for (const c of categories) map.set(c.category_id, c);
        return map;
      }, [categories]);

      const childCategoriesByParent = useMemo(() => {
        const map = new Map();
        for (const c of categories) {
          const key = c.parentId ?? null;
          if (!map.has(key)) map.set(key, []);
          map.get(key).push(c);
        }
        return map;
      }, [categories]);

      const rootCategories = useMemo(() => {
        const roots = childCategoriesByParent.get(null) || [];
        return [...roots].sort((a, b) => (a.category_name || '').localeCompare(b.category_name || ''));
      }, [childCategoriesByParent]);

      const [expandedRoots, setExpandedRoots] = useState({});

      useEffect(() => {
        if (!selectedCategoryId) return;
        const selected = categoriesById.get(selectedCategoryId);
        const parentId = selected?.parentId ?? null;
        if (parentId != null) {
          setExpandedRoots((prev) => ({ ...prev, [parentId]: true }));
        }
      }, [selectedCategoryId, categoriesById]);

      useEffect(() => {
        // Khi đổi categoryId từ URL, reset lại trang để tránh lệch pageNo
        setPage(1);
      }, [selectedCategoryId]);

      const getProductImage = (product) => {
        const imageUrl = product?.imageUrl;
        if (Array.isArray(imageUrl)) return imageUrl[0] || "#";
        return imageUrl || "#";
      };

  useEffect(() => {
    const pageNoForCategoryApi = Math.max(0, page - 1);

    axios.get(`${import.meta.env.VITE_APP_API}/brand/get-brand`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        const items = res.data?.data || [];
        setBrands(items);
      })
      .catch((err) => {
        console.error("Error brands:", err);
      });
      
    axios.get(`${import.meta.env.VITE_APP_API}/category/get-category`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        const items = res.data?.data || [];
        setCategories(items);
      })
      .catch((err) => {
        console.error("Error category:", err);
      });

    const fetchProducts = async () => {
      try {
        if (selectedCategoryId) {
          const res = await axios.get(
            `${import.meta.env.VITE_APP_API}/product/category/${selectedCategoryId}`,
            {
              params: { pageNo: pageNoForCategoryApi, pageSize: 10, categoryId: selectedCategoryId },
              headers: { "Content-Type": "application/json" },
            }
          );

          const data = res.data?.data;
          const items = data?.items || [];
          setProducts(items);
          setTotalPages(data?.totalPages || 1);
          return;
        }

        const res = await axios.get(`${import.meta.env.VITE_APP_API}/product/get-product`, {
          params: { pageNo: page, pageSize: 10 },
          headers: { "Content-Type": "application/json" },
        });
        const items = res.data?.data?.items || [];
        setProducts(items);
        setTotalPages(res.data?.data?.totalPages || 1);
      } catch (err) {
        console.error("Error products:", err);
      }
    };

    fetchProducts();
  }, [page, selectedCategoryId]);
  const navigate = useNavigate();
  const handleToProductDetail = (id) => {
    
    navigate("/Product_detail", { state: { id }});

  };



    return (
        <div className="container my-4">
          <div className="row g-3">
            <div className="col-12 col-lg-3">
              <div className="shop-sidebar">
                <div className="shop-sidebar-title">
                  <i className="bi bi-list me-2"></i>
                  Tất Cả Danh Mục
                </div>

                <ul className="shop-category-list">
                  {rootCategories.map((root) => {
                    const rootChildren = childCategoriesByParent.get(root.category_id) || [];
                    const isRootSelected = selectedCategoryId === root.category_id;
                    const isExpanded = expandedRoots[root.category_id] ?? (rootChildren.length > 0 && isRootSelected);

                    return (
                      <li key={root.category_id} className="shop-category-node">
                        <div className={`shop-category-item ${isRootSelected ? 'active' : ''}`}>
                          {rootChildren.length > 0 && (
                            <button
                              type="button"
                              className="shop-category-toggle"
                              onClick={() =>
                                setExpandedRoots((prev) => ({
                                  ...prev,
                                  [root.category_id]: !(prev[root.category_id] ?? false),
                                }))
                              }
                              aria-label="toggle"
                            >
                              <i className={`bi ${isExpanded ? 'bi-caret-down-fill' : 'bi-caret-right-fill'}`}></i>
                            </button>
                          )}

                          <button
                            type="button"
                            className="shop-category-link"
                            onClick={() => navigate(`/Products?categoryId=${root.category_id}`)}
                          >
                            {root.category_name}
                          </button>
                        </div>

                        {isExpanded && rootChildren.length > 0 && (
                          <ul className="shop-subcategory-list">
                            {rootChildren.map((child) => (
                              <li key={child.category_id}>
                                <button
                                  type="button"
                                  className={`shop-subcategory-link ${selectedCategoryId === child.category_id ? 'active' : ''}`}
                                  onClick={() => navigate(`/Products?categoryId=${child.category_id}`)}
                                >
                                  {child.category_name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>

                <div className="shop-filter-title">
                  <i className="bi bi-funnel me-2"></i>
                  BỘ LỌC TÌM KIẾM
                </div>

                <div className="shop-filter-block">
                  <label className="form-label mb-1">Tìm kiếm</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                </div>

                <div className="shop-filter-block">
                  <label className="form-label mb-1">Thương hiệu</label>
                  <select
                    className="form-select"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    {brands.map((b) => (
                      <option key={b.brand_id} value={b.brand_name}>{b.brand_name}</option>
                    ))}
                  </select>
                </div>

                <div className="shop-filter-block">
                  <label className="form-label mb-1">Loại sản phẩm</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    {categories.map((c) => (
                      <option key={c.category_id} value={c.category_name}>{c.category_name}</option>
                    ))}
                  </select>
                </div>

                <div className="shop-filter-block">
                  <button
                    className="btn btn-secondary w-100"
                    onClick={() => {
                      setPage(1);
                      const tfilter = "productName:" + filter;
                      const params = {
                        pageNo: page,
                        pageSize: 10,
                        sortBy: sort,
                        brandName: brand,
                        categoryName: category,
                        search: tfilter,
                      };
                      axios.get(`${import.meta.env.VITE_APP_API}/product/get-products-multiple-searching-col`, {
                        params,
                        headers: { "Content-Type": "application/json" },
                      })
                        .then((res) => {
                          const items = res.data?.data?.items || [];
                          setProducts(items);
                          setTotalPages(res.data?.data?.totalPages || 1);
                        })
                        .catch((err) => {
                          console.error("Error products:", err);
                        });
                    }}
                  >
                    Lọc
                  </button>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-9">
              <div className="shop-sortbar">
                <div className="shop-sortbar-left">
                  <span className="me-2">Sắp xếp theo</span>
                  <button type="button" className="btn btn-light btn-sm" onClick={() => setSort("")}>Phổ Biến</button>
                  <button type="button" className="btn btn-light btn-sm" onClick={() => setSort("")}>Mới Nhất</button>
                  <button type="button" className="btn btn-light btn-sm" onClick={() => setSort("")}>Bán Chạy</button>
                </div>
                <div className="shop-sortbar-right">
                  <select
                    className="form-select form-select-sm"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="">Giá</option>
                    <option value="price:asc">Giá: Thấp đến cao</option>
                    <option value="price:desc">Giá: Cao đến thấp</option>
                  </select>
                </div>
              </div>

              <div className="row g-3" id="product-list">
                {products.map((product) => (
                  <div key={product.id} className="col-12 col-md-4 col-lg-3">
                    <a className="product-item shop-product-card" onClick={() => handleToProductDetail(product.id)}>
                      <img
                        src={getProductImage(product)}
                        alt={product.productName}
                        className="img-fluid product-thumbnail"
                      />
                      <h3 className="product-title">{product.productName}</h3>
                      <div className="shop-price-row">
                        <strong className="product-price text-danger">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </strong>
                        {typeof product.saleVolume === 'number' ? (
                          <span className="shop-sold">Đã bán {new Intl.NumberFormat('vi-VN').format(product.saleVolume)}</span>
                        ) : (
                          <span className="shop-sold" />
                        )}
                      </div>
                      <span className="icon-cross text-white fs-2">
                        <i className="bi bi-plus-circle-fill"></i>
                      </span>
                    </a>
                  </div>
                ))}
              </div>

              <nav className="mt-4 d-flex justify-content-center" aria-label="Page navigation">
                <ul className="pagination">
                  <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setPage(page - 1)}>Trước</button>
                  </li>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setPage(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}

                  <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setPage(page + 1)}>Sau</button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
    );
}

export default Products;
