import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
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


import '../assets/vendor/apexcharts/apexcharts.min.js';
import '../assets/vendor/echarts/echarts.min.js';
import '../assets/vendor/chart.js/chart.umd.js';
import '../assets/vendor/php-email-form/validate.js';
import '../assets/vendor/bootstrap/js/bootstrap.bundle.min.js';
import '../assets/vendor/tinymce/tinymce.min.js';
import '../assets/vendor/quill/quill.js'
import '../assets/vendor/simple-datatables/simple-datatables.js'
import '../assets/js/main.js';
function TicketCanelRequest () {
    // const [nowShowing, setNowShowing] = useState(true);
    // const navigate = useNavigate();

    // const [showingNow, setShowingNow] = useState([]);
    // const [commingSoon, setCommingSoon] = useState([]);
    // const handleMovieDetails = (id) => {
    //     navigate("/Movie_detail", { state: { id }});
    // }
    // const fetchMovies = async () => {
    //     try {
    //         const res = await axios.get("http://localhost:8099/auth/getAll-movies");
    //         const s1 = res.data.filter(movie => movie.showing === "Đang chiếu");
    //         const c1 = res.data.filter(movie => movie.showing === "Sắp chiếu");
    //         console.log(res.data);
    //         setShowingNow(s1);
    //         setCommingSoon(c1);
    //     } catch (error) {
    //         console.error("Lỗi khi lấy danh sách phim", error);
    //     }
    // }
    // useEffect(() => {
    //     fetchMovies();
    // },[]);

      useEffect(() => {
    // Lấy phần tử bảng sau khi render
    const tableElement = document.querySelector(".datatable");

    if (tableElement) {
      new DataTable(tableElement); // khởi tạo bảng
    }
  }, []);
    return (
        <div>
           <main id="main" className="main">

    <div className="pagetitle">
      <h1>Duyệt yêu cầu huỷ vé</h1>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/">Home</a></li>
          <li className="breadcrumb-item active">Duyệt yêu cầu huỷ vé</li>
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
              <table className='table datatable'>
                <thead>
                  <tr>
                    <th>    
                      Tên phim
                    </th>
                    <th >Thể loại</th>
                    <th>Thời lượng</th>
                    <th data-type="date" data-format="YYYY/DD/MM">Ngày phát hành</th>
                    <th>lựa chọn</th>

                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Unity Pugh</td>
                    <td>9958</td>
                    <td>Curicó</td>
                    <td>2005/02/11</td>
                    <td>
                        <a className="btn btn-sm btn-success me-1"><i class="bi bi-check-circle"></i>

</a>
                        <a className="btn btn-sm btn-danger me-1"><i class="bi bi-x-circle"></i>

</a>
<a className="btn btn-sm btn-secondary"><i class="bi bi-info-circle-fill"></i>
</a>

                    </td>
                  </tr>
                  <tr>
                    <td>Theodore Duran</td>
                    <td>8971</td>
                    <td>Dhanbad</td>
                    <td>1999/04/07</td>
                    <td>97%</td>
                  </tr>
                  <tr>
                    <td>Kylie Bishop</td>
                    <td>3147</td>
                    <td>Norman</td>
                    <td>2005/09/08</td>
                    <td>63%</td>
                  </tr>
                  <tr>
                    <td>Willow Gilliam</td>
                    <td>3497</td>
                    <td>Amqui</td>
                    <td>2009/29/11</td>
                    <td>30%</td>
                  </tr>
                  <tr>
                    <td>Blossom Dickerson</td>
                    <td>5018</td>
                    <td>Kempten</td>
                    <td>2006/11/09</td>
                    <td>17%</td>
                  </tr>
                  <tr>
                    <td>Elliott Snyder</td>
                    <td>3925</td>
                    <td>Enines</td>
                    <td>2006/03/08</td>
                    <td>57%</td>
                  </tr>
                  <tr>
                    <td>Castor Pugh</td>
                    <td>9488</td>
                    <td>Neath</td>
                    <td>2014/23/12</td>
                    <td>93%</td>
                  </tr>
                  <tr>
                    <td>Pearl Carlson</td>
                    <td>6231</td>
                    <td>Cobourg</td>
                    <td>2014/31/08</td>
                    <td>100%</td>
                  </tr>
                  <tr>
                    <td>Deirdre Bridges</td>
                    <td>1579</td>
                    <td>Eberswalde-Finow</td>
                    <td>2014/26/08</td>
                    <td>44%</td>
                  </tr>
                  <tr>
                    <td>Daniel Baldwin</td>
                    <td>6095</td>
                    <td>Moircy</td>
                    <td>2000/11/01</td>
                    <td>33%</td>
                  </tr>
                  <tr>
                    <td>Phelan Kane</td>
                    <td>9519</td>
                    <td>Germersheim</td>
                    <td>1999/16/04</td>
                    <td>77%</td>
                  </tr>
                  <tr>
                    <td>Quentin Salas</td>
                    <td>1339</td>
                    <td>Los Andes</td>
                    <td>2011/26/01</td>
                    <td>49%</td>
                  </tr>
                  <tr>
                    <td>Armand Suarez</td>
                    <td>6583</td>
                    <td>Funtua</td>
                    <td>1999/06/11</td>
                    <td>9%</td>
                  </tr>
                 
                </tbody>
              </table>
              

            </div>
          </div>

        </div>
      </div>
    </section>

  </main>
        </div>
    );
}

export default TicketCanelRequest;
