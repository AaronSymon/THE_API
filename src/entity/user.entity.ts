import {Entity, Column} from "typeorm"
import {UserHiddenEntityColumns} from "./hiddenEntityColumns/user.hiddenEntityColumns";
@Entity()
export class User extends UserHiddenEntityColumns{

    @Column({nullable: false, unique: true, type: "varchar"})
    email: string;

    @Column({nullable: false, type: "varchar"})
    password: string;

    @Column({nullable: false, type: "varchar"})
    nom: string;

    @Column({nullable: false, type: "varchar"})
    prenom: string;

}
