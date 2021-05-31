<template>
  <div id="songs">
    <h2>Utwory</h2>
    <div v-if="!playlistOn" id="song-list">
      <div class="track" v-for="(track, index) in tracks" :key="index">
        <div class="track-header" v-on:click="requestSong(index)">
          <h4>{{ track }}</h4>
        </div>
        <div class="add-to-playlist" v-on:click="playlistChange(index)">
          <h4><font-awesome-icon icon="plus-square" /></h4>
        </div>
      </div>
    </div>
    <div v-else id="song-list">
      <div class="track" v-for="(track, index) in playlistTracks" :key="index">
        <div class="track-header" v-on:click="requestSong(index)">
          <h4>{{ track }}</h4>
        </div>
        <div class="add-to-playlist" v-on:click="playlistRemove(index)">
          <h4><font-awesome-icon icon="minus-square" /></h4>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
module.exports = {
  data() {
    return {};
  },
  computed: {
    tracks() {
      return this.$store.getters.getAlbumSongNames;
    },
    playlistOn() {
      return this.$store.getters.getIfPlayingFromPlaylist;
    },
    playlistTracks() {
      return this.$store.getters.getPlaylistSongNames;
    },
  },
  methods: {
    requestSong: function (track) {
      this.$store.dispatch("setSong", track);
    },
    playlistChange: function (track) {
      this.$store.dispatch("addPlaylistContent", track);
    },
    playlistRemove: function (track) {
      this.$store.commit("REMOVE_FROM_PLAYLIST", track);
    },
  },
};
</script>
<style>
#songs {
  width: 60%;
  display: flex;
  flex-direction: column;
  background-color: #eeebdd;
  align-items: center;
}
#song-list {
  width: 100%;
  height: 90%;
  overflow-y: scroll;
}
#songs h2 {
  height: 10%;
}
.track {
  padding: 10px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.track-header {
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.track-header:hover {
  cursor: pointer;
  color: #eeebdd;
  background-color: #434343;
}
h5 font-awesome-icon {
  font-size: 2rem;
}
.add-to-playlist {
  width: 20%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.add-to-playlist:hover {
  cursor: pointer;
  color: #eeebdd;
  background-color: #434343;
}
@media only screen and (max-width: 800px) {
  #songs {
    width: 100%;
  }
}
</style>
