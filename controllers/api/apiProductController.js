import createError from 'http-errors'
import Product from '../../models/Product.js'

//Devolver una lista de productos
export async function apiProductList(req, res, next) {
  try {
    //Variable con el id de usuario logado de jwtAutMiddleware
    const userId = req.apiUserId

    //http://localhost:3000/api/products/?name=lib
    const filterName = req.query.name
    //http://localhost:3000/api/products/?limit=2&skip=2
    const limit = req.query.limit
    const skip = req.query.skip
    //http://localhost:3000/api/products/?sort=price
    const sort = req.query.sort
    //http://localhost:3000/api/products/?fields=name -_id
    const fields = req.query.fields


    //Construir el filtro que se llena según las consultas de req.query
    //El owner debe ser el userId
    const filter = { owner: userId }
    if (filterName) {
      // Expresion regular que hace que la búsqueda sea insensible a mayúsculas y que busque solo por el comienzo de la palabra
      filter.name = new RegExp(filterName, 'i');
    }


    //Búsqueda del modelo de product usando el metodo list
    const products = await Product.list(filter, limit, skip, sort, fields)

    //Mostrar la cantidad total de productos que hay
    const productCount = await Product.countDocuments(filter)

    res.json({
      result: products,
      count: productCount
    })

  } catch (error) {
    next(error)
  }
}


//Devolver un producto
export async function apiProductGetOne(req, res, next) {
  try {

    //http://localhost:3000/api/products/6730cca48b5bbac69211d06d

    //Variable con el id de usuario logado de jwtAutMiddleware
    const userId = req.apiUserId

    const productId = req.params.productId

    const product = await Product.findOne({ _id: productId, owner: userId })

    res.json({ result: product })
  } catch (error) {
    next(error)
  }
}


//Crear un producto
export async function apiProductNew(req, res, next) {

  try {

    //Variable con el id de usuario logado de jwtAutMiddleware
    const userId = req.apiUserId

    //variable para recoger los datos del producto que vamos a crear:
    const productData = req.body

    //crear una instancia de producto en memoria y le pasamos productData
    const product = new Product(productData)

    //El owner debe ser el userId
    product.owner = userId

    //Asignar a photo la propiedad filename de req.file si existe(opcional, para eso ponemos ?)
    product.photo = req.file?.filename

    //guardarla en base de datos y lo metemos en la variable savedProduct
    const savedProduct = await product.save()

    //devolver codigo 201(created)
    res.status(201).json({ result: savedProduct })

  } catch (error) {
    next(error)
  }
}


//Actualizar un producto
export async function apiProductUpdate(req, res, next) {
  try {

    //Variable con el id de usuario logado de jwtAutMiddleware
    const userId = req.apiUserId

    const productId = req.params.productId

    //variable para recoger los datos del producto que vamos a actualizar:
    const productData = req.body

    productData.photo = req.file?.filename

    const updatedProduct = await Product.findOneAndUpdate({ _id: productId, owner: userId }, productData, {
      new: true // para obtener el documento actualizado}
    })

    res.json({ result: updatedProduct })

  } catch (error) {
    next(error)
  }

}


//Borrar un producto
export async function apiProductDelete(req, res, next) {
  try {

    //Variable con el id de usuario logado de jwtAutMiddleware
    const userId = req.apiUserId

    const productId = req.params.productId

    // validar que el producto que queremos borrar es propiedad del usuario logado
    const product = await Product.findOne({ _id: productId })

    // verificar que existe
    if (!product) {
      console.warn(`WARNING - El usuario ${userId} está intentando eliminar un producto inexistente.`)
      return next(createError(404))
    }

    // comprobar la propiedad antes de eliminar
    // owner es un objeto(mirar model), para compararlo con userId hay que pasarlo a str
    if (product.owner.toString() !== userId) {
      console.warn(`WARNING - el usuario ${userId} no está autorizado para eliminar este producto.`)
      return next(createError(401))
    }

    await Product.deleteOne({ _id: productId })

    res.json()

  } catch (error) {
    next(error)
  }
}