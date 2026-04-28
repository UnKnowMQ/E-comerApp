package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.dto.request.CitizenIdentificationRequest;
import com.CyberSecCourse.FinalProject.dto.response.CitizenIdentificationResponse;
import com.CyberSecCourse.FinalProject.entity.CitizenIdentification;
import com.CyberSecCourse.FinalProject.entity.User;
import com.CyberSecCourse.FinalProject.repository.CitizenIdentificationRepository;
import com.CyberSecCourse.FinalProject.repository.UserRepository;
import com.CyberSecCourse.FinalProject.service.CitizenIdentificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CitizenIdentificationServiceImpl implements CitizenIdentificationService {

    private final CitizenIdentificationRepository citizenRepo;
    private final UserRepository userRepository;

    // CREATE
    @Override
    public CitizenIdentificationResponse create(CitizenIdentificationRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // check đã tồn tại chưa (1 user chỉ có 1 CCCD)
        if (citizenRepo.findByUser_UserId(((User) user).getUserId()).isPresent()) {
            throw new RuntimeException("Citizen Identification already exists");
        }

        CitizenIdentification ci = new CitizenIdentification();
        ci.setUser(user);
        ci.setCiFront(request.getCiFront());
        ci.setCiBack(request.getCiBack());
        ci.setCiNumber(request.getCiNumber());
        ci.setIsVerified(false); // mặc định chưa verify

        CitizenIdentification saved = citizenRepo.save(ci);

        return mapToResponse(saved);
    }

    // UPDATE
    @Override
    public CitizenIdentificationResponse update(Integer id, CitizenIdentificationRequest request) {

        CitizenIdentification ci = citizenRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Citizen Identification not found"));

        if (request.getCiFront() != null) {
            ci.setCiFront(request.getCiFront());
        }
        if (request.getCiBack() != null) {
            ci.setCiBack(request.getCiBack());
        }
        if (request.getCiNumber() != null) {
            ci.setCiNumber(request.getCiNumber());
        }

        CitizenIdentification updated = citizenRepo.save(ci);

        return mapToResponse(updated);
    }

    // GET BY USER
    @Override
    public CitizenIdentificationResponse getByUserId(Integer userId) {

        CitizenIdentification ci = citizenRepo.findByUser_UserId(userId)
                .orElseThrow(() -> new RuntimeException("Not found"));

        return mapToResponse(ci);
    }

    // ===================== MAPPER =====================
    private CitizenIdentificationResponse mapToResponse(CitizenIdentification ci) {
        CitizenIdentificationResponse res = new CitizenIdentificationResponse();
        res.setId(ci.getId());
        res.setUserId(ci.getUser().getUserId());
        res.setCiFront(ci.getCiFront());
        res.setCiBack(ci.getCiBack());
        res.setCiNumber(ci.getCiNumber());
        res.setIsVerified(ci.getIsVerified());
        return res;
    }
}
