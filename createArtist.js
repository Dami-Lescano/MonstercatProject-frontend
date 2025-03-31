const request = new XMLHttpRequest()
const url = "http://localhost:8080/api/enums/countries"
request.open('GET', url)
request.send()
request.addEventListener("readystatechange", () => {
    if(request.readyState === 4){
        if(request.status == 200){
            const genres = JSON.parse(request.response)
            genres.forEach(element => {
                var select = document.getElementById("country")
                var option = document.createElement("option")
                option.text = element.name
                option.value = element.country
                select.add(option)
            })
        }
        else {
            alert("No se pudo fetchear los paises")
        }
    }
})

localStorage.setItem("namesCant", 1)



const create = () => {
    const artistName = document.getElementById("artistName").value
    const realName = readRealNames()//["Damián Lescano"]//document.getElementById("artists").value
    const birthDate = document.getElementById("birthDate").value
    const country = document.getElementById("country").value
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

const readRealNames = () => {
    var seguir = true
    var realNameId = "realName1"
    const realNames = []
    while (seguir) {
        try {
            var name = document.getElementById(realNameId).value
            realNames.push(name)
            realNameId = realNameId + "1"
        }
        catch {
            seguir = false
        }
        console.log(realNames)
    }
    return realNames
}

const addName = () => {
    const numeroNombre = localStorage.getItem("namesCant") + 1
    console.log(numeroNombre)
    var names = document.getElementById("realNames")
    var name = document.createElement("input")
    name.type = "text"
    name.placeholder = "Ingrese el nombre real"
    name.id = "realName" + numeroNombre
    names.appendChild(name)
    localStorage.setItem("namesCant", numeroNombre)
}