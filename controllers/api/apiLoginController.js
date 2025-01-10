import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import User from '../../models/User.js'

export async function loginJWT(req, res, next) {
    try {

        //http://localhost:3000/api/login

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
        jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '2d'
        }, (err, tokenJWT) => {
            if (err) {
                next(err)
                return
            }
            res.json({ tokenJWT })
        })

    } catch (error) {
        next(error)
    }
}