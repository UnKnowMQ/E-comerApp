package com.CyberSecCourse.FinalProject.dto.request;

import com.CyberSecCourse.FinalProject.entity.Administrator;
import com.CyberSecCourse.FinalProject.entity.Customer;
import com.CyberSecCourse.FinalProject.entity.Manager;
import com.CyberSecCourse.FinalProject.utils.AccountStatus;
import jakarta.persistence.*;
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
