const urlParams = new URLSearchParams(window.location.search);
const artistId = urlParams.get('artistId');

const request = new XMLHttpRequest()
const url = `http://localhost:8080/api/artist/${artistId}`
request.open('GET', url)
request.send()

request.addEventListener("readystatechange", () =>{
    if(request.readyState === 4){
        if(request.status == 200){
            let artist = ''
            const response = JSON.parse(request.response)
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
            document.getElementById("artist").innerHTML = artist
        }
        else{
            document.getElementById("artist").innerHTML = "Error " + request.status
        }
    }
    
})