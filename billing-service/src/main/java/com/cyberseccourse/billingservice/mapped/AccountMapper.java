package com.cyberseccourse.billingservice.mapped;


import com.cyberseccourse.billingservice.dto.request.AccountRequestDTO;
import com.cyberseccourse.billingservice.entity.Account;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountMapper {
   AccountRequestDTO toDto(Account account);

   Account toEntity(AccountRequestDTO accountRequestDTO);
}
