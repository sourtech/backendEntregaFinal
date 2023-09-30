const socketChat = io({
    autoConnect: true // si lo dejo en false como deberia, no me llega a mandar el emit login
});
let user = document.getElementById("user").value;
  
const chatBox = document.getElementById("text");
/*
Swal.fire({
    title: "identificate",
    text: "para acceder al chat coloca tu username",
    icon: "question",
    input: "text",
    inputValidator: (value) => {
        return !value && "necesitas registrarte antes de ingresar";
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
}).then((result) => {
    user = result.value;
    socketChat.connect();
    socketChat.emit("login", user);
});
  */
chatBox.addEventListener("keyup", (evt) => {
    if (evt.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socketChat.emit("logs", { user, message: chatBox.value.trim() });
        }
    }
});
  
socketChat.on("logs", (data) => {
    const msn = document.getElementById("messages");
    let message = "";
    chatBox.value = "";
    data.forEach((log) => {
        message += `<strong>${log.user}</strong> dice: ${log.message}<br/>`;
    });
    msn.innerHTML = message;
});
  
socketChat.on("newUserConnected", (data) => {
    if (!user) return;
    Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        title: `${data} se unio al chat`,
        icon: "success",
    });
});