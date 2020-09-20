const socket = io('/')





const findBuddy = () => {
    console.log("starting to search for buddy!");
    socket.emit('find-buddy', ['dota'])
}

const stopSearching = () => {
    console.log("search cancelled!");
    socket.emit('stop-searching')
}

socket.on('buddy-found', roomID => {
    window.location.href = `/room/${roomID}`;
})