const urlParams = new URLSearchParams(window.location.search);
const albumId = urlParams.get('albumId');
const albumType = urlParams.get('albumType');

console.log(albumType)

const request = new XMLHttpRequest()
const url = `http://localhost:8080/api/album/${albumType}/info/${albumId}`
request.open('GET', url)
request.send()

request.addEventListener("readystatechange", () =>{
    if(request.readyState === 4){
        if(request.status == 200){
            let album = ''
            const response = JSON.parse(request.response)
            album += `
                <img src="monstercat-placeholder.png" height="250">
                <h2 >Título: ${response.title}</h2>
            `
            
            if (albumType == "artistAlbum") {
                album += "<h2 >Artista/s: </h2>"
                response.artists.forEach(artist => {
                    album += `<p><a href="artist.html?artistId=${artist.id}">${artist.artistName}</a></p>`
                })    
            }

            album += "<h2 >Canciones: </h2>"

            response.songs.forEach(song => {
                album += `<p><a href="song.html?songId=${song.id}">${song.fullName}</a></p>`
            })

            album +=`
                <h2 >Duración: ${response.length}</h2>
                <h2 >Cantidad de Canciones: ${response.numberOfSongs}</h2>
                <h2 >Fecha de lanzamiento: ${response.releaseDate}</h2>
                <h2 >Número de catálogo: ${response.catalogNumber}</h2>
                <h2 >ID: ${response.id}</h2>
            `
            document.getElementById("album").innerHTML = album
        }
        else{
            document.getElementById("album").innerHTML = "Error " + request.status
        }
    }
    
})