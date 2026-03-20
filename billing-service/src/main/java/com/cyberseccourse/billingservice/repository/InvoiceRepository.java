package com.cyberseccourse.billingservice.repository;

import com.cyberseccourse.billingservice.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface InvoiceRepository extends JpaRepository<Invoice,Integer> {

    @Query("select i from Invoice i where i.order_code = :orderCode")
    Optional<Invoice> findInvoiceByOrderCode(Long orderCode);

}
