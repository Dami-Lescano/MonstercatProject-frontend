const request = new XMLHttpRequest()
const url = "http://localhost:8080/api/song/songsItems"
request.open('GET', url)
request.send()

request.addEventListener("readystatechange", () => {
    if(request.readyState === 4){
        if(request.status == 200){
            let songsList = ''
            const songs = JSON.parse(request.response)

            songs.forEach(element => {
                songsList += `<p><a href="song.html?songId=${element.id}">${element.fullName}</a></p>`
                
            })

            document.getElementById("list").innerHTML = songsList
        }
        else {
            document.getElementById("list").innerHTML = "Error " + request.status
        }
    }
})