//Fonction getFunctionParams; retourne un tableau contenant les noms des paramètres d'une fonction
//Fucntion getFunctionParams; return an array containing the names of the parameters of a function
export function getFunctionParams(func: Function | object): string[] {
    // Récupérer le code source de la fonction
    // Get the source code of the function
    const funcStr = func.toString();

    // Extraire les paramètres de la fonction à partir du code source
    // Extract the function parameters from the source code
    const params = funcStr.slice(funcStr.indexOf('(') + 1, funcStr.indexOf(')')).split(',');

    // Supprimer les espaces blancs et les parenthèses des noms de paramètres
    // Remove whitespace and parentheses from parameter names
    return params.map((param) => param.trim().replace(/\/\*.*\*\//, '').split('=')[0]);
}