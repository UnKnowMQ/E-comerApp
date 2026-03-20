package com.cyberseccourse.billingservice.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "manager")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Manager {

    @Id
    @Column(name = "manager_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer manager_id;

    @Column(name = "fullname")
    private String fullName;


    @Column(name = "phone_number")
    private String phone;

    @Column(name = "hometown")
    private String hometown;

    @Column(name = "gender")
    private Boolean gender;

    @Column(name = "start_date")
    private Instant startDate;

    @Column(name = "end_date")
    private Instant endDate;

    @Column(name = "date_of_birth")
    private Instant date_of_birth;

    @OneToOne(mappedBy = "manager")
    @ToString.Exclude
    private Account managerAccount;


}
