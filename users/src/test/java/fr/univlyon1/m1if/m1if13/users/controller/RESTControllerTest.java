package fr.univlyon1.m1if.m1if13.users.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(OrderAnnotation.class)
public class RESTControllerTest {
	@Autowired
	private MockMvc mockMvc;

	/*
	 * Test la reception d'un utilisateur existant
	 */
	@Test
	@Order(1)
	public void GETUsers() throws Exception {
		mockMvc.perform(get("/users"))
		.andExpect(status().isOk())
		.andExpect(content().contentType(MediaType.APPLICATION_JSON))
		.andExpect(content().json("[\"francais\",\"english\"]"));
	}
	
	/*
	 * Verifie qu'on a un code d'erreur quand on essaie d'acceder à un utilisateur inexistant
	 */
	@Test
	@Order(2)
	public void GETBadUsers() throws Exception {
		mockMvc.perform(get("/users/fakeuser"))
		.andExpect(status().isNotFound());
	}
	
	/*
	 * Création d'un utilisateur et vérification du code de statut
	 */
	@Test
	@Order(3)
	public void POSTUsers() throws Exception {
		this.mockMvc.perform(post("/users")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"login\":\"test\", \"password\":\"test\"}"))
	      .andExpect(status().isOk());
	}
	/*
	 * Modification du mot de passe de l'utilisateur créé
	 */
	@Test
	@Order(4)
	public void PUTUsers() throws Exception {
		this.mockMvc.perform(put("/users/{name}","test")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"password\":\"mdp\"}"))
	      .andExpect(status().isOk());
	}
	
	/*
	 * Suppression de l'utilisateur créé
	 */
	@Test
	@Order(5)
	public void DELETEUsers() throws Exception {
		this.mockMvc.perform(delete("/users/{name}","test"))
	      .andExpect(status().isOk());
		
	}
	
	/*
	 * Vérifier que l'utilisateur a bien été supprimé
	 */
	@Test
	@Order(6)
	public void GETDeleteUsers() throws Exception {
		mockMvc.perform(get("/users/test"))
		.andExpect(status().isNotFound());
	}
}
