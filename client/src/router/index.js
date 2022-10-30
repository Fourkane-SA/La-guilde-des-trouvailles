import { createRouter, createWebHashHistory } from "vue-router";
import MyIndex from "@/components/MyIndex.vue";
import MyLogin from "@/components/MyLogin.vue";
import MyEdit from "@/components/MyProfile.vue";
import MyMap from "@/components/MyMap.vue";
import MyLogout from "@/components/MyLogout.vue";

const routes = [
  {
    path: "/",
    name: "Accueil",
    component: MyIndex,
  },
  {
    path: "/login",
    name: "connexion",
    component: MyLogin,
  },
  {
    path: "/profile",
    name: "Profil",
    component: MyEdit,
  },
  {
    path: "/game",
    name: "jeu",
    component: MyMap,
  },
  {
    path: "/logout",
    name: "deco",
    component: MyLogout,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
