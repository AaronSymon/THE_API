import {Column, Entity, ManyToMany} from "typeorm";
import {Base} from "./base/base";
import {Question} from "./question.entity";

@Entity()
export class Category extends Base{

    @Column({nullable: false, type: "varchar"})
    name: string

    @ManyToMany(() => Question, (question) => question.categories)
    questions: Question[]

}