const socket = io('/')


const findBuddy = () => {
    console.log("starting to search for buddy!");
    var elem = document.querySelectorAll('.chips')[0];
    var instance = M.Chips.getInstance(elem);
    const interestList = instance.chipsData.map(el => el.tag);

    console.log(interestList);
    const spinner = document.getElementById('spinner');
    const findBuddyButton = document.getElementById('findBuddyButton');
    const stopSearchingButton = document.getElementById('stopSearchingButton');

    spinner.classList.add('active');
    findBuddyButton.classList.add('disabled');
    stopSearchingButton.classList.remove('disabled');
    socket.emit('find-buddy', interestList)
}

const stopSearching = () => {
    console.log("search cancelled!");

    const spinner = document.getElementById('spinner');
    const findBuddyButton = document.getElementById('findBuddyButton');
    const stopSearchingButton = document.getElementById('stopSearchingButton');

    spinner.classList.remove('active');
    findBuddyButton.classList.remove('disabled');
    stopSearchingButton.classList.add('disabled');
    socket.emit('stop-searching')
}

socket.on('buddy-found', roomID => {
    window.location.href = `/room/${roomID}`;
})