package com.cyberseccourse.userservice.controller;

import com.cyberseccourse.userservice.dto.request.UserRequestDTO;
import com.cyberseccourse.userservice.dto.response.ResponseData;
import com.cyberseccourse.userservice.dto.response.UserResponseDTO;
import com.cyberseccourse.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<ResponseData<Long>> createUser(@RequestBody @Valid UserRequestDTO request) {

        Long id = userService.createUser(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ResponseData<>(
                        HttpStatus.CREATED.value(),
                        "User created successfully",
                        id
                ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseData<UserResponseDTO>> getUser(@PathVariable Long id) {

        UserResponseDTO user = userService.getUserById(id);

        return ResponseEntity.ok(
                new ResponseData<>(
                        HttpStatus.OK.value(),
                        "Get user successfully",
                        user
                )
        );
    }
    @GetMapping
    public ResponseEntity<ResponseData<List<UserResponseDTO>>> getAllUsers() {

        List<UserResponseDTO> users = userService.getAllUsers();

        return ResponseEntity.ok(
                new ResponseData<>(
                        HttpStatus.OK.value(),
                        "Get users successfully",
                        users
                )
        );
    }
    @PutMapping("/{id}")
    public ResponseEntity<ResponseData<Void>> updateUser(
            @PathVariable Long id,
            @RequestBody @Valid UserRequestDTO request
    ) {

        userService.updateUser(id, request);

        return ResponseEntity.ok(
                new ResponseData<>(
                        HttpStatus.OK.value(),
                        "Update successfully",
                        null
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseData<Void>> deleteUser(@PathVariable Long id) {

        userService.deleteUser(id);

        return ResponseEntity.ok(
                new ResponseData<>(
                        HttpStatus.OK.value(),
                        "Delete successfully",
                        null
                )
        );
    }
}
