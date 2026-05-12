package com.CyberSecCourse.FinalProject.repository;

import com.CyberSecCourse.FinalProject.dto.response.CategoryPieResponse;
import com.CyberSecCourse.FinalProject.dto.response.InvoiceResponse;
import com.CyberSecCourse.FinalProject.dto.response.RevenueStatisticResponse;
import com.CyberSecCourse.FinalProject.dto.response.TopProductRevenueResponse;
import com.CyberSecCourse.FinalProject.entity.Invoice;
import com.CyberSecCourse.FinalProject.utils.InvoiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
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
    WHERE u.userId = :userId
""")
    Page<InvoiceResponse> findByUserId(@Param("userId") Integer userId, Pageable pageable);

    @Query("""
    SELECT i FROM Invoice i
    WHERE i.invoice_id = :invoiceId
      AND i.user.userId = :userId
""")
    Optional<Invoice> findByIdAndUserId(
            @Param("invoiceId") Integer invoiceId,
            @Param("userId") Integer userId
    );

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
    WHERE i.invoice_id = :invoiceId
""")
    Optional<InvoiceResponse> findInvoiceById(@Param("invoiceId") Integer invoiceId);



    @Query("""
    SELECT new com.CyberSecCourse.FinalProject.dto.response.RevenueStatisticResponse(
        YEAR(i.invoice_date),
        MONTH(i.invoice_date),
        SUM(i.total_amount),
        COUNT(DISTINCT i.user.userId)

    )
    FROM Invoice i
    WHERE i.invoice_status = 'DONE'
      AND YEAR(i.invoice_date) = :year
      AND i.shop.shopId = :shopId
    GROUP BY YEAR(i.invoice_date), MONTH(i.invoice_date)
    ORDER BY MONTH(i.invoice_date)
""")
    List<RevenueStatisticResponse> getRevenueByMonth(@Param("year") int year, @Param("shopId") int shopId);

    @Query("""
    SELECT new com.CyberSecCourse.FinalProject.dto.response.RevenueStatisticResponse(
           YEAR(i.invoice_date),
           MONTH(i.invoice_date),
           SUM(i.total_amount),
           COUNT(DISTINCT i.user.userId)
       )
       FROM Invoice i
       WHERE i.invoice_status = 'DONE'
         AND YEAR(i.invoice_date) =  YEAR(CURRENT_DATE)
         AND i.shop.shopId = :shopId
       GROUP BY YEAR(i.invoice_date), MONTH(i.invoice_date)
       ORDER BY MONTH(i.invoice_date)
""")
    List<RevenueStatisticResponse> getRevenueByYear(@Param("shopId") int shopId);


    @Query("""
    SELECT new com.CyberSecCourse.FinalProject.dto.response.TopProductRevenueResponse(
        p.id,
        p.productName,
        SUM(d.quantity),
        SUM(d.unitPrice * d.quantity)
    )
    FROM InvoiceDetail d
    JOIN d.invoice i
    JOIN d.product p
    WHERE i.invoice_status = :status
      AND i.shop.shopId = :shopId
      AND i.invoice_date BETWEEN :start AND :end
    GROUP BY p.id, p.productName
    ORDER BY SUM(d.unitPrice * d.quantity) DESC
""")
    List<TopProductRevenueResponse> getTopProductRevenue(
            @Param("shopId") int shopId,
            @Param("status") InvoiceStatus status,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end,
            Pageable pageable
    );

    @Query("""
    SELECT new com.CyberSecCourse.FinalProject.dto.response.CategoryPieResponse(
        c.category_name,
        SUM(d.unitPrice * d.quantity)
    )
    FROM InvoiceDetail d
    JOIN d.invoice i
    JOIN d.product p
    JOIN p.category c
    WHERE i.invoice_status = :status
      AND i.shop.shopId = :shopId
      AND i.invoice_date BETWEEN :start AND :end
    GROUP BY c.category_name
    ORDER BY SUM(d.unitPrice * d.quantity) DESC
""")
    List<CategoryPieResponse> getCategoryPie(
            @Param("shopId") int shopId,
            @Param("status") InvoiceStatus status,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );
}
