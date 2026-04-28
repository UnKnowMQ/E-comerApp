package com.CyberSecCourse.FinalProject.repository;

import com.CyberSecCourse.FinalProject.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Integer> {


    @Query("SELECT AVG(r.rate) FROM Rating r WHERE r.productId = :productId")
    Double getAverageRatingByProductId(@Param("productId") String productId);

    @Query("SELECT count(r) FROM Rating r WHERE r.productId = :productId")
    Integer getNumbersRatingByProductId(@Param("productId") String productId);


}
