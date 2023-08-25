import {PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Entity, Column, ManyToOne,   } from "typeorm";
    import {User} from "./user.entity";
    
    @Entity()
    export class Photo {
        
        @PrimaryGeneratedColumn({type: "int"})
        id : number;
    
        @CreateDateColumn({type: "datetime"})
        createdAt: Date;
    
        @UpdateDateColumn({type: "datetime"})
        updatedAt: Date;
        
        @Column({nullable: false, unique: false, type: "varchar", }) 
        url: string 
         
         @ManyToOne(  () => User, (user) => user.photos )
          
         user: User   
    
    }
    