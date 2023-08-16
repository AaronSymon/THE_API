import {Column, Entity, JoinTable, ManyToMany} from "typeorm";
import {Base} from "./base/base";
import {Category} from "./category.entity";

@Entity()
export class Question extends Base{


    @Column({nullable: false, type: "varchar"})
    title: string

    @Column({nullable: false, type: "varchar"})
    text: string

    @ManyToMany(() => Category, (category) => category.questions)
    @JoinTable()
    categories: Category[]
}