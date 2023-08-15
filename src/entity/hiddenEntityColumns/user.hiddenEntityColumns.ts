import {Base} from "../base/base";
import {Column} from "typeorm";

export class UserHiddenEntityColumns extends Base{

    @Column({nullable: false, type: "varchar", default: "User"})
    role : string

}