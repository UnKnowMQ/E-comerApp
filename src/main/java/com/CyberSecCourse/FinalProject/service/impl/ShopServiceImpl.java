package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.dto.request.ProductShopRequestDTO;
import com.CyberSecCourse.FinalProject.dto.request.ShopCreateRequestDTO;
import com.CyberSecCourse.FinalProject.dto.response.ProductResponse;
import com.CyberSecCourse.FinalProject.entity.Shop;
import com.CyberSecCourse.FinalProject.repository.ShopRepository;
import com.CyberSecCourse.FinalProject.service.ShopService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ShopServiceImpl implements ShopService {

    private final ShopRepository shopRepository;


    @Override
    public Shop CreateShop(ShopCreateRequestDTO shopCreateRequestDTO) {
        if(shopRepository.findShopByShopName(shopCreateRequestDTO.getShopName()) != null)
        {
            throw new RuntimeException("Shop name is present!");
        }
        if(shopRepository.findShopByUserId(shopCreateRequestDTO.getUserId()) != null)
        {
            throw new RuntimeException("Current user had created a shop!");
        }

        Shop shop = Shop.builder()
                .shopName(shopCreateRequestDTO.getShopName())
                .userId(shopCreateRequestDTO.getUserId())
                .logo(null)
                .banner(null)
                .rating(null)
                .verified(false)
                .createdAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .businessType(shopCreateRequestDTO.getBusinessType())
                .businessVerification(shopCreateRequestDTO.getBusinessVerification())
                .build();
        shopRepository.save(shop);
        return shop;
    }

    @Override
    public ProductResponse AddProductToShop(ProductShopRequestDTO productAddShopRequestDTO) {
        return null;
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
        return List.of();
    }
}
