import readline from 'node:readline'
import connectMongoose from "./lib/connectMongoose.js";

import User from './models/User.js';
import Product from './models/Product.js'
import { userInfo } from 'node:os';

const connection = await connectMongoose()

const questionResponse = await ask('Are you sure you want to  empty the database and create initial data?')
if (questionResponse.toLowerCase() !== 'yes'){
    console.log('Operation aborted')
    process.exit()
}


await initUsers()
await initProducts()

connection.close()

//Cargar usuarios iniciales

async function initUsers(){
    //borrar usuarios
    const deleteResult = await User.deleteMany()
    console.log(`Borrados ${deleteResult.deletedCount} usuarios.`)

    const hashedPassword = await User.hashPassword('1234')
    
    //crear usuarios iniciales
    const insertResult = await User.insertMany([
        {email: 'user1@example.com', password: hashedPassword},
        {email: 'user2@example.com', password: hashedPassword}
    ])

    console.log(`Creados ${insertResult.length} usuarios.`)
}

//Cargar productos iniciales

async function initProducts(){
    //borrar productos
    const deleteResult = await Product.deleteMany()
    console.log(`Borrados ${deleteResult.deletedCount} productos.`)

    //Consulta a la DB buscando los usuarios con ese email:
    const [user1, user2] = await Promise.all([
        User.findOne({ email: 'user1@example.com' }),
        User.findOne({ email: 'user2@example.com' }),
      ])

    //crear productos iniciales
    const insertResult = await Product.insertMany([
        {
            name: 'Abrigo', 
            price: '125', 
            image: "https://www.thenorthface.es/es-es/p/hombre-211701/chaqueta-mountain-q-para-hombre-NF0A5IG2?color=1NO", 
            tags:["Work", "Lifestyle"], 
            owner: user1._id
        },
        
        {
            name: 'Coche', 
            price: '10200', 
            image: "https://www.ocasionplus.com/coches-segunda-mano/opel-astra-16-selective-con-125126km-2015-9pkbzqac",
            tags:["Motor"],
            owner: user1._id
        },

        {
            name: 'Movil', 
            price: '950', 
            image: "https://www.apple.com/es/shop/buy-iphone/iphone-15",
            tags:["Mobile"],
            owner: user2._id
        }
    ])

    console.log(`Creados ${insertResult.length} productos.`)
}


function ask(questionText){
    return new Promise((resolve, reject) => {
        const consoleInterface = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        consoleInterface.question(questionText, answer => {
            consoleInterface.close()
            resolve(answer)
        })
    })
}