const urlParams = new URLSearchParams(window.location.search);
const artistId = urlParams.get('artistId');

var namesId = 100
var namesChipsIds = []

const setInputValue = (field, value) => {
    const fieldInput = document.getElementById(field)
    fieldInput.value = value
}

const requestArtist = new XMLHttpRequest()
requestArtist.open('GET', `http://localhost:8080/api/artist/${artistId}`)
requestArtist.send()

requestArtist.addEventListener("readystatechange", () =>{
    if(requestArtist.readyState === 4){
        if(requestArtist.status == 200){
            const response = JSON.parse(requestArtist.response)

            setInputValue("artistName", response.artistName)
            setInputValue("birthDate", response.birthDate)
            setInputValue("country", response.country)
            setInputValue("initYear", response.initYear)
            setInputValue("endYear", response.endYear)

            fillNames(response.realName)

        }
        else{
            document.getElementById("artist").innerHTML = "Error " + requestArtist.status
        }
    }
    
})

const requestCountries = new XMLHttpRequest()
requestCountries.open('GET', "http://localhost:8080/api/enums/countries")
requestCountries.send()
requestCountries.addEventListener("readystatechange", () => {
    if(requestCountries.readyState === 4){
        if(requestCountries.status == 200){
            const genres = JSON.parse(requestCountries.response)
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

const modify = () => {
    const artistName = document.getElementById("artistName").value
    const realName = readNames()
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
        endYear: endYear,
        artistId: artistId
    }

    console.log("artist ", artist)

    request.open('PUT', url)
    request.setRequestHeader('Content-Type', 'application/json')
    let body = JSON.stringify(artist)
    request.send(body)
    console.log("body ", body)
    
    request.addEventListener("readystatechange", () =>{
        if(request.readyState === 4){
            if(request.status == 200){
                console.log(request.response)
                alert("Artista modificado exitosamente")
                location.href = "artist.html?artistId=" + artistId
            }
            else {
                alert("algo salio mal")
            }
        }
    })

    
}

const addName = () => {
    const nameInput = document.getElementById("realName")
    const name = nameInput.value
    if(name == "") {
        //TODO: agregar cheque de nombres iguales.
        return
    }
    const realNamesDiv = document.getElementById("realNames")

    const newNameChip = document.createElement("div")
    newNameChip.className = "chip"
    newNameChip.id = namesId
    newNameChip.innerHTML = `<button type="button" onClick="removeName(${namesId})"></button>${name}`

    console.log("newNameChip ", newNameChip)

    realNamesDiv.appendChild(newNameChip)

    nameInput.value = ""
    namesChipsIds.push(namesId)
    console.log("ids", namesChipsIds)
    namesId = namesId + 1

}

const fillNames = (names) => {
    const nameInput = document.getElementById("realName")
    names.forEach(name => {
        nameInput.value = name
        addName()
    })
    
}

const readNames = () => {
    const names = []
    namesChipsIds.forEach(id => {
        const nameChip = document.getElementById(id)
        names.push(nameChip.innerText)
    })
    console.log("names ", names)
    return names
}

const removeName = (id) => {
    document.getElementById(id).remove()
    namesChipsIds = namesChipsIds.filter(c => c != id)
    console.log("ids", namesChipsIds)
}

const navigateToInfo = () => {
    location.href = "artist.html?artistId=" + artistId
}