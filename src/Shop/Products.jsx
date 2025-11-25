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

import '../Shop/Products.css';
import '../assets/vendor/apexcharts/apexcharts.min.js';
import '../assets/vendor/echarts/echarts.min.js';
import '../assets/vendor/chart.js/chart.umd.js';
import '../assets/vendor/php-email-form/validate.js';
import '../assets/vendor/bootstrap/js/bootstrap.bundle.min.js';
import '../assets/vendor/tinymce/tinymce.min.js';
import '../assets/vendor/quill/quill.js'
import '../assets/vendor/simple-datatables/simple-datatables.js'
import '../assets/js/main.js';

function Products () {

      const [products, setProducts] = useState([]);
      const [filter, setFilter] = useState([""]);
      const [page, setPage] = useState(1); // trang hiện tại
      const [brand, setBrand] = useState("");
      const [brands, setBrands] = useState([]);
      const [totalPages, setTotalPages] = useState(1);
      const [category, setCategory] = useState("");
      const [categories, setCategories] = useState([]);
      const [sort, setSort] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("jwt");


    axios.get(`${import.meta.env.VITE_APP_API}/brand/get-brand`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        const items = res.data?.data || [];
        setBrands(items);
      })
      .catch((err) => {
        console.error("Error brands:", err);
      });
      
    axios.get(`${import.meta.env.VITE_APP_API}/category/get-category`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        const items = res.data?.data || [];
        setCategories(items);
      })
      .catch((err) => {
        console.error("Error category:", err);
      });


    
    axios.get(`${import.meta.env.VITE_APP_API}/product/get-product`, {
      params: { pageNo: page, pageSize: 10 }, // query param
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        const items = res.data?.data?.items || [];
        setProducts(items);
        setTotalPages(res.data?.data?.totalPages || 1);
      })
      .catch((err) => {
        console.error("Error products:", err);
      });
  }, [page]);
  const navigate = useNavigate();
  const handleToProductDetail = (id) => {
    
    navigate("/Product_detail", { state: { id }});

  };



    return (
        <div>
			<div className="hero">
				<div className="container">
					<div className="row justify-content-between">
						<div className="col-lg-2">
							<div className="intro-excerpt">
								<h1>Shop</h1>
							</div>
						</div>
						<div className="col-lg-10">
							      <div className="row mb-4">
    <div className="col-md-4 mt-2" >
      <input
        type="text"
        style={{ height: '80%' }}
        className="form-control"
        placeholder="Tìm kiếm sản phẩm..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
    </div>
     <div className="col-md-3 mt-2">
      <select
        className="form-select"
        placeholder="Thương hiệu..."
        value={brand}
        onChange={e => setBrand(e.target.value)}
      >
        <option value="">Thương hiệu...</option>
        {brands.map((b) => (
          <option key={b.brand_id} value={b.brand_name}>{b.brand_name}</option>
        ))}
        
      </select>


    </div>
     <div className="col-md-3 mt-2">
      <select
        className="form-select"
        placeholder="Loại sản phẩm..."
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        <option value="">Loại...</option>
        {categories.map((b) => (
          <option key={b.category_id} value={b.category_name}>{b.category_name}</option>
        ))}
        
      </select>


    </div>
      <div className="col-md-2">
      <button style={{height: '80%'}} className="btn btn-secondary w-100" onClick={() => {
        // reset về trang 1
        setPage(1); 
        const tfilter = "productName:" + filter 
        // gọi API với filter, brand, category
        const params = { pageNo: page, pageSize: 10 ,sortBy:sort , brandName: brand, categoryName: category, search: tfilter};
        axios.get(`${import.meta.env.VITE_APP_API}/product/get-products-multiple-searching-col`, {
          params,
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            const items = res.data?.data?.items || [];
            console.log("Filtered items:", params.search);
            setProducts(items);
            
            setTotalPages(res.data?.data?.totalPages || 1);
          })
          .catch((err) => {
            console.error("Error products:", err);
          });
      }}> <p>Lọc</p></button>

    </div>
  </div>
						</div>
					</div>
          <div className='row'>
            <p>Sắp xếp theo</p>
            <div className='col-md-3'>
              <select className='form-select' onChange={e => setSort(e.target.value)} >
                <option value="">Mặc định</option>
                <option value="price:asc">Giá: Thấp đến cao</option>
                <option value="price:desc">Giá: Cao đến thấp</option>
              </select>
          </div>
				</div>
        
      </div>
			</div>

		

		<div className="untree_co-section product-section before-footer-section">
		    <div className="container">
		     <div id="product-list" className="row">
      {products.map((product) => (
        <div key={product.id} className="col-12 col-md-4 col-lg-3 mb-5">
          <a className="product-item" onClick={() => handleToProductDetail(product.id)}>
            <img
              src={product.imageUrl || "#"}
              alt={product.productName}
              className="img-fluid product-thumbnail"
            />
            <h3 className="product-title">{product.productName}</h3>
            <strong className="product-price text-danger">
             {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </strong>
            <span className="icon-cross text-white fs-2">
              <i className="bi bi-plus-circle-fill"></i>
            </span>
          </a>
        </div>
      ))}
    </div>
		    </div>
		</div>
     <nav className="mt-3 d-flex justify-content-center" aria-label="Page navigation">
        <ul className="pagination">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPage(page - 1)}>Trước</button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => setPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}

          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPage(page + 1)}>Sau</button>
          </li>
        </ul>
      </nav>

   
        
        </div>
    );
}

export default Products;
