import React from "react";
import '../Booking/Booking.css';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Booking () {
    const navigate = useNavigate();
    const [movieInfo, setMovieInfo] = useState({});

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('movieInfo'));
        if (data) setMovieInfo(data);
    }, []);
    const seatTypes = {
        vip: ['D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'E6', 'E7', 'E8', 'E9']
    };

    const getSeatType = (seat) => {
        const row = seat.charAt(0);
        if (seatTypes.vip.includes(seat)) return 'vip';
        if (row === 'G') return 'couple';
        return 'normal';
    };
    const handlePaymentInfo = () => {
        navigate("/Payment_info");
    }

    return (
        <div className="container mt-4">
            <div className="d-flex flex-wrap p-4 ticket-booking-container gap-5 justify-content-center">
                
                {/* Khu vực chọn ghế */}
                <div className="seating-layout">
                    <div className="screen text-center mb-4">MÀN HÌNH CHIẾU</div>

                    <div className="seat-grid">
                        {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((row) => (
                            <div className="seat-row" key={row}>
                                {Array.from({ length: 14 }, (_, i) => {
                                    const seatNumber = `${row}${i + 1}`;
                                    const seatIndex = i + 1;
                                    const type = getSeatType(seatNumber);

                                    if (type === 'couple' && seatIndex % 2 === 0) return null;

                                    return (
                                        <div
                                            key={seatNumber}
                                            className={`seat ${type}`}
                                            style={type === 'couple' ? { width: '80px' } : {}}
                                        >
                                            {seatNumber}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div className="legend mt-4">
                        <h6 className="mb-3 fw-bold col-2">Loại ghế:</h6>
                        <div className="d-flex flex-wrap gap-3">
                            <div><span className="seat normal"></span> Ghế thường</div>
                            <div><span className="seat vip"></span> Ghế VIP</div>
                            <div><span className="seat couple"></span> Ghế đôi</div>
                        </div>
                    </div>
                    <div className="legend mt-4">
                        <h6 className="mb-3 fw-bold col-2">Tình trạng:</h6>
                        <div className="d-flex flex-wrap gap-3">
                            <div><span className="seat empty"></span> Ghế trống</div>
                            <div><span className="seat selected"></span> Đang chọn</div>
                            <div><span className="seat sold"></span> Đã bán</div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between mt-4 px-2">
                        <div>
                            <p className="fw-bold mb-1">Tổng tiền</p>
                            <h5 className="text-primary">0 VNĐ</h5>
                        </div>
                        <div>
                            <p className="fw-bold mb-1">Thời gian còn lại</p>
                            <h5 className="text-success">6:03</h5>
                        </div>
                    </div>
                </div>

                {/* Khu vực thông tin phim */}
                <div className="ticket-summary">
                    <img src={movieInfo.image} className="img-fluid mb-3 rounded" alt="Poster" width={220} />
                    <h5 className="fw-bold text-primary">{movieInfo.movieName}</h5>
                    <p><strong>2D Phụ đề</strong></p>
                    <ul className="list-unstyled">
                        <li><strong>Thể loại:</strong> {movieInfo.genre}</li>
                        <li><strong>Thời lượng:</strong> {movieInfo.duration}</li>
                        <li><strong>Rạp chiếu:</strong> Beta Thái Nguyên</li>
                        <li><strong>Ngày chiếu:</strong> {movieInfo.releaseDate}</li>
                        <li><strong>Giờ chiếu:</strong> 20:45</li>
                        <li><strong>Phòng chiếu:</strong> P2</li>
                        <li><strong>Ghế ngồi:</strong> C7, C8</li>
                    </ul>

                    <hr />
                    <button className="btn btn-primary w-100 mt-2" onClick={handlePaymentInfo}>TIẾP TỤC</button>
                </div>
            </div>
        </div>
    );
}

export default Booking;
