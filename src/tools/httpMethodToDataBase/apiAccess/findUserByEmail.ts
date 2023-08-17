//Import AppDataSource
import {AppDataSource} from "../../../data-source.config";

//Import entity
import {User} from "../../../entity/user.entity";

//Fonction findUserByEmail, permet de trouver un utilisateur par son email
//Function findUserByEmail, allows to find a user by his email
export default async function findUserByEmail(email: string) {

    //Récupération du repository User
    //Get the User repository
    const userRepository = AppDataSource.getRepository(User);

    //Retourne l'utilisateur trouvé
    //Return the user found
    return await userRepository.findOne({where: {email: email}});
}