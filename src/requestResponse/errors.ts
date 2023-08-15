export const error403 : responseMessage = {
    status : 403,
    message : {message: 'access Forbidden'}
}

export const emailOrPasswordUndefinedError : responseMessage = {
    status : 400,
    message : {message: 'Email and password required !'}
}

export const emailFormatError : responseMessage = {
    status : 400,
    message : {message: 'Email format must be valid'}
}

export const passwordFormatError : responseMessage = {
    status : 400,
    message : {message: 'Password format must be valid'}
}
export const emailAndPasswordFormatError : responseMessage = {
    status : 400,
    message : {message: 'Email and password format must be valid'}
}
export const emailAlreadyUsedError : responseMessage = {
    status : 409,
    message : {message: 'Email already used'}
}
export const userNotFoundByEmail : responseMessage = {
    status : 404,
    message : {message: 'Invalid email or password'}
}

export const ipAdressOrUserAgentError : responseMessage = {
    status : 403,
    message : {message: 'Token invalide ou expiré. Accès refusé.'}
}

export const errorTest : responseMessage = {
    status : 403,
    message : {message: 'access Forbidden pour accéder à cette ressource'}
}
