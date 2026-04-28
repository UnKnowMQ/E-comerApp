package com.CyberSecCourse.FinalProject.service;

import com.CyberSecCourse.FinalProject.dto.response.PageResponse;
import com.CyberSecCourse.FinalProject.dto.response.ProductResponse;
import com.CyberSecCourse.FinalProject.dto.response.ProductTopResponse;
import com.CyberSecCourse.FinalProject.dto.response.ResponseData;

import java.util.List;

public interface ProductService {

    PageResponse<?> getAllProducts(int pageNo, int pageSize);
    PageResponse<?> getProductsWithMultipleSearchingColumns(int pageNo, int pageSize, String sortBy,String address,String category, String... search);
    ProductResponse getProductById(int id);

    List<String> getUrlImageByProductId(int id);

    List<ProductTopResponse> getTopProduct();

    void approveProduct(Integer productId);

    void rejectProduct(Integer productId);
}
