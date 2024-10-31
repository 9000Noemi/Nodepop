import mongoose from 'mongoose'

//si emite un evento error,quiero que active la funcion err
mongoose.connection.on('error', err =>{
    console.log('Error de conexión', err)
})

//para que nos diga si se ha podido conectar
mongoose.connection.once("open", () => {
    console.log("Conectado a MongoDB en", mongoose.connection.name);
});


export default function connectMongoose(){
    return mongoose.connect('mongodb://127.0.0.1:27017/nodepop')
    .then(mongoose => mongoose.connection)
}

