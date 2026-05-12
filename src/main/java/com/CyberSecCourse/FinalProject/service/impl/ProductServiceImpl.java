package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.dto.request.SpecificationRequest;
import com.CyberSecCourse.FinalProject.dto.request.UpdateProductRequestDTO;
import com.CyberSecCourse.FinalProject.dto.response.PageResponse;
import com.CyberSecCourse.FinalProject.dto.response.ProductResponse;
import com.CyberSecCourse.FinalProject.dto.response.ProductTopResponse;
import com.CyberSecCourse.FinalProject.entity.*;
import com.CyberSecCourse.FinalProject.mapped.ProductMapper;
import com.CyberSecCourse.FinalProject.repository.*;
import com.CyberSecCourse.FinalProject.service.ProductService;
import com.CyberSecCourse.FinalProject.utils.InvoiceStatus;
import com.CyberSecCourse.FinalProject.utils.ProductStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {


    private final ProductRepository productRepository;
    private final SearchRepository searchRepository;
    private final CategoryRepository categoryRepository;
    private final RatingRepository ratingRepository;

    private final ImageRepository imageRepository;
    private final ProductMapper productMapper;

    private final SpecificationRepository specificationRepository;
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
                .saleVolume(product.getSaleVolume())
                .rating(ratingRepository.getAverageRatingByProductId(product.getProductId())!= null? ratingRepository.getAverageRatingByProductId(product.getProductId()):5)
                .numberRating(ratingRepository.getNumbersRatingByProductId(product.getProductId()))
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

    public PageResponse<?> getAllProductsByCategoryId(int pageNo, int pageSize, Integer categoryId) {
        int pa  = 0;

        pa  = (pageNo > 0) ? pageNo - 1 :pa;

        Pageable page = PageRequest.of(pa, pageSize);

        List<Integer> childNumber = categoryRepository.listIdCategoryChild(categoryId);
        List<Product> productFound = new ArrayList<>();

        productFound.addAll(productRepository.findProductByCategoryId(categoryId));

        if (!childNumber.isEmpty()) {
            childNumber.forEach(child -> {
                productFound.addAll(productRepository.findProductByCategoryId(child));
            });
        }

        Page<Product> products = new PageImpl<>(productFound,page,productFound.size());

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
                .saleVolume(product.getSaleVolume())
                .rating(ratingRepository.getAverageRatingByProductId(product.getProductId())!= null? ratingRepository.getAverageRatingByProductId(product.getProductId()):5)
                .numberRating(ratingRepository.getNumbersRatingByProductId(product.getProductId()))
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
        ProductResponse response =  productMapper.toResponse(product);
        response.setSaleVolume(product.getSaleVolume());
        response.setRating(ratingRepository.getAverageRatingByProductId(product.getProductId())!= null? ratingRepository.getAverageRatingByProductId(product.getProductId()):5);
        response.setNumberRating(ratingRepository.getNumbersRatingByProductId(product.getProductId()));
        return response;
    }

    @Override
    public List<String> getUrlImageByProductId(int id) {
        List<String> urlList = new ArrayList<>();
        urlList =  productRepository.getImageByProductId(id);
        System.out.println(urlList.size());
        return  urlList;
    }

    @Override
    public List<ProductTopResponse> getTopProduct(int limit) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(6); // đủ 7 ngày (kể cả hôm nay)
        List<ProductTopResponse> productTopResponseList =  productRepository.getTopProductLast7Days(InvoiceStatus.DONE,
                start,
                end,
                PageRequest.of(0, limit));

        productTopResponseList.forEach(productTopResponse -> {
            productTopResponse.setImg(imageRepository.getFirstImgByProductId(productTopResponse.getId()));
        });

        return productTopResponseList;
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

    @Transactional
    public ProductResponse updateProduct(Integer productId, UpdateProductRequestDTO dto) {

        // 1. Find product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 2. Update basic info (null check để support partial update)
        if (dto.getProductName() != null) {
            product.setProductName(dto.getProductName());

            // update slug luôn
            String slug = dto.getProductName()
                    .toLowerCase()
                    .replaceAll("\\s+", "-");
            product.setSlug(slug);
        }

        if (dto.getPrice() != null) {
            product.setPrice(dto.getPrice());
        }

        if (dto.getQuantity() != null) {
            product.setQuantity(dto.getQuantity());
        }

        if (dto.getWarranty() != null) {
            product.setWarranty(String.valueOf(dto.getWarranty()));
        }

        if (dto.getDescription() != null) {
            product.setDescription(dto.getDescription());
        }

        // 3. Update category (nếu có)
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        product.setUpdatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);

        // ================= IMAGE =================
        if (dto.getImageUrl() != null) {

            // xoá ảnh cũ
            imageRepository.deleteByProductId(productId);

            // thêm ảnh mới
            Set<Image> images = new HashSet<>();

            for (String url : dto.getImageUrl()) {
                Image img = new Image();
                img.setUrl(url);
                img.setImageName("img_" + UUID.randomUUID());
                img.setProduct(savedProduct);
                images.add(img);
            }

            imageRepository.saveAll(images);
            savedProduct.setImages(images);
        }

        // ================= SPEC =================
        if (dto.getSpecifications() != null) {

            // xoá spec cũ
            specificationRepository.deleteByProductId(productId);

            // thêm mới
            List<Specification> specs = new ArrayList<>();

            for (SpecificationRequest s : dto.getSpecifications()) {
                Specification spec = new Specification();
                spec.setName(s.getName());
                spec.setValue(s.getValue());
                spec.setProduct(savedProduct);
                specs.add(spec);
            }

            specificationRepository.saveAll(specs);
        }

        // 4. Map response
        ProductResponse response = new ProductResponse();
        response.setId(savedProduct.getId());
        response.setProductName(savedProduct.getProductName());
        response.setSlug(savedProduct.getSlug());
        response.setPrice(savedProduct.getPrice());
        response.setQuantity(savedProduct.getQuantity());
        response.setWarranty(savedProduct.getWarranty());
        response.setStatus(savedProduct.getStatus());
        response.setCreated_at(savedProduct.getCreatedAt());
        response.setUpdated_at(savedProduct.getUpdatedAt());
        response.setCategory_name(savedProduct.getCategory().getCategory_name());
        response.setDescription(savedProduct.getDescription());

        return response;
    }
}
