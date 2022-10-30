package fr.univlyon1.m1if.m1if13.users.DAO;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import fr.univlyon1.m1if.m1if13.users.model.User;

public class UserDAO  implements Dao<User> {

	private List<User> users = new ArrayList<>();
	
	public UserDAO() {
        users.add(new User("english", "password"));
        users.add(new User("francais", "motdepasse"));
    }
	
	@Override
	public Optional<User> get(String id) {
		for(User user : users) {
			if(user.getLogin().equals(id)) {
				return Optional.ofNullable(user);
			}
		}
		return Optional.ofNullable(null);
	}

	@Override
	public Set<String> getAll() {
		Set<String> logins = new HashSet<String>();
		for(User user : users) {
			logins.add(user.getLogin());
		}
		return logins;
	}

	@Override
	public void save(User t) {
		users.add(t);
	}

	@Override
	public void update(String login, String password) {
		int index = -1;
		for(int i=0; i<users.size(); i++) {
			if(users.get(i).getLogin().equals(login)) {
				index = i;
			}
		}
		if(index >= 0) {
			users.get(index).setPassword(password);
		} else {
			System.out.println("utilisateur non trouvé");
		}
	}

	@Override
	public void delete(User t) {
		users.remove(t);
		
	}

}
