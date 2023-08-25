import {PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Entity, Column, OneToOne,OneToMany, JoinColumn,  } from "typeorm";
    import {Profile} from "./profile.entity";
    import {Photo} from "./photo.entity";
    
    @Entity()
    export class User {
        
        @PrimaryGeneratedColumn({type: "int"})
        id : number;
    
        @CreateDateColumn({type: "datetime"})
        createdAt: Date;
    
        @UpdateDateColumn({type: "datetime"})
        updatedAt: Date;
        
        @Column({nullable: false, unique: false, type: "varchar", default: "User",}) 
        role: string
        
        @Column({nullable: false, unique: true, type: "varchar", }) 
        email: string
        
        @Column({nullable: false, unique: false, type: "varchar", }) 
        password: string
        
        @Column({nullable: false, unique: false, type: "varchar", }) 
        nom: string
        
        @Column({nullable: false, unique: false, type: "varchar", }) 
        prenom: string 
         
         @OneToOne(() => Profile, (profile) => profile.user   )
         @JoinColumn() 
         profile: Profile 
         
         @OneToMany( () => Photo, (photo) => photo.user  )
          
         photos: Photo []  
    
    }
    