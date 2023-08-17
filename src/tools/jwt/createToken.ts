//Import Jwt
const jwt = require('jsonwebtoken');

//Fonction createToken, permet de créer un token jwt
//Function createToken, allows to create a jwt token
export default function createToken (userPayLoad: userPayload): string {

    // Générer le token jwt
    // Generate the jwt token
    return jwt.sign(userPayLoad, process.env.TK_SECRETKEY, {expiresIn: process.env.TK_VALIDTOKENTIMER});

}