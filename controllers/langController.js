//Creamos esta funcion que va a ser un middleware:

export function changeLocale(req, res, next) {
    /* Usando PARAMETRO DE RUTA:
       const locale = req.params.locale
    */

    // Usando query params:
    const locale = req.query.locale

    // poner una cookie en la respuesta en Express se hace con res.cookie
    res.cookie('nodepop-lang-cookie', locale, {
        //duración 30 días
        maxAge: 1000 * 60 * 60 * 24 * 30
    })

    // redirigir a la misma página en la que estaba
    res.redirect('back')
}