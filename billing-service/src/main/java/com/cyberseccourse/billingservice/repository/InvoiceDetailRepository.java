package com.cyberseccourse.billingservice.repository;

import com.cyberseccourse.billingservice.entity.InvoiceDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface InvoiceDetailRepository  extends JpaRepository<InvoiceDetail, Integer> {

    @Query("Select i from InvoiceDetail i where i.invoice.invoice_id = :invoiceId")
    List<InvoiceDetail> findByInvoiceId(int invoiceId);

}
