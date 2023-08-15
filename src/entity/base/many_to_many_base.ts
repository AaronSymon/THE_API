import {CreateDateColumn, UpdateDateColumn} from "typeorm";

export class Many_To_Many_Base {

    @CreateDateColumn({type: "datetime"})
    createdAt: Date;

    @UpdateDateColumn({type: "datetime"})
    updatedAt: Date;

}