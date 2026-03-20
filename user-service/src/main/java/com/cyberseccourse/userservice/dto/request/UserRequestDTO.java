package com.cyberseccourse.userservice.dto.request;

import com.cyberseccourse.userservice.utils.PhoneNumber;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.Instant;
import java.time.LocalDate;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRequestDTO {
    @NotBlank(message = "First name not blank")
    private String firstName;

    @NotBlank(message = "Last name not blank")
    private String lastName;

    @Email
    private String email;

    @PhoneNumber
    private String phone;

    private String address;

    private String status;

    private Boolean gender;

    private Instant createdAt;

    private String note;

    @NotNull(message = "dateOfBirth must be not null")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @JsonFormat(pattern = "MM/dd/yyyy")
    private LocalDate date_of_birth;


}
