<template>
  <div id="panel">
    <div id="profile">
      <h2>d-_-b</h2>
      <img id="avatar" src="../assets/logo.png" />
      <h3 id="data"></h3>
    </div>
    <div id="playlist">
      <h3>Twoja playlista:</h3>
      <div
        id="playlist-button"
        v-on:click="requestPlaylist"
        @mouseover="hover = true"
        @mouseleave="hover = false"
      >
        <div v-show="hover">
          <font-awesome-icon icon="play" id="playlist-icon" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
module.exports = {
  data() {
    return {
      interval: setInterval(this.clockupdate, 1000),
      hover: false,
    };
  },
  methods: {
    clockupdate: () => {
      let clock = new Date();
      let minuted =
        clock.getMinutes() < 10 ? "0" + clock.getMinutes() : clock.getMinutes();
      document.getElementById("data").innerHTML =
        clock.getHours() + ":" + minuted;
    },
    requestPlaylist: function () {
      this.$store.commit("SWITCH_PLAYLIST");
    },
  },
};
</script>
<style>
#panel {
  width: 300px;
  color: #eeebdd;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
}
#panel img {
  margin: 10px;
}
#avatar {
  height: 100px;
  width: 100px;
}
#profile {
  flex-direction: column;
  align-items: center;
}
#profile h2 {
  text-align: center;
}
#profile h3 {
  text-align: center;
}
#playlist {
  flex-direction: column;
  align-items: center;
}
@media only screen and (max-width: 800px) {
  #panel {
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
  }
}
#playlist-button {
  height: 100px;
  width: 100px;
  background-image: url("../assets/playlistcover.png");
  background-repeat: no-repeat;
  background-size: contain;
}
#playlist-button div {
  background-color: black;
  opacity: 0.5;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
</style>