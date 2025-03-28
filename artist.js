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
const url = "http://localhost:8080/api/artist/4"
request.open('GET', url) //+ localStorage.getItem("ruta"))
//request.setRequestHeader("Content-type", "application/json")
request.send()





request.addEventListener("readystatechange", () =>{
    let artist = ''
    if(request.readyState === 4){
        if(request.status == 200){
            console.log(request.response)
            //const jason = JSON.parse(request.response).users.map(e => e.Nombre + ' ' + e.Apellido)
            const response = JSON.parse(request.response)
            //const total = jason.length
            //document.getElementById('total').innerHTML = `<i class="fas fa-search"></i> Total: ${total}`
            artist += `
                        <img src="monstercat-placeholder.png" height="250">
                        <h2 >Artista: ${response.artistName}</h2>
                        <h2 >Nombre/s: ${response.realName.length > 0 ? response.realName : "Desconocido"}</h2>
                        <h2 >Fecha de nacimiento: ${response.birthDate == null ? "N/A" : `${response.birthDate}`}</h2>
                        <h2 >País: ${response.country}</h2>
                        <h2 >Año de inicio: ${response.initYear == null ? "N/A" : `${response.initYear}`}</h2>
                        <h2 >Año de fin: ${response.endYear == null ? "N/A" : `${response.endYear}`}</h2>
                        <h2 >ID: ${response.artistId}</h2>
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
            document.getElementById("artist").innerHTML = artist
        }
        else{
            document.getElementById("artist").innerHTML = "Error " + request.status
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