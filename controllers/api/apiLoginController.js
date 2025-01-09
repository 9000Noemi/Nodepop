import User from '../../models/User.js'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'

export async function loginJWT(req, res, next) {
    try {
        //Recoger los parametros de entrada que nos pasan
        const { email, password } = req.body

        // buscar el usuario en la base de datos
        const user = await User.findOne({ email: email.toLowerCase() })

        // si no lo encuentro, o la contraseña no coincide:
        if (!user || !(await user.comparePassword(password))) {
            next(createError(401, 'invalid credentials'))
            return
        }

        //si lo encuentra y coincide la contraseña se emite el JWT


    } catch (error) {
        next(error)
    }
}