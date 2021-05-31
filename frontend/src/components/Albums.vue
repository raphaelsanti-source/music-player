<template>
  <div id="albums">
    <img
      class="img-cover"
      v-for="(cover, index) in covers"
      :key="index"
      :src="cover"
      v-on:click="requestAlbum(albums[index])"
    />
  </div>
</template>
<script>
module.exports = {
  data() {
    return {};
  },
  computed: {
    covers() {
      return this.$store.getters.getAlbumsCovers;
    },
    albums() {
      return this.$store.getters.getAlbums;
    },
    playlistOn() {
      return this.$store.getters.getIfPlayingFromPlaylist;
    },
  },
  methods: {
    requestAlbum: function (album) {
      if (this.playlistOn) {
        this.$store.commit("SWITCH_PLAYLIST");
      }
      this.$store.dispatch("getAlbum", album);
    },
  },
};
</script>
<style>
#albums {
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.img-cover {
  width: 200px;
  height: 200px;
  transition: transform 0.2s;
  cursor: pointer;
}
.img-cover:hover {
  -ms-transform: scale(1.5);
  -webkit-transform: scale(1.5);
  transform: scale(1.5);
}
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
@media only screen and (max-width: 800px) {
  #albums {
    height: 400px;
    width: 100%;
    flex-direction: row;
    overflow-x: scroll;
    overflow-y: hidden;
  }
}
</style>