import MessageManager from '../dao/mongo/managers/massageManager.js';

/* DEBERIA PASARLO A REPOSITORY POR EL MOMENTO QUEDA ASI */

const chat = new MessageManager();    

export default function chatRealTime(io){

    io.on("connection", async (socket) => {
        console.log("chat conectado");
        try {
            const messages = await chat.getMessages();
            socket.emit("logs", messages);
        } catch (error) {
            console.error("No se pueden obtener mensajes");
        }
        socket.on("logs", async (data) => {
            try {
                // guardo
                const message = await chat.sendMessage(data);
                // traigo todos nuevamente
                const messages = await chat.getMessages();
                io.emit("logs", messages);
            } catch (error) {
                console.error("Error guardar", error);
            }
        });
        socket.on("login", async (data) => {
            console.log(data);
            socket.broadcast.emit("newUserConnected", data);
        });
    });    

}
