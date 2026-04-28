package com.CyberSecCourse.FinalProject.service;

import com.CyberSecCourse.FinalProject.repository.InvoiceRepository;
import com.CyberSecCourse.FinalProject.utils.InvoiceStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class InvoiceExpiredListener implements MessageListener {

    private final InvoiceRepository invoiceRepository;

    private static final String PREFIX = "invoice:pending:";

    @Override
    @Transactional
    public void onMessage(Message message, byte[] pattern) {
        String expiredKey = message.toString();

        // Chỉ xử lý key của invoice
        if (!expiredKey.startsWith(PREFIX)) return;

        Long invoiceId = Long.parseLong(expiredKey.replace(PREFIX, ""));
        log.info("Invoice {} expired, attempting to cancel...", invoiceId);

        invoiceRepository.findById(Math.toIntExact(invoiceId)).ifPresent(invoice -> {
            if (InvoiceStatus.PENDING.equals(invoice.getInvoice_status())) {
                invoice.setInvoice_status(InvoiceStatus.CANCELLED);
                invoiceRepository.save(invoice);
                log.info("Invoice {} has been CANCELLED", invoiceId);
            } else {
                log.info("Invoice {} already in status {}, skip cancel",
                        invoiceId, invoice.getInvoice_status());
            }
        });
    }
}