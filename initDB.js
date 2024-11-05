import readline from 'node:readline'
import connectMongoose from "./lib/connectMongoose.js";

import User from './models/User.js'
import { userInfo } from 'node:os';

const connection = await connectMongoose()

const questionResponse = await ask('Are you sure you want to  empty the database and create initial data?')
if (questionResponse.toLowerCase() !== 'yes'){
    console.log('Operation aborted')
    process.exit()
}


await initUsers()

connection.close()
/*
async function initAgents(){
    //delete all agents
    const deleteResult = await Agent.deleteMany()
    console.log(`Deleted ${deleteResult.deleteCount} agents.`)

    //create initial agents
    const insertResult = await Agent.insertMany([
        {name: 'Smith', age: 31},
        {name: 'Brown', age: 42},
        {name: 'John', age: 23}
    ])

    console.log(`Created ${insertResult.length} agents.`)
}
*/

async function initUsers(){
    //delete all users
    const deleteResult = await User.deleteMany()
    console.log(`Deleted ${deleteResult.deleteCount} users.`)

    const hashedPassword = await User.hashPassword('1234')
    console.log(hashedPassword)
    //create initial users
    const insertResult = await User.insertMany([
        {email: 'user1@example.com', password: hashedPassword},
        {email: 'user2@example.com', password: hashedPassword}
    ])

    console.log(`Created ${insertResult.length} users.`)
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