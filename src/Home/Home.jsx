import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Home.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const API_BASE = import.meta.env.VITE_API || 'http://localhost:8036';

function Homepage() {
  const orderStatusBadge = (status) => {
    const map = {
      pending: { color: 'warning', text: 'Chờ thanh toán' },
      wfad: { color: 'info', text: 'Chờ giao hàng' },
      delivery: { color: 'primary', text: 'Đang vận chuyển' },
      done: { color: 'success', text: 'Hoàn thành' },
      cancelled: { color: 'danger', text: 'Đã huỷ' },
      rr: { color: 'secondary', text: 'Trả hàng' },
      refunded: { color: 'dark', text: 'Đã hoàn tiền' },
    };
    const info = map[status?.toLowerCase()] || { color: 'dark', text: status };
    return <span className={`badge bg-${info.color}`}>{info.text}</span>;
  };

  const formatOrderDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  const columns = [
  {
    name: "Mã đơn",
    selector: row => row.invoiceId,
    sortable: true,
    width: "85px"
  },
  {
    name: "Ngày đặt",
    selector: row => row.invoiceDate,
    cell: row => formatOrderDate(row.invoiceDate),
    sortable: true,
    width: "110px"
  },
  {
    name: "Khách hàng",
    selector: row => row.username,
    sortable: true
  },
  {
    name: "Tổng tiền",
    selector: row => row.totalAmount,
    cell: row => `${row.totalAmount?.toLocaleString('vi-VN')} đ`,
    sortable: true,
    width: "130px"
  },
  {
    name: "Trạng thái",
    cell: row => orderStatusBadge(row.status),
    width: "130px"
  }
];
  const columns2 = [
  {
    name: "#",
    selector: (row, index) => index + 1,
    sortable: false,
    width: "55px"
  },
  {
    name: "Sản phẩm",
    selector: row => row.productName,
    sortable: true
  },
  {
    name: "SL bán",
    selector: row => row.totalQuantity,
    sortable: true,
    width: "90px"
  },
  {
    name: "Doanh thu",
    selector: row => row.totalRevenue,
    cell: row => `${row.totalRevenue?.toLocaleString('vi-VN')} đ`,
    sortable: true,
    width: "140px"
  }
];
const [amount, setAmount] = useState(0);
const [revenue, setRevenue] = useState(0);
const [amountBooking, setAmountBooking] = useState(0);

const [revenueByMonth, setRevenueByMonth] = useState([]);
const [shopId, setShopId] = useState(null);
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

const [cardFilter, setCardFilter] = useState('');
const [lineFilter, setLineFilter] = useState('');
const navigate = useNavigate();

// Resolve shopId từ user data
const resolveShopId = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem('user'));
    const userId = userData?.user?.data?.customerId ?? userData?.user?.data?.id;
    const jwt = localStorage.getItem('jwt');

    if (!userId) {
      console.error('User not found');
      return;
    }

    const res = await axios.post(`${API_BASE}/shop/user/${userId}`, null, {
      params: { userId },
      headers: { Authorization: `Bearer ${jwt}` },
      withCredentials: true,
    });

    const fetchedId = res.data?.data?.id ?? res.data?.data?.shopId;
    if (fetchedId) {
      setShopId(fetchedId);
      return fetchedId;
    }
  } catch (err) {
    console.error('Error resolving shop ID:', err);
  }
  return null;
};

// Fetch doanh thu theo tháng
const fetchRevenueByMonth = async (year, id) => {
  try {
    const jwt = localStorage.getItem('jwt');
    const shopIdToUse = id || shopId;

    if (!shopIdToUse) {
      console.error('Shop ID not available');
      return;
    }

    const res = await axios.get(`${API_BASE}/api/revenue/month`, {
      params: {
        year,
        shopId: shopIdToUse,
      },
      headers: { Authorization: `Bearer ${jwt}` },
      withCredentials: true,
    });

    if (Array.isArray(res.data)) {
      setRevenueByMonth(res.data);
      renderMonthlyRevenueChart(res.data, year);
    }
  } catch (err) {
    console.error('Error fetching revenue by month:', err);
  }
};

// Fetch doanh thu theo năm (tổng hoặc lọc theo tháng)
const fetchRevenueByYear = async (id, filterMonth = null) => {
  try {
    const jwt = localStorage.getItem('jwt');
    const shopIdToUse = id || shopId;

    if (!shopIdToUse) {
      console.error('Shop ID not available');
      return;
    }

    const res = await axios.get(`${API_BASE}/api/revenue/year`, {
      params: {
        shopId: shopIdToUse,
      },
      headers: { Authorization: `Bearer ${jwt}` },
      withCredentials: true,
    });

    if (Array.isArray(res.data) && res.data.length > 0) {
      if (filterMonth !== null) {
        // Lọc theo tháng cụ thể
        const monthData = res.data.find((item) => item.month === filterMonth);
        setRevenue(monthData?.totalRevenue || 0);
        setAmountBooking(monthData?.totalCustomers || 0);
      } else {
        // Tổng cộng tất cả các tháng
        const totalRevenue = res.data.reduce((sum, item) => sum + (item.totalRevenue || 0), 0);
        const totalCustomers = res.data.reduce((sum, item) => sum + (item.totalCustomers || 0), 0);
        setRevenue(totalRevenue);
        setAmountBooking(totalCustomers);
      }
    } else {
      setRevenue(0);
      setAmountBooking(0);
    }
  } catch (err) {
    console.error('Error fetching revenue by year:', err);
  }
};

