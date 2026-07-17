export default class IlumScene extends Phaser.Scene {

    constructor(){

        super("IlumScene");

    }


    init(data){

        this.session = data.session;

    }


    create(){

        this.add.text(
            400,
            300,
            "ILUM GAME"
        );

    }

}