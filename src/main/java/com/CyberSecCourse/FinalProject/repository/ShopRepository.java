package com.CyberSecCourse.FinalProject.repository;

import com.CyberSecCourse.FinalProject.entity.Shop;
import com.CyberSecCourse.FinalProject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopRepository extends JpaRepository<Shop,Integer> {

    @Query("Select s from Shop s where s.shopName = :shopName")
    Shop findShopByShopName(String shopName);

    @Query("Select s from Shop s where s.userId = :userId")
    Shop findShopByUserId(Integer userId);

    @Query("select s from Shop s where s.shopStatus = 'PENDING'")
    List<Shop> findShopVerifiedRequest();

    @Query("select s from Shop s join Product p on p.currentShop.shopId = s.shopId WHERE p.id = :productId")
    Shop findShopByProduct(Integer productId);


}
