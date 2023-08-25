import {PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Entity, Column, ManyToMany,  JoinTable, } from "typeorm";
    import {Question} from "./question.entity";
    
    @Entity()
    export class Category {
        
        @PrimaryGeneratedColumn({type: "int"})
        id : number;
    
        @CreateDateColumn({type: "datetime"})
        createdAt: Date;
    
        @UpdateDateColumn({type: "datetime"})
        updatedAt: Date;
        
        @Column({nullable: false, unique: true, type: "varchar", }) 
        name: string 
         
         @ManyToMany(   () => Question, (question) => question.categories)
          
         questions: Question []  
    
    }
    