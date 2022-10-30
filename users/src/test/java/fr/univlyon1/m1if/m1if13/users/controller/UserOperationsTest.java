package fr.univlyon1.m1if.m1if13.users.controller;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;


@SpringBootTest
@AutoConfigureMockMvc
public class UserOperationsTest {
	@Autowired
	private MockMvc mockMvc;
	public String token;
	
	/*
	 * On test la méthode Post Login, on récupère son token, et en test la méthode Get Authenticate
	 */
	@Test
	public void POSTLoginAndGetAuthenticate() throws Exception{
		MvcResult result = mockMvc.perform(post("/login").queryParam("login", "francais").queryParam("password", "motdepasse").queryParam("Origin", "http://localhost:8080"))
	      .andExpect(status().isNoContent())
	      .andExpect(header().exists("Authentication")).andReturn();
		token = result.getResponse().getHeader("Authentication");
		
		mockMvc.perform(get("/authenticate").queryParam("jwt", token).queryParam("Origin", "http://localhost:8080"))
		.andExpect(status().isNoContent());
	}
	
	/*
	 * On test qu'on a le bon code d'erreur lorsque le login est incorrect
	 */
	@Test
	public void POSTBadLogin() throws Exception{
		mockMvc.perform(post("/login").queryParam("login", "francadis").queryParam("password", "motdepasse").queryParam("Origin", "http://localhost:8080"))
	      .andExpect(status().isNotFound());
	}
	
	/*
	 * On test le code d'erreur lorsque le mot de passe est incorrect
	 */
	@Test
	public void POSTBadPassword() throws Exception{
		mockMvc.perform(post("/login").queryParam("login", "francais").queryParam("password", "mdp").queryParam("Origin", "http://localhost:8080"))
	      .andExpect(status().isUnauthorized());
	}
	
	/*
	 * On test le code d'erreur lorsque le token est mauvais
	 */
	@Test
	public void BadToken() throws Exception{
		mockMvc.perform(get("/authenticate").queryParam("jwt", "cikbe").queryParam("Origin", "http://localhost:8080"))
		.andExpect(status().isUnauthorized());
	}
	
	@Test
	public void ExpiredToken() throws Exception{
		String token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmcmFuY2FpcyIsImF1ZCI6Imh0dHBzOi8vd3d3LnRlc3QuY29tIiwiaXNzIjoiTTFJRjEzIiwiZXhwIjoxNjQ1MTE1MDM0fQ.71NUhouEqPhQKt_VJoyZj2Djkzo_oGoXqjwUBOtT9B0";
		mockMvc.perform(get("/authenticate").queryParam("jwt", token).queryParam("Origin", "http://localhost:8080"))
		.andExpect(status().isBadRequest());
	}
    
}
