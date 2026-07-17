class SessionManager {


    constructor(){

        this.sessions = {};

    }






    createSession(map){


        const id =
        Math.random()
        .toString(36)
        .substring(2,8)
        .toUpperCase();




        this.sessions[id] = {


            id:id,


            map:map,


            players:[]


        };



        return this.sessions[id];


    }







    getSession(id){


        return this.sessions[id];


    }








    joinSession(id, player){



        const session =
        this.sessions[id];



        if(!session){


            return null;


        }



        session.players.push(
            player
        );



        return session;


    }








    removePlayer(socketId){



        for(
            const id in this.sessions
        ){



            const session =
            this.sessions[id];





            const index =
            session.players.findIndex(
                p=>p.id === socketId
            );





            if(index !== -1){



                const player =
                session.players[index];



                session.players.splice(
                    index,
                    1
                );





                // Si plus personne
                // on détruit la session


                if(session.players.length === 0){



                    delete this.sessions[id];



                    return {

                        session:null,

                        player:player

                    };


                }






                return {


                    session:session,

                    player:player


                };


            }


        }





        return null;


    }




}


module.exports = SessionManager;