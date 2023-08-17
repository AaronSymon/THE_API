import * as bcrypt from 'bcrypt';

//Fonction comparePasswords, charger de comparer le mot de passe non crypté avec le mot de passe crypté
//Function comparePasswords, in charge of comparing the non-encrypted password with the encrypted password
export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
// Utilisation de la méthode compare de bcrypt pour comparer le mot de passe non crypté avec le mot de passe crypté
// Use the compare method of bcrypt to compare the non-encrypted password with the encrypted password
// Retourne le résultat de la comparaison sous forme de booléen
// Returns the result of the comparison as a boolean
    return await bcrypt.compare(password, hashedPassword);
}