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









    // CREATION SESSION


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


                x:5,


                y:5


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





            console.log(
                "Session créée :",
                session.id
            );



        }
    );













    // REJOINDRE SESSION


    socket.on(
        EVENTS.JOIN_SESSION,
        (data)=>{



            const player = {


                id:socket.id,


                name:
                data.name || "Player",


                avatar:
                data.avatar || "SAMOYED_1",


                x:5,


                y:5


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
                session.players
            );





            console.log(

                player.name,
                "a rejoint",
                session.id

            );



        }
    );













    // CHAT


    // CHAT


socket.on(
    EVENTS.CHAT_MESSAGE,
    (message)=>{


        const rooms =
        Array.from(
            socket.rooms
        );



        const sessionId =
        rooms.find(
            room=>room !== socket.id
        );



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





        const chatMessage = {


            name:
            player
            ? player.name
            : "Player",


            message:message


        };






        io.to(
            sessionId
        )
        .emit(
            EVENTS.CHAT_MESSAGE,
            chatMessage
        );


    }
);












    // DECONNEXION


    socket.on(
        "disconnect",
        ()=>{



            console.log(
                "Déconnexion :",
                socket.id
            );






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
                    result.session.players
                );


            }






        }
    );





});









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