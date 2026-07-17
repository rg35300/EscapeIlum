export default class EmployeeScene extends Phaser.Scene {

    constructor(){

        super("EmployeeScene");

    }


    init(data){

        this.session = data.session;

    }


    create(){

        this.add.text(
            400,
            300,
            "EMPLOYEE GAME"
        );

    }

}