const urlParams = new URLSearchParams(window.location.search);
const songId = urlParams.get('songId');

const selectedArtistsIds = []
const selectedFeaturedArtistsIds = []
const selectedRemixersIds = []

const artistsIdsLists = [selectedArtistsIds, selectedFeaturedArtistsIds, selectedRemixersIds]

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

            const artistSelect = document.getElementById("artistSelect");
            const featuredArtistSelect = document.getElementById("featuredArtistSelect");
            const remixerSelect = document.getElementById("remixerSelect");

            const artistSelects = [artistSelect, featuredArtistSelect, remixerSelect]

            artists.forEach(artist => {
                artistSelects.forEach(artistSelect => {
                    var option = document.createElement("option");
                    option.text = artist.artistName;
                    option.value = artist.artistId;
                    option.id = artistSelect.id + "Option" + artist.artistId
                    option.disabled = false//selectedArtistsIds.includes(artist.artistId) ? true : false
                    artistSelect.add(option);
                })
                
            })
        }
        else {
            alert("No se pudo fetchear los artistas")
        }
    }
})

const requestSong = new XMLHttpRequest()
requestSong.open('GET', `http://localhost:8080/api/song/info/${songId}`)
requestSong.send()
requestSong.addEventListener("readystatechange", () =>{
    if(requestSong.readyState === 4){
        if(requestSong.status == 200){
            const response = JSON.parse(requestSong.response)

            setInputValue("title", response.title)
            setInputValue("minutes", response.lengthMinutes)
            setInputValue("seconds", response.lengthSeconds)
            setInputValue("genre", response.genre)
            setInputValue("releaseDate", response.releaseDate)
            setInputValue("catalogNumber", response.catalogNumber)

            fillArtists("artist", response.artists)
            fillArtists("featuredArtist", response.featuredArtists)
            fillArtists("remixer", response.remixers)
        }
        else{
            alert("No se pudo fetchear la información de la canción.")
        }
    }
    
})

const fillArtists = (type, artists) => {
    const artistSelect = document.getElementById(type + "Select")
    artists.forEach(a => {
        artistSelect.value = a.artistId
        addArtist(type)
    })
}

const requestGenres = new XMLHttpRequest()
const url = "http://localhost:8080/api/enums/genres"
requestGenres.open('GET', url)
requestGenres.send()
requestGenres.addEventListener("readystatechange", () => {
    if(requestGenres.readyState === 4){
        if(requestGenres.status == 200){
            const genres = JSON.parse(requestGenres.response)
            genres.forEach(element => {
                var select = document.getElementById("genre");
                var option = document.createElement("option");
                option.text = element.name;
                option.value = element.genre;
                select.add(option);
            })
        }
        else {
            alert("No se pudo fetchear los generos")
        }
    }
})

const modify = () => {
    const title = document.getElementById("title").value
    const artists = readArtists("artist")
    const featuredArtists = readFeaturedArtists("featuredArtist")
    const remixers = readRemixers("remixer")
    const releaseDate = document.getElementById("releaseDate").value
    const genre = document.getElementById("genre").value
    const minutes = document.getElementById("minutes").value
    const seconds = document.getElementById("seconds").value
    const catalogNumber = document.getElementById("catalogNumber").value
    const length = (minutes * 60) + parseInt(seconds)
    
    const request = new XMLHttpRequest()
    const url = "http://localhost:8080/api/song"

    const song = {
        title: title,
        artists: artists,
        featuredArtists: featuredArtists,
        remixers: remixers,
        genre: genre,
        releaseDate: releaseDate,
        length: length,
        catalogNumber: catalogNumber,
        songId: songId
    }

    request.open('PUT', url)
    request.setRequestHeader('Content-Type', 'application/json')
    let body = JSON.stringify(song)
    request.send(body)
    console.log("body ", body)
    
    request.addEventListener("readystatechange", () =>{
        if(request.readyState === 4){
            if(request.status == 200){
                alert("Canción modificada exitosamente")
                navigateToInfo()
            }
            else {
                alert("algo salio mal")
            }
        }
    })

    
}

const addArtist = (type) => {
    const artistsDiv = document.getElementById(type + "s")
    const artistSelect = document.getElementById(type + "Select")
    const artistId = artistSelect.value
    if(artistId == 0) {
        return
    }
    artistSelect.value = 0
    const artistName = document.getElementById(type + "SelectOption" + artistId).text

    const newArtistChip = document.createElement("div")
    newArtistChip.className = "chip"
    newArtistChip.id = artistId
    newArtistChip.innerHTML = `<button type="button" onClick="removeArtist(${artistId})">X</button>${artistName}`
    
    checkOtherSelects(artistId)

    toggleDisableOption(artistId, true)

    artistsDiv.appendChild(newArtistChip)

    if (type == "artist") {
        selectedArtistsIds.push(artistId)
    }
    else if (type == "featuredArtist") {
        selectedFeaturedArtistsIds.push(artistId)
    }
    else {
        selectedRemixersIds.push(artistId)
    }
}

const removeArtist = (id) => {
    document.getElementById(id).remove()
    toggleDisableOption(id, false)

    artistsIdsLists.forEach(list => {
        const index = list.indexOf(id.toString())
        if (index > -1) {
            list.splice(index, 1)
        }
    })

    
}

const toggleDisableOption = (id, bool) => {
    const artistOption = document.getElementById("artistSelectOption" + id)
    const featuredArtistOption = document.getElementById("featuredArtistSelectOption" + id)
    const remixerOption = document.getElementById("remixerSelectOption" + id)

    artistOption.disabled = bool
    featuredArtistOption.disabled = bool
    remixerOption.disabled = bool
}

const checkOtherSelects = (id) => {
    const artistSelect = document.getElementById("artistSelect")
    const featuredArtistSelect = document.getElementById("featuredArtistSelect")
    const remixerSelect = document.getElementById("remixerSelect")

    if (artistSelect.value == id) {
        artistSelect.value = 0
    }
    if (featuredArtistSelect.value == id) {
        featuredArtistSelect.value = 0
    }
    if (remixerSelect.value == id) {
        remixerSelect.value = 0
    }
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

const readFeaturedArtists = () => {
    const artists = []
    selectedFeaturedArtistsIds.forEach(artistId => {
        const artist = {
            artistId: artistId
        }
        artists.push(artist)
    })
    return artists;
}

const readRemixers = () => {
    const artists = []
    selectedRemixersIds.forEach(artistId => {
        const artist = {
            artistId: artistId
        }
        artists.push(artist)
    })
    return artists;
}

const navigateToInfo = () => {
    location.href = "song.html?songId=" + songId
}