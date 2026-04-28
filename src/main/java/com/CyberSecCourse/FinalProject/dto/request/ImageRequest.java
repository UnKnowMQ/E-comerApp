package com.CyberSecCourse.FinalProject.dto.request;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ImageRequest {
        private String url;
        private String imageName;
        private Integer productId;
        private Integer ratingId;
}
