import React, { useState,useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

function Movie_add() {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const handleImageChange = (e) => {
  const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // tạo đường dẫn tạm
    }
  };
const [movieName, setMovieName] = useState("");
const [cast, setCast] = useState("");
const [director, setDirector] = useState("");
const [releaseDate, setReleaseDate] = useState("");
const [duration, setDuration] = useState("");
const [movieDescription, setDescription] = useState("");
const [trailer, setTrailer] = useState("");
const [genre, setGenre] = useState("");
const [showingType, setShowingType] = useState("");

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
    formData.append('folder', 'movies'); // ví dụ folder là "movies"

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
    movieName,
    cast,
    trailerUrl : trailer,
    director,
    releaseDate,
    duration,
    movieDescription,
    genre,
    showing: showingType,
  };

  try {
    const response = await axios.post("http://localhost:8099/movies/add-Movies", data, {
      withCredentials: true,
    });
    console.log("Phim đã được thêm:", response.data);

    setAlertMsg('Thêm phim thành công!');
    setAlertType('success');
  } catch (err) {
    console.error("Lỗi khi thêm phim:", err);
      setAlertMsg('Thêm phim thất bại!');
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
              <h5 className="card-title">Thêm phim mới</h5>

            
                <form onSubmit={handleSubmit}>

                <div className="row mb-3">
                  <label htmlFor="inputMovie" className="col-sm-2 col-form-label">Ảnh bìa</label>
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
                  <label htmlFor="inputMovie" className="col-sm-2 col-form-label">Tên phim</label>
                  <div className="col-sm-10">
                    <input type="text" className="form-control" id='movieName' onChange={(e) => setMovieName(e.target.value)} required/>
                  </div>
                </div>
                 <div className="row mb-3">
                  <label htmlFor="inputCast" className="col-sm-2 col-form-label">Diễn viên</label>
                  <div className="col-sm-10">
                    <input type="text" className="form-control" id='cast' onChange={(e) => setCast(e.target.value)} required/>
                  </div>
                </div>
                   <div className="row mb-3">
                  <label htmlFor="inputCast" className="col-sm-2 col-form-label">Trailer</label>
                  <div className="col-sm-10">
                    <input type="text" className="form-control" id='cast' onChange={(e) => setTrailer(e.target.value)} required/>
                  </div>
                </div>
                      <div className="row mb-3">
                  <label htmlFor="inputCast" className="col-sm-2 col-form-label">Đạo diễn</label>
                  <div className="col-sm-10">
                    <input type="text" className="form-control" id='director' onChange={(e) => setDirector(e.target.value)} required/>
                  </div>
                </div>


                <div className="row mb-3">
                  <label htmlFor="inputDate" className="col-sm-2 col-form-label">Ngày phát hành</label>
                  <div className="col-sm-10">
                    <input type="date" className="form-control" id='releaseDate' onChange={(e) => setReleaseDate(e.target.value)} required/>
                  </div>
                </div>
                <div className="row mb-3">
                  <label htmlFor="inputTime" className="col-sm-2 col-form-label">Thời lượng</label>
                  <div className="col-sm-10">
                    <input type="text" className="form-control" onChange={(e) => setDuration(e.target.value)} required/>
                  </div>
                </div>

               
                <div className="row mb-3">
                  <label htmlFor="inputDescription" className="col-sm-2 col-form-label">Mô tả</label>
                  <div className="col-sm-10">
                    <textarea className="form-control" style={{height: 100}} onChange={(e) => setDescription(e.target.value)} id='description'></textarea>
                  </div>
                </div>
                <fieldset className="row mb-3">
                  <legend className="col-form-label col-sm-2 pt-0">Loại phim</legend>
                  <div className="col-sm-10">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="not showing"  
    onChange={(e) => setShowingType(e.target.value)} />
                      <label className="form-check-label" htmlFor="gridRadios1">
                        Sắp chiếu
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="showing"  
    onChange={(e) => setShowingType(e.target.value)}/>
                      <label className="form-check-label" htmlFor="gridRadios2">
                        Đang chiếu
                      </label>
                    </div>
                   
                  </div>
                </fieldset>
                
                <div className="row mb-3">
                  <label htmlFor="inputGenre" className="col-sm-2 col-form-label">Thể loại</label>
                  <div className="col-sm-10">
                    <input type="text" className="form-control" onChange={(e) => setGenre(e.target.value)} required/>
                  </div>
                </div>

                


                <div className="row mb-3">
                  <div className="col-sm-10">
                    <button type="submit" className="btn btn-primary" >Thêm phim</button>
                  </div>
                </div>

              </form>

            </div>
          </div>
        </div>
        </main>
    );
}

export default Movie_add;
