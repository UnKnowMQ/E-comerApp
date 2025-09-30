import React from "react";
import styles from "./Ranking.module.css";
import poster from "../assets/phim1.png"; // Thay bằng ảnh phim thực tế

const movies = [
  {
    id: 1,
    title: "Con Nít Quỷ",
    rating: 8.4,
    views: "1.2M",
    poster: poster,
  },
  {
    id: 2,
    title: "Người Nhện: Đa Vũ Trụ",
    rating: 8.9,
    views: "980K",
    poster: poster,
  },
  {
    id: 3,
    title: "Lật Mặt 6",
    rating: 7.8,
    views: "750K",
    poster: poster,
  },
];

function Ranking() {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>🎬 BẢNG XẾP HẠNG PHIM HOT</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Poster</th>
            <th>Tên Phim</th>
            <th>Đánh Giá</th>
            <th>Lượt Xem</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie, index) => (
            <tr key={movie.id}>
              <td className={styles.rank}>{index + 1}</td>
              <td><img src={movie.poster} alt={movie.title} className={styles.poster} /></td>
              <td>{movie.title}</td>
              <td className={styles.rating}>{movie.rating}</td>
              <td>{movie.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Ranking;