// Vẽ biểu đồ doanh thu theo tháng
const renderMonthlyRevenueChart = (data, year) => {
  // Tạo mảng 12 tháng với doanh thu = 0
  const monthlyData = Array(12).fill(0);

  // Gán giá trị từ API
  data.forEach((item) => {
    if (item.month >= 1 && item.month <= 12) {
      monthlyData[item.month - 1] = item.totalRevenue;
    }
  });

  const months = [
    'T1', 'T2', 'T3', 'T4', 'T5', 'T6',
    'T7', 'T8', 'T9', 'T10', 'T11', 'T12'
  ];

  if (window.ApexCharts) {
    const chartElement = document.querySelector('#monthlyRevenueChart');
    if (chartElement) {
      // Xoá chart cũ nếu có
      chartElement.innerHTML = '';
      
      new ApexCharts(chartElement, {
        series: [
          {
            name: 'Doanh thu',
            data: monthlyData,
          },
        ],
        chart: {
          height: 350,
          type: 'bar',
          toolbar: { show: true },
        },
        colors: ['#2eca6a'],
        dataLabels: { enabled: false },
        xaxis: {
          categories: months,
        },
        yaxis: {
          title: {
            text: 'Doanh thu (đ)',
          },
        },
        tooltip: {
          y: {
            formatter: (value) => `${value?.toLocaleString('vi-VN')} đ`,
          },
        },
      }).render();
    }
  }
};

