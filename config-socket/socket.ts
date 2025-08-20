import {io, Socket} from "socket.io-client";
let socket : Socket;
export const getSocket = ():Socket => {
    if (socket) {
        return socket;
    }
    console.log(socket, "socket");
    
    socket = io(process.env.APP_URL,{
        autoConnect : false,
    })

    return socket;
}