package com.cyberseccourse.userservice.mapstruct;


import com.cyberseccourse.userservice.dto.request.UserRequestDTO;
import com.cyberseccourse.userservice.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toEntity(UserRequestDTO userRequestDTO);

    UserRequestDTO toDto(User user);
}
