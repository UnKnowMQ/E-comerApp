import React, { use } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Home.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../assets/vendor/bootstrap/css/bootstrap.min.css';
import '../assets/vendor/bootstrap-icons/bootstrap-icons.css';
import '../assets/vendor/boxicons/css/boxicons.min.css';
import '../assets/vendor/quill/quill.snow.css';
import '../assets/vendor/quill/quill.bubble.css';
import '../assets/vendor/remixicon/remixicon.css';
import '../assets/vendor/simple-datatables/style.css';
import '../assets/css/style.css';
import DataTable from 'react-data-table-component';
import Dropdown from 'react-bootstrap/Dropdown';

import '../assets/vendor/apexcharts/apexcharts.min.js';
import '../assets/vendor/echarts/echarts.min.js';
import '../assets/vendor/chart.js/chart.umd.js';
import '../assets/vendor/php-email-form/validate.js';
import '../assets/vendor/bootstrap/js/bootstrap.bundle.min.js';
import '../assets/vendor/tinymce/tinymce.min.js';
import '../assets/vendor/quill/quill.js'
import '../assets/vendor/simple-datatables/simple-datatables.js'
import '../assets/js/main.js';
import axios from 'axios';
import { useEffect } from 'react';


function Homepage() {
  const columns = [
  {
    name: "#",
    selector: (row, index) => index + 1,
    sortable: false,
    width: "60px"
  },
  {
    name: "Khách hàng",
    selector: row => row.username,
    sortable: true
  },
  {
    name: "Phim",
    selector: row => row.movieName,
    sortable: true
  },
  {
    name: "Giá vé",
    selector: row => `${row.totalPrice}đ`,
    sortable: true
  },
  {
    name: "Status",
    cell: row => {
      const statusClass = row.ticketStatus === "done"
        ? "bg-success"
        : row.ticketStatus === "pending"
        ? "bg-warning"
        : "bg-danger";
      return <span className={`badge ${statusClass}`}>{row.ticketStatus}</span>;
    }
  }
];
  const columns2 = [
  {
    name: "#",
    selector: (row, index) => index + 1,
    sortable: false,
    width: "60px"
  },
  {
    name: "Tên phim",
    selector: row => row.movieName,
    sortable: true
  },
  {
    name: "Giá Vé",
    selector: row => `${row.price}đ`,
    sortable: true
  },
  {
    name: "Lượng đặt",
    selector: row => row.sold,
    sortable: true
  },
  {
    name: "Doanh thu",
     selector: row => `${row.revenueByMovie}đ`,
      sortable: true
    
  }
];
const [amount, setAmount] = useState(0);
const [revenue, setRevenue] = useState(0);
const [amountBooking, setAmountBooking] = useState(0);

const [cardFilter, setCardFilter] = useState('');
const [lineFilter, setLineFilter] = useState('');
const navigate = useNavigate();
useEffect(() => {
  axios.get("http://localhost:8099/movies/getTopMovies", { withCredentials: true })
    .then(res => setMovieList(res.data.data))
    .catch(err => console.error(err));
}, []);
  const handleSignOut = () => {


  axios.get('http://localhost:8099/auth/logout', { withCredentials: true })
    .then(() => {
      navigate('/Login') // chuyển hướng về trang đăng nhập
    }
    )
    .catch((err) => console.error(err));
};
          const [bookingList, setBookingList] = useState([]);
          const [movieList, setMovieList] = useState([]);
         useEffect(() => {

          setCardFilter('year');
          setLineFilter('year');
  axios.get("http://localhost:8099/booking/responses", { withCredentials: true })
    .then(res => setBookingList(res.data))
    .catch(err => console.error(err));




          const bookingStats = async (cardFilter) => {
            try {
              console.log(cardFilter);
const response = await axios.get('http://localhost:8099/booking/get-data-for-line-chart', {
  params: {
    filter: cardFilter
  },
  withCredentials: true,
});              const data = response.data;
              setRevenue(data.data.revenue);
              setAmountBooking(data.data.a_cus);
            } catch (error) {
              console.error('Error fetching booking stats:', error);
            }
          }
        bookingStats(cardFilter);

    lineChart(lineFilter);

        if(window.echarts) {
            var budgetChart = echarts.init(document.querySelector("#budgetChart"));
            budgetChart.setOption({
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: 'Budget',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: 1048, name: 'Chi tiêu phân bổ' },
                            { value: 735, name: 'Sử dụng' },
                            { value: 580, name: 'Chi tiêu dự kiến' }
                        ]
                    }
                ]
            });
        }

          axios.get('http://localhost:8099/booking/bookings-by-category')
    .then(res => {
      const chartData = res.data.map(item => ({
        value: item.value,
        name: item.name,
      }));

      if (window.echarts) {
        const trafficChart = echarts.init(document.querySelector("#trafficChart"));
        trafficChart.setOption({
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '5%',
            left: 'center'
          },
          series: [{
            name: 'Thể loại',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: chartData
          }]
        });
      }
    });
      
    }, []);

    const bookingStats = async (filterValue) => {
  try {
    console.log("Filter:", filterValue);
    const response = await axios.get('http://localhost:8099/booking/get-data-for-line-chart', {
      params: {
        filter: filterValue
      },
      withCredentials: true,
    });
    const data = response.data;
    setRevenue(data.data.revenue);
    setAmountBooking(data.data.a_cus);
  } catch (error) {
    console.error('Error fetching booking stats:', error);
  }
};
const lineChart = async () => {
    if(lineFilter === 'year')
    {  
    axios.get('http://localhost:8099/booking/stats',{
       params: { year : new Date().getFullYear()},
        withCredentials: true,}
     ).then(response => {
      const data = response.data;

      const bookings = data.bookings;
      const revenues = data.revenues;

      const categories = Array.from({ length: 12 }, (_, i) => 
          new Date(2025, i, 1).toISOString()
      );

      if (window.ApexCharts) {
          new ApexCharts(document.querySelector("#reportsChart"), {
              series: [{
                  name: 'Lượng đăt vé',
                  data: bookings,
              }, {
                  name: 'Doanh thu',
                  data: revenues
              }],
              chart: {
                  height: 350,
                  type: 'area',
                  toolbar: { show: false },
              },
              markers: { size: 4 },
              colors: ['#FF6B1F', '#2eca6a'],
              fill: {
                  type: "gradient",
                  gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.3,
                      opacityTo: 0.4,
                      stops: [0, 90, 100]
                  }
              },
              dataLabels: { enabled: false },
              stroke: { curve: 'smooth', width: 2 },
              xaxis: {
                  type: 'datetime',
                  categories: categories
              },
              tooltip: {
                  x: { format: 'MM/yyyy' }
              }
          }).render();
      }
  });
    }
    else if (lineFilter === 'month'){
       axios.get('http://localhost:8099/booking/stats-monthly',{
       params: { month : new Date().getMonth()},
        withCredentials: true,}
     ).then(response => {
      const data = response.data;

      const bookings = data.bookings;
      const revenues = data.revenues;

      const categories = Array.from({ length: 31 }, (_, i) => 
          new Date(2025, new Date().getMonth(), i).toISOString()
      );

      if (window.ApexCharts) {
          new ApexCharts(document.querySelector("#reportsChart"), {
              series: [{
                  name: 'Lượng đăt vé',
                  data: bookings,
              }, {
                  name: 'Doanh thu',
                  data: revenues
              }],
              chart: {
                  height: 350,
                  type: 'area',
                  toolbar: { show: false },
              },
              markers: { size: 4 },
              colors: ['#FF6B1F', '#2eca6a'],
              fill: {
                  type: "gradient",
                  gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.3,
                      opacityTo: 0.4,
                      stops: [0, 90, 100]
                  }
              },
              dataLabels: { enabled: false },
              stroke: { curve: 'smooth', width: 2 },
              xaxis: {
                  type: 'datetime',
                  categories: categories
              },
              tooltip: {
                  x: { format: 'MM/yyyy' }
              }
          }).render();
      }
  });
    }
  }
