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
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0);
    const [walletInfo, setWalletInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        status: 'ACTIVE',
        totalDeposit: 0,
        totalSpend: 0
    });
    const [activeTab, setActiveTab] = useState('balance');
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('credit-card');
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchWalletBalance = async () => {
            console.log('useEffect chạy rồi!');
            const customerId = localStorage.getItem('customerId');
            const token = localStorage.getItem('jwt');
            console.log('customerId:', customerId);
            console.log('token:', token);
            
            if (customerId && token) {
                try {
                    const apiUrl = `${import.meta.env.VITE_APP_API}/wallet/information/${customerId}`;
                    console.log('Fetching từ URL:', apiUrl);
                    
                    const response = await axios.get(apiUrl, {
                        headers: {
                            'accept': '*/*',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    console.log('Wallet balance response:', response.data);
                    const data = response.data;
                    
                    setBalance(data.balance);
                    setWalletInfo({
                        fullName: data.fullName || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        status: data.status || 'ACTIVE',
                        totalDeposit: data.totalDeposit || 0,
                        totalSpend: data.totalSpend || 0
                    });

                    // Fetch transaction history
                    if (data.walletId) {
                        const txRes = await axios.get(
                            `${import.meta.env.VITE_APP_API}/wallet-transaction`,
                            {
                                params: { walletId: data.walletId },
                                headers: {
                                    'accept': '*/*',
                                    'Authorization': `Bearer ${token}`
                                }
                            }
                        );
                        console.log('Transactions response:', txRes.data);
                        if (txRes.data?.data) {
                            setTransactions(txRes.data.data);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching wallet balance:', error);
                }
            } else {
                console.log('Không có customerId hoặc token trong localStorage');
            }
        };
        fetchWalletBalance();
    }, []);

    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        const tp = Math.max(1, Math.ceil(transactions.length / pageSize));
        if (page > tp) setPage(tp);
    }, [transactions]);

    const totalPages = Math.max(1, Math.ceil(transactions.length / pageSize));
    const paginatedTransactions = transactions.slice((page - 1) * pageSize, page * pageSize);

    const handleDeposit = async () => {
        if (depositAmount && parseFloat(depositAmount) > 0) {
            const customerId = localStorage.getItem('customerId');
            const token = localStorage.getItem('jwt');
            
            if (!customerId || !token) {
                alert('Vui lòng đăng nhập lại!');
                return;
            }

            try {
                const apiUrl = `${import.meta.env.VITE_APP_API}/Order/create`;
                console.log('Depositing to:', apiUrl);
                
                const response = await axios.post(apiUrl, {
                    productName: 'Nạp tiền vào Ví EWallet',
                    username: walletInfo.fullName || 'User',
                    description: `Nạp tiền số ${depositAmount}đ`,
                    userId: customerId,
                    returnUrl: `${import.meta.env.VITE_APP_FE_ENDPOINT}/wallet`,
                    price: parseFloat(depositAmount),
                    cancelUrl: `${import.meta.env.VITE_APP_FE_ENDPOINT}/wallet`
                }, {
                    headers: {
                        'accept': '*/*',
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                console.log('Deposit response:', response.data);
                
                if (response.data.error === 0 && response.data.data.qrCode) {
                    navigate('/QRCheckout', {
                        state: {
                            qrCode: response.data.data.qrCode,
                            amount: response.data.data.amount,
                            orderCode: response.data.data.orderCode,
                            checkoutUrl: response.data.data.checkoutUrl,
                            description: response.data.data.description
                        }
                    });
                } else {
                    alert('Lỗi nạp tiền: ' + (response.data.message || 'Không rõ'));
                }
            } catch (error) {
                console.error('Error depositing:', error);
                alert('Lỗi nạp tiền: ' + (error.response?.data?.message || error.message));
            }
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
                                    <div className="card-body text-center" style={{paddingTop: '3rem'}}>
                                        <i className="bi bi-arrow-down-circle text-success" style={{fontSize: '2rem', marginBottom: '10px'}}></i>
                                        <h6 className="card-title">Tổng Nạp</h6>
                                        <p className="text-success fw-bold">+{walletInfo.totalDeposit.toLocaleString('vi-VN')}₫</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="card border-0 shadow-sm h-100" style={{borderRadius: '10px'}}>
                                    <div className="card-body text-center" style={{paddingTop: '3rem'}}>
                                        <i className="bi bi-arrow-up-circle text-danger mt-2" style={{fontSize: '2rem', marginBottom: '10px'}}></i>
                                        <h6 className="card-title">Tổng Chi</h6>
                                        <p className="text-danger fw-bold">-{walletInfo.totalSpend.toLocaleString('vi-VN')}₫</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="card border-0 shadow-sm h-100" style={{borderRadius: '10px'}}>
                                    <div className="card-body text-center" style={{paddingTop: '3rem'}}>
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
                                            style={{borderBottom: activeTab === 'balance' ? '3px solid #667eea' : 'none', color: activeTab === 'balance' ? '#667eea' : '#666', fontSize: '1.05rem'}}
                                        >
                                            <i className="bi bi-eye me-2"></i>Tổng Quan
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link ${activeTab === 'deposit' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('deposit')}
                                            style={{borderBottom: activeTab === 'deposit' ? '3px solid #667eea' : 'none', color: activeTab === 'deposit' ? '#667eea' : '#666', fontSize: '1.05rem'}}
                                        >
                                            <i className="bi bi-plus-circle me-2"></i>Nạp Tiền
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link ${activeTab === 'withdraw' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('withdraw')}
                                            style={{borderBottom: activeTab === 'withdraw' ? '3px solid #667eea' : 'none', color: activeTab === 'withdraw' ? '#667eea' : '#666', fontSize: '1.05rem'}}
                                        >
                                            <i className="bi bi-dash-circle me-2"></i>Rút Tiền
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button 
                                            className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('history')}
                                            style={{borderBottom: activeTab === 'history' ? '3px solid #667eea' : 'none', color: activeTab === 'history' ? '#667eea' : '#666', fontSize: '1.05rem'}}
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
                                                <p className="fw-bold">{walletInfo.fullName || 'Không có dữ liệu'}</p>
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label text-muted">Email</label>
                                                <p className="fw-bold">{walletInfo.email || 'Không có dữ liệu'}</p>
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label text-muted">Số điện thoại</label>
                                                <p className="fw-bold">{walletInfo.phone || 'Không có dữ liệu'}</p>
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <label className="form-label text-muted">Trạng Thái Ví</label>
                                                <p className="fw-bold"><span className={`badge ${walletInfo.status === 'ACTIVE' ? 'bg-success' : 'bg-warning'}`}>{walletInfo.status === 'ACTIVE' ? 'Hoạt Động' : 'Không Hoạt Động'}</span></p>
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
                                                        <th>Trạng Thái</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {paginatedTransactions.length === 0 ? (
                                                        <tr><td colSpan="4" className="text-center text-muted py-4">Chưa có giao dịch nào</td></tr>
                                                    ) : (
                                                        paginatedTransactions.map((tx) => (
                                                            <tr key={tx.transactionId}>
                                                                <td>
                                                                    {tx.type === 'DEPOSIT' && <><i className="bi bi-arrow-down-circle text-success me-2"></i>Nạp Tiền</>}
                                                                    {tx.type === 'WITHDRAW' && <><i className="bi bi-arrow-up-circle text-danger me-2"></i>Rút Tiền</>}
                                                                    {tx.type === 'PURCHASE' && <><i className="bi bi-bag-check text-info me-2"></i>Mua Hàng</>}
                                                                    {tx.type === 'PAYMENT' && <><i className="bi bi-bag-check text-info me-2"></i>Thanh Toán</>}
                                                                    {!['DEPOSIT', 'WITHDRAW', 'PURCHASE', 'PAYMENT'].includes(tx.type) && <>{tx.type}</>}
                                                                </td>
                                                                <td className={tx.type === 'DEPOSIT' ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                                                    {tx.type === 'DEPOSIT' ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')}₫
                                                                </td>
                                                                <td>{new Date(tx.createdAt).toLocaleString('vi-VN')}</td>
                                                                <td>
                                                                    {tx.status === 'SUCCESS' && <span className="badge bg-success">Thành Công</span>}
                                                                    {tx.status === 'PENDING' && <span className="badge bg-warning">Đang Xử Lý</span>}
                                                                    {tx.status === 'FAILED' && <span className="badge bg-danger">Thất Bại</span>}
                                                                    {!['SUCCESS', 'PENDING', 'FAILED'].includes(tx.status) && <span className="badge bg-secondary">{tx.status}</span>}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination controls */}
                                        {totalPages > 1 && (
                                            <div className="d-flex justify-content-between align-items-center mt-3">
                                                <div className="text-muted">Hiển thị {(transactions.length === 0) ? 0 : ( (page - 1) * pageSize + 1)} - {Math.min(page * pageSize, transactions.length)} / {transactions.length}</div>
                                                <div>
                                                    <nav>
                                                        <ul className="pagination mb-0">
                                                            <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                                                                <button className="page-link" onClick={() => setPage((p) => Math.max(1, p - 1))}>‹</button>
                                                            </li>
                                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                                                <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                                                                    <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                                                                </li>
                                                            ))}
                                                            <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
                                                                <button className="page-link" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>›</button>
                                                            </li>
                                                        </ul>
                                                    </nav>
                                                </div>
                                            </div>
                                        )}
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
