const selectedSongsIds = []

const fecthSongs = (artistId) => {
    let url
    if (artistId == 0) {
        url = "http://localhost:8080/api/song/songsItems"
    }
    else {
        url = `localhost:8080/api/artist/${artistId}/songs`
    }
    const request = new XMLHttpRequest()
    request.open('GET', url)
    request.send()
    request.addEventListener("readystatechange", () => {
        if(request.readyState === 4){
            if(request.status == 200){
                let songs = [{id: 0, fullName: "No especificado"}]
                songs = songs.concat(JSON.parse(request.response))

                songs.forEach(element => {
                    var select = document.getElementById("songSelect");
                    var option = document.createElement("option");
                    option.text = element.fullName;
                    option.value = element.id;
                    option.id = "option" + element.id;
                    select.add(option);
                })
            }
            else {
                console.log("response ", response)
                alert("No se pudo fetchear las canciones")
            }
        }
    })
}


const requestCompilation = new XMLHttpRequest()
requestCompilation.open('GET', "http://localhost:8080/api/enums/compilationTypes")
requestCompilation.send()
requestCompilation.addEventListener("readystatechange", () => {
    if(requestCompilation.readyState === 4){
        if(requestCompilation.status == 200){
            const compilationTypes = JSON.parse(requestCompilation.response)
            compilationTypes.forEach(element => {
                var select = document.getElementById("compilationType");
                var option = document.createElement("option");
                option.text = element.tipo;
                option.value = element.compilationType;
                select.add(option);
            })
        }
        else {
            alert("No se pudo fetchear los tipos de compilaciones")
        }
    }
})

const artistChanged = (artistId) => {
    fecthSongs(artistId)
}

const artistSelect = document.createElement("select")
artistSelect.id = "artistSelect"
artistSelect.onchange = artistChanged(artistSelect.value)

const requestArtists = new XMLHttpRequest()
requestArtists.open('GET', "http://localhost:8080/api/artist/namesAndIds")
requestArtists.send()
requestArtists.addEventListener("readystatechange", () => {
    if(requestArtists.readyState === 4){
        if(requestArtists.status == 200){
            let artists = [{artistId: 0, artistName: "No especificado"}]
            artists = artists.concat(JSON.parse(requestArtists.response))

            artists.forEach(artist => {
                var option = document.createElement("option");
                option.text = artist.artistName;
                option.value = artist.artistId;
                option.id = "artistOption" + artist.artistId
                artistSelect.add(option);
            })
                
        }
        else {
            alert("No se pudo fetchear los artistas")
        }
    }
})

fecthSongs(0)

const albumTypeChanged = (type) => {
    let albumTypeFieldsDiv = document.getElementById("albumTypeFields")
    if (type == "artistAlbum") {
        console.log("artists select ", artistSelect)
        albumTypeFieldsDiv.innerHTML = `${artistSelect.outerHTML}`
    }
    else {

    }
}

const create = () => {
    const type = document.getElementById("type").value

    const title = "titulo"//document.getElementById("title").value
    const songs = readSongs()//{1: {songId: 3}, 2: {songId: 7}}//readSongs()
    const releaseDate = "2000-06-06"//document.getElementById("releaseDate").value
    const catalogNumber = "MC100"//document.getElementById("catalogNumber").value

    if (type == 0) {
        
    }
    
    const request = new XMLHttpRequest()
    const url = "http://localhost:8080/api/album"

    const album = {
        title: title,
        songs: songs,
        releaseDate: releaseDate,
        catalogNumber: catalogNumber,
        type: type
    }

    console.log("album ", album)

    request.open('POST', url)
    request.setRequestHeader('Content-Type', 'application/json')
    let body = JSON.stringify(album)
    request.send(body)
    console.log("body ", body)
    
    request.addEventListener("readystatechange", () =>{
        if(request.readyState === 4){
            if(request.status == 200){
                alert("Album creado exitosamente")
                location.reload(false)
            }
            else {
                alert("algo salio mal")
            }
        }
    })

    
}

const addSong = () => {
    const songsDiv = document.getElementById("songs")
    const songSelect = document.getElementById("songSelect")
    const songId = songSelect.value
    if(songId == 0) {
        return
    }
    songSelect.value = 0
    const songName = document.getElementById("option" + songId).text

    const newSongChip = document.createElement("div")
    newSongChip.className = "chip"
    newSongChip.id = songId
    newSongChip.innerHTML = `<button type="button" onClick="removeSong(${songId})">X</button>${songName}`

    toggleDisableOption(songId, true)

    songsDiv.appendChild(newSongChip)

    selectedSongsIds.push(songId)

    console.log("songs ids ", selectedSongsIds)
}

const removeSong = (id) => {
    document.getElementById(id).remove()
    toggleDisableOption(id, false)
    const index = selectedSongsIds.indexOf(id.toString())
    if (index > -1) {
        selectedSongsIds.splice(index, 1)
    }
}

const toggleDisableOption = (id, bool) => {
    const songOption = document.getElementById("option" + id)
    songOption.disabled = bool
}

const readSongs = () => {
    const songs = new Map()
    let position = 1
    selectedSongsIds.forEach(id => {
        songs[position] = { songId: id}
        position += 1
    })
    console.log("songs ", songs)
    return songs
}