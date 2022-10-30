<template>
  <nav class="border-gray-200 px-2 sm:px-4 py-2.5 rounded bg-gray-800">
    <router-link class="text-base font-medium leading-none text-white" to="/"
      >Accueil |
    </router-link>

    <router-link
      class="text-base font-medium leading-none text-white"
      to="/game"
      v-if="isLogout == false"
      >Jeu |
    </router-link>

    <router-link
      class="text-base font-medium leading-none text-white"
      to="/profile"
      v-if="isLogout == false"
      >Profil |
    </router-link>

    <router-link
      class="text-base font-medium leading-none text-white"
      to="/login"
      v-if="isLogout"
      >Connexion</router-link
    >
    <router-link
      class="text-base font-medium leading-none text-white"
      to="/logout"
      v-if="isLogout == false"
      >Deconnexion</router-link
    >
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isLogout: localStorage.getItem("token") == null, // Vrai si l'utilisateur n'est pas connecté. Permet un affichage différent du menu lorsqu'il est connecté
    };
  },
};
</script>
