package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.dto.request.ProductShopRequestDTO;
import com.CyberSecCourse.FinalProject.dto.request.ShopCreateRequestDTO;
import com.CyberSecCourse.FinalProject.dto.response.ProductResponse;
import com.CyberSecCourse.FinalProject.entity.Shop;
import com.CyberSecCourse.FinalProject.service.ShopService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShopServiceImpl implements ShopService {


    @Override
    public Shop CreateShop(ShopCreateRequestDTO shopCreateRequestDTO) {
        return null;
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
