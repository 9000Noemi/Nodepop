import jwt from 'jsonwebtoken'
import createError from 'http-errors'

//Middleware para verificar si llega un token válido

export function verifyToken(req, res, next) {

    //Sacar el tokenJWT de la cabecera, body o de la query string:
    const tokenJWT = req.get('Authorization') || req.body.jwt || req.query.jwt

    //Si no hay token responder con un error 401(Unauthorized):
    if (!tokenJWT) {
        next(createError(401, 'No token provided'))
        return
    }

    //Comprobar que el token es valido:
    jwt.verify(tokenJWT, process.env.JWT_SECRET, (err, payload) => {
        //Si no es valido responder con un error 401(Unauthorized):
        if (err) {
            next(createError(401, 'Invalid token'))
            return
        }
        //Si es válido dejar pasar al usuario:
        next()
    })
}
