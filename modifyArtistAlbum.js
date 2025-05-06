const selectedSongsIds = []

const selectedArtistsIds = []

const setInputValue = (field, value) => {
    const fieldInput = document.getElementById(field)
    fieldInput.value = value
}

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

            fetchAlbum()
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
                
                console.log("songSelect ", songSelect)

                songs.forEach(element => {
                    
                    const option = document.createElement("option");
                    option.text = element.fullName;
                    option.value = element.id;
                    option.id = "songOption" + element.id;
                    option.disabled = false
                    songSelect.add(option);
                })

                if (fetching) {
                    fillSongs(songsToFetch)
                    fetching = false
                }
            }

            

            else {
                console.log("response ", response)
                alert("No se pudo fetchear las canciones")
            }
        }
    })

    }
}

const urlParams = new URLSearchParams(window.location.search)
const albumId = urlParams.get('albumId')
const albumType = urlParams.get('albumType')

var fetching = true
var songsToFetch

const fetchAlbum = () => {


    const requestAlbum = new XMLHttpRequest()
    const url = `http://localhost:8080/api/album/artistAlbum/info/${albumId}`
    requestAlbum.open('GET', url)
    requestAlbum.send()

    requestAlbum.addEventListener("readystatechange", () =>{
        if(requestAlbum.readyState === 4){
            if(requestAlbum.status == 200){
                const response = JSON.parse(requestAlbum.response)

                setInputValue("title", response.title)
                setInputValue("releaseDate", response.releaseDate)
                setInputValue("catalogNumber", response.catalogNumber)

                fillArtists(response.artists)

                console.log("songs ", response.songs)
                songsToFetch = response.songs

                //fecthSongs()
            }
            else{
                alert("No se pudo fetchear la información del álbum.")
            }
        }
        
    })
}

const fillArtists = (artists) => {
    const artistSelect = document.getElementById("artistSelect")
    artists.forEach(a => {
        artistSelect.value = a.artistId
        addArtist()
    })
    
}

const fillSongs = (songs) => {
    const songSelect = document.getElementById("songSelect")
    songs.forEach(s => {
        songSelect.value = s.id
        addSong()
    })
    console.log("fillSongs ", selectedSongsIds)
}

const modify = () => {
    const title = document.getElementById("title").value
    const songs = readSongs()//{1: {songId: 3}, 2: {songId: 7}}//readSongs()
    const releaseDate = document.getElementById("releaseDate").value
    const catalogNumber = document.getElementById("catalogNumber").value
    const artists = readArtists()
    
    const request = new XMLHttpRequest()
    const url = "http://localhost:8080/api/album"

    const album = {
        albumId: albumId,
        artists: artists,
        title: title,
        songs: songs,
        releaseDate: releaseDate,
        catalogNumber: catalogNumber,
        artists: artists,
        type: "artistAlbum"
    }

    console.log("album ", album)

    request.open('PUT', url)
    request.setRequestHeader('Content-Type', 'application/json')
    let body = JSON.stringify(album)
    request.send(body)
    console.log("body ", body)
    
    request.addEventListener("readystatechange", () =>{
        if(request.readyState === 4){
            if(request.status == 200){
                alert("Album modificado exitosamente")
                navigateToInfo()
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
    newArtistChip.id = "artist" + artistId
    newArtistChip.innerHTML = `<button type="button" onClick="removeArtist(${artistId})">X</button>${artistName}`

    toggleDisableArtistOption(artistId, true)

    artistsDiv.appendChild(newArtistChip)

    selectedArtistsIds.push(artistId)

    fecthSongs()
}

const removeArtist = (id) => {
    document.getElementById("artist" + id).remove()
    toggleDisableArtistOption(id, false)

    const index = selectedArtistsIds.indexOf(id.toString())
    if (index > -1) {
        selectedArtistsIds.splice(index, 1)
    }

    fecthSongs()
}

const addSong = () => {
    
    const songSelect = document.getElementById("songSelect")
    const songId = songSelect.value
    if(songId == 0) {
        return
    }
    songSelect.value = 0
    const songName = document.getElementById("songOption" + songId).text

    addSongChip(songId, songName)

    console.log("songs ids ", selectedSongsIds)
}

const addSongChip = (id, name) => {
    const songsDiv = document.getElementById("addedSongs")
    const newSongChip = document.createElement("div")
    newSongChip.className = "chip"
    newSongChip.id = "song" + id
    newSongChip.innerHTML = `<button type="button" onClick="removeSong(${id})">X</button>${name}`

    songsDiv.appendChild(newSongChip)

    selectedSongsIds.push(id)

    toggleDisableSongOption(id, true)
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
    document.getElementById("song" + id).remove()
    toggleDisableSongOption(id, false)
    const index = selectedSongsIds.indexOf(id.toString())
    if (index > -1) {
        selectedSongsIds.splice(index, 1)
    }
}

const toggleDisableSongOption = (id, bool) => {
    const songOption = document.getElementById("songOption" + id)
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

const navigateToInfo = () => {
    location.href = "album.html?albumId=" + albumId + "&albumType=" + albumType
}