package com.CyberSecCourse.FinalProject;

import com.CyberSecCourse.FinalProject.service.impl.CartServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.List;

@SpringBootApplication
@EnableScheduling
@RequiredArgsConstructor
public class FinalProjectApplication {


	public static void main(String[] args) {
		SpringApplication.run(FinalProjectApplication.class, args);
	}

	private final CartServiceImpl cartService;

	@Scheduled(cron ="0 0 0 * * *")
	public void deleteCartNotUsed()
	{
		List<String> cusId = cartService.getCustomerUsernameHaveCart();
		for(String id : cusId)
		{
			System.out.println("Deleting Left to Root Cart!");
			System.out.println(cartService.deleteCartByCustomer(id));
		}
	}
}
