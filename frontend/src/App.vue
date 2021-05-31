<template>
  <div id="app">
    <header>
      <h1 v-if="!playlistOn">{{ currentAlbum }}</h1>
      <h1 v-else>Twoja playlista</h1>
    </header>
    <div id="content">
      <Panel />
      <Songs />
      <Albums />
    </div>
    <Controls />
  </div>
</template>

<script>
import Controls from "./components/Controls.vue";
import Panel from "./components/Panel.vue";
import Songs from "./components/Songs.vue";
import Albums from "./components/Albums.vue";

export default {
  name: "App",
  components: {
    Controls,
    Panel,
    Songs,
    Albums,
  },
  computed: {
    currentAlbum() {
      return this.$store.getters.getAlbum;
    },
    playlistOn() {
      return this.$store.getters.getIfPlayingFromPlaylist;
    },
    playlist() {
      return this.$store.getters.getPlayListContent;
    },
  },
  mounted() {
    this.$store.dispatch("getAlbums");
  },
  watch: {
    playlist() {
      fetch("http://localhost:3000/setPlaylist", {
        method: "post",
        body: JSON.stringify(this.$store.getters.getPlayListContent),
      })
        .then((res) => res.json())
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: "Roboto", sans-serif;
}
#app {
  display: flex;
  flex-direction: column;
}
header {
  height: 10vh;
  color: #eeebdd;
  background-color: #1b1717;
  display: flex;
  justify-content: center;
  align-items: center;
}
#content {
  height: 70vh;
  width: 100%;
  background-color: #312e2e;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
@media only screen and (max-width: 800px) {
  #content {
    height: 800px;
    flex-direction: column;
  }
}
@media only screen and (max-width: 550px) {
  header h1 {
    font-size: 1.5rem;
  }
}
@media only screen and (max-width: 550px) {
  header h1 {
    font-size: 1rem;
  }
}
@media only screen and (max-width: 285px) {
  #content {
    height: 1000px;
  }
}
</style>
