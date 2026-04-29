import 'bootstrap/dist/css/bootstrap.min.css';
import { useState  } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
 import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect,useRef } from 'react';
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
function Shop () {
    const navigate = useNavigate();
useEffect(() => {
  // Kiểm tra thông báo lưu trong localStorage khi trang load lại
  const storedMsg = localStorage.getItem('shop_alertMsg');
  const storedType = localStorage.getItem('shop_alertType');
  if (storedMsg) {
    setAlertMsg(storedMsg);
    setAlertType(storedType || 'primary');
    localStorage.removeItem('shop_alertMsg');
    localStorage.removeItem('shop_alertType');
  }
}, []);
    const [shops, setShops] = useState([]);

  // Gọi API
  useEffect(() => {
    axios.get('http://localhost:8036/shop/list', { withCredentials: true })
      .then((res) => setShops(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  const [selectedShop, setSelectedShop] = useState(null);
const handleEdit = (shop) => {
  navigate("/Shop_edit", { state: { shop } });
};
    console.log(shops);
const openModal = (lshop) => {
  setSelectedShop(lshop);
  const modal = new Modal(document.getElementById("detailModal"));
  modal.show();
};
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [shopToDelete, setShopToDelete] = useState(null);


const handleDeleteClick = (shop) => {
  setShopToDelete(shop);
  setShowDeleteModal(true);
  const modal = new Modal(document.getElementById("deleteModal"));
  modal.show();
};

const confirmDelete = async () => {
  if (!shopToDelete) return;
  try {
    const re = await axios.delete("http://localhost:8036/shop/delete", {
      params: { id: shopToDelete.shopId },
      withCredentials: true,
    });
    if(re.data.status !== 200) {
          setShowDeleteModal(false);
          setShopToDelete(null);
          localStorage.setItem('shop_alertMsg', 'Xoá cửa hàng thất bại!');
          localStorage.setItem('shop_alertType', 'danger');
          window.location.reload();
      return;
    }
    setShowDeleteModal(false);
    setShopToDelete(null);
    localStorage.setItem('shop_alertMsg', 'Xoá cửa hàng thành công!');
    localStorage.setItem('shop_alertType', 'success');
    window.location.reload();
  } catch (err) {
    setShowDeleteModal(false);
    setShopToDelete(null);
    setAlertMsg('Xoá thất bại!');
    setAlertType('danger');  }
};
const columns = [
  {
    name: "ID",
    selector: row => row.shopId,
    sortable: true
  },
  {
    name: "Tên cửa hàng",
    selector: row => row.shopName,
    sortable: true
  },
  {
    name: "Loại hình kinh doanh",
    selector: row => row.businessType,
    sortable: true
  }
  ,
  {
    name: "Địa chỉ",
    selector: row => row.shopAddress,
    sortable: true
  },
  {
    name: "Trạng thái",
    selector: row => row.shopStatus,
    sortable: true
  }
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

  const filteredShops = shops.filter(
    shop =>
      shop.shopName &&
      shop.shopName.toLowerCase().includes(filterText.toLowerCase())
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
      <h1>Quản lý cửa hàng</h1>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/">Trang chủ</a></li>
          <li className="breadcrumb-item active">Quản lý cửa hàng</li>
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
                <a className='text-light' href="/Shop_Verification">
                    <i className="bi bi-check2-circle pe-1"></i>
                   Duyệt đơn đăng ký</a>
                    </button>
                    </div>
              <div className="col-md-4">
              <input
        type="text"
        placeholder="Tìm cửa hàng..."
        className="form-control mb-3"
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
      />
      </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredShops}
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
              <p>Bạn có chắc chắn muốn xoá cửa hàng <strong>{shopToDelete?.shopName}</strong>?</p>
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
            {selectedShop && (
              <>
                <div className="modal-header">
                  <h5 className="modal-title" id="detailModalLabel">
                    {selectedShop.shopName}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p><strong>Logo cửa hàng:</strong></p>
                  <img src={selectedShop.logo} alt="Logo" style={{ width: "200px" }} />
                  <p><strong>Loại hình kinh doanh:</strong> {selectedShop.businessType}</p>
                  <p><strong>Địa chỉ:</strong> {selectedShop.shopAddress}</p>
                  <p><strong>Xác thực kinh doanh:</strong> {selectedShop.businessVerification}</p> 
                  <p><strong>Trạng thái:</strong> {selectedShop.shopStatus}</p>
                  <p><strong>Tổng sản phẩm:</strong> {selectedShop.totalProducts}</p>
                  <p><strong>Tổng người theo dõi:</strong> {selectedShop.totalFollowers}</p>
                  <p><strong>Đánh giá:</strong> {selectedShop.rating}</p>
                  <p><strong>Mô tả:</strong> {selectedShop.description}</p>
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

export default Shop;
