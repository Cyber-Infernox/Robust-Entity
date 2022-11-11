alert("connected");
const socket = io('http://localhost:8000');
const form= document.getElementById('sendcontainer');
const messageInput = document.getElementById('minput')
const messageContainer = document.querySelector(".container")
const append =(message,position)=>{
    const messageELement = document.createElement('div')
    messageELement.innerText = message;
    messageELement.classList.add('message')
    messageELement.classList.add('position');
    messageContainer.append(messageELement);
}
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`you:${message}`,'right')
    socket.emit('send',message);
    messageInput.value =''
})
const  username = prompt("Enter your name to join");
socket.emit('new-user-joined', username)

socket.on('user-joined',username=>{
    append(`${username} joined the chat `,'right')

})

socket.on('recieve', data=>{
    append(`${data.username} :${data.message}`,'left')
})
socket.on('leave', username=>{
    append(`${username} left the chat`,'left')
})
