//Fonction servant à déterminer si un objet pris en paramètre est vide ou non
export default function isObjectNotEmpty(object: object): boolean {
    return Object.keys(object).length > 0;
}