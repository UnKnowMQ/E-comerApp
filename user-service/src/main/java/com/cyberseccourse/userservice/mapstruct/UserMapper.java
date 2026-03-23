package com.cyberseccourse.userservice.mapstruct;


import com.cyberseccourse.userservice.dto.request.UserRequestDTO;
import com.cyberseccourse.userservice.dto.response.UserResponseDTO;
import com.cyberseccourse.userservice.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toEntity(UserRequestDTO userRequestDTO);

    UserRequestDTO toDto(User user);

    void updateUserFromDto(UserRequestDTO dto, @MappingTarget User entity);

    UserResponseDTO toResponse(User user);
}
