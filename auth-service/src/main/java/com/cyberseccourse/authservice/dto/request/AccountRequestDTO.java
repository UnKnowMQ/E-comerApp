package com.cyberseccourse.authservice.dto.request;


import com.cyberseccourse.billingservice.entity.Administrator;
import com.cyberseccourse.billingservice.entity.Customer;
import com.cyberseccourse.billingservice.entity.Manager;
import com.cyberseccourse.billingservice.utils.AccountStatus;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class AccountRequestDTO implements Serializable {


    private String username;

    private String password;

    private AccountStatus status;

    private Administrator administrator;

    private Customer customer ;

    private Manager manager;

}
