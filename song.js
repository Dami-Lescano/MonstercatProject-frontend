const urlParams = new URLSearchParams(window.location.search);
const songId = urlParams.get('songId');

const request = new XMLHttpRequest()
const url = `http://localhost:8080/api/song/info/${songId}`
request.open('GET', url)
request.send()

request.addEventListener("readystatechange", () =>{
    if(request.readyState === 4){
        if(request.status == 200){
            let song = ''
            const response = JSON.parse(request.response)
            song += `
                        <img src="monstercat-placeholder.png" height="250">
                        <h2 >Título: ${response.title}</h2>
                        <h2 >Artista/s: ${response.artists}</h2>
                        ${response.featuredArtists.length > 0 ? `<h2 >Artistas colaboradores: ${response.featuredArtists}</h2>` : ""}
                        ${response.remixers.length > 0 ? `<h2 >Remixers: ${response.remixers}</h2>` : ""}
                        <h2 >Duración: ${response.length}</h2>
                        <h2 >Género: ${response.genre}</h2>
                        <h2 >Número de catálogo: ${response.catalogNumber == null ? "N/A" : `${response.catalogNumber}`}</h2>
                        <h2 >ID: ${response.songId}</h2>
                    `
            document.getElementById("song").innerHTML = song
        }
        else{
            document.getElementById("song").innerHTML = "Error " + request.status
        }
    }
    
})