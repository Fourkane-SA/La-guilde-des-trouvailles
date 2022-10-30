<template>
  <my-menu />
  <section>
    <p class="content"></p>
    <div class="flex-row">
      <p class="text-white">TTL : <strong id="ttl"> ... </strong></p>
      <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          id="progressBarTtl"
          class="bg-blue-600 h-2.5 rounded-full"
          style="width: 5%"
        ></div>
      </div>
      <p class="text-white">
        distance du coffre le plus proche :
        <strong id="PlayerToChest"> ...</strong>
      </p>
      <div id="map" class="map" style="border: 8px solid; z-index: 0"></div>
    </div>

    <div class="flex md:items-center place-content-center">
      <div
        id="small-modal"
        tabindex="-1"
        class="verflow-y-auto overflow-x-hidden fixed top-0 right-0 z-50 w-full md:inset-0 h-modal md:h-full"
        style="margin-left: 40%; margin-top: 10%; text-align: center"
      >
        <div class="relative p-4 w-full max-w-md h-full md:h-auto">
          <!-- Modal content -->
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <div
              class="flex justify-between items-center p-5 rounded-t border-b dark:border-gray-600"
            >
              <h3
                id="title-modal"
                class="text-xl font-medium text-gray-900 dark:text-white"
              >
                Règles du jeu
              </h3>
            </div>
            <!-- Modal body -->
            <div class="p-6 space-y-6">
              <p
                id="text-modal"
                class="text-base leading-relaxed text-gray-500 dark:text-gray-400"
              >
                Certains coffres se trouvent dans le batiment Nautibus. Vous
                avez un temps limité pour trouvez le plus de coffre possible.
              </p>
            </div>
            <!-- Modal footer -->
            <div
              class="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600"
            >
              <button
                id="modal-close"
                v-on:click="closeModal"
                data-modal-toggle="small-modal"
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Commencer la partie
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import "leaflet/dist/leaflet.css";
import "../store/index.js";
// This part resolves an issue where the markers would not appear in webpack
import { Icon } from "leaflet";
import MyMenu from "./MyMenu.vue";
import axios from "axios";
import $ from "jquery";
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// initialisation de la map
let lat = 45.782,
  lng = 4.8656,
  zoom = 19;
let mymap = {};

