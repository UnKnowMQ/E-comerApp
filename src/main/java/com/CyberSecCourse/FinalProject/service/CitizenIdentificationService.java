package com.CyberSecCourse.FinalProject.service;

import com.CyberSecCourse.FinalProject.dto.request.CitizenIdentificationRequest;
import com.CyberSecCourse.FinalProject.dto.response.CitizenIdentificationResponse;

public interface CitizenIdentificationService {

    CitizenIdentificationResponse create(CitizenIdentificationRequest request);

    CitizenIdentificationResponse update(Integer id, CitizenIdentificationRequest request);

    CitizenIdentificationResponse getByUserId(Integer userId);

}