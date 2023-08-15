const jwt = require('jsonwebtoken');
export default function createToken (userPayLoad: userPayload): string {

    // Générer le token jwt
    return jwt.sign(userPayLoad, process.env.TK_SECRETKEY, {expiresIn: process.env.TK_VALIDTOKENTIMER});

}