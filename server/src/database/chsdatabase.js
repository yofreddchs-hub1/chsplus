require('dotenv').config({path:'./server/variables.env'});
const URI = process.env.DB_URL1;
const mongoose = require( 'mongoose' )
const db = mongoose.createConnection(
    `${ URI }`,
    {
        // useFindAndModify: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        // useCreateIndex: true
    }
)
db.on( 'open', () => console.log( 'Mongoose successfully chs...' ) )
db.on( 'error', err => console.log( 'Mongoose connection error') )
module.exports.database = db; 
 