const handleYear = () => {
  setCardFilter('year');        // Cập nhật UI (nếu cần)
  bookingStats('year');         // Gọi trực tiếp với giá trị đúng
};

const handleMonth = () => {
  setCardFilter('month');
  bookingStats('month');
};
const handleLineChartMonth = () =>{
  setLineFilter('year');
};

const handleLineChartYear = () =>{
    setLineFilter('month');

};
useEffect(() => {
  if (lineFilter) {
    console.log(lineFilter);
    lineChart();
  }
}, [lineFilter]);

    return (
        <div>
          <main id="main" className="main">

    <div className="pagetitle">
      <h1>Tổng quan</h1>
      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/">Trang chủ</a></li>
          <li className="breadcrumb-item active">Tổng quan</li>
        </ol>
      </nav>
    </div>

    <section className="section dashboard">
      <div className="row">

       
        <div className="col-lg-8">
          <div className="row">
            <div className="col-xxl-6 col-md-6">
              <div className="card info-card revenue-card">

              <Dropdown className="filter">
      <Dropdown.Toggle variant="light" id="dropdown-basic">
        <i className="bi bi-three-dots"></i>
      </Dropdown.Toggle>

      <Dropdown.Menu align="end">
        <Dropdown.Item href="#">Hôm nay</Dropdown.Item>
        <Dropdown.Item href="#" onClick={handleMonth}>Tháng này</Dropdown.Item>
        <Dropdown.Item href="#" onClick={handleYear}>Năm nay</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>


                <div className="card-body">
                  <h5 className="card-title">Doanh thu <span>| {cardFilter ? 'năm' : ''}</span></h5>

                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center fw-bold">
                      Đ
                    </div>
                    <div className="ps-3">
                      <h6>{revenue}</h6>
                      <span className="text-success small pt-1 fw-bold">8%</span> <span className="text-muted small pt-2 ps-1">tăng</span>

                    </div>
                  </div>
                </div>

              </div>
            </div>

           
            <div className="col-xxl-6 col-xl-12">

              <div className="card info-card customers-card">

                <div className="filter">
                  <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                    <li className="dropdown-header text-start">
                      <h6>Filter</h6>
                    </li>

                    <li><a className="dropdown-item" href="#">Today</a></li>
                    <li><a className="dropdown-item" href="#">This Month</a></li>
                    <li><a className="dropdown-item" href="#">This Year</a></li>
                  </ul>
                </div>

                <div className="card-body">
                  <h5 className="card-title">Số Khách hàng <span>| {cardFilter ? 'năm' : ''}</span></h5>

                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-people"></i>
                    </div>
                    <div className="ps-3">
                      <h6>{amountBooking}</h6>
                      <span className="text-danger small pt-1 fw-bold">12%</span> <span className="text-muted small pt-2 ps-1">giảm</span>

                    </div>
                  </div>

                </div>
              </div>

            </div>

          
            <div className="col-12">
              <div className="card">

                   <Dropdown className="filter">
      <Dropdown.Toggle variant="light" id="dropdown-basic">
        <i className="bi bi-three-dots"></i>
      </Dropdown.Toggle>

      <Dropdown.Menu align="end">
        <Dropdown.Item href="#">Hôm nay</Dropdown.Item>
        <Dropdown.Item href="#" onClick={handleLineChartMonth}>Tháng này</Dropdown.Item>
        <Dropdown.Item href="#" onClick={handleLineChartYear}>Năm nay</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>


                <div className="card-body">
                  <h5 className="card-title">Thống kê <span>{lineFilter !=='year' ? 'năm nay' : 'tháng này'}</span></h5>

                 
                  <div id="reportsChart"></div>

                </div>

              </div>
            </div>

        
            <div className="col-12">
              <div className="card recent-sales overflow-auto">

                <div className="filter">
                  <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                    <li className="dropdown-header text-start">
                      <h6>Filter</h6>
                    </li>

                    <li><a className="dropdown-item" href="#">Today</a></li>
                    <li><a className="dropdown-item" href="#">This Month</a></li>
                    <li><a className="dropdown-item" href="#">This Year</a></li>
                  </ul>
                </div>

                <div className="card-body">
                  <h5 className="card-title">Các vé vừa đặt <span>| Tất cả</span></h5>

                   <DataTable
          columns={columns}
          data={bookingList}
          pagination
          highlightOnHover
          striped
        />


                </div>

              </div>
            </div>

           
            <div className="col-12">
              <div className="card top-selling overflow-auto">

                <div className="filter">
                  <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                    <li className="dropdown-header text-start">
                      <h6>Filter</h6>
                    </li>

                    <li><a className="dropdown-item" href="#">Today</a></li>
                    <li><a className="dropdown-item" href="#">This Month</a></li>
                    <li><a className="dropdown-item" href="#">This Year</a></li>
                  </ul>
                </div>

                <div className="card-body pb-0">
                  <h5 className="card-title">Top doanh thu phim <span>| Tất cả</span></h5>

                 
                   <DataTable
          columns={columns2}
          data={movieList}
          pagination
          highlightOnHover
          striped
        />

                </div>

              </div>
            </div>

          </div>
        </div>

       
        <div className="col-lg-4">

         
          <div className="card">
            <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>

                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div>

            <div className="card-body">
              <h5 className="card-title">Hoạt động gần đây <span>| Hôm nay</span></h5>

              <div className="activity">

                <div className="activity-item d-flex">
                  <div className="activite-label">32 min</div>
                  <i className='bi bi-circle-fill activity-badge text-success align-self-start'></i>
                  <div className="activity-content">
                    Người dùng aa đặt vé <a href="#" className="fw-bold text-dark">Con nít quỷ</a> VIP
                  </div>
                </div>

                <div className="activity-item d-flex">
                  <div className="activite-label">56 min</div>
                  <i className='bi bi-circle-fill activity-badge text-danger align-self-start'></i>
                  <div className="activity-content">
                    Người quảm lý đã thêm phim <a href="#" className="fw-bold text-dark">Nhà gia tiên</a>
                  </div>
                </div>

                <div className="activity-item d-flex">
                  <div className="activite-label">2 hrs</div>
                  <i className='bi bi-circle-fill activity-badge text-primary align-self-start'></i>
                  <div className="activity-content">
                    Người quản lý đã cập nhật thông tin phim <a href="#" className="fw-bold text-dark">Con nít quỷ</a>
                  </div>
                </div>

                <div className="activity-item d-flex">
                  <div className="activite-label">1 day</div>
                  <i className='bi bi-circle-fill activity-badge text-info align-self-start'></i>
                  <div className="activity-content">
                    Người dùng quan đã đặt vé<a href="#" className="fw-bold text-dark"> Đàn cá gỗ </a> Vé thường
                  </div>
                </div>

                <div className="activity-item d-flex">
                  <div className="activite-label">2 days</div>
                  <i className='bi bi-circle-fill activity-badge text-warning align-self-start'></i>
                  <div className="activity-content">
                    Người dùng bb đã đặt vé <a href="#" className="fw-bold text-dark"> Nhà gia tiên</a> Vé thường
                  </div>
                </div>

              

              </div>

            </div>
          </div>

          
          <div className="card">
            <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>

                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div>

            <div className="card-body pb-0">
              <h5 className="card-title">Báo cáo ngân sách <span>| This Month</span></h5>

              <div id="budgetChart" style={{minHeight: 400}} className="echart"></div>

            </div>
          </div>

          
          <div className="card">
            <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>

                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div>

            <div className="card-body pb-0">
              <h5 className="card-title">Xu hướng phim <span>| Tất cả</span></h5>

              <div id="trafficChart" style={{minHeight:400}} className="echart"></div>

            

            </div>
          </div>

          
          <div className="card">
            <div className="filter">
              <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <li className="dropdown-header text-start">
                  <h6>Filter</h6>
                </li>

                <li><a className="dropdown-item" href="#">Today</a></li>
                <li><a className="dropdown-item" href="#">This Month</a></li>
                <li><a className="dropdown-item" href="#">This Year</a></li>
              </ul>
            </div>

        
          </div>

        </div>

      </div>
    </section>

  </main>
        </div>
    );

}

export default Homepage;
