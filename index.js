const express = require('express');
const app = express();

const path = require('path')


const exphbs = require('express-handlebars');
//body parsevar
bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const db = require('./configs/db');

const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

db.connect();

const route = require('./routes');


app.use( express.static(path.join(__dirname, 'public')));
app.engine('.html', exphbs({extname: '.html'}));
app.set('view engine', '.html');



route(app);

io.on("connection",(socket)=>{
    console.log('connected');
})





server.listen(3000, ()=>{
    console.log('listening on port 3000');
})
