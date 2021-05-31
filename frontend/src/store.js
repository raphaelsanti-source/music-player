import Vuex from 'vuex';
import Vue from 'vue';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        playing: false,
        currentSong: 0,
        currentSongDuration: 0,
        currentSongCover: 'http://localhost:3000/default/cover.png',
        currentSongsNames: [],
        currentSongsLinks: [],
        albumSongNames: [],
        album: '',
        albums: [],
        albumsCovers: [],
        playingFromPlaylist: false,
        playlistSongNames: [],
        playlistSongLinks: [],
        playlist: [],
    },
    actions: {
        getAlbums({ commit }) {
            axios.post("http://localhost:3000/first").then((resp) => {
                let linkTab = [];
                for (let i = 0; i < resp.data.length; i++) {
                    linkTab[i] = "http://localhost:3000/" + resp.data[i] + "/cover.png";
                }
                commit('SET_ALBUMS', resp.data);
                commit('SET_ALBUMS_COVERS', linkTab)
                axios.post("http://localhost:3000/" + resp.data[0]).then((resp2) => {
                    for (let i = resp2.data.length - 1; i >= 0; i--) {
                        if (resp2.data[i].slice(-4) == ".png" || resp2.data[i].slice(-4) == ".jpg") {
                            resp2.data.splice(i, 1)
                        }
                    }
                    commit('SET_ALBUM_SONGS', resp2.data);
                });
            });
            axios.post("http://localhost:3000/getPlaylist").then((resp) => {
                commit('SET_PLAYLIST', resp.data)
                let nameTab = [];
                let linkTab = [];
                for (let i = 0; i < resp.data.length; i++) {
                    nameTab[i] = resp.data[i].song;
                    linkTab[i] = "http://localhost:3000/" + resp.data[i].album + "/" + resp.data[i].song
                }
                commit('SET_PLAYLIST_NAMES', nameTab)
                commit('SET_PLAYLIST_LINKS', linkTab)
            })
        },
        getAlbum({ commit }, album) {
            axios.post("http://localhost:3000/" + album).then((resp) => {
                for (let i = resp.data.length - 1; i >= 0; i--) {
                    if (resp.data[i].slice(-4) == ".png" || resp.data[i].slice(-4) == ".jpg") {
                        resp.data.splice(i, 1)
                    }
                }
                commit('SET_ALBUM', album);
                commit('SET_ALBUM_SONGS', resp.data);
            })
        },
        setSong({ commit }, track) {
            if (!this.getters.getIfPlayingFromPlaylist) {
                let playlist = this.getters.getAlbumSongNames;
                let albm = this.getters.getAlbum;
                let cover = "http://localhost:3000/" + albm + "/cover.png";
                let linkTab = [];
                for (let i = 0; i < playlist.length; i++) {
                    linkTab[i] = "http://localhost:3000/" + albm + "/" + playlist[i]
                }
                commit('SET_CURRENT_SONG_COVER', cover);
                commit('SET_CURRENT_SONGS_LINKS', linkTab);
                commit('SET_CURRENT_SONGS', playlist);
                commit('SET_CURRENT_SONG', track);
            } else {
                commit('SET_CURRENT_SONG_COVER', 'http://localhost:3000/default/cover.png');
                commit('SET_CURRENT_SONGS_LINKS', this.getters.getPlaylistSongLinks);
                commit('SET_CURRENT_SONGS', this.getters.getPlaylistSongNames);
                commit('SET_CURRENT_SONG', track);
            }
        },
        getAudioLength({ commit }) {
            let duration = document.getElementById("audio").duration;
            commit('SET_SONG_DURATION', duration);
        },
        addPlaylistContent({ commit }, track) {
            let song = this.getters.getAlbumSongNames[track];
            let album = this.getters.getAlbum;
            if (this.getters.getPlayListContent.length == 0) {
                commit('ADD_TO_PLAYLIST', { song: song, album: album });
            } else {
                let alreadyIn = false
                for (let i = 0; i < this.getters.getPlayListContent.length; i++) {
                    if (this.getters.getPlayListContent[i].song == song) {
                        alreadyIn = true
                    }
                }
                if (!alreadyIn) {
                    commit('ADD_TO_PLAYLIST', { song: song, album: album });
                }
            }
            let nameTab = [];
            let linkTab = [];
            for (let i = 0; i < this.getters.getPlayListContent.length; i++) {
                nameTab[i] = this.getters.getPlayListContent[i].song;
                linkTab[i] = "http://localhost:3000/" + this.getters.getPlayListContent[i].album + "/" + this.getters.getPlayListContent[i].song
            }
            commit('SET_PLAYLIST_NAMES', nameTab)
            commit('SET_PLAYLIST_LINKS', linkTab)
        },
    },
    mutations: {
        SET_ALBUMS(state, albums) {
            state.albums = albums;
            state.album = albums[0];
        },
        SET_ALBUM(state, album) {
            state.album = album;
        },
        SET_ALBUM_SONGS(state, songs) {
            state.albumSongNames = songs;
        },
        SET_ALBUMS_COVERS(state, links) {
            state.albumsCovers = links;
        },
        SET_CURRENT_SONGS(state, names) {
            state.currentSongsNames = names;
        },
        SET_CURRENT_SONG(state, index) {
            state.currentSong = index;
        },
        SET_CURRENT_SONGS_LINKS(state, links) {
            state.currentSongsLinks = links;
        },
        SET_IF_PLAYING(state) {
            state.playing = !state.playing;
        },
        SET_PLAYING(state) {
            state.playing = true;
        },
        SET_NOT_PLAYING(state) {
            state.playing = false;
        },
        SET_CURRENT_SONG_NEXT(state) {
            if (state.currentSong == state.currentSongsNames.length - 1) {
                state.currentSong = 0;
            } else {
                state.currentSong++;
            }
        },
        SET_CURRENT_SONG_PREV(state) {
            if (state.currentSong == 0) {
                state.currentSong = state.currentSongsNames.length - 1;
            } else {
                state.currentSong--;
            }
        },
        SET_CURRENT_SONG_COVER(state, cover) {
            state.currentSongCover = cover;
        },
        SET_SONG_DURATION(state, time) {
            state.currentSongDuration = time;
        },
        ADD_TO_PLAYLIST(state, track) {
            state.playlist.push(track)
        },
        REMOVE_FROM_PLAYLIST(state, track) {
            state.playlistSongLinks.splice(track, 1)
            state.playlistSongNames.splice(track, 1)
            state.playlist.splice(track, 1)
        },
        SET_PLAYLIST_NAMES(state, names) {
            state.playlistSongNames = names;
        },
        SET_PLAYLIST_LINKS(state, links) {
            state.playlistSongLinks = links;
        },
        SWITCH_PLAYLIST(state) {
            state.playingFromPlaylist = !state.playingFromPlaylist;
        },
        SET_PLAYLIST(state, playlist) {
            state.playlist = playlist
        },
    },
    getters: {
        getAlbum: (state) => {
            return state.album;
        },
        getAlbums: (state) => {
            return state.albums;
        },
        getAlbumsCovers: (state) => {
            return state.albumsCovers;
        },
        getAlbumSongNames: (state) => {
            return state.albumSongNames;
        },
        getCurrentSongsNames: (state) => {
            return state.currentSongsNames;
        },
        getCurrentSongsLinks: (state) => {
            return state.currentSongsLinks;
        },
        getCurrentSong: (state) => {
            return state.currentSong;
        },
        getCurrentSongCover: (state) => {
            return state.currentSongCover;
        },
        getIfPlaying: (state) => {
            return state.playing;
        },
        getCurrentSongDuration: (state) => {
            return state.currentSongDuration;
        },
        getPlayListContent: (state) => {
            return state.playlist;
        },
        getIfPlayingFromPlaylist: (state) => {
            return state.playingFromPlaylist;
        },
        getPlaylistSongNames: (state) => {
            return state.playlistSongNames;
        },
        getPlaylistSongLinks: (state) => {
            return state.playlistSongLinks;
        },
    },
})