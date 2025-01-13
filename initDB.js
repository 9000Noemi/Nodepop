import 'dotenv/config'
import readline from 'node:readline'
import connectMongoose from "./lib/connectMongoose.js";

import User from './models/User.js';
import Product from './models/Product.js'
import { userInfo } from 'node:os';

const connection = await connectMongoose()

const questionResponse = await ask('Are you sure you want to  empty the database and create initial data?')
if (questionResponse.toLowerCase() !== 'yes') {
    console.log('Operation aborted')
    process.exit()
}


await initUsers()
await initProducts()

connection.close()

//Cargar usuarios iniciales

async function initUsers() {
    //borrar usuarios
    const deleteResult = await User.deleteMany()
    console.log(`Borrados ${deleteResult.deletedCount} usuarios.`)

    const hashedPassword = await User.hashPassword('1234')

    //crear usuarios iniciales
    const insertResult = await User.insertMany([
        { email: 'user1@example.com', password: hashedPassword },
        { email: 'user2@example.com', password: hashedPassword }
    ])

    console.log(`Creados ${insertResult.length} usuarios.`)
}

//Cargar productos iniciales

async function initProducts() {
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
            name: 'Libro',
            price: 22,
            photo: 'photo-1734606592275-libro.png',
            tags: ["Lifestyle"],
            owner: user1._id
        },

        {
            name: 'Coche',
            price: 10200,
            photo:'coche.png',
            tags: ["Motor", "Work"],
            owner: user1._id
        },

        {
            name: 'Abanico',
            price: 9,
            photo: 'abanico.png',
            tags: ["Lifestyle"],
            owner: user1._id
        },

        {
            name: 'Bicicleta',
            price: 205,
            photo: 'photo-1734860001284-bike.png',
            tags: ["Lifestyle", "Work"],
            owner: user2._id
        },

        {
            name: 'Abrigo',
            price: 150,
            photo: 'abrigo.png',
            tags: ["Lifestyle"],
            owner: user2._id
        },

    ])

    console.log(`Creados ${insertResult.length} productos.`)
}


function ask(questionText) {
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