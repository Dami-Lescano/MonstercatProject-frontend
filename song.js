/*if(localStorage.song == null){
    localStorage.setItem("song", "")
}
const ordenar = (song = '') => {
    localStorage.setItem("song", song)
}

localStorage.setItem("search", "")


document.getElementById('search-field').value = ""

*/
const request = new XMLHttpRequest()
const url = "http://localhost:8080/api/song/info/46"
request.open('GET', url) //+ localStorage.getItem("ruta"))
//request.setRequestHeader("Content-type", "application/json")
request.send()





request.addEventListener("readystatechange", () =>{
    let song = ''
    if(request.readyState === 4){
        if(request.status == 200){
            console.log(request.response)
            //const jason = JSON.parse(request.response).users.map(e => e.Nombre + ' ' + e.Apellido)
            const response = JSON.parse(request.response)
            //const total = jason.length
            //document.getElementById('total').innerHTML = `<i class="fas fa-search"></i> Total: ${total}`
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
            /*jason.forEach( e => {
                user_string += `

                        <div class="grid-item"><p class="grid-user">${e.usuario_logeado}</p></div>
                        <div class="grid-item"><p class="grid-user">${e.resumen_descarga}</p></div>
                        <div class="grid-item"><p class="grid-user">${e.resumen_positivo}</p></div>
                        <div class="grid-item"><p class="grid-user">${e.resumen_negativo}</p></div>
                        <div class="grid-item"><p class="grid-user">${e.puntaje_global}</p></div>
                    `
            })*/
            document.getElementById("song").innerHTML = song
        }
        else{
            document.getElementById("song").innerHTML = "Error " + request.status
        }
        /* localStorage.setItem("busqueda", "0") */
    }
    
})

const clicker = () =>{
    let busqueda = document.getElementById("search-field").value
    console.log("valor de busqueda: " + busqueda)
    if(busqueda == '' || busqueda == null){
        alert("el cuadro de busqueda esta vacio")
        location.reload()
        return
    }
    else {
        localStorage.setItem("busqueda", busqueda)
    }
}