import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
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
import '../assets/vendor/quill/quill.js'
import '../assets/vendor/simple-datatables/simple-datatables.js'
import '../assets/js/main.js';

function Wallet () {
    const [balance, setBalance] = useState(2500.00);
    const [activeTab, setActiveTab] = useState('balance');
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('credit-card');
    const [transactions, setTransactions] = useState([
        { id: 1, type: 'deposit', amount: 500, date: '2026-04-15', status: 'success', method: 'Credit Card' },
        { id: 2, type: 'purchase', amount: -150.50, date: '2026-04-14', status: 'success', method: 'Wallet Balance' },
        { id: 3, type: 'deposit', amount: 1000, date: '2026-04-10', status: 'success', method: 'Bank Transfer' },
        { id: 4, type: 'withdrawal', amount: -200, date: '2026-04-08', status: 'success', method: 'Bank Account' },
        { id: 5, type: 'purchase', amount: -249.99, date: '2026-04-05', status: 'success', method: 'Wallet Balance' },
    ]);

    const handleDeposit = () => {
        if (depositAmount && parseFloat(depositAmount) > 0) {
            const newBalance = balance + parseFloat(depositAmount);
            setBalance(newBalance);
            setTransactions([...transactions, {
                id: transactions.length + 1,
                type: 'deposit',
                amount: parseFloat(depositAmount),
                date: new Date().toISOString().split('T')[0],
                status: 'success',
                method: paymentMethod === 'credit-card' ? 'Credit Card' : paymentMethod === 'bank' ? 'Bank Transfer' : 'PayPal'
            }]);
            alert('Nạp tiền thành công!');
            setDepositAmount('');
        }
    };

    const handleWithdraw = () => {
        if (withdrawAmount && parseFloat(withdrawAmount) > 0 && parseFloat(withdrawAmount) <= balance) {
            const newBalance = balance - parseFloat(withdrawAmount);
            setBalance(newBalance);
            setTransactions([...transactions, {
                id: transactions.length + 1,
                type: 'withdrawal',
                amount: -parseFloat(withdrawAmount),
                date: new Date().toISOString().split('T')[0],
                status: 'pending',
                method: 'Bank Account'
            }]);
            alert('Yêu cầu rút tiền đã được gửi!');
            setWithdrawAmount('');
        } else if (parseFloat(withdrawAmount) > balance) {
            alert('Số tiền rút vượt quá số dư ví!');
        }
    };

    return (
        <div className="container-fluid" style={{backgroundColor: '#f5f5f5', minHeight: '100vh', paddingTop: '80px', paddingBottom: '50px'}}>
            <div className="container">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-md-12">
                        <h1 className="mb-1">
                            <i className="bi bi-wallet2 me-2"></i>Ví Của Tôi
                        </h1>
                        <p className="text-muted">Quản lý số dư ví và các giao dịch của bạn</p>
                    </div>
                </div>

                {/* Balance Card */}
                <div className="row mb-4">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm" style={{borderRadius: '10px', background: 'linear gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                            <div className="card-body text-white">
                                <h6 className="card-title mb-3 opacity-75">Số Dư Hiện Tại</h6>
                                <h2 className="mb-0 text-black">
                                    <span className="me-2">₫</span>{balance.toLocaleString('vi-VN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <div className="card border-0 shadow-sm h-100" style={{borderRadius: '10px'}}>
                                    <div className="card-body text-center">
                                        <i className="bi bi-arrow-down-circle text-success" style={{fontSize: '2rem', marginBottom: '10px'}}></i>
                                        <h6 className="card-title">Tổng Nạp</h6>
                                        <p className="text-success fw-bold">+2,500₫</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="card border-0 shadow-sm h-100" style={{borderRadius: '10px'}}>
                                    <div className="card-body text-center">
                                        <i className="bi bi-arrow-up-circle text-danger" style={{fontSize: '2rem', marginBottom: '10px'}}></i>
                                        <h6 className="card-title">Tổng Chi</h6>
                                        <p className="text-danger fw-bold">-600₫</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="card border-0 shadow-sm h-100" style={{borderRadius: '10px'}}>
                                    <div className="card-body text-center">
                                        <i className="bi bi-credit-card text-primary" style={{fontSize: '2rem', marginBottom: '10px'}}></i>
                                        <h6 className="card-title">Loại Ví</h6>
                                        <p className="text-primary fw-bold">Thường</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="row mb-4">
                    <div className="col-md-12">
                        <div className="card border-0 shadow-sm" style={{borderRadius: '10px'}}>
                            <div className="card-header bg-white border-bottom p-0" style={{borderRadius: '10px 10px 0 0'}}>
                                <ul className="nav nav-tabs nav-fill border-0" role="tablist">
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link ${activeTab === 'balance' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('balance')}
                                            style={{borderBottom: activeTab === 'balance' ? '3px solid #667eea' : 'none', color: activeTab === 'balance' ? '#667eea' : '#666'}}
                                        >
                                            <i className="bi bi-eye me-2"></i>Tổng Quan
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link ${activeTab === 'deposit' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('deposit')}
                                            style={{borderBottom: activeTab === 'deposit' ? '3px solid #667eea' : 'none', color: activeTab === 'deposit' ? '#667eea' : '#666'}}
                                        >
                                            <i className="bi bi-plus-circle me-2"></i>Nạp Tiền
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link ${activeTab === 'withdraw' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('withdraw')}
                                            style={{borderBottom: activeTab === 'withdraw' ? '3px solid #667eea' : 'none', color: activeTab === 'withdraw' ? '#667eea' : '#666'}}
                                        >
                                            <i className="bi bi-dash-circle me-2"></i>Rút Tiền
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('history')}
                                            style={{borderBottom: activeTab === 'history' ? '3px solid #667eea' : 'none', color: activeTab === 'history' ? '#667eea' : '#666'}}
                                        >
                                            <i className="bi bi-clock-history me-2"></i>Lịch Sử Giao Dịch
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div className="card-body p-4">
                                {/* Balance Overview Tab */}
                                {activeTab === 'balance' && (
                                    <div>
                                        <h5 className="mb-4">Thông Tin Ví</h5>
                                        <div className="row">
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label text-muted">Tên Chủ Ví</label>
                                                <p className="fw-bold">Nguyễn Văn A</p>
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label text-muted">Email</label>
                                                <p className="fw-bold">nguyenvana@example.com</p>
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label text-muted">Số điện thoại</label>
                                                <p className="fw-bold">0123456789</p>
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label text-muted">Trạng Thái Ví</label>
                                                <p className="fw-bold"><span className="badge bg-success">Hoạt Động</span></p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Deposit Tab */}
                                {activeTab === 'deposit' && (
                                    <div>
                                        <h5 className="mb-4">Nạp Tiền Vào Ví</h5>
                                        <form>
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <div className="mb-4">
                                                        <label className="form-label fw-bold">Chọn Số Tiền Nạp</label>
                                                        <div className="btn-group w-100 mb-3" role="group">
                                                            <input type="radio" className="btn-check" name="amount" id="amount100" value="100000" onChange={() => setDepositAmount('100000')} />
                                                            <label className="btn btn-outline-primary" htmlFor="amount100">100K</label>
                                                            
                                                            <input type="radio" className="btn-check" name="amount" id="amount500" value="500000" onChange={() => setDepositAmount('500000')} />
                                                            <label className="btn btn-outline-primary" htmlFor="amount500">500K</label>
                                                            
                                                            <input type="radio" className="btn-check" name="amount" id="amount1m" value="1000000" onChange={() => setDepositAmount('1000000')} />
                                                            <label className="btn btn-outline-primary" htmlFor="amount1m">1M</label>
                                                            
                                                            <input type="radio" className="btn-check" name="amount" id="amount5m" value="5000000" onChange={() => setDepositAmount('5000000')} />
                                                            <label className="btn btn-outline-primary" htmlFor="amount5m">5M</label>
                                                        </div>
                                                    </div>

                                                    <div className="mb-4">
                                                        <label htmlFor="customAmount" className="form-label fw-bold">Hoặc Nhập Số Tiền Tùy Chọn</label>
                                                        <input 
                                                            type="number" 
                                                            className="form-control" 
                                                            id="customAmount"
                                                            placeholder="Nhập số tiền (₫)"
                                                            value={depositAmount}
                                                            onChange={(e) => setDepositAmount(e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="mb-4">
                                                        <label htmlFor="paymentMethod" className="form-label fw-bold">Phương Thức Thanh Toán</label>
                                                        <select 
                                                            className="form-select" 
                                                            id="paymentMethod"
                                                            value={paymentMethod}
                                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                                        >
                                                            <option value="credit-card">Thẻ Tín Dụng / Ghi Nợ</option>
                                                            <option value="bank">Chuyển Khoản Ngân Hàng</option>
                                                            <option value="paypal">PayPal</option>
                                                        </select>
                                                    </div>

                                                    <button 
                                                        type="button" 
                                                        className="btn btn-success btn-lg w-100"
                                                        onClick={handleDeposit}
                                                    >
                                                        <i className="bi bi-plus-circle me-2"></i>Nạp {depositAmount ? `₫${parseInt(depositAmount).toLocaleString('vi-VN')}` : 'Tiền'}
                                                    </button>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="card bg-light border-0" style={{borderRadius: '10px'}}>
                                                        <div className="card-body">
                                                            <h6 className="card-title mb-3">Thông Tin Nạp Tiền</h6>
                                                            <ul className="list-unstyled small">
                                                                <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Nạp nhanh chóng, an toàn</li>
                                                                <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Không có phí ẩn</li>
                                                                <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Được bảo vệ by PCI</li>
                                                                <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Hỗ trợ 24/7</li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Withdraw Tab */}
                                {activeTab === 'withdraw' && (
                                    <div>
                                        <h5 className="mb-4">Rút Tiền Từ Ví</h5>
                                        <form>
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <div className="alert alert-info" role="alert">
                                                        <i className="bi bi-info-circle me-2"></i>
                                                        <strong>Lưu ý:</strong> Tiền rút sẽ được chuyển vào tài khoản ngân hàng được đăng ký trong vòng 1-3 ngày làm việc.
                                                    </div>

                                                    <div className="mb-4">
                                                        <label htmlFor="withdrawAmount" className="form-label fw-bold">Nhập Số Tiền Rút (Tối đa: ₫{balance.toLocaleString('vi-VN', {minimumFractionDigits: 2})})</label>
                                                        <input 
                                                            type="number" 
                                                            className="form-control form-control-lg" 
                                                            id="withdrawAmount"
                                                            placeholder="Nhập số tiền cần rút"
                                                            value={withdrawAmount}
                                                            onChange={(e) => setWithdrawAmount(e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="mb-4">
                                                        <label htmlFor="bankAccount" className="form-label fw-bold">Tài Khoản Ngân Hàng</label>
                                                        <select className="form-select form-select-lg" id="bankAccount">
                                                            <option>Ngân Hàng Agriabank - ****1234</option>
                                                            <option>Ngân Hàng Techcombank - ****5678</option>
                                                            <option>Ngân Hàng Vietcombank - ****9012</option>
                                                        </select>
                                                    </div>

                                                    <button 
                                                        type="button" 
                                                        className="btn btn-danger btn-lg w-100"
                                                        onClick={handleWithdraw}
                                                    >
                                                        <i className="bi bi-arrow-up-circle me-2"></i>Rút {withdrawAmount ? `₫${parseInt(withdrawAmount).toLocaleString('vi-VN')}` : 'Tiền'}
                                                    </button>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="card bg-warning bg-opacity-10 border-warning" style={{borderRadius: '10px'}}>
                                                        <div className="card-body">
                                                            <h6 className="card-title mb-3">Hạn Mức Rút Tiền</h6>
                                                            <p className="small">
                                                                <strong>Hạn mức hàng ngày:</strong> 50,000,000₫
                                                            </p>
                                                            <p className="small">
                                                                <strong>Thời gian xử lý:</strong> 1-3 ngày làm việc
                                                            </p>
                                                            <p className="small">
                                                                <strong>Phí giao dịch:</strong> Miễn phí
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* History Tab */}
                                {activeTab === 'history' && (
                                    <div>
                                        <h5 className="mb-4">Lịch Sử Giao Dịch</h5>
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Loại Giao Dịch</th>
                                                        <th>Số Tiền</th>
                                                        <th>Ngày</th>
                                                        <th>Phương Thức</th>
                                                        <th>Trạng Thái</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {transactions.map((tx) => (
                                                        <tr key={tx.id}>
                                                            <td>
                                                                {tx.type === 'deposit' && <><i className="bi bi-arrow-down-circle text-success me-2"></i>Nạp Tiền</>}
                                                                {tx.type === 'withdrawal' && <><i className="bi bi-arrow-up-circle text-danger me-2"></i>Rút Tiền</>}
                                                                {tx.type === 'purchase' && <><i className="bi bi-bag-check text-info me-2"></i>Mua Hàng</>}
                                                            </td>
                                                            <td className={tx.amount > 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                                                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('vi-VN', {minimumFractionDigits: 2})}₫
                                                            </td>
                                                            <td>{tx.date}</td>
                                                            <td>{tx.method}</td>
                                                            <td>
                                                                {tx.status === 'success' && <span className="badge bg-success">Thành Công</span>}
                                                                {tx.status === 'pending' && <span className="badge bg-warning">Đang Xử Lý</span>}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Wallet;
