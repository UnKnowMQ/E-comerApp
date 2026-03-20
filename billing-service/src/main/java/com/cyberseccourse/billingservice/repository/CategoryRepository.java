package com.cyberseccourse.billingservice.repository;

import com.cyberseccourse.billingservice.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    Category findById(int id);

}
