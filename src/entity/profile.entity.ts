import {PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Entity, Column, OneToOne, JoinColumn,  } from "typeorm";
    import {User} from "./user.entity";
    
    @Entity()
    export class Profile {
        
        @PrimaryGeneratedColumn({type: "int"})
        id : number;
    
        @CreateDateColumn({type: "datetime"})
        createdAt: Date;
    
        @UpdateDateColumn({type: "datetime"})
        updatedAt: Date;
        
        @Column({nullable: false,  type: "varchar", }) 
        gender: string
        
        @Column({nullable: false,  type: "varchar", }) 
        photo: string 
         
         @OneToOne(() => User, (user) => user.profile   )
         @JoinColumn() 
         user: User   
    
    }
    