package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.dto.response.InvoiceDetailResponse;
import com.CyberSecCourse.FinalProject.dto.response.InvoiceResponse;
import com.CyberSecCourse.FinalProject.entity.Invoice;
import com.CyberSecCourse.FinalProject.entity.InvoiceDetail;
import com.CyberSecCourse.FinalProject.repository.InvoiceDetailRepository;
import com.CyberSecCourse.FinalProject.repository.InvoiceRepository;
import com.CyberSecCourse.FinalProject.service.InvoiceService;
import com.CyberSecCourse.FinalProject.utils.InvoiceStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.docx4j.Docx4jProperties;
import org.docx4j.convert.out.pdf.PdfConversion;
import org.docx4j.convert.out.pdf.viaXSLFO.Conversion;
import org.docx4j.convert.out.pdf.viaXSLFO.PdfSettings;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.openpackaging.parts.WordprocessingML.MainDocumentPart;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.*;
import java.math.BigDecimal;
import java.util.*;

@RequiredArgsConstructor
@Service
public class InvoiceServiceImpl implements InvoiceService {

    private  final InvoiceDetailRepository invoiceDetailRepository;

    private  final InvoiceRepository invoiceRepository;





    @Override
    public void createInvoice(Invoice invoice) throws Exception {

        Docx4jProperties.setProperty("docx4j.jaxb.JaxbValidationEventHandler", "false");

        // Load template từ resources (classpath)
        InputStream templateStream = getClass().getResourceAsStream("/templates/hoadonmau.docx");
        if (templateStream == null) {
            throw new FileNotFoundException("Không tìm thấy template hoadonmau.docx trong resources!");
        }

        WordprocessingMLPackage wordMLPackage = WordprocessingMLPackage.load(templateStream);
        MainDocumentPart documentPart = wordMLPackage.getMainDocumentPart();

        List<InvoiceDetail> listSP = invoiceDetailRepository.findByInvoiceId(invoice.getInvoice_id());

        Map<String, String> placeholders = new HashMap<>();
        BigDecimal tax = invoice.getTotal_amount().divide(BigDecimal.valueOf(10));
        String fullname = invoice.getUser().getFirstname() + " " + invoice.getUser().getLastname();

        placeholders.put("id", invoice.getInvoice_id().toString());
        placeholders.put("fullname", fullname);
        placeholders.put("phone", invoice.getUser().getPhoneNumber());
        placeholders.put("address", invoice.getShipping_address());
        placeholders.put("description", invoice.getNote());
        placeholders.put("datetime", invoice.getInvoice_date().toString());
        placeholders.put("tax", tax.toString());
        placeholders.put("total", invoice.getTotal_amount().toString());
        placeholders.put("shipfee", "0");
        placeholders.put("paymenttotal", invoice.getTotal_amount().subtract(tax).toString());

        int i = 0;
        for (InvoiceDetail sp : listSP) {
            placeholders.put("quantity" + i, sp.getQuantity().toString());
            placeholders.put("productname" + i, sp.getProduct().getProductName());
            placeholders.put("unitprice" + i, sp.getUnitPrice().toString());
            i++;
        }

        for (int j = i; j < 6; j++) {
            placeholders.put("quantity" + j, "");
            placeholders.put("productname" + j, "");
            placeholders.put("unitprice" + j, "");
            placeholders.put("subtotal" + j, "");
        }

        documentPart.variableReplace(placeholders);

        //  Tạo thư mục output runtime
        File outputDir = new File("/app/output");
        if (!outputDir.exists()) outputDir.mkdirs();

        //  ĐƯỜNG DẪN XUẤT FILE
        File outputDocx = new File("/app/output/Hoadon.docx");
        File outputPdf  = new File("/app/output/Hoadon.pdf");

        // Xuất DOCX
        wordMLPackage.save(outputDocx);

        // Xuất PDF
        try (FileOutputStream os = new FileOutputStream(outputPdf)) {
            PdfConversion conversion = new Conversion(wordMLPackage);
            PdfSettings pdfSettings = new PdfSettings();
            conversion.output(os, pdfSettings);
        }
    }

//    public List<InvoiceResponse> getInvoicesByShopId(Integer shopId) {
//
//        List<InvoiceResponse> result = invoiceRepository.findByShopId(shopId);
//
//        if (result.isEmpty()) {
//            return Collections.emptyList();
//        }
//
//        return result;
//    }

