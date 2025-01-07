import Product from '../../models/Product.js'


//Devolver una lista de productos
export async function apiProductList(req, res, next) {
    try {
        //http://localhost:3000/api/products/?name=lib
        const filterName = req.query.name
        //http://localhost:3000/api/products/?limit=2&skip=2
        const limit = req.query.limit
        const skip = req.query.skip
        //http://localhost:3000/api/products/?sort=price
        const sort = req.query.sort
        //http://localhost:3000/api/products/?fields=name -_id
        const fields = req.query.fields


        // Construir el filtro que se llena según las consultas de req.query
        const filter = {}
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

      const productId = req.params.productId
  
      const product = await Product.findById(productId)
  
      res.json({ result: product })
    } catch (error) {
      next(error)
    }
  }


  //Crear un producto
  export async function apiProductNew(req, res, next) {
    try {
      //variable para recoger los datos del producto que vamos a crear:
      const productData = req.body

      //crear una instancia de producto en memoria y le pasamos productData
      const product = new Product(productData)

      //Asignar a photo la propiedad filename de req.file si existe(opcional, para eso ponemos ?)
      product.photo =  req.file?.filename

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
      const productId = req.params.productId

      //variable para recoger los datos del producto que vamos a actualizar:
      const productData = req.body

      productData.photo = req.file?.filename

      const updatedProduct = await Product.findByIdAndUpdate(productId, productData, {
        new: true // para obtener el documento actualizado}
      })

      res.json({ result: updatedProduct })

    } catch (error) {
      next(error)
    }

  }