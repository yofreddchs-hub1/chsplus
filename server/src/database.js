require('dotenv').config({path:'./server/variables.env'})
const mongoose = require('mongoose');

const URI = process.env.DB_URL;
mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

mongoose.connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Base de datos conectada : ' ,URI);
});
