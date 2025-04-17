const request = new XMLHttpRequest()
const url = "http://localhost:8080/api/album/albumsList"
request.open('GET', url)
request.send()

request.addEventListener("readystatechange", () => {
    if(request.readyState === 4){
        if(request.status == 200){
            let albumsList = ''
            const albums = JSON.parse(request.response)

            albums.forEach(element => {
                albumsList += `<p><a href="album.html?albumId=${element.id}">${element.title}</a></p>`
                
            })

            document.getElementById("list").innerHTML = albumsList
        }
        else {
            document.getElementById("list").innerHTML = "Error " + request.status
        }
    }
})