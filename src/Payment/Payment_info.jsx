import React, { useState } from "react";
import styles from '../Payment/Payment_info.module.css';
import pic from '../assets/vite-vite-logo.png';
import { FaPlus, FaMinus, FaUser } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import vnpay_logo from '../assets/vnpay_logo.png';
import momo_logo from '../assets/MoMo_Logo.png';

function PaymentInfo() {
  const [comboCounts, setComboCounts] = useState({
    beta: 0,
    sweet: 0,
  });

  const handleIncrement = (key) => {
    setComboCounts({ ...comboCounts, [key]: comboCounts[key] + 1 });
  };

  const handleDecrement = (key) => {
    if (comboCounts[key] > 0) {
      setComboCounts({ ...comboCounts, [key]: comboCounts[key] - 1 });
    }
  };

  return (
    <div className={styles.container}>
      {/* Thông tin thanh toán */}
      <div className={styles.box}>
        <h5 className={styles.title}>
          <FaUser className={styles.icon} /> THÔNG TIN THANH TOÁN
        </h5>
        <div className={styles.infoRow}>
          <div><strong>Họ Tên:</strong> tuan duog</div>
          <div><strong>Số điện thoại:</strong> 0774303567</div>
          <div><strong>Email:</strong> tuancutks@gmail.com</div>
        </div>
        <hr />
        <h6 className={styles.sectionLabel}>GHẾ THƯỜNG</h6>
        <p className={styles.priceRow}>1 x 45.000 = <strong>45.000 VNĐ</strong></p>
      </div>

      {/* Combo ưu đãi */}
      <div className={styles.box}>
        <h5 className={styles.title}>
          <img
            src="https://img.icons8.com/ios/24/000000/popcorn.png"
            alt="combo"
            className={styles.icon}
          />
          COMBO ƯU ĐÃI
        </h5>

        <table className={styles.comboTable}>
          <thead>
            <tr>
              <th>Tên Combo</th>
              <th>Mô tả</th>
              <th>Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {/* Combo 1 */}
            <tr>
              <td className={styles.comboInfo}>
                <img src={pic} alt="Beta Combo" className={styles.comboImg} />
                <span>Beta Combo 69oz</span>
              </td>
              <td>
                <span className={styles.discount}>TIẾT KIỆM 28K!!!</span><br />
                Gồm: 1 Bắp (69oz) + 1 Nước có gaz (22oz)
              </td>
              <td>
                <div className={styles.quantityControl}>
                  <button onClick={() => handleDecrement("beta")}> <FaMinus /> </button>
                  <span>{comboCounts.beta}</span>
                  <button onClick={() => handleIncrement("beta")}> <FaPlus /> </button>
                </div>
              </td>
            </tr>

            {/* Combo 2 */}
            <tr>
              <td className={styles.comboInfo}>
                <img src={pic} alt="Sweet Combo" className={styles.comboImg} />
                <span>Sweet Combo 69oz</span>
              </td>
              <td>
                <span className={styles.discount}>TIẾT KIỆM 46K!!!</span><br />
                Gồm: 1 Bắp (69oz) + 2 Nước có gaz (22oz)
              </td>
              <td>
                <div className={styles.quantityControl}>
                  <button onClick={() => handleDecrement("sweet")}> <FaMinus /> </button>
                  <span>{comboCounts.sweet}</span>
                  <button onClick={() => handleIncrement("sweet")}> <FaPlus /> </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* mã giảm giá */}
       <div className={styles.box}>
        <h5 className={styles.title}>
          <FaUser className={styles.icon} /> MÃ GIẢM GIÁ
        </h5>
        <div className={styles.voucherInputRow}>
          <input type="text" placeholder="Mã Voucher" className={styles.voucherInput} />
          <input type="text" placeholder="Mã PIN" className={styles.voucherInput} />
          <button className={styles.voucherButton}>ÁP DỤNG</button>
        </div>

        <h6 className={styles.sectionLabel}>VOUCHER CỦA BẠN</h6>

        <table className={styles.voucherTable}>
          <thead>
            <tr>
              <th>Mã voucher</th>
              <th>Nội dung voucher</th>
              <th>Ngày hết hạn</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ABC123</td>
              <td>Giảm 50K cho hóa đơn trên 200K</td>
              <td>31/12/2025</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.box}>
            <p>Tổng tiền: </p>
            <p>Số tiền được giảm: </p>
            <p>Số tiền cần thanh toán: </p>
      </div>
        {/* phương thức thanh toán */}
        <div className={styles.box}>
        <h5 className={styles.title}>
            <FaUser className={styles.icon} /> PHƯƠNG THỨC THANH TOÁN
        </h5>

        <div className={styles.paymentMethods}>
            <label className={styles.paymentOption}>
            <input type="radio" name="payment" />
            <img src={momo_logo} alt="Momo" />
            <span>Thanh toán qua MoMo</span>
            </label>

            <label className={styles.paymentOption}>
            <input type="radio" name="payment" />
            <img src={vnpay_logo} alt="VNPay" />
            <span>Thanh toán qua VNPay</span>
            </label>
        </div>
        </div>

        <div className="d-flex justify-content-center">
            <button className="btn btn-primary w-75 mt-2">TIẾP TỤC</button>
        </div>
    </div>
  );
}

export default PaymentInfo;
