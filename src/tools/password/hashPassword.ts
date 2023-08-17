import * as bcrypt from 'bcrypt';

//Fonction hashPassword qui permet de hasher un mot de passe
//Function hashPassword that allows to hash a password
//Elle prend en paramètre un mot de passe et renvoie une promesse d'un mot de passe hashé
//It takes a password as a parameter and returns a promise of a hashed password
export async function hashPassword(password: string): Promise<string> {
    //Générer un sel aléatoire en utilisant bcrypt avec un paramètre de complexité de 10.
    //Generare a random salt using bcrypt with a complexity parameter of 10
    //Plus la complexité est élevée, plus le sel sera long à générer mais plus le hash sera sécurisé
    const salt = await bcrypt.genSalt(10);

    //Utiliser bcrypt pour hasher le mot de passe en utilisant le sel généré précédemment
    //Use bcrypt to hash the password using the salt generated previously
    //Renvoyer le mot de passe hashé
    //Return the hashed password
    return await bcrypt.hash(password, salt);

}