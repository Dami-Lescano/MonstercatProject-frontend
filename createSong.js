localStorage.setItem("artistsCant", "1")
localStorage.setItem("featuredArtistsCant", "")
localStorage.setItem("remixersCant", "")

const selectedArtistsIds = []
const selectedFeaturedArtistsIds = []
const selectedRemixersIds = []

const request = new XMLHttpRequest()
const url = "http://localhost:8080/api/enums/genres"
request.open('GET', url)
request.send()
request.addEventListener("readystatechange", () => {
    if(request.readyState === 4){
        if(request.status == 200){
            const genres = JSON.parse(request.response)
            console.log(genres)
            genres.forEach(element => {
                console.log(element)
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

const requestDos = new XMLHttpRequest()
const urlDos = "http://localhost:8080/api/artist/namesAndIds"
requestDos.open('GET', urlDos)
requestDos.send()
requestDos.addEventListener("readystatechange", () => {
    if(requestDos.readyState === 4){
        if(requestDos.status == 200){
            let artists = [{artistId: 0, artistName: "No especificado"}]
            artists = artists.concat(JSON.parse(requestDos.response))
            console.log(requestDos)
            
            
            //const artistTypes = ["artist", "featuredArtist", "remixer"]

            const artistSelect = document.getElementById("artistSelect");
            const featuredArtistSelect = document.getElementById("featuredArtistSelect");
            const remixerSelect = document.getElementById("remixerSelect");

            const artistSelects = [artistSelect, featuredArtistSelect, remixerSelect]

            //artistTypes.forEach(artistType => {
                artists.forEach(artist => {
                    console.log(artist)
                    
                    
                    artistSelects.forEach(artistSelect => {
                        var option = document.createElement("option");
                        option.text = artist.artistName;
                        option.value = artist.artistId;
                        option.id = artistSelect.id + "Option" + artist.artistId
                        option.disabled = false//selectedArtistsIds.includes(artist.artistId) ? true : false
                        artistSelect.add(option);
                    })
                    
                })
            //})
            //console.log("artists select ", artist)
            //artistSelect = artist
        }
        else {
            alert("No se pudo fetchear los artistas")
        }
    }
})

const create = () => {
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
        catalogNumber: catalogNumber
    }

    console.log("song ", song)

    request.open('POST', url)
    request.setRequestHeader('Content-Type', 'application/json')
    let body = JSON.stringify(song)
    request.send(body)
    console.log("body ", body)
    
    request.addEventListener("readystatechange", () =>{
        if(request.readyState === 4){
            if(request.status == 200){
                console.log(request.response)
                alert("Canción creada exitosamente")
                location.reload(false)
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
    newArtistChip.innerHTML = `<button type="button" onClick="removeArtist(${artistId})"></button>${artistName}`

    console.log("newArtistChip ", newArtistChip)
    
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
    console.log("artistsDiv ", artistsDiv.children)

    /*const numeroArtista = localStorage.getItem(type + "sCant") + 1
    console.log(numeroArtista)
    var artistType = document.getElementById(type + "s")
    var artistNuevo = artistSelect.cloneNode(true)
    artistNuevo.id = type + numeroArtista
    console.log("artist type ", artistType)
    artistType.appendChild(artistNuevo)
    localStorage.setItem(type + "sCant", numeroArtista)*/
}

const removeArtist = (id) => {
    document.getElementById(id).remove()
    toggleDisableOption(id, false)
}

const toggleDisableOption = (id, bool) => {
    const artistOption = document.getElementById("artistSelectOption" + id)
    const featuredArtistOption = document.getElementById("featuredArtistSelectOption" + id)
    const remixerOption = document.getElementById("remixerSelectOption" + id)

    artistOption.disabled = bool
    featuredArtistOption.disabled = bool
    remixerOption.disabled = bool

    //console.log
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
/*const readArtists = (type) => {
    var seguir = true
    var artistSelectId = type + "1"
    const artists = []
    while (seguir) {
        try {
            var artistId = document.getElementById(artistSelectId).value
            const artist = {
                artistId: artistId
            }
            artists.push(artist)
            artistSelectId = artistSelectId + "1"
        }
        catch {
            seguir = false
        }
        console.log(artists)
    }
    return artists
}*/