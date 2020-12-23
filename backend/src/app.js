const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();


const session_secret = "newton";

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: "http://localhost:8080"
}));
// https://vinu-todoapp.herokuapp.com/
// uncomment if deployin on heroku and package.json nodemon ==> node

// app.set('trust proxy', 1);

app.use(session({
    secret: session_secret,
    // cookie: { sameSite: 'none', secure: true }
}));

const {userModel, todoModel} = require('./models/todo');

const isNullOrUndefined = val => val === null || val === undefined;
const SALT = 5;



const AuthMiddleware = async (req, res, next) => {

    if(isNullOrUndefined(req.session) || isNullOrUndefined(req.session.userId)){
        res.status(401).send({err: "Signin again !"});
    }else{
        next();
    }
}



app.post('/signup', async (req, res)=>{
    const {userName, password} = req.body;
    const existingUser = await userModel.findOne({ userName });
    if(isNullOrUndefined(existingUser)){
        const hashedPwd = bcrypt.hashSync(password, SALT);
        const newUser = new userModel({userName, password:hashedPwd});
        await newUser.save();
        req.session.userId = newUser._id;
        res.status(201).send({success: 'Siged up'});
    }else{
        res.status(400).send({err: `Username ${userName} already exists. Please choose another.`});
    }
});

app.post('/signin', async (req, res)=>{
    const {userName, password} = req.body;
    const existingUser = await userModel.findOne({ userName });
    
    if(isNullOrUndefined(existingUser)){
        res.status(401).send({err: "Username does not exists"});
    }else{
        const hashedPwd = existingUser.password;
        if(bcrypt.compareSync(password, hashedPwd)){
            req.session.userId = existingUser._id;
            res.status(200).send({success: 'Logged in'});
        }else{
            res.status(401).send({err: "Password is incorrect"});
        }
    }
});

app.get('/todo', AuthMiddleware, async(req, res)=>{
    const allTodos = await todoModel.find({userId: req.session.userId});
    res.send(allTodos);
});

app.post('/todo', AuthMiddleware, async (req, res)=>{
    const todo = req.body;
    todo.creationTime = new Date();
    todo.done = false;
    todo.userId = req.session.userId;
    const newTodo = new todoModel(todo);
    await newTodo.save();
    res.status(201).send(newTodo);
});

app.put('/todo/:todoid', AuthMiddleware, async (req, res)=> {
    const {task} = req.body;
    const todoid = req.params.todoid;
    try{
        const todo = await todoModel.findOne({_id: todoid, userId: req.session.userId});
        if(isNullOrUndefined(todo)){
            res.sendStatus(400);
        }else{
            todo.task = task;
            await todo.save();
            res.send(todo);
        }
    }catch(e){
        res.sendStatus(404);
    }
});

app.delete('/todo/:todoid', AuthMiddleware, async (req, res)=>{
    const todoid = req.params.todoid;

    try{
        await todoModel.deleteOne({_id: todoid, userId: req.session.userId});
        res.sendStatus(200);
    }catch(e){
        res.sendStatus(404);
    }
});

app.get('/todo/:todoid', AuthMiddleware, async (req, res)=>{
    const todoid = req.params.todoid;

    try{
        const todo = await todoModel.findOne({_id: todoid, userId: req.session.userId});
        if(isNullOrUndefined(todo)){
            res.sendStatus(400);
        }else{
            if(todo.done){
                todo.done = false;
            }else{
                todo.done = true;
            }
            await todo.save();
            res.send(todo);
        }
    }catch(e){
        res.sendStatus(404);
    }
});

app.get('/logout', (req, res) => {
    if(!isNullOrUndefined(req.session)){
        req.session.destroy(() => {
            res.sendStatus(200);
        });
    }else{
        res.sendStatus(200);
    }
});

app.get('/userinfo', AuthMiddleware, async (req, res) => {
    const user = await userModel.findById(req.session.userId);
    res.send({userName: user.userName});
});

app.get("/", async (req, res)=> {
    res.send("server works");
})


module.exports = app;