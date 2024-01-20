require('dotenv').config({path:'./server/variables.env'});
const mongoose = require("mongoose");
const { database } = require( './databasechs' )
const {Model} = require('./model');
const URI = process.env.DB_URL;
const Principal = 'ChsPrincipal';
global.Principal = Principal;
const nombreDB= 'Principal';
global.DataBase = {
    [Principal] : database(URI,Principal).useDb( nombreDB, { useCache: true } )
}

const Inicio = async()=>{
    const Apis = await Model(Principal,'Api');
    let apis = await Apis.find();
    apis = apis.filter(f=>f.valores.api!==Principal).map(v=>v.valores);
}

Inicio();