import {PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Entity, Column, ManyToMany,  JoinTable, } from "typeorm";
    import {Category} from "./category.entity";
    
    @Entity()
    export class Question {
        
        @PrimaryGeneratedColumn({type: "int"})
        id : number;
    
        @CreateDateColumn({type: "datetime"})
        createdAt: Date;
    
        @UpdateDateColumn({type: "datetime"})
        updatedAt: Date;
        
        @Column({nullable: false, unique: false, type: "varchar", }) 
        title: string
        
        @Column({nullable: false, unique: false, type: "varchar", }) 
        text: string 
         
         @ManyToMany(   () => Category, (category) => category.questions)
          @JoinTable()
         categories: Category []  
    
    }
    