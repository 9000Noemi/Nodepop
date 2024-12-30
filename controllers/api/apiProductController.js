import Product from '../../models/Product.js'


export async function apiProductList(req, res, next) {
    try {
        const filter = {}; // Filtro vacío si no hay un filtro específico
        const limit = req.query.limit
        const skip = req.query.skip
        const sort = req.query.sort
        const fields = req.query.fields

        //Búsqueda del modelo de product usando el metodo list
        const products = await Product.list(filter, limit, skip, sort, fields)

        res.json({ result: products })

    } catch (error) {
        next(error)
    }
}