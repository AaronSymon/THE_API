import {CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

//Base est la classe mère de toutes les entités.
//Elle possède pour attribut :
// - id qui est la clé primaire de tout les entity
// - createdAt qui est la date de création
// - updatedAt qui est la date de dernière mise à jour.
export class Base{
    @PrimaryGeneratedColumn({type: "int"})
    id : number;

    @CreateDateColumn({type: "datetime"})
    createdAt: Date;

    @UpdateDateColumn({type: "datetime"})
    updatedAt: Date;

}