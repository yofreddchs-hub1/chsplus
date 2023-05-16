require('dotenv').config({path:'./server/variables.env'})
const mongoose = require('mongoose');

const URI = process.env.DB_URL;
// mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

mongoose.connect(URI, {
    // useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // useCreateIndex: true
});

const connection = mongoose.connection;
connection.once('open', async() => {
    console.log('Base de datos conectada : ' ,URI);
    let lista =await connection.db.listCollections().toArray()
    lista=lista.map(val=> val.name)
    global.models= lista;
    require('./server_socket');
});

