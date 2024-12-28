import mongoose, { Schema } from 'mongoose'

//Definir esquema de productos:

const productSchema = new Schema({
    name: String,
    owner: { ref: 'User', type: mongoose.Schema.Types.ObjectId },
    price: Number,
    tags: [String],
    photo: String
});

const Product = mongoose.model('Product', productSchema)

export default Product
