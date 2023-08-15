import * as bcrypt from 'bcrypt';


export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
// Utilisation de la méthode compare de bcrypt pour comparer le mot de passe non crypté avec le mot de passe crypté
// Retourne le résultat de la comparaison sous forme de booléen
    return await bcrypt.compare(password, hashedPassword);
}