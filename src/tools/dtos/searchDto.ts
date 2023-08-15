export function searchDto(dtos: Function[] | object[], researchedDto: string): Function | undefined {

    researchedDto = `${researchedDto}Dto`

    let foundDto: Function | undefined

    dtos.some(dto =>{

        if (dto.name === researchedDto){
            foundDto = dto
            return true
        }
        return false
    })

    return foundDto
}