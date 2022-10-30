package fr.univlyon1.m1if.m1if13.users.controller;

import java.util.Optional;
import java.util.Set;

import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.ModelAndView;

import fr.univlyon1.m1if.m1if13.users.UsersApplication;
import fr.univlyon1.m1if.m1if13.users.DAO.UserDAO;
import fr.univlyon1.m1if.m1if13.users.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

@RestController
public class RESTController {
	// create and configure beans
	UserDAO userDao = UsersApplication.context.getBean("user", UserDAO.class);


	/*
	 * Renvoie une erreur 404 si l'utilisateur n'existe pas.
	 * Cette fonction est appellée à chaque fois qu'on doit vérifier la présence d'un utilisateur
	 */
	public void userIncorrectError(String login) {
		Optional<User> u = userDao.get(login);
		if(u.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur inconnu");
		}
	}

	
	@Operation(summary = "Get all users")
    @ApiResponse(responseCode = "200", description = "successful operation")
	@CrossOrigin(origins = {"http://localhost:4000","http://192.168.75.46:8080","https://192.168.75.46", "http://192.168.75.46"})
	@GetMapping(path="/users",produces= {"application/json", "application/xml"})
	public Set<String> getUserParam() {
		return userDao.getAll();
	}
	
	@Operation(summary = "Get user's login, and if he is connected")
    @ApiResponse(responseCode = "404", description = "User not found")
    @ApiResponse(responseCode = "200", description = "successful operation")
	@CrossOrigin(origins = {"http://localhost:4000","http://192.168.75.46:8080","https://192.168.75.46", "http://192.168.75.46"})
	@GetMapping(path="/users/{login}",produces= {"application/json", "application/xml"})
	public User getUserParam(@PathVariable(value = "login") String login) {
		userIncorrectError(login); // Si l'utilisateur n'existe pas, renvoie une erreur 404
		return userDao.get(login).get();
	}

	@CrossOrigin(origins = {"http://localhost:4000","http://192.168.75.46:8080","https://192.168.75.46", "http://192.168.75.46"})
	@GetMapping(path="/users/{login}", produces= {"text/html"})
	public ModelAndView getUserHTML(@PathVariable(value = "login") String login) {
		ModelAndView mav;
		login = login.replace("login=","");
		Optional<User> u = userDao.get(login);
		if(u.isPresent()) {
			mav = new ModelAndView("GetUser");
			mav.addObject("user", u.get());
		} else {
			mav = new ModelAndView("GetUserBad");
		}

		return mav;
	}

	@PostMapping(path="/users",consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
	@Operation(summary = "create a new user",
    description = "creation of a user.")
	public void addUser(@RequestBody String login, @RequestBody String password) {
		String[] split = login.split("&");
		login = split[0].replace("login=", "");
		password = split[1].replace("password=", "");
		userDao.save(new User(login,password));
	}

	@PostMapping(path="/users",consumes = MediaType.APPLICATION_JSON_VALUE)
	public void addUserJSON(@RequestBody String json) {
		JSONObject obj = new JSONObject(json);
		String login = obj.getString("login");
		String password = obj.getString("password");
		userDao.save(new User(login,password));
	}


	@PutMapping(path="/users/{login}",consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
	@Operation(summary = "update password user.",
    responses = {
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "200", description = "successful operation") }
	)
	public void updateUser( String password,@PathVariable(value = "login") String login) {
		userIncorrectError(login);
		userDao.update(login, password);
	}

	@PutMapping(path="/users/{login}",consumes = MediaType.APPLICATION_JSON_VALUE)
	public void updateUserWithJSON(@PathVariable(value = "login") String login ,@RequestBody String json) {
		userIncorrectError(login);
		JSONObject obj = new JSONObject(json);
		String password = obj.getString("password");
		userDao.update(login, password);
	}

	@DeleteMapping("/users/{login}")
	@Operation(summary = "Delete user",
    	description = "deleting a user.")
	@ApiResponse(responseCode = "200", description = "user deteled")
	@ApiResponse(responseCode = "404", description = "User not found")
	public void deleteUser(@PathVariable(value = "login") String login) {
		userIncorrectError(login);
		userDao.delete(userDao.get(login).get());
	}

}
