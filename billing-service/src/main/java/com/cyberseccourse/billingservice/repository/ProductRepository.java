package com.cyberseccourse.billingservice.repository;

import com.cyberseccourse.billingservice.dto.response.ProductTopResponse;
import com.cyberseccourse.billingservice.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query("Select i.imageUrl from Image i where i.product.id = :productId ")
    List<String> getImageByProductId(int productId);

    @Query("Select new com.CyberSecCourse.FinalProject.dto.response.ProductTopResponse(p.id,p.price, sum(id.quantity), p.productName) from Product p" +
            " inner join InvoiceDetail id on id.product.id  = p.id " +
            "group by p.id , p.productName" +
            " order by sum(id.quantity) desc" +
            " limit 3")
    List<ProductTopResponse> getTop3Product();
}
