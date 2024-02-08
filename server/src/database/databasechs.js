// const URI = process.env.DB_URL1;
const mongoose = require( 'mongoose' )
const basedate=(URI, nombre) => {
    const db= mongoose.createConnection(
        `${ URI }`,
        {
            // useFindAndModify: false,
            useUnifiedTopology: true,
            useNewUrlParser: true,
            // useCreateIndex: true
        }
    )
    db.on( 'open', () => console.log( `Mongoose ${nombre} conectado...` ) )
    db.on( 'error', err => console.log( `Mongoose error en conexión con ${nombre} ${URI}`) )
    // console.log(db)
    return db
}
module.exports.database = basedate; 