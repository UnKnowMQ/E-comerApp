package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.dto.request.ImageRequest;
import com.CyberSecCourse.FinalProject.dto.response.ImageResponse;
import com.CyberSecCourse.FinalProject.entity.Image;
import com.CyberSecCourse.FinalProject.entity.Product;
import com.CyberSecCourse.FinalProject.repository.ImageRepository;
import com.CyberSecCourse.FinalProject.repository.ProductRepository;
import com.CyberSecCourse.FinalProject.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;
    private final ProductRepository productRepository;

    // CREATE
    @Override
    public ImageResponse create(ImageRequest request) {

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Image image = new Image();
        image.setUrl(request.getUrl());
        image.setImageName(request.getImageName());
        image.setProduct(product);

        Image saved = imageRepository.save(image);

        return mapToResponse(saved);
    }

    // UPDATE
    @Override
    public ImageResponse update(Integer id, ImageRequest request) {

        Image image = imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        if (request.getUrl() != null) {
            image.setUrl(request.getUrl());
        }
        if (request.getImageName() != null) {
            image.setImageName(request.getImageName());
        }

        Image updated = imageRepository.save(image);

        return mapToResponse(updated);
    }

    // MAPPER
    private ImageResponse mapToResponse(Image image) {
        ImageResponse res = new ImageResponse();
        res.setImageId(image.getImageId());
        res.setUrl(image.getUrl());
        res.setImageName(image.getImageName());
        res.setProductId(image.getProduct().getId());
        return res;
    }
}