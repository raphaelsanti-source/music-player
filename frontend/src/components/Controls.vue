<template>
  <div id="controls">
    <div id="name-cover">
      <img id="cover-image" :src="currentSongCover" />
      <h4>{{ currentSongName }}</h4>
    </div>
    <div id="buttons">
      <div>
        <button v-on:click="prev">
          <font-awesome-icon icon="step-backward" />
        </button>
        <button id="play" v-on:click="play">
          <font-awesome-icon icon="pause" v-if="playing" />
          <font-awesome-icon icon="play" v-else />
        </button>
        <button v-on:click="next">
          <font-awesome-icon icon="step-forward" />
        </button>
      </div>
      <audio id="audio">
        <source
          :src="currentSongLink"
          id="audio_src"
          type="audio/mp3"
          preload="metadata"
        />
      </audio>
      <div id="progress">
        <span>{{ formatedTimestamp }}</span>
        <input
          type="range"
          min="0"
          step="1"
          v-model="currentSongTimestamp"
          :max="currentSongDuration"
          @input="changeTimeStamp"
        />
        <span>{{ formatedDuration }}</span>
      </div>
    </div>
    <div id="volume-control">
      <font-awesome-icon icon="volume-up" />
      <input
        type="range"
        id="volume-slider"
        min="0"
        max="100"
        step="1"
        v-model="volume"
      />
    </div>
  </div>
</template>
<script>
module.exports = {
  data() {
    return {
      volume: 100,
      currentSongTimestamp: 0,
      audio: null,
      formatedTimestamp: "0:00",
    };
  },
  mounted() {
    document.getElementById("audio").onloadeddata = this.loaded;
    document.getElementById("audio").onended = this.ended;
    this.audio = document.getElementById("audio");
  },
  computed: {
    currentSongCover() {
      return this.$store.getters.getCurrentSongCover;
    },
    currentSong() {
      return this.$store.getters.getCurrentSong;
    },
    currentSongNames() {
      return this.$store.getters.getCurrentSongsNames;
    },
    currentSongLinks() {
      return this.$store.getters.getCurrentSongsLinks;
    },
    currentSongLink() {
      return this.currentSongLinks[this.currentSong];
    },
    currentSongName() {
      return this.currentSongNames[this.currentSong];
    },
    playing() {
      return this.$store.getters.getIfPlaying;
    },
    currentSongDuration() {
      return this.$store.getters.getCurrentSongDuration;
    },
    formatedDuration() {
      let minutes = parseInt(this.$store.getters.getCurrentSongDuration / 60);
      let seconds = parseInt(this.$store.getters.getCurrentSongDuration % 60);
      if (seconds == 0) {
        seconds = "00";
      } else if (seconds < 10) {
        return minutes + ":0" + seconds;
      } else {
        return minutes + ":" + seconds;
      }
    },
  },
  methods: {
    play: function () {
      if (this.currentSongName !== undefined) {
        if (!this.playing) {
          document.getElementById("audio").play();
        } else {
          document.getElementById("audio").pause();
        }
        this.$store.commit("SET_IF_PLAYING");
      }
    },
    prev: function () {
      this.$store.commit("SET_CURRENT_SONG_PREV");
    },
    next: function () {
      this.$store.commit("SET_CURRENT_SONG_NEXT");
    },
    loaded: function () {
      let time = parseInt(document.getElementById("audio").duration);
      this.$store.commit("SET_SONG_DURATION", time);
    },
    ended: function () {
      this.$store.commit("SET_CURRENT_SONG_NEXT");
    },
    changeTimeStamp: function (e) {
      this.audio.currentTime = parseInt(e.target.value);
      this.currentSongTimestamp = parseInt(e.target.value);
    },
  },
  watch: {
    currentSongLink() {
      this.formatedDuration = "0:00";
      document.getElementById("audio").load();
      document.getElementById("audio").play();
      this.$store.commit("SET_PLAYING");
    },
    volume() {
      document.getElementById("audio").volume = this.volume / 100;
    },
    playing() {
      if (this.playing) {
        document.getElementById("cover-image").style.animationDuration = "6s";
      } else {
        document.getElementById("cover-image").style.animationDuration = "0s";
      }
    },
    audio() {
      this.audio.ontimeupdate = (e) => {
        this.currentSongTimestamp = parseInt(e.target.currentTime);
      };
    },
    currentSongTimestamp() {
      let minutes = parseInt(this.currentSongTimestamp / 60);
      let seconds = parseInt(this.currentSongTimestamp % 60);
      if (seconds == 0) {
        seconds = "00";
      } else if (seconds < 10) {
        this.formatedTimestamp = minutes + ":0" + seconds;
      } else {
        this.formatedTimestamp = minutes + ":" + seconds;
      }
    },
  },
};
</script>
<style>
#cover-image {
  animation-name: rotation;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
@-webkit-keyframes rotation {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
  }
}
#controls {
  height: 20vh;
  color: #eeebdd;
  display: flex;
  flex-direction: row;
  background-color: #1b1717;
  justify-content: space-between;
}
#buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
#buttons button {
  outline: none;
  border: none;
  color: #eeebdd;
  background-color: #ce1212;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  margin: 5px;
}
#buttons button:hover {
  background-color: #810000;
  cursor: pointer;
}
#buttons button:active {
  border: 2px solid #eeebdd;
}
#name-cover img {
  border-radius: 50%;
  height: 100px;
  width: 100px;
}
@media only screen and (max-width: 750px) {
  #controls {
    padding: 20px;
    height: 400px;
    flex-direction: column;
    align-items: center;
  }
  #buttons {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  #buttons > div {
    margin-bottom: 10px;
  }
  #name-cover img {
    height: 200px;
    width: 200px;
  }
}
#name-cover {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
}

#volume-control {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
}
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  input[type="range"] {
    outline: none;
    overflow: hidden;
    width: 80px;
    -webkit-appearance: none;
    background-color: #810000;
  }

  input[type="range"]::-webkit-slider-runnable-track {
    height: 10px;
    -webkit-appearance: none;
    color: #13bba4;
    margin-top: -1px;
  }

  input[type="range"]::-webkit-slider-thumb {
    width: 10px;
    -webkit-appearance: none;
    height: 10px;
    cursor: ew-resize;
    background: #434343;
    box-shadow: -80px 0 0 80px #ce1212;
  }
}
#progress {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 400px;
  font-size: 0.7rem;
}
#progress > input[type="range"] {
  width: 300px;
}
#progress > input[type="range"]::-webkit-slider-thumb {
  width: 10px;
  -webkit-appearance: none;
  height: 10px;
  cursor: ew-resize;
  background: #434343;
  box-shadow: -300px 0 0 300px #ce1212;
}
@media only screen and (max-width: 450px) {
  #progress {
    width: 200px;
  }
  #progress > input[type="range"] {
    width: 100px;
  }
  #progress > input[type="range"]::-webkit-slider-thumb {
    box-shadow: -100px 0 0 100px #ce1212;
  }
}
</style>