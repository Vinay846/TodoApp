const mongoose = require('mongoose');
const port = 3000
const app = require('./app');

const uri = "mongodb://localhost:27017/TodoApp";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
const connection = mongoose.connection;

connection.once("open", ()=>{
    console.log("MongoDB database connection established successfully")
})

app.listen(process.env.PORT || port);
