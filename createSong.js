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


const create = () => {
    const title = document.getElementById("title").value
    const artists = [{artistId: 4}]//document.getElementById("artists").value
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

const cifrar = (str, val = 13) => {

    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let current 
    let caesars = ""

    for(let i = 0; i < str.length; i++){
        if(letters.includes(str[i])){
            current = str[i].charCodeAt(0) + val
            if (current > 90){
                current -= 26
                }
            else if(current < 65){
                current +=26
                }
            caesars += String.fromCharCode(current)
            }
        else{
            caesars += str[i]
        }
    }
    return caesars

}