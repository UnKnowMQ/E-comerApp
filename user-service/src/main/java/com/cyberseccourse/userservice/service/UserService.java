package com.cyberseccourse.userservice.service;


import com.cyberseccourse.userservice.dto.request.UserRequestDTO;
import com.cyberseccourse.userservice.entity.User;
import com.cyberseccourse.userservice.mapstruct.UserMapper;
import com.cyberseccourse.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final UserMapper userMapper;

    public Long createUser(UserRequestDTO userRequestDTO){
        User newUser = (userRequestDTO);

    }


}
