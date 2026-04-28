package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.dto.response.PageResponse;
import com.CyberSecCourse.FinalProject.dto.response.ProductResponse;
import com.CyberSecCourse.FinalProject.dto.response.ProductTopResponse;
import com.CyberSecCourse.FinalProject.entity.Product;
import com.CyberSecCourse.FinalProject.entity.Shop;
import com.CyberSecCourse.FinalProject.entity.User;
import com.CyberSecCourse.FinalProject.mapped.ProductMapper;
import com.CyberSecCourse.FinalProject.repository.ProductRepository;
import com.CyberSecCourse.FinalProject.repository.SearchRepository;
import com.CyberSecCourse.FinalProject.service.ProductService;
import com.CyberSecCourse.FinalProject.utils.ProductStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {


    private final ProductRepository productRepository;
    private final SearchRepository searchRepository;

    private final ProductMapper productMapper;
    @Override
    public PageResponse<?> getAllProducts(int pageNo, int pageSize) {
        int pa  = 0;

        pa  = (pageNo > 0) ? pageNo - 1 :pa;

        System.out.println(pageNo);

        Pageable page = PageRequest.of(pa, pageSize);

        Page<Product> products = productRepository.findAll(page);

        List<ProductResponse> all = products.stream().map(product -> ProductResponse.builder()
                .productName(product.getProductName())
//                .brand_name(product.getBrand() == null ? "" : product.getBrand().getBrand_name() )
                .id(product.getId())
                .price(product.getPrice())
                .slug(product.getSlug())
                .category_name(product.getCategory() == null ? "" : product.getCategory().getCategory_name())
//                .discount_name(product.getDiscount() == null ? "" : product.getDiscount().getDiscount_name())
                .quantity(product.getQuantity())
                .warranty(product.getWarranty())
                .created_at(product.getCreatedAt())
                .status(String.valueOf(ProductStatus.valueOf(product.getStatus())))
                .imageUrl(
                        getUrlImageByProductId(product.getId()))
                .build()).toList();

        return PageResponse.builder()
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalPages(products.getTotalPages())
                .items(all)
                .build();
    }
    @Override
    public PageResponse<?> getProductsWithMultipleSearchingColumns(int pageNo, int pageSize, String sortBy,String address, String category, String... search) {
        return searchRepository.searchingProductWithMultipleColumns(pageNo,pageSize,sortBy,address,category,search);
    }

    @Override
    public ProductResponse getProductById(int id) {
        Product product = productRepository.findById(id).orElse(null);

        return productMapper.toResponse(product);
    }

    @Override
    public List<String> getUrlImageByProductId(int id) {
        List<String> urlList = new ArrayList<>();
        urlList =  productRepository.getImageByProductId(id);
        System.out.println(urlList.size());
        return  urlList;
    }

    @Override
    public List<ProductTopResponse> getTopProduct() {
        return productRepository.getTop3Product();
    }

    @Override
    public void approveProduct(Integer shopId) {

        Product product = productRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStatus().equals("ACTIVE")) {
            throw new RuntimeException("Product already approved");
        }

        product.setStatus("ACTIVE");
        productRepository.save(product);
    }

    @Override
    public void rejectProduct(Integer shopId) {

        Product product = productRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStatus().equals("REJECTED")) {
            throw new RuntimeException("Product already rejected");
        }

        product.setStatus("REJECTED");
        productRepository.save(product);
    }

}
