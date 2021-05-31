# Musicplayer

Node: 14.16.0 
Back: node server
Front: npm run serve

## Backend:
Endpoints:
* GET:
    1. *"/admin"* - music files upload,
    2. *"/album/cover.png"* - *album* cover,
    3. *"/album/title.mp3"* - mp3 file with *title* z from *album*,
    4. *"/default/cover.png* - deafult cover,
    5. *"/admin"* - upload drag&drop.
* POST:
    1. *"/first"* - init,
    2. *"/album"* - album content list,
    3. *"/getPlaylist"* - playlist content,
    4. *"/setPlaylist"* - sets playlist,
    5. *"/upload"* - file upload from *"/admin"*.
