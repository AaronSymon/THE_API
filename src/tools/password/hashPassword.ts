import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
    // On génère un sel aléatoire en utilisant bcrypt avec un paramètre de complexité de 10.
    const salt = await bcrypt.genSalt(10);

    // On utilise bcrypt pour hasher le mot de passe en utilisant le sel généré précédemment
    const hashedPassword = await bcrypt.hash(password, salt);

    // On renvoie le mot de passe hashé
    return hashedPassword;

}