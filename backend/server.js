const http = require("http");
const fs = require("fs");
const PORT = process.env.PORT || 3000;
const Datastore = require('nedb');
const formidable = require("formidable");
const uuid = require("uuid")

const playlist = new Datastore({
    filename: 'playlist.db',
    autoload: true,
})

const server = http.createServer((req, res) => {
    let url = decodeURIComponent(req.url);
    switch (req.method) {
        case "GET":
            if (url == '/admin') {
                fs.readFile(__dirname + '\\static\\pages\\admin.html', function (err, html) {
                    if (err) {
                        throw err;
                    }
                    res.writeHeader(200, { "Content-Type": "text/html" });
                    res.write(html);
                    res.end();
                });
            } else if (url == '/default/cover.png') {
                let file = __dirname + '\\static\\default\\cover.png'
                fs.readFile(file, (err, content) => {
                    if (err) {
                        console.log(`file not found ${file}`);
                        res.writeHead(404);
                        res.end()
                    } else {
                        res.setHeader("X-Content-Type-Options", "nosniff");
                        res.writeHead(200, {
                            "Content-type": "image/png",
                            "Access-Control-Allow-Origin": "*"
                        });
                        res.end(content);
                    }
                });
            } else {
                console.log(url)
                let requestedPath = url.replace(/\//g, '\\');
                let file = __dirname + "\\static\\mp3" + requestedPath;
                fs.readFile(file, (err, content) => {
                    fs.stat(file, (err, stats) => {
                        console.log(`file requested: ${file}`);
                        if (err) {
                            console.log(`file not found ${file}`);
                            res.writeHead(404);
                            res.end()
                        } else {
                            res.setHeader("X-Content-Type-Options", "nosniff");
                            let type = requestedPath.slice(-4);
                            console.log(type)
                            switch (type) {
                                case ".png":
                                    res.writeHead(200, {
                                        "Content-type": "image/png",
                                        "Access-Control-Allow-Origin": "*",
                                    });
                                    break;
                                case ".mp3":
                                    res.writeHead(200, {
                                        "Content-type": "audio/mpeg",
                                        "Access-Control-Allow-Origin": "*",
                                        "Content-Length": stats.size,
                                        "Accept-Ranges": "bytes"
                                    });
                                    break
                            }
                            res.end(content);
                        }
                    })
                });
            }
            break
        case "POST":
            if (url == '/first') {
                fs.readdir(__dirname + "/static/mp3/", (err, content) => {
                    if (err) {
                        console.log('directories error')
                        res.writeHead(404);
                        res.end()
                    } else {
                        res.writeHead(200, {
                            "content-type": "json/application",
                            "Access-Control-Allow-Origin": "*"
                        });
                        res.end(JSON.stringify(content))
                    }
                });
            } else if (url == '/getPlaylist') {
                playlist.find({}, function (err, docs) {
                    if (err) throw err
                    res.writeHead(200, {
                        "content-type": "json/application",
                        "Access-Control-Allow-Origin": "*"
                    });
                    let returners = [];
                    for (let i = 0; i < docs.length; i++) {
                        returners[i] = { song: docs[i].song, album: docs[i].album }
                    }
                    res.end(JSON.stringify(returners))
                })
            } else if (url == '/setPlaylist') {
                req.on("data", function (data) {
                    let received = JSON.parse(data)
                    console.log(received)
                    playlist.remove({}, { multi: true }, function (err, numRemoved) {
                        if (err) throw err
                    });
                    for (let i = 0; i < received.length; i++) {
                        playlist.insert(received[i], (err, newDoc) => {
                            if (err) throw err
                        })
                    }
                })
                req.on('end', () => {
                    console.log("seting now")
                })
                res.writeHead(200, {
                    "content-type": "text/plain",
                    "Access-Control-Allow-Origin": "*"
                });
                res.end("poszło")
            } else if (url == "/upload") {
                let dir = __dirname + '/static/mp3/' + uuid.v1()
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                    let hasCover = false;
                    console.log("Uploading to: " + dir)
                    let form = formidable({})
                    form.parse(req);
                    form.on('fileBegin', function (name, file) {
                        file.path = dir + "/" + file.name;
                    });
                    form.on('file', function (name, file) {
                        console.log('Uploaded: ' + file.name);
                        if (file.name == "cover.png") hasCover = true;
                    });
                    form.on('end', function () {
                        if (!hasCover) {
                            fs.copyFileSync('./static/default/cover.png', dir + "/cover.png")
                            console.log("haven't found cover.png among files, instead imported deafult cover")
                        }
                    })
                    req.on('end', () => {
                        console.log("Files uploaded")
                    })
                    res.writeHead(200, {
                        "content-type": "text/plain",
                        "Access-Control-Allow-Origin": "*"
                    })
                    res.end()
                }
            } else {
                fs.readdir(__dirname + "/static/mp3" + url + '/', (err, content) => {
                    if (err) {
                        console.log('directories error')
                        res.writeHead(404);
                        res.end()
                    } else {
                        res.writeHead(200, {
                            "content-type": "json/application",
                            "Access-Control-Allow-Origin": "*"
                        });
                        res.end(JSON.stringify(content))
                    }
                });
            }
            break
    }
});
server.listen(PORT, () => {
    console.log('śmigamy na http://localhost:' + PORT);
});