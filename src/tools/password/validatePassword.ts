const passwordValidator = require('password-validator');


//Fonction validatePassword, charger de définir les règles de validation du mot de passe
//Function validatePassword, in charge of defining the password validation rules
//et de renvoyer un boolean en fonction de la validité du mot de passe
//and return a boolean depending on the validity of the password
export async function validatePassword (password : string): Promise<Boolean | any[]> {

    //Création d'un schema de validation
    //Creation of a validation schema
    let schema = new passwordValidator()

    schema
        .is().min(8)                                     // Minimum length 8
        .is().max(100)                                   // Maximum length 100
        .has().uppercase()                                    // Must have uppercase letters
        .has().lowercase()                                    // Must have lowercase letters
        .has().digits()                                       // Must have at least 2 digits
        .has().symbols()                                      // Must have symbol
        .has().not().spaces()                                 // Should not have spaces
        .is().not().oneOf(['Passw0rd', 'Password123']);   // Blacklist these values

    //Renvoie un boolean en fonction de la validité du mot de passe
    //Returns a boolean depending on the validity of the password
    return (schema.validate(password))

}