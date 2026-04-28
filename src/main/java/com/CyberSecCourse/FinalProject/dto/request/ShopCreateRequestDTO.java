package com.CyberSecCourse.FinalProject.dto.request;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ShopCreateRequestDTO {

        private String shopName;

        private Integer userId;

        private Double rating;

        private String description;

        private String businessType;

        private String businessVerification;

        private String shopAddress;
}
