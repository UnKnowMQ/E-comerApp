package com.cyberseccourse.userservice.service;


import com.cyberseccourse.userservice.dto.request.UserRequestDTO;
import com.cyberseccourse.userservice.dto.response.UserResponseDTO;
import com.cyberseccourse.userservice.entity.User;
import com.cyberseccourse.userservice.mapstruct.UserMapper;
import com.cyberseccourse.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    public Long createUser(UserRequestDTO request) {
        User user = userMapper.toEntity(request);
        user.setCreatedAt(Instant.now());

        return userRepository.save(user).getUserId();
    }

    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));


        return userMapper.toResponse(user);
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    public UserResponseDTO updateUser(Long id, UserRequestDTO request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // dùng mapper update (khuyên dùng MapStruct @MappingTarget)
        userMapper.updateUserFromDto(request, user);

        return userMapper.toResponse(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }


}