    public Page<InvoiceResponse> getInvoicesByShopId(Integer shopId, int pageNo, int pageSize, String sortBy) {

        Pageable pageable = PageRequest.of(
                Math.max(pageNo - 1, 0),
                pageSize,
                Sort.by(sortBy).descending()
        );

        Page<InvoiceResponse> getByShopId = invoiceRepository.findByShopId(shopId,pageable);

        getByShopId.forEach(invoice ->{
            invoice.setDetails(
                   invoiceDetailRepository.findByInvoiceId(invoice.getInvoiceId()).stream().map(d->
                            InvoiceDetailResponse.builder()
                                    .productId(d.getProduct().getId())
                                    .productName(d.getProduct().getProductName())
                                    .quantity(d.getQuantity())
                                    .unitPrice(d.getUnitPrice())
                                    .build()  ).toList());
        });

        return getByShopId;
    }
    public Page<InvoiceResponse> getInvoicesByUserId(Integer userId, int pageNo, int pageSize, String sortBy) {

        Pageable pageable = PageRequest.of(
                Math.max(pageNo - 1, 0),
                pageSize,
                Sort.by(sortBy).descending()
        );

        Page<InvoiceResponse> getByUserId = invoiceRepository.findByUserId(userId,pageable);

        getByUserId.forEach(invoice ->{
            invoice.setDetails(
                    invoiceDetailRepository.findByInvoiceId(invoice.getInvoiceId()).stream().map(d->
                            InvoiceDetailResponse.builder()
                                    .productId(d.getProduct().getId())
                                    .productName(d.getProduct().getProductName())
                                    .quantity(d.getQuantity())
                                    .unitPrice(d.getUnitPrice())
                                    .build()  ).toList());
        });

        return getByUserId;
    }
    public Optional<InvoiceResponse> getInvoicesById(Integer invoiceId) {

        Optional<InvoiceResponse> getByInvoiceId = invoiceRepository.findInvoiceById(invoiceId);

        List<InvoiceDetail> invoiceDetail = invoiceDetailRepository.findByInvoiceId(getByInvoiceId.get().getInvoiceId());

            getByInvoiceId.get().setDetails(
                    invoiceDetail.stream().map(d->
                            InvoiceDetailResponse.builder()
                                    .productId(d.getProduct().getId())
                                    .productName(d.getProduct().getProductName())
                                    .quantity(d.getQuantity())
                                    .unitPrice(d.getUnitPrice())
                                    .build()  ).toList());
        return getByInvoiceId;
    }

    private boolean isValidTransition(InvoiceStatus current, InvoiceStatus next) {

        return switch (current) {
            case PENDING -> next == InvoiceStatus.WFAD || next == InvoiceStatus.CANCELLED;
            case WFAD -> next == InvoiceStatus.DELIVERY || next == InvoiceStatus.CANCELLED;
            case RR -> next == InvoiceStatus.REFUNDED || next == InvoiceStatus.DONE;
            case DELIVERY -> next == InvoiceStatus.DONE ;
            default -> false;
        };
    }
    @Transactional
    public void updateInvoiceStatus(Integer invoiceId, Integer shopId, InvoiceStatus newStatus) {

        Invoice invoice = invoiceRepository.findByIdAndShopId(invoiceId, shopId)
                .orElseThrow(() -> new RuntimeException("Invoice not found or not belong to shop"));

        // 🔒 validate flow (quan trọng)
        InvoiceStatus currentStatus = invoice.getInvoice_status();

        if (!isValidTransition(currentStatus, newStatus)) {
            throw new RuntimeException("Invalid status transition");
        }

        invoice.setInvoice_status(newStatus);
        invoiceRepository.save(invoice);
    }



}
