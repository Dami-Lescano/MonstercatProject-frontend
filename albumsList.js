const requestCompilation = new XMLHttpRequest()
requestCompilation.open('GET', "http://localhost:8080/api/album/compilationAlbum/list")
requestCompilation.send()

requestCompilation.addEventListener("readystatechange", () => {
    if(requestCompilation.readyState === 4){
        if(requestCompilation.status == 200){
            let albumsList = ''
            const albums = JSON.parse(requestCompilation.response)

            albums.forEach(element => {
                albumsList += `<p><a href="album.html?albumId=${element.id}&albumType=${element.type}">${element.title}</a></p>`
                
            })

            document.getElementById("compilationAlbumList").innerHTML = albumsList
        }
        else {
            document.getElementById("compilationAlbumList").innerHTML = "Error " + requestCompilation.status
        }
    }
})

const requestArtist = new XMLHttpRequest()
requestArtist.open('GET', "http://localhost:8080/api/album/artistAlbum/list")
requestArtist.send()

requestArtist.addEventListener("readystatechange", () => {
    if(requestArtist.readyState === 4){
        if(requestArtist.status == 200){
            let albumsList = ''
            const albums = JSON.parse(requestArtist.response)

            albums.forEach(element => {
                albumsList += `<p><a href="album.html?albumId=${element.id}&albumType=${element.type}">${element.title}</a></p>`
                
            })

            document.getElementById("artistAlbumList").innerHTML = albumsList
        }
        else {
            document.getElementById("artistAlbumList").innerHTML = "Error " + requestArtist.status
        }
    }
})