package com.CyberSecCourse.FinalProject.service;

import com.CyberSecCourse.FinalProject.dto.request.ProductShopRequestDTO;
import com.CyberSecCourse.FinalProject.dto.request.ShopCreateRequestDTO;
import com.CyberSecCourse.FinalProject.dto.response.ProductResponse;
import com.CyberSecCourse.FinalProject.entity.Product;
import com.CyberSecCourse.FinalProject.entity.Shop;

import java.util.List;

public interface ShopService {

    Shop CreateShop(ShopCreateRequestDTO shopCreateRequestDTO);
    ProductResponse AddProductToShop(ProductShopRequestDTO productAddShopRequestDTO);
    ProductResponse DeleteProductFromShop(Integer productId);
    ProductResponse EditProductInShop(Integer productId, ProductShopRequestDTO productEditRequestDTO);
    List<ProductResponse> getProductOfShop(Integer shopId);
    List<Shop> getAllShops();

    void approveShop(Integer shopId);

    void rejectShop(Integer shopId);

}
