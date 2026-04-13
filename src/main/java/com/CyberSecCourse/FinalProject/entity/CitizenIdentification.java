package com.CyberSecCourse.FinalProject.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "citizen_identification")
@Getter
@Setter
@Builder
@NoArgsConstructor
public class CitizenIdentification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "CI_Back", nullable = false)
    private Integer ciBack;

    @Column(name = "CI_front", nullable = false)
    private Integer ciFront;

    @Column(name = "CI_number", nullable = false)
    private Integer ciNumber;

    @Column(name = "is_verified")
    private Boolean isVerified;


}
