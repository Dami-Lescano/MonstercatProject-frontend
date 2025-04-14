const selectedSongsIds = []

const request = new XMLHttpRequest()
const url = "http://localhost:8080/api/song/songsItems"
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
            alert("No se pudo fetchear las canciones")
        }
    }
})

const create = () => {
    const title = document.getElementById("title").value
    const songs = readSongs()
    const releaseDate = document.getElementById("releaseDate").value
    const catalogNumber = document.getElementById("catalogNumber").value
    
    const request = new XMLHttpRequest()
    const url = "http://localhost:8080/api/album"

    const album = {
        title: title,
        songs: songs,
        releaseDate: releaseDate,
        catalogNumber: catalogNumber
    }

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
}

const removeSong = (id) => {
    document.getElementById(id).remove()
    toggleDisableOption(id, false)
}

const toggleDisableOption = (id, bool) => {
    const songOption = document.getElementById("option" + id)

    songOption.disabled = bool
}

const readSongs = () => {
    const songs = []
    selectedSongsIds.forEach(songId => {
        const song = {
            songId: songId
        }
        songs.push(song)
    })
    return songs;
}