package com.CyberSecCourse.FinalProject.repository;

import com.CyberSecCourse.FinalProject.dto.response.InvoiceResponse;
import com.CyberSecCourse.FinalProject.entity.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface InvoiceRepository extends JpaRepository<Invoice,Integer> {

    @Query("select i from Invoice i where i.order_code = :orderCode")
    Optional<Invoice> findInvoiceByOrderCode(Long orderCode);

    @Query("select i.user.userId from Invoice i WHERE i.invoice_id = :invoiceId")
    Integer UserIdByInvoice(int invoiceId );

    @Query("""
    SELECT new com.CyberSecCourse.FinalProject.dto.response.InvoiceResponse(
        i.invoice_id,
        i.invoice_date,
        i.total_amount,
        i.payment_method,
        i.shipping_address,
        i.invoice_status,
        i.note,
        i.order_code,
        i.payment_id,
        i.exprired_at,
        u.userId,
        u.username,
        s.shopId,
        s.shopName,
        null
    )
    FROM Invoice i
    JOIN i.user u
    JOIN i.shop s
    WHERE s.shopId = :shopId
""")
    Page<InvoiceResponse> findByShopId(@Param("shopId") Integer shopId, Pageable pageable);

    @Query("""
    SELECT i FROM Invoice i
    WHERE i.invoice_id = :invoiceId
      AND i.shop.shopId = :shopId
""")
    Optional<Invoice> findByIdAndShopId(
            @Param("invoiceId") Integer invoiceId,
            @Param("shopId") Integer shopId
    );

}
