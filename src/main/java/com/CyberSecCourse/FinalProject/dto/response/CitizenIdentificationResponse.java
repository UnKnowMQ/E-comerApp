package com.CyberSecCourse.FinalProject.dto.response;


import lombok.*;

@Getter
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CitizenIdentificationResponse {
    private Integer id;
    private Integer userId;
    private String ciFront;
    private String ciBack;
    private String ciNumber;
    private Boolean isVerified;
}