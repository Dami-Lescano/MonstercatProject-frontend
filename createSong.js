localStorage.setItem("artistsCant", "1")
localStorage.setItem("featuredArtistsCant", "")
localStorage.setItem("remixersCant", "")

var artistSelect

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
            const artists = JSON.parse(requestDos.response)
            console.log(requestDos)
            
            var artist = document.getElementById("artist1");

            var option = document.createElement("option");
            option.text = "No especificado";
            option.value = 0;
            artist.add(option);

            artists.forEach(element => {
                console.log(element)
                
                var option = document.createElement("option");
                option.text = element.artistName;
                option.value = element.artistId;
                artist.add(option);
            })

            console.log("artists select ", artist)
            artistSelect = artist
        }
        else {
            alert("No se pudo fetchear los artistas")
        }
    }
})

const create = () => {
    const title = document.getElementById("title").value
    const artists = readArtists("artist")
    const featuredArtists = readArtists("featuredArtist")
    const remixers = readArtists("remixer")
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
        //let user_string = ''
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
    const numeroArtista = localStorage.getItem(type + "sCant") + 1
    console.log(numeroArtista)
    var artistType = document.getElementById(type + "s")
    var artistNuevo = artistSelect.cloneNode(true)
    artistNuevo.id = type + numeroArtista
    console.log("artist type ", artistType)
    artistType.appendChild(artistNuevo)
    localStorage.setItem(type + "sCant", numeroArtista)
}

const readArtists = (type) => {
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
}