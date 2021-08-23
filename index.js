const express = require('express');
const app = express();

const path = require('path')
const cookieParser = require('cookie-parser');

const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

const exphbs = require('express-handlebars');
//body parsevar
bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use( express.static(path.join(__dirname, 'public')));
app.engine('.html', exphbs({extname: '.html'}));
app.set('view engine', '.html');

const db = require('./configs/db');


db.connect();

const route = require('./routes');





route(app);

io.on("connection",(socket)=>{
    console.log('connected');
})





server.listen(3000, ()=>{
    console.log('listening on port 3000');
})
