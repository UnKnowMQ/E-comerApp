package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.dto.request.ProductShopRequestDTO;
import com.CyberSecCourse.FinalProject.dto.request.ShopCreateRequestDTO;
import com.CyberSecCourse.FinalProject.dto.request.SpecificationRequest;
import com.CyberSecCourse.FinalProject.dto.response.ProductResponse;
import com.CyberSecCourse.FinalProject.entity.*;
import com.CyberSecCourse.FinalProject.repository.*;
import com.CyberSecCourse.FinalProject.service.ShopService;
import com.CyberSecCourse.FinalProject.utils.ProductStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ShopServiceImpl implements ShopService {

    private final ShopRepository shopRepository;

    private final CategoryRepository categoryRepository;

    private final ProductRepository productRepository;

    private final ImageRepository imageRepository;

    private final SpecificationRepository specificationRepository;

    private final  UserRepository userRepository;
    @Override
    public Shop CreateShop(ShopCreateRequestDTO shopCreateRequestDTO) {
        if(shopRepository.findShopByShopName(shopCreateRequestDTO.getShopName()) != null)
        {
            throw new RuntimeException("Shop name is present!");
        }
        if(shopRepository.findShopByUserId(shopCreateRequestDTO.getUserId()) != null && shopRepository.findShopByUserId(shopCreateRequestDTO.getUserId()).getShopStatus().equals("ACTIVE"))
        {
            throw new RuntimeException("Current user had created a shop!");
        }
        if(shopRepository.findShopByUserId(shopCreateRequestDTO.getUserId()) != null && shopRepository.findShopByUserId(shopCreateRequestDTO.getUserId()).getShopStatus().equals("PENDING"))
        {
            throw new RuntimeException("Current user had sent a requesting to create a shop!");
        }

        Shop shop = Shop.builder()
                .shopName(shopCreateRequestDTO.getShopName())
                .userId(shopCreateRequestDTO.getUserId())
                .logo(null)
                .banner(null)
                .rating(null)
                .shopStatus("PENDING")
                .createdAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .businessType(shopCreateRequestDTO.getBusinessType())
                .businessVerification(shopCreateRequestDTO.getBusinessVerification())
                .shopAddress(shopCreateRequestDTO.getShopAddress())
                .build();
        shopRepository.save(shop);

        return shop;


    }

    @Override
    public ProductResponse AddProductToShop(ProductShopRequestDTO dto) {

        // 1. Validate shop
        Shop shop = shopRepository.findById(dto.getShopId())
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        // 2. Validate category
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // 3. Create product
        Product product = new Product();
        product.setProductName(dto.getProductName());

        // slug
        String slug = dto.getProductName()
                .toLowerCase()
                .replaceAll("\\s+", "-");
        product.setSlug(slug);

        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setWarranty(dto.getWarranty());
        product.setDescription(dto.getDescription());

        // ✅ FIX status
        product.setStatus(String.valueOf(ProductStatus.PENDING));

        product.setCategory(category);
        product.setCurrentShop(shop);

        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        product.setSaleVolume(0);

        // 4. Save product
        Product savedProduct = productRepository.save(product);

        // ================= IMAGE =================
        if (dto.getImageUrl() != null && !dto.getImageUrl().isEmpty()) {

            Set<Image> images = new HashSet<>();

            for (String url : dto.getImageUrl()) {
                Image img = new Image();
                img.setUrl(url);
                img.setImageName("img_" + UUID.randomUUID());
                img.setProduct(savedProduct); // 🔥 QUAN TRỌNG
                images.add(img);
            }

            imageRepository.saveAll(images);
            savedProduct.setImages(images);
        }

        // ================= SPEC =================
        if (dto.getSpecifications() != null && !dto.getSpecifications().isEmpty()) {

            List<Specification> specs = new ArrayList<>();

            for (SpecificationRequest s : dto.getSpecifications()) {
                Specification spec = new Specification();
                spec.setName(s.getName());
                spec.setValue(s.getValue());
                spec.setProduct(savedProduct); // 🔥
                specs.add(spec);
            }

            specificationRepository.saveAll(specs);
        }

        // 5. Map response
        ProductResponse response = new ProductResponse();
        response.setId(savedProduct.getId());
        response.setProductName(savedProduct.getProductName());
        response.setSlug(savedProduct.getSlug());
        response.setPrice(savedProduct.getPrice());
        response.setQuantity(savedProduct.getQuantity());
        response.setWarranty(savedProduct.getWarranty());

        // ✅ FIX status
        response.setStatus(savedProduct.getStatus());

        // ✅ FIX time
        response.setCreated_at(savedProduct.getCreatedAt());
        response.setUpdated_at(savedProduct.getUpdatedAt());

        response.setCategory_name(savedProduct.getCategory().getCategory_name());
        response.setDescription(savedProduct.getDescription());

        return response;
    }

    @Override
    public ProductResponse DeleteProductFromShop(Integer productId) {
        return null;
    }

    @Override
    public ProductResponse EditProductInShop(Integer productId, ProductShopRequestDTO productEditRequestDTO) {
        return null;
    }

    @Override
    public List<ProductResponse> getProductOfShop(Integer shopId) {

        List<ProductResponse> productResponseList = productRepository.findProductByShopId(shopId);
        productResponseList.forEach((productResponse -> {
            productResponse.setImageUrl(productRepository.getImageByProductId(productResponse.getId()));
        }));

        return productResponseList;
    }

    @Override
    public List<Shop> getAllShops() {
        return shopRepository.findAll();
    }


    @Override
    public void approveShop(Integer shopId) {

        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        if (shop.getShopStatus().equals("ACTIVE")) {
            throw new RuntimeException("Shop already approved");
        }
        User u = userRepository.getReferenceById(shop.getUserId());
        u.setRole("Seller");
        userRepository.save(u);

        shop.setShopStatus("ACTIVE");
        shopRepository.save(shop);
    }

    @Override
    public void rejectShop(Integer shopId) {

        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        if (shop.getShopStatus().equals("REJECTED")) {
            throw new RuntimeException("Shop already rejected");
        }

        shop.setShopStatus("REJECTED");
        shopRepository.save(shop);
    }

}
