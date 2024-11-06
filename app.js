import express, { json, urlencoded } from 'express';
import createError from 'http-errors';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

import path from 'path';
import { fileURLToPath } from 'url';

import connectMongoose from './lib/connectMongoose.js';

import * as sessionManager from './lib/sessionManager.js';

import * as homeController from './controllers/homeController.js'
import * as productController from './controllers/productController.js'
import * as loginController from './controllers/loginController.js'

await connectMongoose()

const app = express();

app.locals.appName = 'Nodepop';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Indicamos donde estan las vistas y qué motor de plantillas usamos:
app.set('views', 'views') 
app.set('view engine', 'ejs')


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

/**
 * Application routes
 */

// Middleware de sesión creado en sessionManager
app.use(sessionManager.middleware, sessionManager.useSessionInViews);

//Endpoints publicos
app.get('/', homeController.index)
app.get('/login', loginController.index)
app.post('/login', loginController.login)
app.all('/logout', loginController.logout)

//Endpoints privados
app.get('/product/new', sessionManager.isLoggedIn, productController.index)
app.post('/product/new', sessionManager.isLoggedIn, productController.createProduct);
app.get('/product/delete/:productId', sessionManager.isLoggedIn, productController.deleteProduct);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
