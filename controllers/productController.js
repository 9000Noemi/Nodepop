import createError from 'http-errors'
import Product from '../models/Product.js'

export function index(req, res, next) {
  res.render('new-product')
}

//Crear producto

export async function createProduct(req, res, next) {
  try {
    const userId = req.session.userId
    const { name, price, tags } = req.body

    console.log(req.file)

    // crear una instancia de producto en memoria
    const product = new Product({
      name,
      owner: userId,
      price,
      tags,
      photo: req.file.filename
    })

    // guardarla en base de datos
    await product.save()

    res.redirect('/')
  } catch (err) {
    next(err)
  }
}


//Borrar producto

export async function deleteProduct(req, res, next) {

  const userId = req.session.userId
  const productId = req.params.productId

  // validar que el producto que queremos borrar es propiedad del usuario logado
  const product = await Product.findOne({ _id: productId })

  // verificar que existe
  if (!product) {
    console.warn(`WARNING - El usuario ${userId} está intentando eliminar un producto inexistente.`)
    return next(createError(404, 'Not found'))
  }

  //comprobar la propiedad antes de eliminar
  //owner es un objeto(mirar model), para compararlo con userId hay que pasarlo a str
  if (product.owner.toString() !== userId) {
    console.warn(`WARNING - el usuario ${userId} no está autorizado para eliminar este producto.`)
    return next(createError(401, 'Not authorized'))
  }

  await Product.deleteOne({ _id: productId })

  res.redirect('/')

}

