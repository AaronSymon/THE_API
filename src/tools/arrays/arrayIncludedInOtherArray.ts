//Fonction servant à vérifier si le contenu d'un tableau est inclut dans le contenu d'un second tableau
//Retourne true si c'est le cas, false sinon
//Function used to check if the content of an array is included in the content of a second array
//Returns true if it is the case, false otherwise
export default function arrayIncludedInOtherArray(array1: string[], array2: string[]): boolean {
    return array1.every((item: string) => array2.includes(item));
}