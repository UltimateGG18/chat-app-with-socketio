const socket = io()

let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
let buttonsend = document.querySelector('#sendjson')

let chatuser = JSON.parse(localStorage.getItem('chatUser'));
console.log("chatuser : ", chatuser)
let userName = chatuser.name;
let email = chatuser.email;
let contact = chatuser.mobile
let chatUserId = chatuser.id
let receiverId
// do {
//     receiverId = prompt('enter receiver id')
// } while (!receiverId)

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})

//to send userid to server
socket.emit('loggedInUser', chatUserId)
//to send receiver id to server
socket.emit('receiver', receiverId)


sendMessage = (message) => {
    let msg = {
        id: chatUserId,
        user: userName,
        email: email,
        contact: contact,
        message: message.trim(),
        receiver: receiverId,
        date: new Date().toString()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)

    //to store messages in database
    let url = `http://localhost:3030/saveMessage`
    axios.post(url).then((res) => {
        console.log(res)
    }).catch((err) => {
        console.log(err.response.data)
    })

}

appendMessage = (msg, type) => {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}

// Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})

scrollToBottom = () => {
    messageArea.scrollTop = messageArea.scrollHeight
}

//to check whether user online or not
socket.once("connect", () => {

    // USER IS ONLINE
    socket.on("online", (userId) => {
        console.log(userId, "Is Online!"); // update online status
    });

    // USER IS OFFLINE
    socket.on("offline", (userId) => {
        console.log(userId, "Is Offline!"); // update offline status
    });

});


//to send json data
// buttonsend.addEventListener('click', (e) => {
//     let obj = {
//         name: "Gaurav Gavkar",
//         department: "NodeJs",
//         company: "Dynamisch",
//         contact: 8433806625
//     }
//     console.log(obj)
//     sendJson(obj)
// })

// const sendJson = (jsonData) => {
//     console.log("jsonData in sendJson", jsonData)
//     // Send to server 
//     socket.emit('jsonData', jsonData)
// }