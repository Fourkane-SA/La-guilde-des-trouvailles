package fr.univlyon1.m1if.m1if13.users.model;

import javax.naming.AuthenticationException;

public class User {
    private final String login;
    private String password;

    // Permet d'invalider une connexion même si le token est toujours valide
    private boolean connected;

    
    
    public User(String login, String password) {
        this.login = login;
        this.password = password;
        this.connected = false;
    }

    public String getLogin() {
        return login;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isConnected() {
        return this.connected;
    }

    public void authenticate(String password) throws AuthenticationException {
        if(!password.equals(this.password)) {
            throw new AuthenticationException("Erroneous password");
        }
        this.connected = true;
    }

    public void disconnect() {
        this.connected = false;
    }
}