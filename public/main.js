const socket = io()

let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
let buttonsend = document.querySelector('#sendjson')

let chatuser = JSON.parse(localStorage.getItem('chatUser'));
console.log("chatuser : ", chatuser)
let userName = chatuser.name;

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})

sendMessage = (message) => {
    let msg = {
        user: userName,
        message: message.trim()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)

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

//to send json data


buttonsend.addEventListener('click', (e) => {
    let obj = {
        name: "Gaurav Gavkar",
        department: "NodeJs",
        company: "Dynamisch",
        contact: 8433806625
    }
    console.log(obj)
    sendJson(obj)
})

const sendJson = (jsonData) => {
    console.log("jsonData in sendJson", jsonData)
    // Send to server 
    socket.emit('jsonData', jsonData)
}