const urlParams = new URLSearchParams(window.location.search);
const albumId = urlParams.get('albumId');

const request = new XMLHttpRequest()
const url = `http://localhost:8080/api/album/info/${albumId}`
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
                    <h2 >Cancioness: </h2>
                `
            
            response.songs.forEach(song => {
                album += `<p><a href="song.html?songId=${song.id}">${song.fullName}</a></p>`
            })
            album +=`
                        <h2 >Duración: ${response.length}</h2>
                        <h2 >Cantidad de Canciones: ${response.numberOfSongs}</h2>
                        <h2 >Género: ${response.releaseDate}</h2>
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