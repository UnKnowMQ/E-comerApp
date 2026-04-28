package com.CyberSecCourse.FinalProject.repository;

import com.CyberSecCourse.FinalProject.dto.request.ProductRequestDTO;
import com.CyberSecCourse.FinalProject.dto.response.ProductResponse;
import com.CyberSecCourse.FinalProject.dto.response.ProductTopResponse;
import com.CyberSecCourse.FinalProject.entity.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query("Select i.url from Image i where i.product.id = :productId ")
    List<String> getImageByProductId(int productId);

    @Query("Select new com.CyberSecCourse.FinalProject.dto.response.ProductTopResponse(p.id,p.price, sum(id.quantity), p.productName) from Product p" +
            " inner join InvoiceDetail id on id.product.id  = p.id " +
            "group by p.id , p.productName" +
            " order by sum(id.quantity) desc" +
            " limit 3")
    List<ProductTopResponse> getTop3Product();

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
