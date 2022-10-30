import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
  state: {
    zrr: [
      [0, 0],
      [0, 0],
    ],
    playerPosition: [0, 0],
    id: "",
    urlIcon: "",
    ttl: 0,
    chestInfo: "",
    chestPosition: [],
    chestVisibles: [],
  },
  mutations: {
    //créer la ZRR
    defineZrr2(state, zrr) {
      state.zrr = zrr;
    },

    //mettre à jour l'identifiant et l'icone du joueur
    updatePlayer2(state, id, url) {
      state.id = id;
      state.urlIcon = url;
    },

    //créer et mettre à jour la position du joueur
    playerPosition2(state, pos) {
      state.playerPosition = pos;
    },

    //créer et modifier le TTL donné par le serveur
    ttl2(state, ttl) {
      state.ttl = ttl;
    },

    //créer des coffres et stocker leurs positions
    chest2(state, pos) {
      state.chestPosition = pos;
    },

    //mettre à jour les états des coffres (visité, type de contenu)
    chestState2(state, statement) {
      state.chestState = statement;
    },
    chestVisible2(state, pos) {
      state.chestVisibles = pos;
    },
  },
  actions: {
    defineZrr() {
      var pos1And2 = axios
        .get("https://192.168.75.46/game/admin/") // Recupére le status
        .then(function (response) {
          return [response.data.pos1, response.data.pos2];
        });
      store.commit("defineZrr2", pos1And2);
    },
    updatePlayer() {
      store.commit(
        "updatePlayer2",
        JSON.parse(localStorage.player).id,
        JSON.parse(localStorage.player).url
      );
    },

    //créer et mettre à jour la position du joueur
    playerPosition() {
      var successCallBack = (pos) => {
        console.log(pos);
        var position = [pos.coords.latitude, pos.coords.longitude];
        store.commit("playerPosition2", position);
      };

      var errorCallBack = (error) => {
        alert("Vous n'avez pas autorisé la localisation");
        console.error(error);
      };

      navigator.geolocation.getCurrentPosition(successCallBack, errorCallBack);
    },

    //créer et modifier le TTL donné par le serveur
    defineTtl() {
      var ttl = axios
        .get("https://192.168.75.46/game/admin/") // Recupére le status
        .then(function (response) {
          // console.log([response.data.pos1, response.data.pos2]);
          return response.data.ttl;
        });
      store.commit("ttl2", ttl);
    },

    //créer des coffres et stocker leurs positions
    chest() {
      var chest = axios
        .get("https://192.168.75.46/game/api/resources/chest")
        .then(function (response) {
          return response.data;
        });
      store.commit("chest2", chest);
    },
    chestVisible() {
      var login = JSON.parse(localStorage.player).id;
      var chest = axios
        .get("https://192.168.75.46/game/api/resources/" + login + "chest")
        .then(function (response) {
          return response.data;
        });
      store.commit("chestVisible2", chest);
    },
  },
  getters: {
    getZrr(state) {
      return state.zrr;
    },
    getTtl(state) {
      return state.ttl;
    },
    getChest(state) {
      return state.chestPosition;
    },
    getPosition(state) {
      return state.playerPosition;
    },
    getChestVisible(state) {
      return state.chestVisibles;
    },
  },
});

export default store;
