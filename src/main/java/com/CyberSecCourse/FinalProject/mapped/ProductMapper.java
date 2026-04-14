package com.CyberSecCourse.FinalProject.mapped;

import com.CyberSecCourse.FinalProject.dto.request.ProductRequestDTO;
import com.CyberSecCourse.FinalProject.dto.response.ProductResponse;
import com.CyberSecCourse.FinalProject.entity.Product;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {
//    @Mapping(source = "brand.brand_name", target = "brand_name")
//    @Mapping(source = "category.category_name", target = "category_name")
////    @Mapping(source = "discount.discount_name", target = "discount_name")
//    @Mapping(source = "status", target = "status")
    ProductRequestDTO toDTO(Product product);

    List<ProductRequestDTO> toDTOs(List<Product> products);

    @InheritInverseConfiguration
    Product toEntity(ProductRequestDTO dto);

//    @Mapping(source = "brand.brand_name", target = "brand_name")
//    @Mapping(source = "category.category_name", target = "category_name")
////    @Mapping(source = "discount.discount_name", target = "discount_name")
//    @Mapping(source = "status", target = "status")
//    @Mapping(source = "created_at", target = "created_at")
//    @Mapping(source = "updated_at", target = "updated_at")
    ProductResponse toResponse(Product entity);
}
