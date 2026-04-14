package com.CyberSecCourse.FinalProject.dto.request;


import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class AuthRequestDTO  implements Serializable {
    String email;
    String password;
}
