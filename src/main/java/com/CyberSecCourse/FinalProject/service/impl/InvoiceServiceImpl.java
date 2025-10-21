package com.CyberSecCourse.FinalProject.service.impl;

import com.CyberSecCourse.FinalProject.entity.Invoice;
import com.CyberSecCourse.FinalProject.entity.InvoiceDetail;
import com.CyberSecCourse.FinalProject.repository.InvoiceDetailRepository;
import com.CyberSecCourse.FinalProject.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.docx4j.Docx4jProperties;
import org.docx4j.convert.out.pdf.PdfConversion;
import org.docx4j.convert.out.pdf.viaXSLFO.Conversion;
import org.docx4j.convert.out.pdf.viaXSLFO.PdfSettings;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.openpackaging.parts.WordprocessingML.MainDocumentPart;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
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

        WordprocessingMLPackage wordMLPackage = WordprocessingMLPackage.load(new File("src/main/resources/templates/hoadonmau.docx"));
        MainDocumentPart documentPart = wordMLPackage.getMainDocumentPart();
//        FileInputStream fis = new FileInputStream("");
//        XWPFDocument document = new XWPFDocument(fis);
        List<InvoiceDetail> listSP = invoiceDetailRepository.findByInvoiceId(invoice.getInvoice_id());
        Map<String, String> placeholders = new HashMap<>();
        BigDecimal tax = invoice.getTotal_amount().divide(BigDecimal.valueOf(10));
        String fullname = new StringBuilder().append(invoice.getCustomer().getFirstName()).append(" ").append(invoice.getCustomer().getLastName()).toString();
        placeholders.put("id", invoice.getInvoice_id().toString());
        placeholders.put("fullname", fullname );
        placeholders.put("phone", invoice.getCustomer().getPhone());
        placeholders.put("address", invoice.getShipping_address());
        placeholders.put("description", invoice.getNote());
        placeholders.put("datetime", invoice.getInvoice_date().toString());
        placeholders.put("tax", tax.toString());
        placeholders.put("total", invoice.getTotal_amount().toString());
        placeholders.put("shipfee", "0");
        placeholders.put("paymenttotal", invoice.getTotal_amount().subtract(tax).toString());
        int  i = 0;
        for (InvoiceDetail sp : listSP) {
            placeholders.put("quantity" + i,sp.getQuantity().toString());
            placeholders.put("productname" +i,sp.getProduct().getProductName());
            placeholders.put("unitprice" +i,sp.getUnitPrice().toString());
            placeholders.put("subtotal"+i,sp.getSubTotal().toString());
            i++;
        }
        for(int j = i;j < 6;j++)
        {
            placeholders.put("quantity" + j,"");
            placeholders.put("productname" +j,"");
            placeholders.put("unitprice" +j,"");
            placeholders.put("subtotal"+j,"");
        }





//        for(XWPFParagraph paragraph : document.getParagraphs()) {
//            for(XWPFRun run : paragraph.getRuns()) {
//                String text = run.getText(0);
//                if(text != null && text.trim().length() > 0) {
//                    for(Map.Entry<String, String> entry : placeholders.entrySet()) {
//                        if(text.contains(entry.getKey())) {
//                            text = text.replace(entry.getKey(), entry.getValue());
//                            run.setText(text, 0);
//                        }
//                    }
//                }
//            }
//
//        }
//        FileOutputStream fos = new FileOutputStream("src/main/resources/templates/Hoadon.docx");
//        document.write(fos);
//        fos.close();
//        document.close();

        documentPart.variableReplace(placeholders);

// Xuất ra docx mới
        wordMLPackage.save(new File("src/main/resources/templates/Hoadon.docx"));

      try(  FileOutputStream os = new FileOutputStream("src/main/resources/templates/Hoadon.pdf"))
      {
          PdfConversion conversion = new Conversion(wordMLPackage);
          PdfSettings pdfSettings = new PdfSettings();
          conversion.output(os,pdfSettings);
      }



    }

}
