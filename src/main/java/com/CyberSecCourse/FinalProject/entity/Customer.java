package com.CyberSecCourse.FinalProject.entity;


import com.CyberSecCourse.FinalProject.utils.Gender;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "customer")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Customer {


    @Id
    @Column(name = "c_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer customerId;

    @Column(name = "firstname")
    private String firstName;

    @Column(name = "lastname")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone_number")
    private String phone;

    @Column(name = "address" ,nullable = true)
    private String address;

    @Column(name = "status")
    private String status;

    @Column(name = "gender")
    private Boolean gender;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "note")
    private String note;

    @Column(name = "date_of_birth")
    private LocalDate date_of_birth;

    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL)
    @ToString.Exclude
    private Account customerAccount;




}
