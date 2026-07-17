const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const SessionManager = require("./SessionManager");
const EVENTS = require("./events");


const app = express();

app.use(cors());


const server =
http.createServer(app);


const io =
new Server(server,{
    cors:{
        origin:"*"
    }
});


const sessions =
new SessionManager();



io.on(
"connection",
(socket)=>{


    console.log(
        "Connexion :",
        socket.id
    );



    socket.on(
        EVENTS.CREATE_SESSION,
        (data)=>{


            const session =
            sessions.createSession(
                data.map
            );


            const player = {

                id:socket.id,

                name:
                data.name || "Player",

                avatar:
                data.avatar || "SAMOYED_1",

                role:null,

                ready:false

            };


            session.players.push(
                player
            );


            socket.join(
                session.id
            );


            socket.emit(
                EVENTS.SESSION_CREATED,
                session
            );


            io.to(
                session.id
            )
            .emit(
                EVENTS.PLAYERS_UPDATED,
                session
            );


        }
    );





    socket.on(
        EVENTS.JOIN_SESSION,
        (data)=>{


            const player = {

                id:socket.id,

                name:
                data.name || "Player",

                avatar:
                data.avatar || "SAMOYED_1",

                role:null,

                ready:false

            };


            const session =
            sessions.joinSession(
                data.sessionId,
                player
            );


            if(!session){


                socket.emit(
                    "join_error",
                    "Code invalide"
                );


                return;


            }



            socket.join(
                session.id
            );


            socket.emit(
                EVENTS.SESSION_JOINED,
                session
            );



            io.to(
                session.id
            )
            .emit(
                EVENTS.PLAYERS_UPDATED,
                session
            );


        }
    );





    socket.on(
        EVENTS.CHANGE_ROLE,
        (data)=>{


            const sessionId =
            getSessionId(socket);



            if(!sessionId)
                return;



            const session =
            sessions.changeRole(
                sessionId,
                socket.id,
                data.role
            );



            if(!session)
                return;



            io.to(
                sessionId
            )
            .emit(
                EVENTS.PLAYERS_UPDATED,
                session
            );


        }
    );





    socket.on(
        EVENTS.PLAYER_READY,
        ()=>{


            const sessionId =
            getSessionId(socket);



            if(!sessionId)
                return;



            const session =
            sessions.setReady(
                sessionId,
                socket.id
            );



            if(!session)
                return;



            io.to(
                sessionId
            )
            .emit(
                EVENTS.PLAYERS_UPDATED,
                session
            );



            if(
                sessions.allReady(
                    sessionId
                )
            ){


                let count = 5;



                const timer =
                setInterval(
                ()=>{


                    io.to(
                        sessionId
                    )
                    .emit(
                        EVENTS.GAME_COUNTDOWN,
                        count
                    );


                    count--;



                    if(count < 0){


                        clearInterval(
                            timer
                        );


                        io.to(
                            sessionId
                        )
                        .emit(
                            EVENTS.START_GAME,
                            session
                        );


                    }


                },
                1000
                );


            }


        }
    );





    socket.on(
        EVENTS.CHAT_MESSAGE,
        (message)=>{


            const sessionId =
            getSessionId(socket);



            if(!sessionId)
                return;



            const session =
            sessions.getSession(
                sessionId
            );


            if(!session)
                return;



            const player =
            session.players.find(
                p=>p.id === socket.id
            );



            io.to(
                sessionId
            )
            .emit(
                EVENTS.CHAT_MESSAGE,
                {

                    name:
                    player
                    ? player.name
                    : "Player",

                    message:message

                }
            );


        }
    );





    socket.on(
        "disconnect",
        ()=>{


            const result =
            sessions.removePlayer(
                socket.id
            );



            if(!result)
                return;



            if(result.session){


                io.to(
                    result.session.id
                )
                .emit(
                    EVENTS.PLAYERS_UPDATED,
                    result.session
                );


            }


        }
    );


});





function getSessionId(socket){


    return Array.from(
        socket.rooms
    )
    .find(
        room=>room !== socket.id
    );


}





const PORT =
process.env.PORT || 3000;


server.listen(
PORT,
"0.0.0.0",
()=>{


    console.log(
        "Serveur EscapeIlum lancé sur le port",
        PORT
    );


});