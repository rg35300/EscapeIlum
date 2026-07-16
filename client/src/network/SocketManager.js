import { io } from "socket.io-client";


class SocketManager {


    constructor(){

        this.socket = null;

    }



    connect(){

    if(this.socket){
        return;
    }


    this.socket = io(
        "http://localhost:3000"
    );


    this.socket.on(
        "connect",
        ()=>{

            console.log(
                "Connecté au serveur :",
                this.socket.id
            );

        }
    );

}



    createSession(data){


    this.socket.emit(
        "create_session",
        data
    );


}



    onSessionCreated(callback){


        this.socket.on(
            "session_created",
            callback
        );


    }

    joinSession(data){


    this.socket.emit(
        "join_session",
        data
    );


}



onSessionJoined(callback){


    this.socket.on(
        "session_joined",
        callback
    );


}


}


export default new SocketManager();