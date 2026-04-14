package com.CyberSecCourse.FinalProject.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "citizen_identification")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CitizenIdentification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "CI_Back", nullable = false)
    private String ciBack;

    @Column(name = "CI_front", nullable = false)
    private String ciFront;

    @Column(name = "CI_number", nullable = false)
    private String ciNumber;

    @Column(name = "is_verified")
    private Boolean isVerified;


}
