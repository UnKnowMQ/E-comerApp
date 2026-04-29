import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, useRef } from 'react';
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

function ProductApproval() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionProduct, setActionProduct] = useState(null);
  const [actionType, setActionType] = useState(''); // 'approve' | 'reject'

  const [filterText, setFilterText] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('primary');
  const toastRef = useRef(null);

  const fetchProducts = () => {
    const jwt = localStorage.getItem('jwt');
    setLoading(true);
    axios
      .get(`${API_BASE}/product/get-product`, {
        params: { pageNo: 0, pageSize: 1000 },
        headers: { Authorization: `Bearer ${jwt}` },
        withCredentials: true,
      })
      .then((res) => {
        const all = res.data?.data?.items ?? [];
        setProducts(all.filter((p) => p.status === 'PENDING'));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Show toast
  useEffect(() => {
    if (alertMsg && toastRef.current) {
      const toast = window.bootstrap.Toast.getOrCreateInstance(toastRef.current);
      toast.show();
    }
  }, [alertMsg]);

  const openDetailModal = (product) => {
    setSelectedProduct(product);
    const modal = new Modal(document.getElementById('detailModal'));
    modal.show();
  };

  const openActionModal = (product, type) => {
    setActionProduct(product);
    setActionType(type);
    const modal = new Modal(document.getElementById('actionModal'));
    modal.show();
  };

  const confirmAction = async () => {
    if (!actionProduct) return;
    const endpoint = actionType === 'approve'
      ? `${API_BASE}/product/approve/${actionProduct.id}`
      : `${API_BASE}/product/reject/${actionProduct.id}`;
    const jwt = localStorage.getItem('jwt');
    try {
      await axios.put(endpoint, null, {
        headers: { Authorization: `Bearer ${jwt}` },
        withCredentials: true,
      });
      setActionProduct(null);
      setAlertMsg(
        actionType === 'approve' ? 'Duyệt sản phẩm thành công!' : 'Từ chối sản phẩm thành công!'
      );
      setAlertType('success');
      fetchProducts();
    } catch {
      setActionProduct(null);
      setAlertMsg('Thao tác thất bại! Vui lòng thử lại.');
      setAlertType('danger');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.productName &&
      p.productName.toLowerCase().includes(filterText.toLowerCase())
  );

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
      name: 'Ngày tạo',
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) =>
        row.created_at
          ? new Date(row.created_at).toLocaleDateString('vi-VN')
          : '—',
    },
    {
      name: 'Lựa chọn',
      cell: (row) => (
        <div className="d-flex gap-1">
          <button
            className="btn btn-sm btn-success"
            title="Duyệt"
            onClick={() => openActionModal(row, 'approve')}
          >
            <i className="bi bi-check-circle-fill"></i>
          </button>
          <button
            className="btn btn-sm btn-danger"
            title="Từ chối"
            onClick={() => openActionModal(row, 'reject')}
          >
            <i className="bi bi-x-circle-fill"></i>
          </button>
          <button
            className="btn btn-sm btn-secondary"
            title="Chi tiết"
            onClick={() => openDetailModal(row)}
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

  return (
    <div>
      <main id="main" className="main">
        {/* Toast */}
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
          <h1>Duyệt sản phẩm</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Trang chủ</a></li>
              <li className="breadcrumb-item active">Duyệt sản phẩm</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="row align-items-center mb-3 mt-2">
                    <div className="col-md-8">
                      <h5 className="mb-0">
                        <span className="badge bg-warning text-dark me-2">
                          {filteredProducts.length}
                        </span>
                        sản phẩm chờ duyệt
                      </h5>
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
                      noDataComponent="Không có sản phẩm nào chờ duyệt."
                    />
                  )}

                  {/* Confirm action modal */}
                  <div
                    className="modal fade"
                    id="actionModal"
                    tabIndex="-1"
                    aria-labelledby="actionModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="actionModalLabel">
                            {actionType === 'approve' ? 'Xác nhận duyệt' : 'Xác nhận từ chối'}
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => setActionProduct(null)}
                          ></button>
                        </div>
                        <div className="modal-body">
                          {actionType === 'approve' ? (
                            <p>
                              Bạn có chắc muốn <strong>duyệt</strong> sản phẩm{' '}
                              <strong>{actionProduct?.productName}</strong>?
                            </p>
                          ) : (
                            <p>
                              Bạn có chắc muốn <strong>từ chối</strong> sản phẩm{' '}
                              <strong>{actionProduct?.productName}</strong>?
                            </p>
                          )}
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            onClick={() => setActionProduct(null)}
                          >
                            Huỷ
                          </button>
                          <button
                            type="button"
                            className={`btn ${actionType === 'approve' ? 'btn-success' : 'btn-danger'}`}
                            data-bs-dismiss="modal"
                            onClick={confirmAction}
                          >
                            {actionType === 'approve' ? 'Duyệt' : 'Từ chối'}
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
                                      style={{
                                        width: '120px',
                                        height: '120px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                              <table className="table table-borderless table-sm">
                                <tbody>
                                  <tr><th>Danh mục</th><td>{selectedProduct.category_name}</td></tr>
                                  <tr><th>Giá</th><td>{selectedProduct.price?.toLocaleString('vi-VN')} đ</td></tr>
                                  <tr><th>Số lượng</th><td>{selectedProduct.quantity}</td></tr>
                                  <tr><th>Bảo hành</th><td>{selectedProduct.warranty}</td></tr>
                                  <tr><th>Mô tả</th><td>{selectedProduct.description}</td></tr>
                                  <tr>
                                    <th>Ngày tạo</th>
                                    <td>{selectedProduct.created_at ? new Date(selectedProduct.created_at).toLocaleString('vi-VN') : '—'}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-success"
                                data-bs-dismiss="modal"
                                onClick={() => openActionModal(selectedProduct, 'approve')}
                              >
                                <i className="bi bi-check-circle-fill me-1"></i>Duyệt
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger"
                                data-bs-dismiss="modal"
                                onClick={() => openActionModal(selectedProduct, 'reject')}
                              >
                                <i className="bi bi-x-circle-fill me-1"></i>Từ chối
                              </button>
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
        </section>
      </main>
    </div>
  );
}

export default ProductApproval;
