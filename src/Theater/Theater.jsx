import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
function Theater () {
        const [theater, setTheater] = useState([]);
        const navigate = useNavigate();
        useEffect(() => {
  // Kiểm tra thông báo lưu trong localStorage khi trang load lại
  const storedMsg = localStorage.getItem('theater_alertMsg');
  const storedType = localStorage.getItem('theater_alertType');
  if (storedMsg) {
    setAlertMsg(storedMsg);
    setAlertType(storedType || 'primary');
    localStorage.removeItem('theater_alertMsg');
    localStorage.removeItem('theater_alertType');
  }
}, []);
const handleEdit = (movie) => {
  navigate("/Theater_edit", { state: { movie } });
};


const handleDeleteClick = (movie) => {
  setMovieToDelete(movie);
  setShowDeleteModal(true);
  const modal = new Modal(document.getElementById("deleteModal"));
  modal.show();
};
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [movieToDelete, setMovieToDelete] = useState(null);

const confirmDelete = async () => {
  if (!movieToDelete) return;
  try {
    const re = await axios.delete("http://localhost:8099/theaters/delete-Theater", {
       params: { id: movieToDelete.theaterId },
       withCredentials: true,
    });
    if(re.data.status !== 200) {
          setShowDeleteModal(false);
          setMovieToDelete(null);
          localStorage.setItem('theater_alertMsg', 'Xoá rạp thất bại, rạp đã có lịch chiếu!');
          localStorage.setItem('theater_alertType', 'danger');
          window.location.reload();
          return;
    }else{
    setShowDeleteModal(false);
    setMovieToDelete(null);
    localStorage.setItem('theater_alertMsg', 'Xoá rạp thành công!');
    localStorage.setItem('theater_alertType', 'success');
    window.location.reload();
    }
  } catch (err) {
    setShowDeleteModal(false);
    setMovieToDelete(null);
    setAlertMsg('Xoá thất bại!' + err.message);
    setAlertType('danger');  }
};


const columns = [
  {
    name: "ID",
    selector: row => row.theaterId,
    sortable: true
  },
  {
    name: "Tên rạp",
    selector: row => row.theaterName,
    sortable: true
  },
  {
    name: "Địa chỉ",
    selector: row => row.theaterLocation,
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
        
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
    sortable: false
  }
];
      useEffect(() => {
    axios.get('http://localhost:8099/theaters/getTheaters', { withCredentials: true })
      .then((res) => setTheater(res.data.data))
      .catch((err) => console.error(err));
  }, []);
  const [filterText, setFilterText] = useState("");
const filteredTheater = Array.isArray(theater)
  ? theater.filter(t =>
      t.theaterName?.toLowerCase().includes(filterText.toLowerCase())
    )
  : [];

  
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
      <h1>Quản lý rạp chiếu</h1>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/">Trang chủ</a></li>
          <li className="breadcrumb-item active">Quản lý rạp chiếu</li>
        </ol>
      </nav>
    </div>

    <section className="section">
      <div className="row">
        <div className="col-lg-12">

 <div className="row mt-2">
               <div className="col-md-8">
                 <button className="btn btn-success mb-3 ms-auto">
                <a className='text-light' href="/Theater_add">
                    <i className="bi bi-plus-circle-fill pe-1"></i>
                    Thêm rạp chiếu mới</a>
                    </button>
                    </div>
              <div className="col-md-4">
              <input
        type="text"
        placeholder="Tìm rạp..."
        className="form-control mb-3"
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
      />
      </div>
      </div>
          <div className="card">
            
            <div className="card-body">
              
                <div className="d-flex">
                    <h5 className="card-title"></h5>
                   
                </div>
             <DataTable
        columns={columns}
        data={filteredTheater}
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
              <p>Bạn có chắc chắn muốn xoá rạp <strong>{movieToDelete?.theaterName}</strong>?</p>
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
          </div>

        </div>
      </div>
    </section>

  </main>
        </div>
    );
}

export default Theater;
