package com.cyberseccourse.billingservice.entity;


import com.cyberseccourse.billingservice.utils.AccountStatus;
import jakarta.persistence.*;
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

    @JoinColumn(name = "administratoradmin_id")
    @OneToOne(fetch = FetchType.EAGER)
    private Administrator administrator;

    @JoinColumn(name = "customerc_id")
    @OneToOne(fetch = FetchType.EAGER)
    private Customer customer ;

    @JoinColumn(name = "managermanager_id")
    @OneToOne(fetch = FetchType.EAGER)
    private Manager manager;


}
