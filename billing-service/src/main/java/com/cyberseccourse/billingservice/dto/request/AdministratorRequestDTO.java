package com.cyberseccourse.billingservice.dto.request;

import lombok.*;

import java.io.Serializable;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdministratorRequestDTO  implements Serializable {

    private Integer admin_id;

}
