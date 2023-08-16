import {Entity, Column, OneToOne, JoinColumn, OneToMany} from "typeorm"
import {UserHiddenEntityColumns} from "./hiddenEntityColumns/user.hiddenEntityColumns";
import {Profile} from "./profile.entity";
import {Photo} from "./photo.entity";
@Entity()
export class User extends UserHiddenEntityColumns{

    @Column({nullable: false, unique: true, type: "varchar"})
    email: string;

    @Column({nullable: false, type: "varchar"})
    password: string;

    @Column({nullable: false, type: "varchar"})
    nom: string;

    @Column({nullable: false, type: "varchar"})
    prenom: string;

    @OneToOne(() => Profile, (profile) => profile.user) // specify inverse side as a second parameter
    @JoinColumn()
    profile: Profile

    @OneToMany(() => Photo, (photo) => photo.user)
    photos: Photo[]

}
