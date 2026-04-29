import 'bootstrap/dist/css/bootstrap.min.css';
import { useState  } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
 import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect } from 'react';
import axios from 'axios';
import DataTable from "react-data-table-component";
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
import '../assets/vendor/quill/quill.js'
import '../assets/vendor/simple-datatables/simple-datatables.js'
import '../assets/js/main.js';
import {useRef} from 'react';

const API_BASE = import.meta.env.VITE_API || 'http://localhost:8036';

function Products () {
     const navigate = useNavigate();

    const [products, setProducts] = useState([]);
useEffect(() => {
  // Kiểm tra thông báo lưu trong localStorage khi trang load lại
  const storedMsg = localStorage.getItem('product_alertMsg');
  const storedType = localStorage.getItem('product_alertType');
  if (storedMsg) {
    setAlertMsg(storedMsg);
    setAlertType(storedType || 'primary');
    localStorage.removeItem('product_alertMsg');
    localStorage.removeItem('product_alertType');
  }
}, []);
  // Gọi API
  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    axios.get(`${API_BASE}/product/get-product`, {
      params: { pageNo: 0, pageSize: 1000 },
      headers: { Authorization: `Bearer ${jwt}` },
      withCredentials: true,
    })
      .then((res) => setProducts(res.data?.data?.items ?? []))
      .catch((err) => console.error(err));
  }, []); 

  const [selectedProduct, setSelectedProduct] = useState(null);
const handleEdit = (product) => {
  navigate("/Products_edit", { state: { product } });
};

const openModal = (lproduct) => {
  setSelectedProduct(lproduct);
  const modal = new Modal(document.getElementById("detailModal"));
  modal.show();
};
const handleDeleteClick = (product) => {
  setProductToDelete(product);
  setShowDeleteModal(true);
  const modal = new Modal(document.getElementById("deleteModal"));
  modal.show();
};
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [productToDelete, setProductToDelete] = useState(null);


  const confirmDelete = async () => {
  if (!productToDelete) return;
  try {
    const re = await axios.delete("http://localhost:8099/product/delete-product", {
       params: { id: productToDelete.productId } ,
      withCredentials: true,
    });
    if(re.data.status !== 200) {
    setShowDeleteModal(false);
    setProductToDelete(null);
    localStorage.setItem('product_alertMsg', 'Xoá sản phẩm thất bại!');
    localStorage.setItem('product_alertType', 'danger');
    window.location.reload();
    return;
    }
    setShowDeleteModal(false);
    setProductToDelete(null);
    localStorage.setItem('product_alertMsg', 'Xoá sản phẩm thành công!');
    localStorage.setItem('product_alertType', 'success');
    window.location.reload();
  } catch (err) {
    setShowDeleteModal(false);
    setProductToDelete(null);
    setAlertMsg('Xoá thất bại!');
    setAlertType('danger');  }
};
const statusBadge = (status) => {
  const map = { ACTIVE: 'success', INACTIVE: 'secondary', BANNED: 'danger' };
  return <span className={`badge bg-${map[status] ?? 'warning'}`}>{status}</span>;
};

const columns = [
  {
    name: "ID",
    selector: row => row.id,
    sortable: true,
    width: '70px'
  },
  {
    name: "Tên sản phẩm",
    selector: row => row.productName,
    sortable: true
  },
  {
    name: "Danh mục",
    selector: row => row.category_name,
    sortable: true
  },
  {
    name: "Giá",
    selector: row => row.price,
    sortable: true,
    cell: row => row.price?.toLocaleString('vi-VN') + ' đ'
  },
  {
    name: "Số lượng",
    selector: row => row.quantity,
    sortable: true,
    width: '100px'
  },
  {
    name: "Trạng thái",
    selector: row => row.status,
    sortable: true,
    cell: row => statusBadge(row.status),
    width: '120px'
  },
  ,
  {
    name: "Lựa chọn",
    cell: row => (
      <div>
        <button
          className="btn btn-sm btn-warning text-light me-1"
          onClick={() => handleEdit(row)}
        >
          <i className="bi bi-pen-fill"></i>
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleDeleteClick(row)}
        >
          <i className="bi bi-trash3-fill"></i>

        </button>
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => openModal(row)}
        >
<i class="bi bi-info-circle-fill"></i>

        </button>
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    sortable: false
  }
];
  const [filterText, setFilterText] = useState("");

  const filteredProducts = products.filter(
    product =>
      product.productName &&
      product.productName.toLowerCase().includes(filterText.toLowerCase())
  );

    const [alertMsg, setAlertMsg] = useState('');
    const [alertType, setAlertType] = useState('primary');
    const toastRef = useRef(null);

    useEffect(() => {
      if (alertMsg && toastRef.current) {
        const toast = window.bootstrap.Toast.getOrCreateInstance(toastRef.current);
        toast.show();
      }
    }, [alertMsg]);

    return (
        <div>
           <main id="main" className="main">
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
    <div className="toast-body">
      {alertMsg}
    </div>
    <button
      type="button"
      className="btn-close btn-close-white me-2 m-auto"
      data-bs-dismiss="toast"
      aria-label="Close"
    ></button>
  </div>
    </div>

    <div className="pagetitle">
      <h1>Quản lý sản phẩm</h1>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/">Trang chủ</a></li>
          <li className="breadcrumb-item active">Quản lý sản phẩm</li>
        </ol>
      </nav>
    </div>

    <section className="section">
      <div className="row">
        <div className="col-lg-12">

          <div className="card">
            <div className="card-body">
                <div className="d-flex">
                    <h5 className="card-title"></h5>
                 
                </div>
             <div className="container">
              <div className="row">
               <div className="col-md-8">
                 <button className="btn btn-success mb-3 ms-auto">
                <a className='text-light' href="/ProductApproval">
                    <i className="bi bi-clipboard2-check pe-1"></i>
                    Duyệt sản phẩm</a>
                    </button>
                    </div>
              <div className="col-md-4">
              <input
        type="text"
        placeholder="Tìm sản phẩm..."
        className="form-control mb-3"
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
      />
      </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredProducts}
        pagination
        highlightOnHover
        selectableRows
      />
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
                <h5 className="modal-title" id="deleteModalLabel">Xác nhận xoá</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Bạn có chắc chắn muốn xoá sản phẩm <strong>{productToDelete?.productName}</strong>?</p>
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
    </div>
              <div
        className="modal fade"
        id="detailModal"
        tabIndex="-1"
        aria-labelledby="detailModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
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
                        <img key={i} src={url} alt={`Ảnh ${i+1}`} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                      ))}
                    </div>
                  )}
                  <table className="table table-borderless table-sm">
                    <tbody>
                      <tr><th>Danh mục</th><td>{selectedProduct.category_name}</td></tr>
                      <tr><th>Giá</th><td>{selectedProduct.price?.toLocaleString('vi-VN')} đ</td></tr>
                      <tr><th>Số lượng</th><td>{selectedProduct.quantity}</td></tr>
                      <tr><th>Bảo hành</th><td>{selectedProduct.warranty}</td></tr>
                      <tr><th>Trạng thái</th><td>{statusBadge(selectedProduct.status)}</td></tr>
                      <tr><th>Mô tả</th><td>{selectedProduct.description}</td></tr>
                      <tr><th>Ngày tạo</th><td>{selectedProduct.created_at ? new Date(selectedProduct.created_at).toLocaleString('vi-VN') : '—'}</td></tr>
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
    </section>

  </main>
        </div>
    );
}

export default Products;
