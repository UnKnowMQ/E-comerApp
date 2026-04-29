  import React, { useState,useRef } from 'react';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import { useNavigate } from 'react-router-dom';
  import '@fortawesome/fontawesome-free/css/all.min.css';
  import { useLocation } from 'react-router-dom';
  import { useEffect } from 'react';
  import axios from 'axios';

  function Showtime_edit() {
    const navigate = useNavigate();

  const [movieName, setMovieName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [movieId, setMovieId] = useState("");
  const [theaterId, setTheaterId] = useState("");
  const [theaterName, setTheaterName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");

  const location = useLocation();
  const showtime = location.state?.movie;
  useEffect(() => {
    if (showtime) {

      setStartTime(showtime.startTime);
      setSelectedMovie(showtime.movieId);
      setSelectedTheater(showtime.theaterId);
      setSelectedRoom(showtime.roomId);
    }
  }, [showtime]);



  const [room, setRoom]  = useState([]);

  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('');

    const[theater, setTheater] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      showtimeId: showtime?.showTimeId, // thêm showtimeId khi sửa
      startTime,
      movieId: selectedMovie,
      roomId: selectedRoom,
    };
    try {
      const response = await axios.put("http://localhost:8099/auth/edit-Showtime", data, {
        withCredentials: true,
              params: {
              id: data.showtimeId,
      },
      });
      console.log("Đã cập nhật suất chiếu:", response.data);

      setAlertMsg('Cập nhật suất chiếu thành công!');
      setAlertType('success');
    } catch (err) {
      console.error("Lỗi khi cập nhật suất chiếu:", err);
      setAlertMsg('Cập nhật suất chiếu thất bại!');
      setAlertType('danger');
    }
  };


  useEffect(() => {
        axios.get('http://localhost:8099/theaters/getTheaters', { withCredentials: true })
        .then((res) => setTheater(res.data.data))
        .catch((err) => console.error(err));

    if (alertMsg) {
      const timer = setTimeout(() => {
        setAlertMsg('');
        setAlertType('');
      }, 3000); // 3 giây

      return () => clearTimeout(timer);
    }
  }, [alertMsg]);

    const [selectedTheater, setSelectedTheater] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');

    const handleTheaterChange = (e) => {
      setSelectedTheater(e.target.value);
    };

      useEffect(() => {
    if (selectedTheater) {
      axios.get('http://localhost:8099/room/getRoomsByTheaterId', {
        withCredentials: true,
        params: {
          theaterId: selectedTheater,
        },
      })
      .then(res => setRoom(res.data.data))
      .catch(err => console.error(err));
    } else {
      setRoom([]);
    }
  }, [selectedTheater]);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  useEffect(() => {
    axios.get('http://localhost:8099/movie/getAll-movies', { withCredentials: true })
      .then(res => setMovies(res.data))
      .catch(err => console.error(err));
  }, []);

//Hiện các suất chiếu trong phòng hiện tại
    const [showtimeInCurRooms, setshowtimeInCurRooms] = useState([]);
    useEffect(() => {
  if (selectedRoom) {
    axios.get('http://localhost:8099/auth/get-showtime-ByRoomId', {
      withCredentials: true,
      params: {
        roomId: selectedRoom,
      },
    })
    .then(res => setshowtimeInCurRooms(res.data.data))
    .catch(err => console.error(err));
  } else {
    setshowtimeInCurRooms([]);
  }
}, [selectedRoom]);


const toastRef = useRef(null);

useEffect(() => {
  if (alertMsg && toastRef.current) {
    const toast = window.bootstrap.Toast.getOrCreateInstance(toastRef.current);
    toast.show();
  }
}, [alertMsg]);
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
                <h5 className="card-title">Cập nhật suất chiếu</h5>

              
                  <form onSubmit={handleSubmit}>

    
                    <div className="row mb-3">
          <label htmlFor="theaterSelect" className="col-sm-2 col-form-label">Chọn rạp chiếu:</label>
          <div className="col-sm-10">
          <select
            id="theaterSelect"
            className="form-select"
            value={selectedTheater}
            onChange={handleTheaterChange}
          >
            <option value="">-- Chọn rạp --</option>
            {theater.map(theater => (
              <option key={theater.theaterId} value={theater.theaterId}>
                {theater.theaterName} - {theater.location}
              </option>
            ))}
          </select>
          </div>
        </div>
                  <div className="row mb-3">
                    <label htmlFor="inputCast" className="col-sm-2 col-form-label">Chọn phòng</label>
                  {/* Select phòng */}
        {room.length > 0 && (
          <div className="col-sm-10">
            <select
              className="form-select"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
            >
              <option value="">-- Chọn phòng --</option>
              {room.map(room => (
                <option key={room.roomId} value={room.roomId}>
                  {room.roomName}
                </option>
              ))}
            </select>
            {showtimeInCurRooms.length > 0 && (
  <div className="mt-2">
    <strong>Giờ chiếu đã có trong phòng:</strong>
    <div className="d-flex flex-wrap gap-2 mt-1">
      {showtimeInCurRooms.map((showtime) => (
        <button
          key={showtime.showtimeId}
          type="button"
          className="btn btn-primary rounded-pill px-4 text-black"
          style={{
            backgroundColor: '#FFCCFF'	,
            border: 'none',
            minWidth: '80px',
            height: '38px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'default'
          }}
          disabled
        >
          {showtime.startTime}
        </button>
      ))}
    </div>
  </div>
)}
          </div>
        )}
        <div className="row mb-3 mt-3">
        <label htmlFor="inputCast" className="col-sm-2 col-form-label">Chọn phim</label>
        <div className="col-sm-10">
    <select
      id="movieSelect"
      className="form-select ms-1"
      value={selectedMovie || ''}
      onChange={(e) => setSelectedMovie(e.target.value)}
    >
      <option value="">-- Chọn phim --</option>
      {movies.map((movie) => (
        <option key={movie.movieId} value={movie.movieId}>
          {movie.movieName}
        </option>
      ))}
    </select>
    {selectedMovie !== null && (  
  <div className="mt-2">
    <strong>Thời lượng phim:{movies.find(m => m.movieId === Number(selectedMovie))?.duration}</strong>
  </div>
)}
    </div>
  </div>
                  </div>
                    <div className="row mb-3">
                    <label htmlFor="inputCast" className="col-sm-2 col-form-label">Giờ chiếu</label>
                    <div className="col-sm-10">
                      <input type="time" className="form-control" id='startTime' onChange={(e) => setStartTime(e.target.value)}               value={startTime}
 required/>
                    </div>
                  </div>
                    
                  


                  <div className="row mb-3">
                    <div className="col-sm-10">
                      <button type="submit" className="btn btn-primary" >Thêm lịch chiếu</button>
                    </div>
                  </div>

                </form>

              </div>
            </div>
          </div>
          </main>
      );
  }

  export default Showtime_edit;
