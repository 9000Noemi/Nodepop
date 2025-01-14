import session from 'express-session'
import MongoStore from 'connect-mongo'

const { MONGO_DB_CONNECTION, SESSION_SECRET } = process.env
const INACTIVITY_EXPIRATION_2_DAYS = 1000 * 60 * 60 * 24 * 2

/**
 * Middleware para gestionar sesiones:
 */

export const middleware = session({

  //nombre de la cookie:
  name: 'nodepop-session',

  //para que los token de sesion generados sean unicos:
  secret: SESSION_SECRET,

  //forzar que una sesion que no este inicializada se guarde en el store:
  saveUninitialized: true,

  //forzar que una sesion se guarde incluso si no ha sido modificada:
  resave: false,

  //tiempo max de vida de la cookie:
  cookie: { maxAge: INACTIVITY_EXPIRATION_2_DAYS },

  // las sesiones se guardan en MongoDB:
  store: MongoStore.create({
    mongoUrl: MONGO_DB_CONNECTION
  })
})


/**
 * Middleware para que todas las vistas puedan acceder a la sesión:
 */

export function useSessionInViews(req, res, next) {
  res.locals.session = req.session
  next()
}


/**
 * Middleware para saber si estamos logados:
 */

export function isLoggedIn(req, res, next) {
  console.log(req.session.userId)

  //Si no estamos logados, redirigir a home, por ej si intentamos acceder a new product:
  if (!req.session.userId) {
    res.redirect('/login')
    return
  }
  next()
}