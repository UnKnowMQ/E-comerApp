package com.CyberSecCourse.FinalProject.controller;

import com.CyberSecCourse.FinalProject.dto.request.InvoiceStatusReq;
import com.CyberSecCourse.FinalProject.dto.response.ResponseData;
import com.CyberSecCourse.FinalProject.dto.response.ResponseError;
import com.CyberSecCourse.FinalProject.entity.Invoice;
import com.CyberSecCourse.FinalProject.repository.InvoiceRepository;
import com.CyberSecCourse.FinalProject.service.impl.CheckoutServiceImpl;
import com.CyberSecCourse.FinalProject.service.impl.InvoiceServiceImpl;
import com.CyberSecCourse.FinalProject.utils.InvoiceStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/invoice")
public class InvoiceController {

    private final CheckoutServiceImpl checkoutService;
    private final InvoiceServiceImpl invoiceService;

    private final InvoiceRepository invoiceRepository;

    @PutMapping("/set-checkout-result")
    public ResponseData<?> getProductMultipleSearchCol(@RequestParam String status,
                                                       @RequestParam Long orderCode
    ) {
        try{
            return new ResponseData<>(HttpStatus.OK.value(),"Edit Invoice Status!",checkoutService.checkOut2(status,orderCode));
        }
        catch (Exception e)
        {
            log.error("there is an error in invoice api: {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
    @GetMapping("/shop/{shopId}")
    public ResponseEntity<?> getByShop(
            @PathVariable Integer shopId,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "invoice_date") String sortBy
    ) {
        return ResponseEntity.ok(
                invoiceService.getInvoicesByShopId(shopId, pageNo, pageSize, sortBy)
        );
    }
    @PatchMapping("/seller/invoice/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Integer id,
            @RequestParam Integer shopId,
            @RequestBody InvoiceStatusReq status
    ) {
        invoiceService.updateInvoiceStatus(id, shopId, status.getStatus());
        return ResponseEntity.ok("Updated");
    }

}
