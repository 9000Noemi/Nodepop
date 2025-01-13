import mongoose from 'mongoose'

const { MONGO_DB_CONNECTION } = process.env

//si emite un evento error, activar la funcion err
mongoose.connection.on('error', err => {
    console.log('Error de conexión', err)
})

//para que nos diga si se ha podido conectar
mongoose.connection.once("open", () => {
    console.log("Conectado a MongoDB en", mongoose.connection.name);
});


export default function connectMongoose() {
    return mongoose.connect(MONGO_DB_CONNECTION)
        .then(mongoose => mongoose.connection)
}

