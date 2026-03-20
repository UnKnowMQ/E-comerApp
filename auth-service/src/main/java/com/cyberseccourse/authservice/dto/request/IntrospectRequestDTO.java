package com.cyberseccourse.authservice.dto.request;

import lombok.*;

import java.io.Serializable;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class IntrospectRequestDTO  implements Serializable {


    String token;


}
