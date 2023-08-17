//Définir ici les différents type d'utilisateur qui seront utilisés dans l'application pour les droits d'accès.
//Lors de la génération des fichiers access, chaque type d'utilisateur aura un ensemble d'accès attribué qui pouront être géré

//Define here the different types of users that will be used in the application for access rights.
//When generating access files, each type of user will have a set of assigned access that can be managed
export const userRoles: Set<string> = new Set([
    "User",
    "Admin",
    "SuperAdmin"
]);