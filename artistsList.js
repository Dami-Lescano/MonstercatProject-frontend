const request = new XMLHttpRequest()
const url = "http://localhost:8080/api/artist/namesAndIds"
request.open('GET', url)
request.send()

request.addEventListener("readystatechange", () => {
    if(request.readyState === 4){
        if(request.status == 200){
            let artistsList = ''
            const artists = JSON.parse(request.response)

            artists.forEach(element => {
                artistsList += `<p><a href="artist.html?artistId=${element.artistId}">${element.artistName}</a></p>`
                
            })

            document.getElementById("list").innerHTML = artistsList
        }
        else {
            document.getElementById("list").innerHTML = "Error " + request.status
        }
    }
})