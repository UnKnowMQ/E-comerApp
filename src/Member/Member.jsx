import React from "react";
import { useState } from "react";
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect } from "react";
import axios from "axios";
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
function Member () {
    const [users, setUsers] = useState([]);



       useEffect(() => {
    axios.get('http://localhost:8099/auth/getAllUser', { withCredentials: true })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err)); 
  }, []);
  const [filterText, setFilterText] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
const customers = users.filter(user => user.userRole === 'customer');

const openModal = (lmovie) => {
  setSelectedMovie(lmovie);
  const modal = new Modal(document.getElementById("detailModal"));
  modal.show();
};


  const columns = [
  {
    name: "ID",
    selector: row => row.userId,
    sortable: true
  },
  {
    name: "Tên đăng nhập",
    selector: row => row.username,
    sortable: true
  },
  {
    name: "Ngày sinh",
    selector: row => row.dob,
    sortable: true
  }
  ,
  {
    name: "Membership",
    selector: row => row.membership,
    sortable: true
  },
  {
    name: "Số điện thoại",
    selector: row => row.phone,
    sortable: true
  }
  ,
  {
    name: "Lựa chọn",
    cell: row => (
      <div>
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
  const filteredMovies = customers.filter(
    customers =>
      customers.username &&
      customers.username.toLowerCase().includes(filterText.toLowerCase())
  );
    return (
        <div>
           <main id="main" className="main">

    <div className="pagetitle">
      <h1>Quản lý thông tin khách hàng</h1>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/">Trang chủ</a></li>
          <li className="breadcrumb-item active">Quản lý thông tin khách hàng</li>
        </ol>
      </nav>
    </div>

    <section className="section">
      <div className="row">
        <div className="col-lg-12">

          <div className="card">
            <div className="card-body">
              <h5 className="card-title"></h5>
         
           <DataTable
        columns={columns}
        data={filteredMovies}
        pagination
        highlightOnHover
        selectableRows
      />
       <div
        className="modal fade"
        id="detailModal"
        tabIndex="-1"
        aria-labelledby="detailModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            {selectedMovie && (
              <>
                <div className="modal-header">
                  <h5 className="modal-title" id="detailModalLabel">
                    {selectedMovie.username}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
              
                  <p><strong>Tên đăng nhâp:</strong> {selectedMovie.username}</p>
                  <p><strong>Email:</strong> {selectedMovie.email} phút</p>
                  <p><strong>Số điện thoại:</strong> {selectedMovie.phone}</p> 
                  <p><strong>Giới tính:</strong> {selectedMovie.gender == 'femail'? 'nữ':'nam'}</p> 
                  <p><strong>Ngày sinh:</strong> {selectedMovie.dob}</p>
                  <p><strong>Quốc tịch:</strong> {selectedMovie.nationality}</p>
                  <p><strong>Membership:</strong> {selectedMovie.membership}</p>

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

export default Member;