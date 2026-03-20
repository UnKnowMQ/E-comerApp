package com.cyberseccourse.authservice.entity;


import com.cyberseccourse.authservice.utils.AccountStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "account")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Account {


    @Id
    @Column(name = "username", length = 50,nullable = false)
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "status")
    private AccountStatus status;

    @Column(name = "user_role")
    private String role;

    @Column(name = "user_role")
    private Integer userId;




}
