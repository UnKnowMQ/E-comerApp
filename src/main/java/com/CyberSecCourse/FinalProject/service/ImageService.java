package com.CyberSecCourse.FinalProject.service;

import com.CyberSecCourse.FinalProject.dto.request.ImageRequest;
import com.CyberSecCourse.FinalProject.dto.response.ImageResponse;

public interface ImageService {

    ImageResponse create(ImageRequest request);

    ImageResponse update(Integer id, ImageRequest request);
}
