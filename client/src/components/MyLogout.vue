<template>
  <p></p>
</template>

<script>
export default {
  mounted() {
    localStorage.clear();
    clearInterval(global.sendDataID);
    clearInterval(global.drawZRRID);
    delete global.sendDataID;
    delete global.drawZRRID;
    window.location.replace("#/login");
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
