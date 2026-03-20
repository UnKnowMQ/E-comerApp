package com.cyberseccourse.billingservice.dto.request;

import com.cyberseccourse.billingservice.entity.Account;
import com.cyberseccourse.billingservice.entity.Customer;
import com.cyberseccourse.billingservice.utils.AccountStatus;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class RegisterRequestDTO implements Serializable {

    private String firstName;

    private String lastName;

    private String email;

    private Boolean gender;

    private String phone;

    private String username;

    private String password;

    private AccountStatus status;

    private Customer customer ;

    private Instant createdAt;

    private String note;

    private LocalDate date_of_birth;

    @ToString.Exclude
    private Account customerAccount;
}
