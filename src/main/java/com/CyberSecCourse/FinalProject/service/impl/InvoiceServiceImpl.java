package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.entity.Invoice;
import com.CyberSecCourse.FinalProject.entity.InvoiceDetail;
import com.CyberSecCourse.FinalProject.repository.InvoiceDetailRepository;
import com.CyberSecCourse.FinalProject.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.docx4j.Docx4jProperties;
import org.docx4j.convert.out.pdf.PdfConversion;
import org.docx4j.convert.out.pdf.viaXSLFO.Conversion;
import org.docx4j.convert.out.pdf.viaXSLFO.PdfSettings;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.openpackaging.parts.WordprocessingML.MainDocumentPart;
import org.springframework.stereotype.Service;

import java.io.*;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class InvoiceServiceImpl implements InvoiceService {

    private  final InvoiceDetailRepository invoiceDetailRepository;

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


}
