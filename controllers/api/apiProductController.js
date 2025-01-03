import Product from '../../models/Product.js'

export async function apiProductList(req, res, next) {
    try {
        // http://localhost:3000/api/products/?name=Libro  NO FUNCIONA!!!!
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
            // Expresion regular que hace que la búsqueda sea insensible a mayúsculas.
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