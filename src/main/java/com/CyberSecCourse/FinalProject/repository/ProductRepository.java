package com.CyberSecCourse.FinalProject.repository;

import com.CyberSecCourse.FinalProject.dto.request.ProductRequestDTO;
import com.CyberSecCourse.FinalProject.dto.response.ProductResponse;
import com.CyberSecCourse.FinalProject.dto.response.ProductTopResponse;
import com.CyberSecCourse.FinalProject.entity.Product;
import com.CyberSecCourse.FinalProject.utils.InvoiceStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query("Select i.url from Image i where i.product.id = :productId ")
    List<String> getImageByProductId(int productId);

    @Query("""
    SELECT new com.CyberSecCourse.FinalProject.dto.response.ProductTopResponse(
        p.id,
        p.price,
        SUM(d.quantity),
        p.productName,
        p.discount,
        null
    )
    FROM InvoiceDetail d
    JOIN d.product p
    JOIN d.invoice i
    WHERE i.invoice_status = :status
      AND i.invoice_date BETWEEN :startDate AND :endDate
    GROUP BY p.id, p.price, p.productName, p.discount
    ORDER BY SUM(d.quantity) DESC
""")
    List<ProductTopResponse> getTopProductLast7Days(
            @Param("status") InvoiceStatus status,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );
    @Query("""
    SELECT new com.CyberSecCourse.FinalProject.dto.response.ProductResponse(
        p.id,
        p.productName,
        p.slug,
        p.price,
        p.quantity,
        p.warranty,
        p.status,
        p.createdAt,
        p.updatedAt,
        c.category_name,
        p.description,
        p.saleVolume,
        null,
        null,
        null
    )
    FROM Product p
    JOIN p.category c
    WHERE p.currentShop.shopId = :shopId
""")
    List<ProductResponse> findProductByShopId(@Param("shopId") int shopId);

    @Query("Select p from Product p where p.category.category_id = :categoryId AND p.status = 'ACTIVE'")
    List<Product> findProductByCategoryId(@Param("categoryId") int categoryId);


}
