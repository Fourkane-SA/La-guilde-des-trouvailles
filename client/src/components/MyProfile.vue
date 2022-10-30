<template>
  <my-menu />
  <div class="container mx-auto rounded cont text-black">
    <h1>Votre profil</h1>
    <br />
    <p>login : {{ login }}</p>
    <img
      style="
        width: 200px;
        display: block;
        margin-left: auto;
        margin-right: auto;
      "
      id="picture"
    />
    <div class="mb-6">
      url : <input type="text" name="url" id="url" class="rounded" />
    </div>
    <button
      class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
      v-on:click="updatePicture()"
    >
      Mettre à jour la photo
    </button>
    <br />
    ttl : {{ ttl }}
    <br />
    position : {{ position }}
  </div>
</template>

<script>
import MyMenu from "@/components/MyMenu.vue";
import $ from "jquery";
import axios from "axios";
export default {
  components: { MyMenu },
  data() {
    return {
      login: "",
      ttl: 0,
      position: [],
    };
  },
  methods: {
    updatePicture() {
      // Permet la mise à jour de la photo de profil d'un utilisateur
      axios
        .put(
          // Appel de la requête de l'API permettant la modification de l'utilisateur
          "https://192.168.75.46/game/api/resources/" + this.login + "/image",
          {
            url: $("#url").val(),
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then(function () {
          // Si la requête a réussi, donc la photo a été mise à jour
          axios
            .get("https://192.168.75.46/game/api/resources", {
              // Requête get afin de récupérer la resource  de l'utilisateur mise à jour
              headers: {
                Authorization: localStorage.getItem("token"),
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
              ); // On remplace l'ancienne resource avec la nouvelle resource et l'url mise à jour
              $("#picture").attr("src", $("#url").val()); // Mise à jour de l'image de profil dans la page
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  mounted() {
    // Initialisation des variables avec les valeurs du json enregistré
    let json = JSON.parse(localStorage.getItem("player"));
    this.login = json.id;
    this.ttl = json.ttl;
    this.position = json.position;
    $("#picture").attr("src", json.url);
    $("#url").attr("value", json.url);
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
.cont {
  margin-top: 50px;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
