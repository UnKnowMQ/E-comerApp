import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import '../assets/vendor/quill/quill.js';
import '../assets/vendor/simple-datatables/simple-datatables.js';
import '../assets/js/main.js';

const API_BASE = import.meta.env.VITE_API || 'http://localhost:8036';

function ShopProduct_add() {
  const navigate = useNavigate();

  // Form fields
  const [productName, setProductName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [warranty, setWarranty] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [description, setDescription] = useState('');

  // Specifications list [{name, value}]
  const [specifications, setSpecifications] = useState([{ name: '', value: '' }]);

  // Images: each entry has { file, previewUrl, uploadedUrl, uploading }
  const [images, setImages] = useState([]);

  // shopId resolved from API
  const [shopId, setShopId] = useState(null);
  const [shopError, setShopError] = useState('');

  // Categories fetched from API
  const [categories, setCategories] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('primary');
  const toastRef = useRef(null);

  // Show toast
  useEffect(() => {
    if (alertMsg && toastRef.current) {
      const toast = window.bootstrap.Toast.getOrCreateInstance(toastRef.current);
      toast.show();
    }
  }, [alertMsg]);

  // Resolve shopId via POST /shop/user/{userId}
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const userId = userData?.user?.data?.customerId ?? userData?.user?.data?.id;
    const jwt = localStorage.getItem('jwt');

    if (!userId) {
      setShopError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    axios
      .post(`${API_BASE}/shop/user/${userId}`, null, {
        params: { userId },
        headers: { Authorization: `Bearer ${jwt}` },
        withCredentials: true,
      })
      .then((res) => {
        const id = res.data?.data?.id ?? res.data?.data?.shopId;
        if (id) {
          setShopId(id);
        } else {
          setShopError('Không tìm thấy thông tin shop.');
        }
      })
      .catch(() => setShopError('Không thể lấy thông tin shop. Vui lòng thử lại.'));
  }, []);

  // Fetch categories
  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    axios
      .get(`${API_BASE}/category/get-category`, {
        headers: { Authorization: `Bearer ${jwt}` },
        withCredentials: true,
      })
      .then((res) => {
        const list = res.data?.data ?? res.data ?? [];
        setCategories(Array.isArray(list) ? list : []);
      })
      .catch(() => setCategories([]));
  }, []);

  // ── Image handlers ──────────────────────────────────────────────

  const handleAddImageFile = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      uploadedUrl: null,
      uploading: false,
    }));
    setImages((prev) => [...prev, ...newImages]);
    e.target.value = '';
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadImage = async (index) => {
    const img = images[index];
    if (!img.file) return;

    setImages((prev) =>
      prev.map((item, i) => (i === index ? { ...item, uploading: true } : item))
    );

    const formData = new FormData();
    formData.append('file', img.file);

    try {
      const jwt = localStorage.getItem('jwt');
      const res = await axios.post(
        `${API_BASE}/api/files/upload/image?folder=Eshop`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );
      const url = res.data?.source_url ?? res.data?.url ?? res.data?.data?.source_url ?? '';
      setImages((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, uploadedUrl: url, uploading: false } : item
        )
      );
      setAlertMsg('Upload ảnh thành công!');
      setAlertType('success');
    } catch {
      setImages((prev) =>
        prev.map((item, i) => (i === index ? { ...item, uploading: false } : item))
      );
      setAlertMsg('Upload ảnh thất bại!');
      setAlertType('danger');
    }
  };

  const handleUploadAll = async () => {
    const pending = images
      .map((img, i) => ({ img, i }))
      .filter(({ img }) => img.file && !img.uploadedUrl);
    await Promise.all(pending.map(({ i }) => handleUploadImage(i)));
  };

  // ── Specification handlers ───────────────────────────────────────

  const handleSpecChange = (index, field, value) => {
    setSpecifications((prev) =>
      prev.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec))
    );
  };

  const handleAddSpec = () =>
    setSpecifications((prev) => [...prev, { name: '', value: '' }]);

  const handleRemoveSpec = (index) =>
    setSpecifications((prev) => prev.filter((_, i) => i !== index));

  // ── Submit ───────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shopId) {
      setAlertMsg(shopError || 'Chưa xác định được shopId.');
      setAlertType('danger');
      return;
    }

    const notUploaded = images.filter((img) => img.file && !img.uploadedUrl);
    if (notUploaded.length > 0) {
      setAlertMsg('Vui lòng upload tất cả ảnh trước khi lưu.');
      setAlertType('warning');
      return;
    }

    const imageUrls = images.map((img) => img.uploadedUrl).filter(Boolean);

    const payload = {
      productName,
      categoryId: parseInt(categoryId, 10),
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      warranty,
      status,
      description,
      imageUrl: imageUrls,
      shopId,
      specifications: specifications.filter((s) => s.name.trim() !== ''),
    };

    const jwt = localStorage.getItem('jwt');
    setSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE}/shop/product`, payload, {
        headers: { Authorization: `Bearer ${jwt}` },
        withCredentials: true,
      });

      if (res.data?.status === 200 || res.status === 200 || res.status === 201) {
        localStorage.setItem('shopproduct_alertMsg', 'Thêm sản phẩm thành công!');
        localStorage.setItem('shopproduct_alertType', 'success');
        navigate('/ShopProducts');
      } else {
        setAlertMsg(res.data?.message || 'Thêm sản phẩm thất bại!');
        setAlertType('danger');
      }
    } catch (err) {
      setAlertMsg(err.response?.data?.message || 'Thêm sản phẩm thất bại!');
      setAlertType('danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <main id="main" className="main">
        {/* Toast */}
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
          <h1>Thêm sản phẩm mới</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/">Trang chủ</a></li>
              <li className="breadcrumb-item"><a href="/ShopProducts">Sản phẩm của shop</a></li>
              <li className="breadcrumb-item active">Thêm sản phẩm</li>
            </ol>
          </nav>
        </div>

        <section className="section">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Thông tin sản phẩm</h5>

                  {shopError && (
                    <div className="alert alert-danger">{shopError}</div>
                  )}

                  <form onSubmit={handleSubmit}>

                    {/* Tên sản phẩm */}
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">Tên sản phẩm <span className="text-danger">*</span></label>
                      <div className="col-sm-10">
                        <input
                          type="text"
                          className="form-control"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Danh mục */}
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">Danh mục <span className="text-danger">*</span></label>
                      <div className="col-sm-10">
                        {categories.length > 0 ? (
                          <select
                            className="form-select"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                          >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map((cat) => (
                              <option key={cat.category_id} value={cat.category_id}>
                                {cat.category_name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Nhập ID danh mục"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                          />
                        )}
                      </div>
                    </div>

                    {/* Giá & Số lượng */}
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">Giá (đ) <span className="text-danger">*</span></label>
                      <div className="col-sm-4">
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          required
                        />
                      </div>
                      <label className="col-sm-2 col-form-label">Số lượng <span className="text-danger">*</span></label>
                      <div className="col-sm-4">
                        <input
                          type="number"
                          className="form-control"
                          min="0"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Bảo hành */}
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">Bảo hành</label>
                      <div className="col-sm-10">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="VD: 12 tháng"
                          value={warranty}
                          onChange={(e) => setWarranty(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Trạng thái */}
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">Trạng thái</label>
                      <div className="col-sm-10">
                        <select
                          className="form-select"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="INACTIVE">INACTIVE</option>
                        </select>
                      </div>
                    </div>

                    {/* Mô tả */}
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">Mô tả</label>
                      <div className="col-sm-10">
                        <textarea
                          className="form-control"
                          rows={4}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Ảnh sản phẩm */}
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">Ảnh sản phẩm</label>
                      <div className="col-sm-10">
                        <input
                          type="file"
                          className="form-control mb-2"
                          accept="image/*"
                          multiple
                          onChange={handleAddImageFile}
                        />

                        {images.length > 0 && (
                          <>
                            <button
                              type="button"
                              className="btn btn-warning btn-sm mb-3"
                              onClick={handleUploadAll}
                              disabled={images.every((img) => img.uploadedUrl)}
                            >
                              <i className="bi bi-cloud-upload me-1"></i>
                              Upload tất cả ảnh
                            </button>

                            <div className="d-flex flex-wrap gap-3">
                              {images.map((img, index) => (
                                <div
                                  key={index}
                                  className="border rounded p-2 text-center"
                                  style={{ width: '150px' }}
                                >
                                  <img
                                    src={img.previewUrl}
                                    alt={`preview-${index}`}
                                    style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '6px' }}
                                  />
                                  <div className="mt-1">
                                    {img.uploadedUrl ? (
                                      <span className="badge bg-success">
                                        <i className="bi bi-check-circle me-1"></i>Đã upload
                                      </span>
                                    ) : img.uploading ? (
                                      <span className="badge bg-secondary">
                                        <span className="spinner-border spinner-border-sm me-1"></span>Đang tải...
                                      </span>
                                    ) : (
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-warning"
                                        onClick={() => handleUploadImage(index)}
                                      >
                                        <i className="bi bi-cloud-upload"></i> Upload
                                      </button>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger mt-1"
                                    onClick={() => handleRemoveImage(index)}
                                  >
                                    <i className="bi bi-trash3"></i> Xoá
                                  </button>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Thông số kỹ thuật */}
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">Thông số kỹ thuật</label>
                      <div className="col-sm-10">
                        {specifications.map((spec, index) => (
                          <div key={index} className="d-flex gap-2 mb-2 align-items-center">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Tên (VD: RAM)"
                              value={spec.name}
                              onChange={(e) => handleSpecChange(index, 'name', e.target.value)}
                            />
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Giá trị (VD: 8GB)"
                              value={spec.value}
                              onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                            />
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleRemoveSpec(index)}
                              disabled={specifications.length === 1}
                            >
                              <i className="bi bi-dash-circle"></i>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={handleAddSpec}
                        >
                          <i className="bi bi-plus-circle me-1"></i>Thêm thông số
                        </button>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="row mb-3">
                      <div className="col-sm-10 offset-sm-2 d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-success"
                          disabled={submitting || !shopId}
                        >
                          {submitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1"></span>
                              Đang lưu...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-save me-1"></i>Lưu sản phẩm
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => navigate('/ShopProducts')}
                        >
                          <i className="bi bi-arrow-left me-1"></i>Quay lại
                        </button>
                      </div>
                    </div>

                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ShopProduct_add;
