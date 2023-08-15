export function getFunctionParams(func: Function | object): string[] {
    // Récupérer le code source de la fonction
    const funcStr = func.toString();
    // Extraire les paramètres de la fonction à partir du code source
    const params = funcStr.slice(funcStr.indexOf('(') + 1, funcStr.indexOf(')')).split(',');
    // Supprimer les espaces blancs et les parenthèses des noms de paramètres
    return params.map((param) => param.trim().replace(/\/\*.*\*\//, '').split('=')[0]);
}