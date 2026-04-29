import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import '../Products/Product_detail.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useLocation } from 'react-router-dom';
import { useEffect ,useRef } from 'react';
import axios from 'axios';

function Product_edit() {
const location = useLocation();
const [image, setImage] = useState(null);
const product = location.state?.product || {};
const [productName, setProductName] = useState("");
const [category, setCategory] = useState("");
const [price, setPrice] = useState("");
const [stock, setStock] = useState("");
const [description, setDescription] = useState("");
const [status, setStatus] = useState("");

const [alertMsg, setAlertMsg] = useState('');
const [alertType, setAlertType] = useState('');

const [selectedFile, setSelectedFile] = useState(null);
const [imageUrl, setImageUrl] = useState('');

const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  
  const uploadToCloudinary = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('folder', 'products'); // ví dụ folder là "products"

    try {
      const response = await axios.post('http://localhost:8099/api/files/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
          withCredentials: true,

      });

     
      setImageUrl(response.data.url); // nếu cloudinaryService trả về `url` ảnh
    } catch (error) {
      console.error('Upload failed', error);
    }
  };
  const handleSubmit = async (e) => {
  e.preventDefault();

  const data = {
    image: imageUrl,
    productName,
    category,
    price: parseFloat(price),
    stock: parseInt(stock),
    description,
    status,
  };

  try {
    const response = await axios.post("http://localhost:8099/product/edit-product", data, {
      params: { id: product.productId },
      withCredentials: true,
    });
    console.log("Sản phẩm đã được sửa:", response.data);

    setAlertMsg('Sửa sản phẩm thành công!');
    setAlertType('success');
  } catch (err) {
    console.error("Lỗi khi sửa sản phẩm:", err);
      setAlertMsg('sửa sản phẩm thất bại!');
  setAlertType('danger');
  }
};

const toastRef = useRef(null);

useEffect(() => {
  if (alertMsg && toastRef.current) {
    const toast = window.bootstrap.Toast.getOrCreateInstance(toastRef.current);
    toast.show();
  }
}, [alertMsg]);
  useEffect(() => {
    if (product) {
      setProductName(product.productName || '');
      setDescription(product.description || '');
      setCategory(product.category || '');
      setImageUrl(product.image || '');
      setPrice(product.price || '');
      setStock(product.stock || '');
      setStatus(product.status || '');
      // set các field khác tương tự
    }
  }, [product]);
    return (
  <main id="main" className="main">
   <div
      className={`toast align-items-center text-bg-${alertType || 'primary'} border-0 position-fixed top-0 end-0 m-3`}
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
        <div className="col-lg-12">

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Sửa thông tin sản phẩm </h5>

            
                <form onSubmit={handleSubmit}>

                <div className="row mb-3">
                  <label htmlFor="inputProduct" className="col-sm-2 col-form-label">Ảnh sản phẩm</label>
                  <div className="col-sm-10">
                <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
      {imageUrl  && (
        <div className="mt-3">
          <img src={imageUrl} alt="preview" className="img-thumbnail" style={{ maxWidth: "300px" }} />
        </div>
      )}
            <a onClick={uploadToCloudinary} className='btn btn-warning mt-1'>Upload</a>
      </div>
       
    
                </div>
  
                <div className="row mb-3">
                  <label htmlFor="inputProduct" className="col-sm-2 col-form-label">Tên sản phẩm</label>
                  <div className="col-sm-10">
                    <input type="text" className="form-control" id='productName' onChange={(e) => setProductName(e.target.value)} value={productName} required/>
                  </div>
                </div>
                 <div className="row mb-3">
                  <label htmlFor="inputCategory" className="col-sm-2 col-form-label">Danh mục</label>
                  <div className="col-sm-10">
                    <input type="text" className="form-control" id='category' onChange={(e) => setCategory(e.target.value)} value={category} required/>
                  </div>
                </div>
                   <div className="row mb-3">
                  <label htmlFor="inputPrice" className="col-sm-2 col-form-label">Giá</label>
                  <div className="col-sm-10">
                    <input type="number" step="0.01" className="form-control" id='price' onChange={(e) => setPrice(e.target.value)} value={price} required/>
                  </div>
                </div>
                      <div className="row mb-3">
                  <label htmlFor="inputStock" className="col-sm-2 col-form-label">Số lượng</label>
                  <div className="col-sm-10">
                    <input type="number" className="form-control" id='stock' onChange={(e) => setStock(e.target.value)} value={stock} required/>
                  </div>
                </div>


                <div className="row mb-3">
                  <label htmlFor="inputDescription" className="col-sm-2 col-form-label">Mô tả</label>
                  <div className="col-sm-10">
                    <textarea className="form-control" style={{height: 100}} onChange={(e) => setDescription(e.target.value)} value={description} id='description'></textarea>
                  </div>
                </div>
                <fieldset className="row mb-3">
                  <legend className="col-form-label col-sm-2 pt-0">Trạng thái</legend>
                  <div className="col-sm-10">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="active"  
    onChange={(e) => setStatus(e.target.value)} />
                      <label className="form-check-label" htmlFor="gridRadios1">
                        Đang bán
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="inactive"  
    onChange={(e) => setStatus(e.target.value)}/>
                      <label className="form-check-label" htmlFor="gridRadios2">
                        Ngừng bán
                      </label>
                    </div>
                   
                  </div>
                </fieldset>
                


                <div className="row mb-3">
                  <div className="col-sm-10">
                    <button type="submit" className="btn btn-primary" >Sửa thông tin sản phẩm</button>
                  </div>
                </div>

              </form>

            </div>
          </div>
        </div>
        </main>
    );
}

export default Product_edit;
