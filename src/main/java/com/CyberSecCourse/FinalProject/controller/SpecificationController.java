package com.CyberSecCourse.FinalProject.controller;

import com.CyberSecCourse.FinalProject.dto.request.ShopCreateRequestDTO;
import com.CyberSecCourse.FinalProject.dto.response.ResponseData;
import com.CyberSecCourse.FinalProject.dto.response.ResponseError;
import com.CyberSecCourse.FinalProject.repository.SpecificationRepository;
import com.CyberSecCourse.FinalProject.service.impl.SpecificationServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/specification")
public class SpecificationController {

    private final SpecificationServiceImpl specificationService;

    @GetMapping("/product/{productId}")
    public ResponseData<?> getSpecsByProductId(@RequestParam Integer productId
    ) {
        try{

            return new ResponseData<>(HttpStatus.OK.value(),"get Specs",specificationService.getSpecsByProduct(productId));
        }
        catch (Exception e)
        {
            log.error("there is an error in specs service: {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }
}
