//Fonction servant à déterminer si un objet pris en paramètre est vide ou non
//Function used to determine if an object taken as a parameter is empty or not
export default function isObjectNotEmpty(object: object): boolean {
    return Object.keys(object).length > 0;
}