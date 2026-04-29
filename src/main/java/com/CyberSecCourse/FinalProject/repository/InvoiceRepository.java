package com.CyberSecCourse.FinalProject.repository;

import com.CyberSecCourse.FinalProject.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface InvoiceRepository extends JpaRepository<Invoice,Integer> {

    @Query("select i from Invoice i where i.order_code = :orderCode")
    Optional<Invoice> findInvoiceByOrderCode(Long orderCode);

    @Query("select i.user.userId from Invoice i WHERE i.invoice_id = :invoiceId")
    Integer UserIdByInvoice(int invoiceId );

}
