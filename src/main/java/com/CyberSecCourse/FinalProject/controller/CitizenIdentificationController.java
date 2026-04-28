package com.CyberSecCourse.FinalProject.controller;

import com.CyberSecCourse.FinalProject.dto.request.CitizenIdentificationRequest;
import com.CyberSecCourse.FinalProject.dto.response.CitizenIdentificationResponse;
import com.CyberSecCourse.FinalProject.service.CitizenIdentificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/citizen-identifications")
@RequiredArgsConstructor
public class CitizenIdentificationController {

    private final CitizenIdentificationService citizenService;

    // ================= CREATE =================
    @PostMapping
    public ResponseEntity<CitizenIdentificationResponse> create(
            @RequestBody CitizenIdentificationRequest request
    ) {
        CitizenIdentificationResponse response = citizenService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    public ResponseEntity<CitizenIdentificationResponse> update(
            @PathVariable Integer id,
            @RequestBody CitizenIdentificationRequest request
    ) {
        CitizenIdentificationResponse response = citizenService.update(id, request);
        return ResponseEntity.ok(response);
    }

    // ================= GET BY USER =================
    @GetMapping("/user/{userId}")
    public ResponseEntity<CitizenIdentificationResponse> getByUserId(
            @PathVariable Integer userId
    ) {
        CitizenIdentificationResponse response = citizenService.getByUserId(userId);
        return ResponseEntity.ok(response);
    }

}