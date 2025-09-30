package com.CyberSecCourse.FinalProject.controller;

import com.CyberSecCourse.FinalProject.dto.response.ResponseData;
import com.CyberSecCourse.FinalProject.dto.response.ResponseError;
import com.CyberSecCourse.FinalProject.service.BrandService;
import com.CyberSecCourse.FinalProject.service.impl.BrandServiceImpl;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/brand")
public class BrandController {

    private final BrandServiceImpl brandService;


    @GetMapping("/get-brand")
    public ResponseData<?> getBrands() {
        try{

            return new ResponseData<>(HttpStatus.OK.value(),"Brand get",brandService.findAll());
        }
        catch (Exception e)
        {
            log.error("there is an error in brand api : {}",e.getMessage());
            return new ResponseError(HttpStatus.BAD_REQUEST.value(), e.getMessage());
        }
    }

}
