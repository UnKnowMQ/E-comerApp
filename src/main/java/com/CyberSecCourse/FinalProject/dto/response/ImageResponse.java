package com.CyberSecCourse.FinalProject.dto.response;

import lombok.*;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ImageResponse {

    private Integer imageId;
    private String url;
    private String imageName;
    private Integer productId;
    private Integer ratingId;
}

