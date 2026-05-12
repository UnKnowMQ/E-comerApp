package com.CyberSecCourse.FinalProject.repository;

import com.CyberSecCourse.FinalProject.entity.Image;
import com.CyberSecCourse.FinalProject.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository  extends JpaRepository<Image, Integer> {

    @Modifying
    @Query("DELETE FROM Image i WHERE i.product.id = :productId")
    void deleteByProductId(@Param("productId") Integer productId);

    @Query("SELECT i.url from Image i Where i.product.id = :productId order by i.imageName limit 1")
    String getFirstImgByProductId(int productId);
}
