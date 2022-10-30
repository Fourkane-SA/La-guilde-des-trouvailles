package fr.univlyon1.m1if.m1if13.users;

import java.util.Set;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import fr.univlyon1.m1if.m1if13.users.DAO.UserDAO;
import fr.univlyon1.m1if.m1if13.users.model.User;

@SpringBootApplication
public class UsersApplication extends SpringBootServletInitializer {
	public static ApplicationContext context = new ClassPathXmlApplicationContext("beanUser.xml");
	public static void main(String[] args) {
		SpringApplication.run(UsersApplication.class, args);
	}
	
	
}
