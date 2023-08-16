import {Column, Entity, ManyToOne} from "typeorm";
import {Base} from "./base/base";
import {User} from "./user.entity";

@Entity()
export class Photo extends Base{


    @Column({nullable: false, type: "varchar"})
    url: string

    @ManyToOne(() => User, (user) => user.photos)
    user: User
}