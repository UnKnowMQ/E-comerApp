import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';
import DataTable from 'react-data-table-component';
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
import '../assets/vendor/quill/quill.js';
import '../assets/vendor/simple-datatables/simple-datatables.js';
import '../assets/js/main.js';

const API_BASE = import.meta.env.VITE_API || 'http://localhost:8036';

function ShopProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [shopId, setShopId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [filterText, setFilterText] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('primary');
  const toastRef = useRef(null);

  // Restore alert from localStorage after reload
  useEffect(() => {
    const storedMsg = localStorage.getItem('shopproduct_alertMsg');
    const storedType = localStorage.getItem('shopproduct_alertType');
    if (storedMsg) {
      setAlertMsg(storedMsg);
      setAlertType(storedType || 'primary');
      localStorage.removeItem('shopproduct_alertMsg');
      localStorage.removeItem('shopproduct_alertType');
    }
  }, []);

  // Show toast when alertMsg changes
  useEffect(() => {
    if (alertMsg && toastRef.current) {
      const toast = window.bootstrap.Toast.getOrCreateInstance(toastRef.current);
      toast.show();
    }
  }, [alertMsg]);

  // Resolve shopId by calling POST /shop/user/{userId} with userId from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const userId = userData?.user?.data?.customerId ?? userData?.user?.data?.id;
    const jwt = localStorage.getItem('jwt');

    if (!userId) {
      setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }

    axios
      .post(`${API_BASE}/shop/user/${userId}`, null, {  
        params: { userId },
        headers: { Authorization: `Bearer ${jwt}` },
        withCredentials: true,
      })
      .then((res) => {
        const fetchedId = res.data?.data?.id ?? res.data?.data?.shopId;
        if (fetchedId) {
          setShopId(fetchedId);
        } else {
          setError('Không tìm thấy thông tin shop. Vui lòng liên hệ quản trị viên.');
          setLoading(false);
        }
      })
      .catch(() => {
        setError('Không thể lấy thông tin shop. Vui lòng thử lại.');
        setLoading(false);
      });
  }, []);

  // Fetch products when shopId is available
  useEffect(() => {
    if (!shopId) return;
    const jwt = localStorage.getItem('jwt');
    setLoading(true);
    axios
      .get(`${API_BASE}/product/shopProduct`, {
        params: { shopId },
        headers: { Authorization: `Bearer ${jwt}` },
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.status === 200) {
            console.log('Fetched products:', res.data);
          setProducts(res.data.data);
        } else {
          setError('Không thể tải danh sách sản phẩm.');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Lỗi khi tải sản phẩm. Vui lòng thử lại.');
      })
      .finally(() => setLoading(false));
  }, [shopId]);

  const handleEdit = (product) => {
    navigate('/ShopProducts_edit', { state: { product } });
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    const modal = new Modal(document.getElementById('detailModal'));
    modal.show();
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
    const modal = new Modal(document.getElementById('deleteModal'));
    modal.show();
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    const jwt = localStorage.getItem('jwt');
    try {
      const res = await axios.delete(`${API_BASE}/product/delete`, {
        params: { id: productToDelete.id },
        headers: { Authorization: `Bearer ${jwt}` },
        withCredentials: true,
      });
      setShowDeleteModal(false);
      setProductToDelete(null);
      if (res.data.status !== 200) {
        localStorage.setItem('shopproduct_alertMsg', 'Xoá sản phẩm thất bại!');
        localStorage.setItem('shopproduct_alertType', 'danger');
      } else {
        localStorage.setItem('shopproduct_alertMsg', 'Xoá sản phẩm thành công!');
        localStorage.setItem('shopproduct_alertType', 'success');
      }
      window.location.reload();
    } catch (err) {
      setShowDeleteModal(false);
      setProductToDelete(null);
      setAlertMsg('Xoá thất bại!');
      setAlertType('danger');
    }
  };

  const statusBadge = (status) => {
    const map = {
      ACTIVE: 'success',
      INACTIVE: 'secondary',
      BANNED: 'danger',
    };
    return (
      <span className={`badge bg-${map[status] ?? 'warning'}`}>{status}</span>
    );
  };

  const columns = [
    {
      name: 'ID',
      selector: (row) => row.id,
      sortable: true,
      width: '70px',
    },
    {
      name: 'Tên sản phẩm',
      selector: (row) => row.productName,
      sortable: true,
    },
    {
      name: 'Danh mục',
      selector: (row) => row.category_name,
      sortable: true,
    },
    {
      name: 'Giá (đ)',
      selector: (row) => row.price,
      sortable: true,
      cell: (row) => row.price?.toLocaleString('vi-VN'),
    },
    {
      name: 'Số lượng',
      selector: (row) => row.quantity,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Trạng thái',
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => statusBadge(row.status),
      width: '120px',
    },
    {
      name: 'Lựa chọn',
      cell: (row) => (
        <div className="d-flex gap-1">
          <button
            className="btn btn-sm btn-warning text-light"
            title="Chỉnh sửa"
            onClick={() => handleEdit(row)}
          >
            <i className="bi bi-pen-fill"></i>
          </button>
          <button
            className="btn btn-sm btn-danger"
            title="Xoá"
            onClick={() => handleDeleteClick(row)}
          >
            <i className="bi bi-trash3-fill"></i>
          </button>
          <button
            className="btn btn-sm btn-secondary"
            title="Chi tiết"
            onClick={() => openModal(row)}
          >
            <i className="bi bi-info-circle-fill"></i>
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const filteredProducts = products.filter(
    (p) =>
      p.productName &&
      p.productName.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div>
      <main id="main" className="main">
        {/* Toast notification */}
        <div
          className={`toast align-items-center text-bg-${alertType} border-0 position-fixed top-0 end-0 m-3`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          ref={toastRef}
          data-bs-delay="3000"
          style={{ zIndex: 9999, minWidth: '250px' }}
        >
          <div className="d-flex">
            <div className="toast-body">{alertMsg}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>

        <div className="pagetitle">
          <h1>Quản lý sản phẩm của shop</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Trang chủ</a>
              </li>
              <li className="breadcrumb-item active">Sản phẩm của shop</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="container">
                    <div className="row align-items-center mb-3">
                      <div className="col-md-8">
                        <button className="btn btn-success">
                          <a className="text-light" href="/ShopProduct_add">
                            <i className="bi bi-plus-circle-fill pe-1"></i>
                            Thêm sản phẩm mới
                          </a>
                        </button>
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          placeholder="Tìm sản phẩm..."
                          className="form-control"
                          value={filterText}
                          onChange={(e) => setFilterText(e.target.value)}
                        />
                      </div>
                    </div>

                    {loading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Đang tải...</span>
                        </div>
                      </div>
                    ) : (
                      <DataTable
                        columns={columns}
                        data={filteredProducts}
                        pagination
                        highlightOnHover
                        selectableRows
                        noDataComponent="Không có sản phẩm nào."
                      />
                    )}

                    {/* Delete modal */}
                    <div
                      className="modal fade"
                      id="deleteModal"
                      tabIndex="-1"
                      aria-labelledby="deleteModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="deleteModalLabel">
                              Xác nhận xoá
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                              onClick={() => setShowDeleteModal(false)}
                            ></button>
                          </div>
                          <div className="modal-body">
                            <p>
                              Bạn có chắc chắn muốn xoá sản phẩm{' '}
                              <strong>{productToDelete?.productName}</strong>?
                            </p>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                              onClick={() => setShowDeleteModal(false)}
                            >
                              Huỷ
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={confirmDelete}
                            >
                              Xoá
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detail modal */}
                    <div
                      className="modal fade"
                      id="detailModal"
                      tabIndex="-1"
                      aria-labelledby="detailModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                          {selectedProduct && (
                            <>
                              <div className="modal-header">
                                <h5 className="modal-title" id="detailModalLabel">
                                  {selectedProduct.productName}
                                </h5>
                                <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                ></button>
                              </div>
                              <div className="modal-body">
                                {selectedProduct.imageUrl?.length > 0 && (
                                  <div className="mb-3 d-flex flex-wrap gap-2">
                                    {selectedProduct.imageUrl.map((url, i) => (
                                      <img
                                        key={i}
                                        src={url}
                                        alt={`Ảnh ${i + 1}`}
                                        style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                                      />
                                    ))}
                                  </div>
                                )}
                                <table className="table table-borderless table-sm">
                                  <tbody>
                                    <tr>
                                      <th>Danh mục</th>
                                      <td>{selectedProduct.category_name}</td>
                                    </tr>
                                    <tr>
                                      <th>Giá</th>
                                      <td>{selectedProduct.price?.toLocaleString('vi-VN')} đ</td>
                                    </tr>
                                    <tr>
                                      <th>Số lượng</th>
                                      <td>{selectedProduct.quantity}</td>
                                    </tr>
                                    <tr>
                                      <th>Bảo hành</th>
                                      <td>{selectedProduct.warranty}</td>
                                    </tr>
                                    <tr>
                                      <th>Trạng thái</th>
                                      <td>{statusBadge(selectedProduct.status)}</td>
                                    </tr>
                                    <tr>
                                      <th>Slug</th>
                                      <td>{selectedProduct.slug}</td>
                                    </tr>
                                    <tr>
                                      <th>Mô tả</th>
                                      <td>{selectedProduct.description}</td>
                                    </tr>
                                    <tr>
                                      <th>Ngày tạo</th>
                                      <td>{new Date(selectedProduct.created_at).toLocaleString('vi-VN')}</td>
                                    </tr>
                                    <tr>
                                      <th>Cập nhật</th>
                                      <td>{new Date(selectedProduct.updated_at).toLocaleString('vi-VN')}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ShopProducts;
