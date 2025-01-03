import mongoose, { Schema } from 'mongoose'

//Definir esquema de productos:

const productSchema = new Schema({
    name: String,
    owner: { ref: 'User', type: mongoose.Schema.Types.ObjectId },
    price: Number,
    tags: [String],
    photo: String
});

// Definir el método estático `list` para devolver la lista de productos:

productSchema.statics.list = function (filter, limit, skip, sort, fields) {
    const query = Product.find(filter) // Crear la consulta con un filtro
    query.limit(limit);             // Limitar el número de resultados
    query.skip(skip);               // Saltar resultados (paginación)
    query.sort(sort);               // Ordenar los resultados
    query.select(fields);           // Seleccionar campos específicos
    return query.exec();            // Ejecutar la consulta y devolver una Promesa
};


//mongoose.model crea un modelo basado en el esquema productSchema
const Product = mongoose.model('Product', productSchema)

export default Product
