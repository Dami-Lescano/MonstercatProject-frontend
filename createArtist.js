const request = new XMLHttpRequest()
const url = "http://localhost:8080/api/enums/countries"
request.open('GET', url)
request.send()
request.addEventListener("readystatechange", () => {
    if(request.readyState === 4){
        if(request.status == 200){
            const genres = JSON.parse(request.response)
            console.log(genres)
            genres.forEach(element => {
                console.log(element)
                var select = document.getElementById("country");
                var option = document.createElement("option");
                option.text = element.name;
                option.value = element.country;
                select.add(option);
            })
        }
        else {
            alert("No se pudo fetchear los paises")
        }
    }
})


const create = () => {
    const artistName = document.getElementById("artistName").value
    const realName = ["Damián Lescano"]//document.getElementById("artists").value
    const birthDate = document.getElementById("birthDate").value
    const country = "ARGENTINA"//document.getElementById("country").value
    const initYear = document.getElementById("initYear").value
    const endYear = document.getElementById("endYear").value
    
    const request = new XMLHttpRequest()
    const url = "http://localhost:8080/api/artist"

    const artist = {
        artistName: artistName,
        realName: realName,
        country: country,
        birthDate: birthDate,
        initYear: initYear,
        endYear: endYear
    }

    console.log("artist ", artist)

    request.open('POST', url)
    request.setRequestHeader('Content-Type', 'application/json')
    let body = JSON.stringify(artist)
    request.send(body)
    console.log("body ", body)
    
    request.addEventListener("readystatechange", () =>{
        //let user_string = ''
        if(request.readyState === 4){
            if(request.status == 200){
                console.log(request.response)
                alert("Artista creado exitosamente")
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