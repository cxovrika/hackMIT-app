const socket = io('/')
const videos = document.getElementById('videos-container')

myPeer = new Peer()

const myVideo = document.createElement('video')
myVideo.muted = true

const peers = {}



socket.on('user-disconnected', userId => {
    if (peers[userId]) {
        peers[userId][1].remove()
        peers[userId][0].close()
        delete peers[userId]
    }
    // peers.remove(userId)
})

myPeer.on('open', id => {
    console.log('peer id:' + id)

    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then(stream => {
        myVideo.classList.add('myvid')
        addVideoStream(myVideo, stream)

        myPeer.on('call', call => {
            call.answer(stream)
            // console.log(call)
            const video = document.createElement('video')
            call.on('stream', userVideoStream => {
                peers[call.peer] = [call, video]
                addVideoStream(video, userVideoStream)
            })
        })

        socket.on('user-connected', userId => {
            connectToNewUser(userId, stream)
        })

        socket.emit('join-room', ROOM_ID, id)
    })
})

function connectToNewUser(userId, mystream) {
    const call = myPeer.call(userId, mystream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream, )
    })
    call.on('close', () => {
        video.remove()
    })

    peers[userId] = [call, video]
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videos.append(video)
}