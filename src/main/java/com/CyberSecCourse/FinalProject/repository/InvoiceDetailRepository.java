package com.CyberSecCourse.FinalProject.repository;

import com.CyberSecCourse.FinalProject.entity.InvoiceDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface InvoiceDetailRepository  extends JpaRepository<InvoiceDetail, Integer> {

}
