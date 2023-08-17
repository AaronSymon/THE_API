//Fonction serchDto, permet de rechercher un dto dans un tableau de dto
//Function searchDto, allows to search a dto in a dto array
export function searchDto(dtos: Function[] | object[], researchedDto: string): Function | undefined {

    //Ajouter le suffixe "Dto" au dto recherché
    //Add the suffix "Dto" to the searched dto
    researchedDto = `${researchedDto}Dto`

    //Initialiserla variable foundDto
    //Initialize the variable foundDto
    let foundDto: Function | undefined

    //Parcourir le tableau de dto
    //Browse the dto array
    dtos.some(dto =>{
        //Si le dto est égal au dto recherché, on l'assigne à la variable foundDto
        //If the dto is equal to the searched dto, we assign it to the variable foundDto
        if (dto.name === researchedDto){

            //Assigner le dto à la variable foundDto
            //Assign the dto to the variable foundDto
            foundDto = dto

            //Retourner true pour arrêter la boucle
            //Return true to stop the loop
            return true
        }

        //Retourner false pour continuer la boucle
        //Return false to continue the loop
        return false
    })

    //Retourner le dto trouvé
    //Return the found dto
    return foundDto
}