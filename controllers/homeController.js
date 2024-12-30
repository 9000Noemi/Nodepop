import assert from 'node:assert';
import Product from '../models/Product.js';


export async function index(req, res, next) {

  try {
    const userId = req.session.userId;

    // Si hay un usuario logado, buscamos los productos asociados a ese usuario
    if (userId) {
      res.locals.products = await Product.find({ owner: userId });
    } else {
      res.locals.products = []; // Si no hay usuario logado, devolvemos una lista vacía
    }

    // Renderizamos la vista 'home' con los datos
    res.render('home', 
      //res.__ es la funcion de I18n para internacionalizar la palabra Home
      { title: res.__('Home'), 
        products: res.locals.products 
      });
  } catch (error) {
    console.error("Error al cargar la página de inicio:", error);
    next(error); // Pasamos el error al middleware de manejo de errores
  }
}
