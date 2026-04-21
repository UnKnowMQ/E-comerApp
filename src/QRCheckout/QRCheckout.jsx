import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/vendor/bootstrap/css/bootstrap.min.css';
import '../assets/vendor/bootstrap-icons/bootstrap-icons.css';
import '../assets/vendor/boxicons/css/boxicons.min.css';
import '../assets/vendor/remixicon/remixicon.css';
import '../assets/css/style.css';

function QRCheckout() {
    const location = useLocation();
    const navigate = useNavigate();
    const qrCanvasRef = useRef(null);
    const { qrCode, amount, orderCode, checkoutUrl, description } = location.state || {};

    useEffect(() => {
        if (!qrCode) {
            navigate('/Wallet');
        }
    }, [qrCode, navigate]);

    useEffect(() => {
        if (qrCode && qrCanvasRef.current) {
            QRCode.toCanvas(qrCanvasRef.current, qrCode, {
                errorCorrectionLevel: 'H',
                type: 'image/png',
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            }, (error) => {
                if (error) {
                    console.error('Error generating QR code:', error);
                }
            });
        }
    }, [qrCode]);

    const handleDownloadQR = () => {
        if (qrCanvasRef.current) {
            const url = qrCanvasRef.current.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = url;
            link.download = `QR_${orderCode}.png`;
            link.click();
        }
    };

    const handleCopyLink = () => {
        if (checkoutUrl) {
            navigator.clipboard.writeText(checkoutUrl);
            alert('Đã sao chép đường dẫn thanh toán!');
        }
    };

    if (!qrCode) {
        return (
            <div className="container-fluid" style={{backgroundColor: '#f5f5f5', minHeight: '100vh', paddingTop: '80px', paddingBottom: '50px'}}>
                <div className="container">
                    <div className="alert alert-warning" role="alert">
                        Không có dữ liệu QR Code
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid" style={{backgroundColor: '#f5f5f5', minHeight: '100vh', paddingTop: '80px', paddingBottom: '50px'}}>
            <div className="container">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-md-12">
                        <h1 className="mb-1">
                            <i className="bi bi-qr-code me-2"></i>Thanh Toán QR Code
                        </h1>
                        <p className="text-muted">Quét mã QR hoặc sử dụng đường dẫn thanh toán để nạp tiền</p>
                    </div>
                </div>

                {/* QR Code Section */}
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <div className="card border-0 shadow-sm" style={{borderRadius: '10px'}}>
                            <div className="card-body p-5 text-center">
                            <div style={{marginBottom: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '10px'}}>
                                    <canvas 
                                        ref={qrCanvasRef} 
                                        style={{display: 'block', margin: '0 auto'}}
                                    />
                                </div>

                                {/* Thông tin */}
                                <div style={{textAlign: 'left', marginBottom: '20px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px'}}>
                                    <p className="mb-2">
                                        <strong>Mã đơn hàng:</strong> <span className="text-primary">{orderCode}</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Số tiền:</strong> <span className="text-success">{amount?.toLocaleString('vi-VN')}₫</span>
                                    </p>
                                    <p className="mb-0">
                                        <strong>Nội dung:</strong> {description}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="d-grid gap-2">
                                    <button 
                                        className="btn btn-primary btn-lg mb-2"
                                        onClick={handleDownloadQR}
                                    >
                                        <i className="bi bi-download me-2"></i>Tải QR Code
                                    </button>
                                    
                                    {checkoutUrl && (
                                        <button 
                                            className="btn btn-info btn-lg mb-2"
                                            onClick={handleCopyLink}
                                        >
                                            <i className="bi bi-files me-2"></i>Sao Chép Đường Dẫn Thanh Toán
                                        </button>
                                    )}

                                    {checkoutUrl && (
                                        <a 
                                            href={checkoutUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-success btn-lg mb-2"
                                        >
                                            <i className="bi bi-credit-card me-2"></i>Thanh Toán Ngay
                                        </a>
                                    )}

                                    <button 
                                        className="btn btn-outline-secondary btn-lg"
                                        onClick={() => navigate('/wallet')}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i>Quay Lại
                                    </button>
                                </div>

                                {/* Instructions */}
                                <div className="alert alert-info mt-4" role="alert">
                                    <h6 className="alert-heading mb-2">Hướng dẫn thanh toán:</h6>
                                    <ul className="mb-0 small">
                                        <li>Mở ứng dụng ngân hàng hoặc ứng dụng thanh toán của bạn</li>
                                        <li>Chọn chức năng quét mã QR</li>
                                        <li>Quét mã QR ở trên</li>
                                        <li>Xác nhận và hoàn tất thanh toán</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QRCheckout;
