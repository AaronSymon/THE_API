type entityCache = {
    entity: Function,
    isEntityCached: boolean
}

type entityAccess = {
        userRole: string,
        accessMethods: Set<string>,
        getAccessParams: Array<string>
}

type responseMessage = {
    status: number,
    message: { message: string }
}

type userPayload = {
    id: number,
    email: string,
    role: string,
    userAgent: string
    ipAdress: string
}

type personalizedController = {
    controllerName: string,
    controllerParams: {paramName: string, paramType: string, paramRegex: string,}[],
    controller: Function
}
