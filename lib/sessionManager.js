import session from 'express-session'
import MongoStore from 'connect-mongo'
const INACTIVITY_EXPIRATION_2_DAYS = 1000 * 60 * 60 * 24 * 2

/**
 * Middleware para gestionar sesiones:
 */

export const middleware = session({

    //nombre de la cookie:
    name: 'nodepop-session',

    //para que los token de sesion generados sean unicos:
    secret: 'w3x4vKBk9Ap6PnyQbz5TYF',

    //forzar que una sesion que no este inicializada se guarde en el store
    saveUninitialized: true,

    //forzar que una sesion se guarde incluso si no ha sido modificada
    resave: false,

    //tiempo max de vida de la cookie
    cookie: { maxAge: INACTIVITY_EXPIRATION_2_DAYS },

    // las sesiones se guardan en MongoDB
    store: MongoStore.create({
      mongoUrl: 'mongodb://127.0.0.1:27017/nodepop'
    })
  })


/**
 * Middleware para que todas las vistas puedan acceder a la sesión.
 */
  export function useSessionInViews(req, res, next) {
    res.locals.session = req.session
    next()
  }