package com.CyberSecCourse.FinalProject.repository;

import com.CyberSecCourse.FinalProject.entity.Invoice;
import com.CyberSecCourse.FinalProject.entity.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpecificationRepository extends JpaRepository<Specification,Integer> {

    @Query("select s from Specification s where s.product.id = :productId")
    List<Specification> getSpecsByProductId(Integer productId);

    @Modifying
    @Query("DELETE FROM Specification s WHERE s.product.id = :productId")
    void deleteByProductId(@Param("productId") Integer productId);

}
