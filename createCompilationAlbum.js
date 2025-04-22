const selectedSongsIds = []

const fecthSongs = (filterType, value) => {
    let url
    if (filterType == "MONSTERCAT_COMPILATION") {
        url = "http://localhost:8080/api/song/songsItems"
    }
    else if (filterType == "BEST_OF_YEAR") {
        url = `http://localhost:8080/api/song/songsItems/year/${value}`
    }
    else {
        url = `http://localhost:8080/api/song/songsItems/genre/${value}`
    }
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

const genreSelect = document.createElement("select")
genreSelect.id = "genreSelect"
genreSelect.onchange = () => fecthSongs("BEST_OF_GENRE", genreSelect.value)

const request = new XMLHttpRequest()
const url = "http://localhost:8080/api/enums/genres"
request.open('GET', url)
request.send()
request.addEventListener("readystatechange", () => {
    if(request.readyState === 4){
        if(request.status == 200){
            const genres = JSON.parse(request.response)
            genres.forEach(element => {
                var option = document.createElement("option");
                option.text = element.name;
                option.value = element.genre;
                genreSelect.add(option);
            })
        }
        else {
            alert("No se pudo fetchear los generos")
        }
    }
})

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

fecthSongs("MONSTERCAT_COMPILATION", null)

const compilationTypeChanged = (type) => {
    const compilationTypeFieldsDiv = document.getElementById("compilationTypeFields")
    const title = document.getElementById("title")
    if (type == "MONSTERCAT_COMPILATION") {
        compilationTypeFieldsDiv.innerHTML = ""
        fecthSongs(type, null)
        title.value = "Monstercat XXX - X"
    }
    else if (type == "BEST_OF_YEAR") {
        compilationTypeFieldsDiv.innerHTML = `
            <label>Año</label>
            <select id="añoSelect" onchange="fecthSongs('BEST_OF_YEAR', value)">
                <option value="2011">2011</option>
                <option value="2012">2012</option>
                <option value="2013">2013</option>
                <option value="2014">2014</option>
                <option value="2015">2015</option>
            </select>
        `
        title.value = "Best of XXXX"
        fecthSongs(type, 2011)
    }
    else {
        compilationTypeFieldsDiv.innerHTML = `
            <label>Género</label>            
        `
        compilationTypeFieldsDiv.appendChild(genreSelect)
        title.value = "Best of XXXXXX"
        fecthSongs(type, "UNKNOWN")
    }
}

const create = () => {
    const compilationType = document.getElementById("compilationType").value

    const title = document.getElementById("title").value
    const songs = readSongs()//{1: {songId: 3}, 2: {songId: 7}}//readSongs()
    const releaseDate = "2000-06-06"//document.getElementById("releaseDate").value
    const catalogNumber = "MC100"//document.getElementById("catalogNumber").value
    
    const request = new XMLHttpRequest()
    const url = "http://localhost:8080/api/album"

    const album = {
        title: title,
        songs: songs,
        releaseDate: releaseDate,
        catalogNumber: catalogNumber,
        type: "compilationAlbum",
        compilationType: compilationType
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