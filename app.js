import express, { json, urlencoded } from 'express';
import createError from 'http-errors';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import path from 'path';
import { fileURLToPath } from 'url';

import connectMongoose from './lib/connectMongoose.js';
import * as sessionManager from './lib/sessionManager.js';

import * as homeController from './controllers/homeController.js'
import * as productController from './controllers/productController.js'
import * as loginController from './controllers/loginController.js'

import upload from './lib/uploadConfigure.js'
import i18n from './lib/i18nConfigure.js'
import * as langController from './controllers/langController.js'
import * as apiProductController from './controllers/api/apiProductController.js'

await connectMongoose()

const app = express();

app.locals.appName = 'Nodepop';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Indicar donde estan las vistas y qué motor de plantillas usamos:
app.set('views', 'views')
app.set('view engine', 'ejs')


app.use(logger('dev'));
app.use(express.json());// parsear el body que venga en formato JSON
app.use(express.urlencoded({ extended: false })); // parsear el body que venga urlencoded (formularios)
app.use(cookieParser());
app.use(express.static('public'));


/**
 * API routes
 */

//La ruta seria: http://localhost:3000/api/products. El resto se ejecuta al hacer esa solicitud.
app.get('/api/products', apiProductController.apiProductList)



//-------------------------------------------------------------------------
/**
 * Website routes
 */

// Middleware de sesión creado en sessionManager:
app.use(sessionManager.middleware, sessionManager.useSessionInViews);

//Middleware i18n para leer la cabecera de idioma y elegir el fichero de idioma correspondiente
app.use(i18n.init);

/*Ruta definida en Express que utiliza un controlador (langController.changeLocale) 
como manejador de esa ruta.
Podemos hacerlo usando un PARAMETRO DE RUTA: 
        app.get('/change-locale/:locale', langController.changeLocale)
o usando QUERY PARAMS:*/
app.get('/change-locale', langController.changeLocale);


//Endpoints publicos
app.get('/', homeController.index)
app.get('/login', loginController.index)
app.post('/login', loginController.login)
app.all('/logout', loginController.logout)

//Endpoints privados
app.get('/product/new', sessionManager.isLoggedIn, productController.index)
//   en upload.single ponemos el "name" del formulario de new-product.ejs: "photo"
app.post('/product/new', sessionManager.isLoggedIn, upload.single('photo'), productController.createProduct);
app.get('/product/delete/:productId', sessionManager.isLoggedIn, productController.deleteProduct);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {

  //message se lo pasamos a la vista error.ejs 
  res.locals.message = err.message;

  res.locals.error = process.env.NODEPOP_ENV === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
