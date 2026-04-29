package com.CyberSecCourse.FinalProject.dto.request;

import com.CyberSecCourse.FinalProject.utils.InvoiceStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceStatusReq {

    private InvoiceStatus status;
}
