import {Entity, Column, OneToOne} from "typeorm"
import {Base} from "./base/base";
import {User} from "./user.entity";

@Entity()
export class Profile extends Base{

    @Column({nullable: false, type: "varchar"})
    gender: string

    @Column({nullable: false, type: "varchar"})
    photo: string

    @OneToOne(() => User, (user) => user.profile) // specify inverse side as a second parameter
    user: User

}