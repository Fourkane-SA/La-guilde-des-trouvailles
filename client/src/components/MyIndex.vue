<template>
  <my-menu />
  <div class="container mx-auto">
    <h1 class="text-white">La Guilde des Trouvailles</h1>
    <br />
    <br />
    <p class="text-white" style="text-align: justify">
      Dans un passé plus ou moins lointain, d'anciens grands sages ont caché sur
      Terre des coffres au trésor. Ces coffres, de formes et couleurs
      similaires, ont été rendus invisibles pour éviter que des puissances
      cupides ne s'en emparent, car ils recèlent de nombreux trésors de toutes
      sortes...
      <br />
      De nos jours, les sociétés secrètes de chasseurs de trésor se multiplient
      et ratissent le moindre bâtiment, le moindre site de fouilles. La plus
      aguerrie de ces sociétés, la Guilde des Trouvailles (GT), a eu vent d'une
      quête prodigieuse et pourtant dangereuse qui se passe dans une forêt
      mystérieuse gardée par un dragon. La rumeur circule que des coffres d'un
      ancien temps contenant des pierres précieuses et magiques réapparaitraient
      dans la forêt avec une régularité étonnante et attendraient juste d'être
      trouvés par des âmes valeureuses.
      <br />
      Pour organiser les recherches, la GT a organisé la forêt en Zones de
      Recherche de Reliques (ZRR) afin que chacun de ses membres, les
      aventuriers, ait sa propre zone de recherche. Mais le dragon rôde… La GT
      fournit donc une potion de lune à chaque aventurier : une protection
      temporaire pour qu'ils puissent se balader comme bon leur semble dans la
      zone sans être repérés par le dragon. Cette potion n'est valable qu'un
      temps limité appelé « Temps de Tranquillité et de Liberté » (TTL). Passé
      ce temps, le dragon frappera tout aventurier qui n'a plus de protection,
      et celui-ci cessera définitivement de participer à la quête. Par chance,
      certains coffres renferment des potions de lune, permettant ainsi à un
      aventurier de recharger son TTL. Toutefois, cette recharge n'est que de
      courte durée et il faudra alors trouver un nouveau coffre de protection en
      un temps plus court que le précédent. Au final, les aventuriers passent
      donc la majorité de leur temps de tranquillité à traquer les apparitions
      de coffres et à se précipiter sur eux pour y collecter les précieux
      trésors.
      <br />
      La plupart des coffres contiennent des potions de lune, mais certains,
      plus rares, contiennent des potions de dissimulation, plus puissantes et
      capables de rendre un aventurier définitivement invisible aux yeux du
      dragon, sans avoir besoin de retrouver une potion de lune. D'autres
      contiennent une des pierres magiques tant recherchées. Mais attention,
      d'autres coffres contiennent des gaz mortels qui stoppent net la quête de
      l'aventurier.
      <br />
      La technologie actuelle permet facilement de détecter à distance les
      apparitions de coffres, mais elle ne permet pas de discerner leurs
      contenus. Les aventuriers qui ouvrent un coffre ne savent donc pas s’ils
      vont y trouver une potion de lune, une potion de dissimulation, un trésor
      ou du gaz mortel.
      <br />
      Tout aventurier qui quitte sa ZRR avant que le TTL soit écoulé ne
      participe plus à la quête, même s'il est sous la protection d'une potion
      de dissimulation.
      <br />
      Dans sa volonté d'équiper au mieux les aventuriers, la Guilde des
      Trouvailles a lancé un grand projet d’application Web mobile destiné à
      permettre à ses membres de trouver plus facilement les apparitions de
      coffres pendant les quêtes.
    </p>
  </div>
</template>

<script>
//import axios from "axios";
//import $ from "jquery";
//const axios = require("axios").default;
import MyMenu from "@/components/MyMenu.vue";
export default {
  components: { MyMenu },
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
