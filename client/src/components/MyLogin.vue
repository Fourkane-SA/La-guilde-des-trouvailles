<template>
  <my-menu />
  <div
    id="loginForm"
    class="shadow-md rounded pt-6 pb-8 mb-4 container mx-auto"
  >
    <div class="mb-6">
      <label class="block text-white text-sm font-bold mb-2" for="username">
        Nom d'utilisateur
      </label>
      <input type="text" name="login" id="login" class="rounded" />
    </div>
    <div class="mb-6">
      <label class="block text-white text-sm font-bold mb-2" for="password">
        Mot de passe
      </label>
      <input type="password" name="password" id="password" class="rounded" />
    </div>
    <div class="mb-6">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        v-on:click="login"
      >
        Se connecter
      </button>
    </div>
  </div>
  <div class="container mx-auto px-80" id="error">
    <div
      class="container mx-auto px-80 bg-red-100 border border-red-400 text-red-700 py-3"
      role="alert"
    >
      <span class="block sm:inline" id="messError"></span>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import $ from "jquery";
import MyMenu from "@/components/MyMenu.vue";
export default {
  name: "MyLogin",
  components: { MyMenu },
  data() {
    return {
      error: false,
    };
  },
  methods: {
    login: () => {
      // Permet de vérifier la connexion
      axios
        .post(
          // Requête post permettant de récupérer le token avec les valeurs du formulaire
          "https://192.168.75.46:8443/users/login?" +
            "login=" +
            $("#login").val() +
            "&password=" +
            $("#password").val() +
            "&Origin=" +
            window.location.origin
        )
        .then((response) => {
          // Si la requête a réussie
          localStorage.setItem("token", response.headers.authentication); // On enregistre le token
          localStorage.setItem("login", $("#login").val()); // On enregistre le login
          axios
            .get("https://192.168.75.46/game/api/resources", {
              // On fait une requête permettant de récupérer la resources du joueur
              headers: {
                Authorization: response.headers.authentication,
              },
            })
            .then(function (response) {
              // Si la requête a réussie
              localStorage.setItem(
                "player",
                JSON.stringify(
                  Array.isArray(response.data.resources)
                    ? response.data.resources.find(
                        (res) => res.id == localStorage.getItem("login") // On enregistre la resource de l'utilisateur qui s'est connecté
                      )
                    : response.data
                )
              );
              window.location.replace("#/game"); // Redirige à la page du jeu
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          // Si la connexion a échouée
          if (error.response.status == 404) {
            // Si c'est une erreur 404
            $("#error").show(); //  on affiche un message d'erreur
            $("#messError").html("L'utilisateur n'existe pas."); // pour signaler que l'utilisateur n'existe pasa
          } else if (error.response.status == 401) {
            // Si c'est une erreur 401
            $("#error").show(); // on affiche un message d'erreur
            $("#messError").html("Le mot de passe est incorrect."); // pour signaler que le mot de passe est incorrect
          }
        });
    },
  },
  mounted() {
    // Au chargement de la page
    $("#error").hide(); // Il n'y a aucun message d'erreur affiché
  },
};
</script>

<style scoped>
input,
input[type="submit"],
select {
  background-color: #2f4f4f !important;
  color: lightgray;
  border: 1px solid;
}
</style>
