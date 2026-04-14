package com.CyberSecCourse.FinalProject.repository;

import com.CyberSecCourse.FinalProject.dto.request.ProductRequestDTO;
import com.CyberSecCourse.FinalProject.dto.response.ProductResponse;
import com.CyberSecCourse.FinalProject.dto.response.ProductTopResponse;
import com.CyberSecCourse.FinalProject.entity.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
}
