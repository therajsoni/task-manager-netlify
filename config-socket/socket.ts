import {io, Socket} from "socket.io-client";
let socket : Socket;
export const getSocket = ():Socket => {
    if (socket) {
        return socket;
    }
    console.log(socket, "socket");
    
    socket = io("http://localhost:3001",{
        autoConnect : false,
    })

    return socket;
}