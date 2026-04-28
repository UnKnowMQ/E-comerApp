package com.CyberSecCourse.FinalProject.dto.request;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CitizenIdentificationRequest {
    private Integer userId;
    private String ciFront;
    private String ciBack;
    private String ciNumber;
}