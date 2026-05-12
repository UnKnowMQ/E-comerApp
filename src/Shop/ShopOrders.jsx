import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, useRef } from 'react';
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
import '../assets/vendor/bootstrap/js/bootstrap.bundle.min.js';

const API_BASE = import.meta.env.VITE_API || 'http://localhost:8036';

function ShopOrders() {
  const [orders, setOrders] = useState([]);
  const [shopId, setShopId] = useState(null);
  const [shopName, setShopName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('primary');
  const toastRef = useRef(null);

  // Pagination state
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('invoice_date');

  // Restore alert from localStorage after reload
  useEffect(() => {
    const storedMsg = localStorage.getItem('shoporders_alertMsg');
    const storedType = localStorage.getItem('shoporders_alertType');
    if (storedMsg) {
      setAlertMsg(storedMsg);
      setAlertType(storedType || 'primary');
      localStorage.removeItem('shoporders_alertMsg');
      localStorage.removeItem('shoporders_alertType');
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
        const fetchedName = res.data?.data?.shopName ?? res.data?.data?.name ?? '';
        if (fetchedId) {
          setShopId(fetchedId);
          setShopName(fetchedName);
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

  // Fetch orders when shopId is available
  const fetchOrders = async (page, size, sort) => {
    if (!shopId) return;
    const jwt = localStorage.getItem('jwt');
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/invoice/shop/${shopId}`, {
        params: {
          pageNo: page,
          pageSize: size,
          sortBy: sort,
        },
        headers: { Authorization: `Bearer ${jwt}` },
        withCredentials: true,
      });
      
      if (res.data?.content) {
        setOrders(res.data.content);
        setTotalRows(res.data.totalElements || 0);
      } else if (Array.isArray(res.data)) {
        setOrders(res.data);
        setTotalRows(res.data.length);
      } else {
        setOrders([]);
        setTotalRows(0);
      }
    } catch (err) {
      console.error(err);
      setError('Lỗi khi tải danh sách đơn hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) {
      fetchOrders(currentPage, perPage, sortBy);
    }
  }, [shopId, currentPage, perPage, sortBy]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const handleSort = (column, sortDirection) => {
    const sortField = column.sortField || 'invoice_date';
    setSortBy(sortField);
  };

  const openDetailModal = (order) => {
    setSelectedOrder(order);
    const modalEl = document.getElementById('orderDetailModal');
    const modal = new window.bootstrap.Modal(modalEl);
    modal.show();
  };

  // Update order status (seller)
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const updateOrderStatus = async (invoiceId, newStatus) => {
    if (!shopId) return;
    const jwt = localStorage.getItem('jwt');
    setUpdatingStatus(true);
    try {
      const res = await axios.patch(
        `${API_BASE}/invoice/seller/invoice/${invoiceId}/status`,
        { status: newStatus },
        {
          params: { shopId },
          headers: {
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (res.status >= 200 && res.status < 300) {
        // Update local state
        setOrders((prev) =>
          prev.map((o) => (o.invoiceId === invoiceId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder?.invoiceId === invoiceId) {
          setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        }
        const successText =
          typeof res.data === 'string' ? res.data : res.data?.message || 'Updated!';
        setAlertMsg(`${successText} - Cập nhật trạng thái đơn hàng thành công!`);
        setAlertType('success');
      } else {
        setAlertMsg('Cập nhật trạng thái thất bại!');
        setAlertType('danger');
      }
    } catch (err) {
      console.error(err);
      const data = err.response?.data;
      const errMsg =
        (data && (data.error || data.message)) ||
        (typeof data === 'string' ? data : null) ||
        'Lỗi khi cập nhật trạng thái đơn hàng!';
      setAlertMsg(errMsg);
      setAlertType('danger');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Define allowed transitions for seller
  const getNextStatusActions = (status) => {
    const s = status?.toLowerCase();
    const actions = [];
    if (s === 'pending') {
      actions.push({ status: 'wfad', label: 'Xác nhận đơn', color: 'info', icon: 'bi-check2' });
      actions.push({ status: 'cancelled', label: 'Huỷ đơn', color: 'danger', icon: 'bi-x-circle' });
    } else if (s === 'wfad') {
      actions.push({ status: 'delivery', label: 'Bàn giao vận chuyển', color: 'primary', icon: 'bi-truck' });
      actions.push({ status: 'cancelled', label: 'Huỷ đơn', color: 'danger', icon: 'bi-x-circle' });
    } else if (s === 'delivery') {
      actions.push({ status: 'done', label: 'Đã giao thành công', color: 'success', icon: 'bi-check-circle' });
    } else if (s === 'rr') {
      actions.push({ status: 'refunded', label: 'Xác nhận hoàn tiền', color: 'dark', icon: 'bi-cash-coin' });
      actions.push({ status: 'done', label: 'Từ chối trả hàng', color: 'success', icon: 'bi-x-circle' });
    }
    return actions;
  };

  const handleStatusChange = (invoiceId, newStatus, label) => {
    if (window.confirm(`Bạn có chắc muốn "${label}" cho đơn hàng #${invoiceId}?`)) {
      updateOrderStatus(invoiceId, newStatus);
    }
  };

  const statusBadge = (status) => {
    const map = {
      pending: { color: 'warning', text: 'Chờ thanh toán' },
      wfad: { color: 'info', text: 'Chờ giao hàng' },
      delivery: { color: 'primary', text: 'Đang vận chuyển' },
      done: { color: 'success', text: 'Hoàn thành' },
      cancelled: { color: 'danger', text: 'Đã huỷ' },
      rr: { color: 'secondary', text: 'Yêu cầu trả hàng' },
      refunded: { color: 'dark', text: 'Đã hoàn tiền' },
    };
    const info = map[status?.toLowerCase()] || { color: 'dark', text: status };
    return <span className={`badge bg-${info.color}`}>{info.text}</span>;
  };

  const paymentMethodLabel = (method) => {
    const map = {
      EWALLET: 'Ví điện tử',
      COD: 'Thanh toán khi nhận hàng',
      CREDIT_CARD: 'Thẻ tín dụng',
      BANK_TRANSFER: 'Chuyển khoản',
    };
    return map[method] || method;
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString('vi-VN') + ' đ';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('vi-VN');
  };

  const columns = [
    {
      name: 'Mã đơn',
      selector: (row) => row.invoiceId,
      sortable: true,
      sortField: 'invoiceId',
      width: '90px',
    },
    {
      name: 'Ngày đặt',
      selector: (row) => row.invoiceDate,
      sortable: true,
      sortField: 'invoice_date',
      cell: (row) => formatDate(row.invoiceDate),
      width: '120px',
    },
    {
      name: 'Khách hàng',
      selector: (row) => row.username,
      sortable: true,
      sortField: 'username',
    },
    {
      name: 'Tổng tiền',
      selector: (row) => row.totalAmount,
      sortable: true,
      sortField: 'total_amount',
      cell: (row) => formatCurrency(row.totalAmount),
      width: '130px',
    },
    {
      name: 'Thanh toán',
      selector: (row) => row.paymentMethod,
      sortable: true,
      cell: (row) => paymentMethodLabel(row.paymentMethod),
      width: '150px',
    },
    {
      name: 'Trạng thái',
      selector: (row) => row.status,
      sortable: true,
      sortField: 'status',
      cell: (row) => statusBadge(row.status),
      width: '130px',
    },
    {
      name: 'Hành động',
      cell: (row) => {
        const nextActions = getNextStatusActions(row.status);
        return (
          <div className="d-flex gap-1 flex-wrap">
            <button
              className="btn btn-sm btn-info text-white"
              title="Chi tiết"
              onClick={() => openDetailModal(row)}
            >
              <i className="bi bi-eye-fill"></i>
            </button>
            {nextActions.map((act) => (
              <button
                key={act.status}
                className={`btn btn-sm btn-${act.color} text-white`}
                title={act.label}
                disabled={updatingStatus}
                onClick={() => handleStatusChange(row.invoiceId, act.status, act.label)}
              >
                <i className={`bi ${act.icon}`}></i>
              </button>
            ))}
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '180px',
    },
  ];

  // Filter orders based on search text and status
  const filteredOrders = orders.filter((order) => {
    const matchText =
      !filterText ||
      order.username?.toLowerCase().includes(filterText.toLowerCase()) ||
      order.invoiceId?.toString().includes(filterText) ||
      order.orderCode?.toString().includes(filterText) ||
      order.shippingAddress?.toLowerCase().includes(filterText.toLowerCase());

    const matchStatus = !statusFilter || order.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchText && matchStatus;
  });

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
          <h1>Quản lý đơn hàng {shopName && `- ${shopName}`}</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Trang chủ</a>
              </li>
              <li className="breadcrumb-item active">Đơn hàng của shop</li>
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
                    {/* Statistics Cards */}
                    <div className="row mb-4 mt-3">
                      <div className="col-lg col-md-4 col-sm-6 mb-2">
                        <div 
                          className={`card border-warning h-100 ${statusFilter === 'pending' ? 'bg-warning bg-opacity-25' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setStatusFilter(statusFilter === 'pending' ? '' : 'pending')}
                        >
                          <div className="card-body text-center py-2">
                            <h6 className="card-subtitle mb-1 text-muted small">Chờ thanh toán</h6>
                            <h4 className="card-title text-warning mb-0">
                              {orders.filter((o) => o.status?.toLowerCase() === 'pending').length}
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg col-md-4 col-sm-6 mb-2">
                        <div 
                          className={`card border-info h-100 ${statusFilter === 'wfad' ? 'bg-info bg-opacity-25' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setStatusFilter(statusFilter === 'wfad' ? '' : 'wfad')}
                        >
                          <div className="card-body text-center py-2">
                            <h6 className="card-subtitle mb-1 text-muted small">Chờ giao hàng</h6>
                            <h4 className="card-title text-info mb-0">
                              {orders.filter((o) => o.status?.toLowerCase() === 'wfad').length}
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg col-md-4 col-sm-6 mb-2">
                        <div 
                          className={`card border-primary h-100 ${statusFilter === 'delivery' ? 'bg-primary bg-opacity-25' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setStatusFilter(statusFilter === 'delivery' ? '' : 'delivery')}
                        >
                          <div className="card-body text-center py-2">
                            <h6 className="card-subtitle mb-1 text-muted small">Đang vận chuyển</h6>
                            <h4 className="card-title text-primary mb-0">
                              {orders.filter((o) => o.status?.toLowerCase() === 'delivery').length}
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg col-md-4 col-sm-6 mb-2">
                        <div 
                          className={`card border-success h-100 ${statusFilter === 'done' ? 'bg-success bg-opacity-25' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setStatusFilter(statusFilter === 'done' ? '' : 'done')}
                        >
                          <div className="card-body text-center py-2">
                            <h6 className="card-subtitle mb-1 text-muted small">Hoàn thành</h6>
                            <h4 className="card-title text-success mb-0">
                              {orders.filter((o) => o.status?.toLowerCase() === 'done').length}
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg col-md-4 col-sm-6 mb-2">
                        <div 
                          className={`card border-danger h-100 ${statusFilter === 'cancelled' ? 'bg-danger bg-opacity-25' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setStatusFilter(statusFilter === 'cancelled' ? '' : 'cancelled')}
                        >
                          <div className="card-body text-center py-2">
                            <h6 className="card-subtitle mb-1 text-muted small">Đã huỷ</h6>
                            <h4 className="card-title text-danger mb-0">
                              {orders.filter((o) => o.status?.toLowerCase() === 'cancelled').length}
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg col-md-4 col-sm-6 mb-2">
                        <div 
                          className={`card border-secondary h-100 ${statusFilter === 'rr' ? 'bg-secondary bg-opacity-25' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setStatusFilter(statusFilter === 'rr' ? '' : 'rr')}
                        >
                          <div className="card-body text-center py-2">
                            <h6 className="card-subtitle mb-1 text-muted small">Yêu cầu trả hàng</h6>
                            <h4 className="card-title text-secondary mb-0">
                              {orders.filter((o) => o.status?.toLowerCase() === 'rr').length}
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg col-md-4 col-sm-6 mb-2">
                        <div 
                          className={`card border-dark h-100 ${statusFilter === 'refunded' ? 'bg-dark bg-opacity-25' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setStatusFilter(statusFilter === 'refunded' ? '' : 'refunded')}
                        >
                          <div className="card-body text-center py-2">
                            <h6 className="card-subtitle mb-1 text-muted small">Đã hoàn tiền</h6>
                            <h4 className="card-title text-dark mb-0">
                              {orders.filter((o) => o.status?.toLowerCase() === 'refunded').length}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Filters */}
                    <div className="row align-items-center mb-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          placeholder="Tìm kiếm theo mã đơn, khách hàng, địa chỉ..."
                          className="form-control"
                          value={filterText}
                          onChange={(e) => setFilterText(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6 text-end">
                        {statusFilter && (
                          <span className="badge bg-primary me-2">
                            Đang lọc: {statusBadge(statusFilter).props.children}
                          </span>
                        )}
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            setFilterText('');
                            setStatusFilter('');
                          }}
                        >
                          <i className="bi bi-x-circle me-1"></i>
                          Xoá bộ lọc
                        </button>
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
                        data={filteredOrders}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onSort={handleSort}
                        sortServer
                        highlightOnHover
                        striped
                        noDataComponent="Không có đơn hàng nào."
                        paginationComponentOptions={{
                          rowsPerPageText: 'Hiển thị:',
                          rangeSeparatorText: 'của',
                          noRowsPerPage: false,
                          selectAllRowsItem: false,
                        }}
                      />
                    )}

                    {/* Order Detail Modal */}
                    <div
                      className="modal fade"
                      id="orderDetailModal"
                      tabIndex="-1"
                      aria-labelledby="orderDetailModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                          {selectedOrder && (
                            <>
                              <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title" id="orderDetailModalLabel">
                                  <i className="bi bi-receipt me-2"></i>
                                  Chi tiết đơn hàng #{selectedOrder.invoiceId}
                                </h5>
                                <button
                                  type="button"
                                  className="btn-close btn-close-white"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                ></button>
                              </div>
                              <div className="modal-body">
                                {/* Order Info */}
                                <div className="row mb-4">
                                  <div className="col-md-6">
                                    <div className="card h-100">
                                      <div className="card-header bg-light">
                                        <strong>
                                          <i className="bi bi-info-circle me-2"></i>
                                          Thông tin đơn hàng
                                        </strong>
                                      </div>
                                      <div className="card-body">
                                        <table className="table table-borderless table-sm mb-0">
                                          <tbody>
                                            <tr>
                                              <td className="text-muted">Mã đơn hàng:</td>
                                              <td><strong>{selectedOrder.invoiceId}</strong></td>
                                            </tr>
                                            <tr>
                                              <td className="text-muted">Mã giao dịch:</td>
                                              <td><code>{selectedOrder.orderCode}</code></td>
                                            </tr>
                                            <tr>
                                              <td className="text-muted">Ngày đặt:</td>
                                              <td>{formatDate(selectedOrder.invoiceDate)}</td>
                                            </tr>
                                            <tr>
                                              <td className="text-muted">Trạng thái:</td>
                                              <td>{statusBadge(selectedOrder.status)}</td>
                                            </tr>
                                            <tr>
                                              <td className="text-muted">Ghi chú:</td>
                                              <td>{selectedOrder.note || '-'}</td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="card h-100">
                                      <div className="card-header bg-light">
                                        <strong>
                                          <i className="bi bi-person me-2"></i>
                                          Thông tin khách hàng
                                        </strong>
                                      </div>
                                      <div className="card-body">
                                        <table className="table table-borderless table-sm mb-0">
                                          <tbody>
                                            <tr>
                                              <td className="text-muted">Khách hàng:</td>
                                              <td><strong>{selectedOrder.username}</strong></td>
                                            </tr>
                                            <tr>
                                              <td className="text-muted">Mã KH:</td>
                                              <td>{selectedOrder.userId}</td>
                                            </tr>
                                            <tr>
                                              <td className="text-muted">Địa chỉ giao:</td>
                                              <td>{selectedOrder.shippingAddress}</td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Payment Info */}
                                <div className="card mb-4">
                                  <div className="card-header bg-light">
                                    <strong>
                                      <i className="bi bi-credit-card me-2"></i>
                                      Thông tin thanh toán
                                    </strong>
                                  </div>
                                  <div className="card-body">
                                    <div className="row">
                                      <div className="col-md-4">
                                        <p className="text-muted mb-1">Phương thức:</p>
                                        <p><strong>{paymentMethodLabel(selectedOrder.paymentMethod)}</strong></p>
                                      </div>
                                      <div className="col-md-4">
                                        <p className="text-muted mb-1">Mã thanh toán:</p>
                                        <p><code>{selectedOrder.paymentId || '-'}</code></p>
                                      </div>
                                      <div className="col-md-4">
                                        <p className="text-muted mb-1">Hết hạn:</p>
                                        <p>{selectedOrder.expiredAt ? formatDateTime(selectedOrder.expiredAt) : '-'}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Products List */}
                                <div className="card">
                                  <div className="card-header bg-light">
                                    <strong>
                                      <i className="bi bi-box-seam me-2"></i>
                                      Danh sách sản phẩm ({selectedOrder.details?.length || 0})
                                    </strong>
                                  </div>
                                  <div className="card-body p-0">
                                    <table className="table table-hover mb-0">
                                      <thead className="table-light">
                                        <tr>
                                          <th style={{ width: '50%' }}>Sản phẩm</th>
                                          <th className="text-center">Số lượng</th>
                                          <th className="text-end">Đơn giá</th>
                                          <th className="text-end">Thành tiền</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {selectedOrder.details?.map((item, idx) => (
                                          <tr key={idx}>
                                            <td>
                                              <div>
                                                <strong>{item.productName}</strong>
                                                <br />
                                                <small className="text-muted">ID: {item.productId}</small>
                                              </div>
                                            </td>
                                            <td className="text-center">{item.quantity}</td>
                                            <td className="text-end">{formatCurrency(item.unitPrice)}</td>
                                            <td className="text-end">
                                              <strong>{formatCurrency(item.quantity * item.unitPrice)}</strong>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                      <tfoot className="table-light">
                                        <tr>
                                          <td colSpan="3" className="text-end">
                                            <strong>Tổng cộng:</strong>
                                          </td>
                                          <td className="text-end">
                                            <strong className="text-primary fs-5">
                                              {formatCurrency(selectedOrder.totalAmount)}
                                            </strong>
                                          </td>
                                        </tr>
                                      </tfoot>
                                    </table>
                                  </div>
                                </div>
                              </div>
                              <div className="modal-footer">
                                {getNextStatusActions(selectedOrder.status).map((act) => (
                                  <button
                                    key={act.status}
                                    type="button"
                                    className={`btn btn-${act.color} text-white`}
                                    disabled={updatingStatus}
                                    onClick={() =>
                                      handleStatusChange(
                                        selectedOrder.invoiceId,
                                        act.status,
                                        act.label
                                      )
                                    }
                                  >
                                    <i className={`bi ${act.icon} me-1`}></i>
                                    {act.label}
                                  </button>
                                ))}
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  data-bs-dismiss="modal"
                                >
                                  Đóng
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
          </div>
        </section>
      </main>
    </div>
  );
}

export default ShopOrders;
