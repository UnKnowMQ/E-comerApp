package com.cyberseccourse.billingservice.service;


import com.cyberseccourse.billingservice.dto.response.PageResponse;
import com.cyberseccourse.billingservice.dto.response.ProductResponse;
import com.cyberseccourse.billingservice.dto.response.ProductTopResponse;

import java.util.List;

public interface ProductService {

    PageResponse<?> getAllProducts(int pageNo, int pageSize);
    PageResponse<?> getProductsWithMultipleSearchingColumns(int pageNo, int pageSize, String sortBy,String address,String category, String... search);
    ProductResponse getProductById(int id);

    List<String> getUrlImageByProductId(int id);

    List<ProductTopResponse> getTopProduct();
}
