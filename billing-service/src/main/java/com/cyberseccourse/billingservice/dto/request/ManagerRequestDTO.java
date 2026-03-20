package com.cyberseccourse.billingservice.dto.request;

import com.cyberseccourse.billingservice.entity.Account;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ManagerRequestDTO implements Serializable   {
    private Integer customerId;

    private String fullName;

    private String phone;

    private String hometown;

    private Boolean gender;

    private Instant startDate;

    private Instant endDate;

    private Instant date_of_birth;

    @ToString.Exclude
    private Account managerAccount;

}