export default {
  components: { MyMenu },
  data() {
    return {
      position: [],
      markerUser: "",
      status: "beforeStart",
      idCoffreProche: 0,
      coffresTotal: 0,
    };
  },
  name: "MyMap",
  methods: {
    // Procédure de mise à jour de la map
    updateMap: function () {
      // Affichage à la nouvelle position
      mymap.setView([lat, lng], zoom);
    },
    drawZRR: async function () {
      const L = await import("leaflet");
      this.$store.dispatch("defineZrr");
      var zrr = await this.$store.getters.getZrr;
      if (zrr[0].length + zrr[1].length == 4) {
        // create a black rectangle
        L.rectangle(zrr, { color: "#000000", weight: 1 }).addTo(mymap);

        // zoom the map to the rectangle bounds
        mymap.fitBounds(zrr);
      }
    },
    addChest() {
      axios.put(
        "https://192.168.75.46/game/api/resources/" +
          JSON.parse(localStorage.player).id +
          "/chest",
        {
          idChest: this.idCoffreProche,
        },
        {
          // On fait une requête permettant de récupérer la resources du joueur
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
    },
    async getData() {
      this.$store.dispatch("defineTtl");
      var ttlInit = await this.$store.getters.getTtl;

      axios
        .get("https://192.168.75.46/game/api/resources", {
          // On fait une requête permettant de récupérer la resources du joueur
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
          );

          $("#ttl").html(
            JSON.parse(localStorage.getItem("player")).ttl + "/" + ttlInit
          );
          let percent =
            (JSON.parse(localStorage.getItem("player")).ttl / ttlInit) * 100;
          $("#progressBarTtl").css("width", percent + "%");
        })
        .catch(function (error) {
          console.log(error);
        });
      if (
        $("#PlayerToChest").text().replace(" m", "") <= 20 &&
        this.status == "start"
      ) {
        // Si un coffre se trouve à moins de 2 metres
        this.addChest(); // On lui ajoute le coffre le plus proche
        this.printChest();
        if (
          //navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/webOS/i) ||
          navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/iPod/i) ||
          navigator.userAgent.match(/BlackBerry/i) ||
          navigator.userAgent.match(/Windows Phone/i)
        ) {
          window.navigator.vibrate(200);
        }
        if (
          this.coffresTotal == JSON.parse(localStorage.player).treasures.length
        ) {
          $("#title-modal").text("Vous avez gagné");
          $("#text-modal").text(
            "Félicitation ! Vous avez trouvé tous les coffres."
          );
          $("#modal-close").text("Recommencer.");
          this.status = "end";
          $("#small-modal").show();
          this.stopParty();
        } else {
          $("#title-modal").text("Nouveau coffre");
          $("#text-modal").text("Félicitation ! Vous avez trouvé un coffre");
          $("#modal-close").text("Fermer.");
          $("#small-modal").show();
        }
      } else if (
        JSON.parse(localStorage.getItem("player")).ttl == 0 &&
        this.status == "start"
      ) {
        // Si le ttl est vide, donc la partie est terminée

        this.status = "end";
        this.stopParty();
        $("#title-modal").text("Fin de partie");
        $("#text-modal").text(
          "La partie est terminée. Vous avez trouvé " +
            JSON.parse(localStorage.player).treasures.length +
            " coffres."
        );
        $("#modal-close").text("Recommencer.");
        $("#small-modal").show();
        if (
          //navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/webOS/i) ||
          navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/iPod/i) ||
          navigator.userAgent.match(/BlackBerry/i) ||
          navigator.userAgent.match(/Windows Phone/i)
        ) {
          window.navigator.vibrate(200);
        }
      }
    },
    sendData() {
      console.log("sendData");
      axios
        .put(
          "https://192.168.75.46/game/api/resources/" +
            JSON.parse(localStorage.getItem("player")).id,
          this.position,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .catch(function (error) {
          console.log(error);
        });
    },
    closeModal() {
      $("#small-modal").hide();
      if (this.status != "start") {
        this.startParty();
      }
    },
    printPlayer(L) {
      mymap.removeLayer(this.markerUser);
      let player = JSON.parse(localStorage.getItem("player"));
      // Ajout d'un marker
      var iconUser = L.icon({
        iconUrl: player.url,
        iconSize: [32, 37],
        iconAnchor: [16, 37],
        popupAnchor: [0, -28],
      });

      this.markerUser = L.marker(this.position)
        .setIcon(iconUser)
        .addTo(mymap)
        .bindPopup(player.id)
        .openPopup();
      lat = this.position[0];
      lng = this.position[1];
      this.updateMap();
    },
    printChest: async function () {
      console.log("printChest");
      const L = await import("leaflet");
      this.$store.dispatch("chest");
      var chests = await this.$store.getters.getChest;
      var pos = await this.$store.getters.getPosition;
      this.position = pos;
      this.printPlayer(L);
      this.coffresTotal = chests.length;
      var distanceToPlayer = Number.MAX_SAFE_INTEGER;
      console.log("chests ", chests);
      chests.forEach((obj) => {
        console.log(Array.from(JSON.parse(localStorage.player).treasures));
        if (
          Array.from(JSON.parse(localStorage.player).treasures).includes(
            obj.idChest
          ) &&
          this.status == "start"
        ) {
          console.log(this.status);
          console.log("recupere ", obj.idChest);
          var iconChest = L.icon({
            iconUrl: obj.url,
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -28],
          });
          L.marker(obj.position)
            .setIcon(iconChest)
            .addTo(mymap)
            .bindPopup(obj.id);
        } else {
          console.log("pas recuperé ", obj.idChest);
          let latlngChest = new L.latLng(obj.position);
          if (latlngChest.distanceTo(pos) < distanceToPlayer) {
            distanceToPlayer = latlngChest.distanceTo(pos);
            this.idCoffreProche = obj.idChest;
          }
        }
      });
      if (distanceToPlayer == Number.MAX_SAFE_INTEGER) {
        distanceToPlayer = 0;
      }
      $("#PlayerToChest").text(Math.floor(distanceToPlayer) + " m");
    },
    stopParty() {
      axios
        .post(
          "https://192.168.75.46/game/api/resources/" +
            JSON.parse(localStorage.getItem("player")).id +
            "/stop",
          null,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .catch(function (error) {
          console.log(error);
        });
    },
    startParty() {
      this.status = "start";
      axios
        .post(
          "https://192.168.75.46/game/api/resources/" +
            JSON.parse(localStorage.getItem("player")).id +
            "/start",
          null,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  async beforeMount() {
    this.stopParty();
    let player = JSON.parse(localStorage.getItem("player"));
    // HERE is where to load Leaflet components!
    const L = await import("leaflet");
    this.getData();
    // Procédure d'initialisation
    mymap = L.map("map", {
      center: [lat, lng],
      zoom: zoom,
    });

    const successCallBack = () => {
      this.$store.dispatch("playerPosition");
      this.sendData();
      this.printChest();
    };

    const errorCallBack = (error) => {
      console.error(error);
    };

    navigator.geolocation.watchPosition(successCallBack, errorCallBack, {
      timeout: 60_000,
    });

    this.drawZRR(L);
    this.printChest();
    // Création d'un "tile layer" (permet l'affichage sur la carte)
    L.tileLayer(
      "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=pk.eyJ1IjoieGFkZXMxMDExNCIsImEiOiJja2d3NjJ4c28wNzQ1MnlyMTM1cjEwb2NxIn0.DvtwpmO4QPeZNY6h1rqRVw",
      {
        maxZoom: 22,
        minZoom: 1,
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          "pk.eyJ1IjoibTFpZjEzIiwiYSI6ImNqczBubmhyajFnMnY0YWx4c2FwMmRtbm4ifQ.O6W7HeTW3UvOVgjCiPrdsA",
      }
    ).addTo(mymap);

    this.$store.dispatch("playerPosition");
    var pos = await this.$store.getters.getPosition;

    // Ajout d'un marker
    var iconUser = L.icon({
      iconUrl: player.url,
      iconSize: [32, 37],
      iconAnchor: [16, 37],
      popupAnchor: [0, -28],
    });
    this.markerUser = L.marker(pos)
      .setIcon(iconUser)
      .addTo(mymap)
      .bindPopup(player.id)
      .openPopup();

    if (global.sendDataID == undefined) {
      global.sendDataID = setInterval(this.getData, 1000);
    }
  },
};
</script>

<style scoped>
.map {
  height: 600px;
  width: 100%;
  border: 1px solid;
}
</style>
