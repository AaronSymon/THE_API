const passwordValidator = require('password-validator');


export async function validatePassword (password : string): Promise<Boolean | any[]> {
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

    return (schema.validate(password))

}