useEffect(() => {
  axios.get("http://localhost:8099/movies/getTopMovies", { withCredentials: true })
    .then(res => setMovieList(res.data.data))
    .catch(err => console.error(err));

  // Resolve shopId và fetch doanh thu
  resolveShopId().then((id) => {
    if (id) {
      fetchRevenueByYear(id);
      fetchRevenueByMonth(selectedYear, id);
      fetchRecentOrders(id);
      fetchTopProducts(id);
      fetchCategoryPie(id);
    }
  });
}, []);
  const handleSignOut = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    axios
      .post(
        `${API_BASE}/auth/logout`,
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      )
      .then(() => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        navigate('/Login');
      })
      .catch((err) => {
        console.error('Logout error:', err);
        localStorage.removeItem('jwt');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        navigate('/Login');
      });
  };
          const [bookingList, setBookingList] = useState([]);
          const [recentOrders, setRecentOrders] = useState([]);
          const [movieList, setMovieList] = useState([]);
          const [topProducts, setTopProducts] = useState([]);

  const fetchCategoryPie = async (id) => {
    const jwt = localStorage.getItem('jwt');
    const shopIdToUse = id || shopId;
    if (!shopIdToUse) return;
    try {
      const res = await axios.get(`${API_BASE}/api/revenue/category-pie`, {
        params: { shopId: shopIdToUse },
        headers: { Authorization: `Bearer ${jwt}` },
        withCredentials: true,
      });
      if (Array.isArray(res.data) && window.echarts) {
        const chartData = res.data.map(item => ({
          value: item.totalRevenue,
          name: item.categoryName,
        }));
        const el = document.querySelector('#trafficChart');
        if (el) {
          const chart = echarts.init(el);
          chart.setOption({
            tooltip: { trigger: 'item', formatter: '{b}: {c} đ ({d}%)' },
            legend: { top: '5%', left: 'center' },
            series: [{
              name: 'Doanh thu',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              label: { show: false, position: 'center' },
              emphasis: { label: { show: true, fontSize: '18', fontWeight: 'bold' } },
              labelLine: { show: false },
              data: chartData,
            }],
          });
        }
      }
    } catch (err) {
      console.error('Error fetching category pie:', err);
    }
  };

  const fetchTopProducts = async (id) => {
    const jwt = localStorage.getItem('jwt');
    const shopIdToUse = id || shopId;
    if (!shopIdToUse) return;
    try {
      const res = await axios.get(`${API_BASE}/api/revenue/top-products`, {
        params: { shopId: shopIdToUse, limit: 5 },
        headers: { Authorization: `Bearer ${jwt}` },
        withCredentials: true,
      });
      if (Array.isArray(res.data)) {
        setTopProducts(res.data);
      }
    } catch (err) {
      console.error('Error fetching top products:', err);
    }
  };

  const fetchRecentOrders = async (id) => {
    const jwt = localStorage.getItem('jwt');
    const shopIdToUse = id || shopId;
    if (!shopIdToUse) return;
    try {
      const res = await axios.get(`${API_BASE}/invoice/shop/${shopIdToUse}`, {
        params: { pageNo: 1, pageSize: 10, sortBy: 'invoice_date' },
        headers: { Authorization: `Bearer ${jwt}` },
        withCredentials: true,
      });
      if (res.data?.content) {
        setRecentOrders(res.data.content);
      } else if (Array.isArray(res.data)) {
        setRecentOrders(res.data);
      }
    } catch (err) {
      console.error('Error fetching recent orders:', err);
    }
  };
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

        const budgetEl = document.querySelector("#budgetChart");
        if(window.echarts && budgetEl) {
            var budgetChart = echarts.init(budgetEl);
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

  // Resolve shopId và fetch doanh thu theo tháng
  resolveShopId().then((id) => {
    if (id) {
      fetchRevenueByMonth(selectedYear, id);
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
  setCardFilter('year');
  if (shopId) fetchRevenueByYear(shopId, null);
};

const handleMonth = () => {
  setCardFilter('month');
  const currentMonth = new Date().getMonth() + 1;
  if (shopId) fetchRevenueByYear(shopId, currentMonth);
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

useEffect(() => {
  if (shopId && selectedYear) {
    fetchRevenueByMonth(selectedYear, shopId);
    fetchRevenueByYear(shopId);
  }
}, [shopId, selectedYear]);

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
                  <h5 className="card-title">Doanh thu <span>| {cardFilter === 'month' ? `Tháng ${new Date().getMonth() + 1}` : `Năm ${new Date().getFullYear()}`}</span></h5>

                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center fw-bold">
                      Đ
                    </div>
                    <div className="ps-3">
                      <h6>{revenue?.toLocaleString('vi-VN')} đ</h6>
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
                  <h5 className="card-title">Số Khách hàng <span>| {cardFilter === 'month' ? `Tháng ${new Date().getMonth() + 1}` : `Năm ${new Date().getFullYear()}`}</span></h5>

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


              

              </div>
            </div>

            
            <div className="col-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Doanh thu theo tháng</h5>
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setSelectedYear(new Date().getFullYear() - 1);
                        if (shopId) fetchRevenueByMonth(new Date().getFullYear() - 1, shopId);
                      }}
                    >
                      {new Date().getFullYear() - 1}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary active"
                      onClick={() => {
                        setSelectedYear(new Date().getFullYear());
                        if (shopId) fetchRevenueByMonth(new Date().getFullYear(), shopId);
                      }}
                    >
                      {new Date().getFullYear()}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setSelectedYear(new Date().getFullYear() + 1);
                        if (shopId) fetchRevenueByMonth(new Date().getFullYear() + 1, shopId);
                      }}
                    >
                      {new Date().getFullYear() + 1}
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div id="monthlyRevenueChart"></div>
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
                  <h5 className="card-title">Đơn hàng mới nhất <span>| 10 đơn gần đây</span></h5>

                   <DataTable
          columns={columns}
          data={recentOrders}
          pagination
          highlightOnHover
          striped
          noDataComponent="Không có đơn hàng nào."
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
                  <h5 className="card-title">Top sản phẩm doanh thu <span>| Top 5</span></h5>

                   <DataTable
          columns={columns2}
          data={topProducts}
          highlightOnHover
          striped
          noDataComponent="Không có dữ liệu."
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
                {[
                  { time: '5 phút', color: 'text-success', icon: 'bi-bag-check-fill', msg: <>Đơn hàng mới <strong>#{ recentOrders[0]?.invoiceId || '---' }</strong> từ <strong>{ recentOrders[0]?.username || 'khách hàng' }</strong></> },
                  { time: '12 phút', color: 'text-warning', icon: 'bi-clock-history', msg: <>Đơn <strong>#{ recentOrders[1]?.invoiceId || '---' }</strong> đang chờ xác nhận</> },
                  { time: '30 phút', color: 'text-primary', icon: 'bi-truck', msg: <>Đơn <strong>#{ recentOrders[2]?.invoiceId || '---' }</strong> đã chuyển sang vận chuyển</> },
                  { time: '1 giờ', color: 'text-success', icon: 'bi-check-circle-fill', msg: <>Đơn <strong>#{ recentOrders[3]?.invoiceId || '---' }</strong> hoàn thành</> },
                  { time: '2 giờ', color: 'text-danger', icon: 'bi-x-circle-fill', msg: <>Đơn <strong>#{ recentOrders[4]?.invoiceId || '---' }</strong> đã bị huỷ</> },
                  { time: '3 giờ', color: 'text-info', icon: 'bi-box-seam', msg: <>Top sản phẩm: <strong>{ topProducts[0]?.productName || '---' }</strong> — { topProducts[0]?.totalQuantity || 0 } sản phẩm bán ra</> },
                  { time: 'Hôm nay', color: 'text-secondary', icon: 'bi-graph-up-arrow', msg: <>Doanh thu hôm nay: <strong>{ revenue?.toLocaleString('vi-VN') } đ</strong></> },
                ].map((item, idx) => (
                  <div key={idx} className="activity-item d-flex">
                    <div className="activite-label">{item.time}</div>
                    <i className={`bi ${item.icon} activity-badge ${item.color} align-self-start`}></i>
                    <div className="activity-content">{item.msg}</div>
                  </div>
                ))}
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
              <h5 className="card-title">Xu hướng đặt hàng <span>| Tất cả</span></h5>

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
