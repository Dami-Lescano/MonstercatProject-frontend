const selectedSongsIds = []

const selectedArtistsIds = []

const requestArtists = new XMLHttpRequest()
requestArtists.open('GET', "http://localhost:8080/api/artist/namesAndIds")
requestArtists.send()
requestArtists.addEventListener("readystatechange", () => {
    if(requestArtists.readyState === 4){
        if(requestArtists.status == 200){
            let artists = [{artistId: 0, artistName: "No especificado"}]
            artists = artists.concat(JSON.parse(requestArtists.response))

            const artistSelect = document.getElementById("artistSelect")

            artists.forEach(artist => {
                var option = document.createElement("option")
                option.text = artist.artistName
                option.value = artist.artistId
                option.id = "artistOption" + artist.artistId
                artistSelect.add(option)
            })
        }
        else {
            alert("No se pudo fetchear los artistas")
        }
    }
})

const fecthSongs = () => {

    selectedSongsIds.splice(0, selectedSongsIds.length)
    console.log("songs ids", selectedSongsIds)
    document.getElementById("addedSongs").innerHTML = ``

    if (selectedArtistsIds.length == 0) {
        const songSelect = document.getElementById("songSelect")
        songSelect.innerHTML = '<option value="0">Seleccione un artista o más</option>'
        return
    }
    else {
        let url = "http://localhost:8080/api/artist/artistsSongs?"
        selectedArtistsIds.forEach( id => {
            url = url.concat(`ids=${id}&`)
        })
        url = url.slice(0, url.length - 1)
    

    console.log("url ", url)

    const request = new XMLHttpRequest()
    request.open('GET', url)
    request.send()
    request.addEventListener("readystatechange", () => {
        if(request.readyState === 4){
            if(request.status == 200){
                const songSelect = document.getElementById("songSelect");
                songSelect.innerHTML = ``

                let songs = [{id: 0, fullName: "No especificado"}]
                songs = songs.concat(JSON.parse(request.response))
                
                songs.forEach(element => {
                    
                    const option = document.createElement("option");
                    option.text = element.fullName;
                    option.value = element.id;
                    option.id = "option" + element.id;
                    songSelect.add(option);
                })
            }
            else {
                console.log("response ", response)
                alert("No se pudo fetchear las canciones")
            }
        }
    })

    }
}

const create = () => {
    const title = document.getElementById("title").value
    const songs = readSongs()//{1: {songId: 3}, 2: {songId: 7}}//readSongs()
    const releaseDate = document.getElementById("releaseDate").value
    const catalogNumber = document.getElementById("catalogNumber").value
    const artists = readArtists()
    
    const request = new XMLHttpRequest()
    const url = "http://localhost:8080/api/album"

    const album = {
        artists: artists,
        title: title,
        songs: songs,
        releaseDate: releaseDate,
        catalogNumber: catalogNumber,
        artists: artists,
        type: "artistAlbum"
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

const addArtist = () => {
    const artistsDiv = document.getElementById("artists")
    const artistSelect = document.getElementById("artistSelect")
    const artistId = artistSelect.value
    if(artistId == 0) {
        return
    }
    artistSelect.value = 0
    const artistName = document.getElementById("artistOption" + artistId).text

    const newArtistChip = document.createElement("div")
    newArtistChip.className = "chip"
    newArtistChip.id = artistId
    newArtistChip.innerHTML = `<button type="button" onClick="removeArtist(${artistId})">X</button>${artistName}`

    toggleDisableArtistOption(artistId, true)

    artistsDiv.appendChild(newArtistChip)

    selectedArtistsIds.push(artistId)

    fecthSongs()
}

const removeArtist = (id) => {
    document.getElementById(id).remove()
    toggleDisableArtistOption(id, false)

    const index = selectedArtistsIds.indexOf(id.toString())
    if (index > -1) {
        selectedArtistsIds.splice(index, 1)
    }

    fecthSongs()
}

const addSong = () => {
    const songsDiv = document.getElementById("addedSongs")
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

    toggleDisableSongOption(songId, true)

    songsDiv.appendChild(newSongChip)

    selectedSongsIds.push(songId)

    console.log("songs ids ", selectedSongsIds)
}

const toggleDisableArtistOption = (id, bool) => {
    const artistOption = document.getElementById("artistOption" + id)
    artistOption.disabled = bool
}

const readArtists = () => {
    const artists = []
    selectedArtistsIds.forEach(artistId => {
        const artist = {
            artistId: artistId
        }
        artists.push(artist)
    })
    return artists;
}

const removeSong = (id) => {
    document.getElementById(id).remove()
    toggleDisableSongOption(id, false)
    const index = selectedSongsIds.indexOf(id.toString())
    if (index > -1) {
        selectedSongsIds.splice(index, 1)
    }
}

const toggleDisableSongOption = (id, bool) => {
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