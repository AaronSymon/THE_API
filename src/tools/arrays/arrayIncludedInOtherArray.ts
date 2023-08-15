//Fonction servant à vérifier si le contenu d'un tableau est inclut dans le contenu d'un second tableau
export default function arrayIncludedInOtherArray(array1: string[], array2: string[]): boolean {
    return array1.every((item: string) => array2.includes(item));
}