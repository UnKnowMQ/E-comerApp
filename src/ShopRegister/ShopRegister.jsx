import React, { useState, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from './ShopRegister.module.css';

/* ─── upload file → return cloud URL ─────────────────────── */
const uploadImage = async (file) => {
  const fd = new FormData();
  fd.append('file', file);
  const res = await axios.post(
    'http://localhost:8036/api/files/upload/image?folder=Shop',
    fd,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return res.data.secure_url;
};

const STEPS = [
  { id: 1, label: 'Thông tin Shop' },
  { id: 2, label: 'Thông tin định danh' },
  { id: 3, label: 'Thông tin thuế' },
  { id: 4, label: 'Hoàn tất' },
];

/* ─── helpers ─────────────────────────────────────────────── */
function FormRow({ label, required, hint, children }) {
  return (
    <div className="row mb-4 align-items-start">
      <label className="col-sm-3 col-form-label text-sm-end fw-semibold pe-4">
        {required && <span className="text-danger me-1">*</span>}
        {label}
      </label>
      <div className="col-sm-7">
        {children}
        {hint && <div className="form-text">{hint}</div>}
      </div>
    </div>
  );
}

function UploadBox({ preview, inputRef, onChange, label }) {
  return (
    <div>
      <div
        className={styles.uploadBox}
        onClick={() => inputRef.current.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current.click()}
      >
        {preview ? (
          <img src={preview} alt={label} className={styles.uploadPreview} />
        ) : (
          <div className="text-center text-muted">
            <i className="bi bi-camera fs-2 d-block mb-1" />
            <small>{label}</small>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="d-none"
        onChange={(e) => onChange(e.target.files[0])}
      />
    </div>
  );
}

/* ─── main component ──────────────────────────────────────── */
function ShopRegister() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    // step 1
    shopName: '',
    address: '',
    email: localStorage.getItem('email') || '',
    phone: localStorage.getItem('phone') || '',
    // step 2
    cccd: '',
    cccdFront: null,
    cccdFrontPreview: null,
    cccdBack: null,
    cccdBackPreview: null,
    // step 3
    businessType: 'individual',
    businessLicense: null,
    businessLicensePreview: null,
  });

  const cccdFrontRef = useRef();
  const cccdBackRef = useRef();
  const licenseRef = useRef();

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleFile = (fileField, previewField, file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, [fileField]: file, [previewField]: url }));
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  // per-step validation
  const step1Valid =
    form.shopName.trim() &&
    form.address.trim() &&
    form.email.trim() &&
    form.phone.trim();

  const step2Valid =
    form.cccd.length === 12 && form.cccdFront && form.cccdBack;

  const step3Valid =
    form.businessType === 'individual' ||
    (form.businessType === 'company' && form.businessLicense);

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const [frontUrl, backUrl] = await Promise.all([
        uploadImage(form.cccdFront),
        uploadImage(form.cccdBack),
      ]);
      await axios.post(
        'http://localhost:8036/api/citizen-identifications',
        {
          userId: parseInt(localStorage.getItem('customerId')),
          ciFront: frontUrl,
          ciBack: backUrl,
          ciNumber: form.cccd,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }
      );
      next();
    } catch (err) {
      alert('Lỗi xác thực định danh: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let businessVerification = '';
      if (form.businessLicense) {
        businessVerification = await uploadImage(form.businessLicense);
      }
      await axios.post(
        'http://localhost:8036/shop/',
        {
          shopName: form.shopName,
          userId: parseInt(localStorage.getItem('customerId')),
          rating: 0,
          description: '',
          businessType: form.businessType,
          businessVerification,
          shopAddress: form.address,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` } }
      );
      setSubmitted(true);
      next();
    } catch (err) {
      alert('Lỗi tạo shop: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* ── Step indicator ── */}
      <div className={styles.stepBarWrapper}>
        <div className={styles.stepBar}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div
                className={[
                  styles.stepItem,
                  step === s.id ? styles.active : '',
                  step > s.id ? styles.done : '',
                ].join(' ')}
              >
                <div className={styles.stepCircle}>
                  {step > s.id ? (
                    <i className="bi bi-check2" />
                  ) : (
                    s.id
                  )}
                </div>
                <span className={styles.stepLabel}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={[
                    styles.stepLine,
                    step > s.id ? styles.doneLine : '',
                  ].join(' ')}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Card ── */}
      <div className={styles.card}>

        {/* ════ STEP 1: Thông tin Shop ════ */}
        {step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); next(); }}>
            <FormRow label="Tên Shop" required hint={`${form.shopName.length}/30 ký tự`}>
              <input
                className="form-control"
                maxLength={30}
                required
                value={form.shopName}
                onChange={(e) => update('shopName', e.target.value)}
                placeholder="Nhập tên shop"
              />
            </FormRow>

            <FormRow label="Địa chỉ lấy hàng" required hint="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố">
              <input
                className="form-control"
                required
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder="VD: 16 Hẻm 194/51/46, Xã Yên Thường, Gia Lâm, Hà Nội"
              />
            </FormRow>

            <FormRow label="Email" required>
              <input
                className="form-control"
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="email@example.com"
              />
            </FormRow>

            <FormRow label="Số điện thoại" required>
              <input
                className="form-control"
                required
                value={form.phone}
                onChange={(e) => update('phone', e.target.value.replace(/\D/g, ''))}
                maxLength={11}
                placeholder="0xxxxxxxxx"
              />
            </FormRow>

            <div className={styles.footer}>
              <button
                type="submit"
                className="btn btn-danger px-5"
                disabled={!step1Valid}
              >
                Tiếp theo
              </button>
            </div>
          </form>
        )}

        {/* ════ STEP 2: Thông tin định danh ════ */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit}>
            <FormRow label="Số CCCD" required hint="Nhập đúng 12 chữ số trên Căn cước công dân">
              <input
                className="form-control"
                required
                value={form.cccd}
                maxLength={12}
                onChange={(e) => update('cccd', e.target.value.replace(/\D/g, ''))}
                placeholder="Nhập 12 số"
              />
            </FormRow>

            <FormRow label="Ảnh mặt trước CCCD" required>
              <UploadBox
                preview={form.cccdFrontPreview}
                inputRef={cccdFrontRef}
                onChange={(f) => handleFile('cccdFront', 'cccdFrontPreview', f)}
                label="Mặt trước"
              />
            </FormRow>

            <FormRow label="Ảnh mặt sau CCCD" required>
              <UploadBox
                preview={form.cccdBackPreview}
                inputRef={cccdBackRef}
                onChange={(f) => handleFile('cccdBack', 'cccdBackPreview', f)}
                label="Mặt sau"
              />
            </FormRow>

            <div className={styles.footer}>
              <button
                type="button"
                className="btn btn-outline-secondary px-4 me-3"
                onClick={prev}
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="btn btn-danger px-5"
                disabled={!step2Valid || loading}
              >
                {loading && <span className="spinner-border spinner-border-sm me-2" role="status" />}
                Tiếp theo
              </button>
            </div>
          </form>
        )}

        {/* ════ STEP 3: Thông tin thuế ════ */}
        {step === 3 && (
          <form onSubmit={handleFinalSubmit}>
            <FormRow label="Loại kinh doanh" required>
              <div className="d-flex gap-4 flex-wrap">
                <label
                  className={[
                    styles.radioCard,
                    form.businessType === 'individual' ? styles.radioSelected : '',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    className="d-none"
                    value="individual"
                    checked={form.businessType === 'individual'}
                    onChange={() => update('businessType', 'individual')}
                  />
                  <i className="bi bi-person-fill fs-2 d-block mb-2" />
                  Kinh doanh cá nhân
                </label>

                <label
                  className={[
                    styles.radioCard,
                    form.businessType === 'company' ? styles.radioSelected : '',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    className="d-none"
                    value="company"
                    checked={form.businessType === 'company'}
                    onChange={() => update('businessType', 'company')}
                  />
                  <i className="bi bi-building fs-2 d-block mb-2" />
                  Công ty / Doanh nghiệp
                </label>
              </div>
            </FormRow>

            <FormRow
              label="Giấy đăng ký kinh doanh"
              required={form.businessType === 'company'}
              hint={
                form.businessType === 'individual'
                  ? 'Không bắt buộc đối với cá nhân'
                  : 'Tải lên ảnh hoặc scan giấy ĐKKD'
              }
            >
              <UploadBox
                preview={form.businessLicensePreview}
                inputRef={licenseRef}
                onChange={(f) =>
                  handleFile('businessLicense', 'businessLicensePreview', f)
                }
                label="Chọn ảnh"
              />
            </FormRow>

            <div className={styles.footer}>
              <button
                type="button"
                className="btn btn-outline-secondary px-4 me-3"
                onClick={prev}
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="btn btn-danger px-5"
                disabled={!step3Valid || loading}
              >
                {loading && <span className="spinner-border spinner-border-sm me-2" role="status" />}
                Tiếp theo
              </button>
            </div>
          </form>
        )}

        {/* ════ STEP 4: Hoàn tất ════ */}
        {step === 4 && (
          <div className="text-center py-5">
            <i
              className="bi bi-check-circle-fill"
              style={{ fontSize: '5rem', color: '#ee4d2d' }}
            />
            <h4 className="mt-4 fw-bold">Đăng ký thành công!</h4>
            <p className="text-muted mt-2">
              Thông tin của bạn đang được xem xét. Chúng tôi sẽ thông báo qua email{' '}
              <strong>{form.email}</strong>.
            </p>
            <div className={styles.summaryBox}>
              <div className={styles.summaryRow}>
                <span>Tên shop</span>
                <strong>{form.shopName}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Địa chỉ lấy hàng</span>
                <strong>{form.address}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Loại kinh doanh</span>
                <strong>
                  {form.businessType === 'individual'
                    ? 'Cá nhân'
                    : 'Công ty / Doanh nghiệp'}
                </strong>
              </div>
            </div>
            <a href="/" className="btn btn-danger mt-4 px-5">
              Về trang chủ
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopRegister;
