package fr.univlyon1.m1if.m1if13.users.controller;

import java.util.Optional;

import javax.naming.AuthenticationException;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.TokenExpiredException;

import fr.univlyon1.m1if.m1if13.users.UsersApplication;
import fr.univlyon1.m1if.m1if13.users.DAO.UserDAO;
import fr.univlyon1.m1if.m1if13.users.model.User;
import fr.univlyon1.m1if.m1if13.users.utils.M1if13JwtHelper;
import org.json.JSONObject; 

@Controller
public class UserOperations {

	
	UserDAO userDao = UsersApplication.context.getBean("user", UserDAO.class);
	
	
	
	/**
	 * Procédure de login utilisée par un utilisateur
	 * @param login Le login de l'utilisateur. L'utilisateur doit avoir été créé préalablement et son login doit être présent dans le DAO.
	 * @param password Le password à vérifier.
	 * @return Une ResponseEntity avec le JWT dans le header "Authentication" si le login s'est bien passé, et le code de statut approprié (204, 401 ou 404).
	 */
	@CrossOrigin(origins = {"http://localhost:4000", "http://localhost:3376","http://192.168.75.46:8080","https://192.168.75.46","http://192.168.75.46"})
	@PostMapping("/login")
	public ResponseEntity<Void> login(@RequestParam("login") String login, @RequestParam("password") String password, @RequestParam("Origin") String origin) {
		Optional<User> u = userDao.get(login);
		if(u.isEmpty()) { // Utilisateur non trouvé
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "l'utilisateur n'a pas été trouvé");
		}
		try {
			u.get().authenticate(password);
		} catch (AuthenticationException e) { // Mot de passe incorrect
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "le mot de passe est incorrect", e);
		}
		// Connexion
		HttpHeaders responseHeaders = new HttpHeaders();
		String token = M1if13JwtHelper.generateToken(login, origin);
		responseHeaders.set("Authentication", token);
		responseHeaders.set("Access-Control-Expose-Headers", "*");
		return new ResponseEntity<>(responseHeaders, HttpStatus.NO_CONTENT);
	}
	@CrossOrigin(origins = {"http://localhost:4000", "http://localhost:3376","http://192.168.75.46:8080","https://192.168.75.46","http://192.168.75.46"})
	@PostMapping(path="/login",consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> login(@RequestBody String json,@RequestParam("Origin") String origin) {
		JSONObject obj = new JSONObject(json);
		String login = obj.getString("login");
		String password = obj.getString("password");
		return login(login,password,origin);
	}
	

	/**
	 * Réalise la déconnexion
	 */
	//@CrossOrigin(origins = {"http://localhost","http://192.168.75.46:8080","https://192.168.75.46"})
	@RequestMapping(path="/logout")
	public ResponseEntity<Void> logout() {
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Authentication", "");
		return new ResponseEntity<>(responseHeaders, HttpStatus.NO_CONTENT);
	}

	/**
	 * Méthode destinée au serveur Node pour valider l'authentification d'un utilisateur.
	 * @param token Le token JWT qui se trouve dans le header "Authentication" de la requête
	 * @param origin L'origine de la requête (pour la comparer avec celle du client, stockée dans le token JWT)
	 * @return Une réponse vide avec un code de statut approprié (204, 400, 401).
	 */
	//@CrossOrigin(origins = {"http://localhost","http://192.168.75.46:8080","https://192.168.75.46"})
	@GetMapping("/authenticate")
	public ResponseEntity<Void> authenticate(@RequestParam("jwt") String jwt, @RequestParam("Origin") String Origin) {
		System.out.println("jwt : " + jwt);
		System.out.println("Origin : " + Origin);
		try {
			String verify = M1if13JwtHelper.verifyToken(jwt, Origin);
		} catch (TokenExpiredException e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "le token a expiré", e);
			
		} catch (JWTDecodeException e) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "le token est invalide", e);
		}
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}
	//@CrossOrigin(origins = {"http://localhost","http://192.168.75.46:8080","https://192.168.75.46"})
	@GetMapping(path="/authenticate",consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> authenticateWithJSON(@RequestBody String json,@RequestParam("Origin") String Origin) {
		JSONObject obj = new JSONObject(json);
		String jwt = obj.getString("jwt");
		return authenticate(jwt,Origin);
	}
	
	
}