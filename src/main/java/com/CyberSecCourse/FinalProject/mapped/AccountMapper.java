package com.CyberSecCourse.FinalProject.mapped;

import com.CyberSecCourse.FinalProject.dto.request.AccountRequestDTO;
import com.CyberSecCourse.FinalProject.entity.Account;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountMapper {
   AccountRequestDTO toDto(Account account);

   Account toEntity(AccountRequestDTO accountRequestDTO);
}
