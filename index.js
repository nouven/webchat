const express = require('express');
const app = express();

const path = require('path')
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');
const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert','key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert','cert.pem')),
},app);
const {Server} = require('socket.io');
const io = new Server(server);
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');

const oauth = require('./configs/oauth');
app.use(passport.initialize());
app.use(passport.session());
// app.use(session({
//     secret: 'cats',
//     resave: false,
//     saveUninitialized: true,
// }))

//body parsevar
bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());

app.use( express.static(path.join(__dirname, 'public')));
app.engine('.html', exphbs({extname: '.html'}));
app.set('view engine', '.html');

const db = require('./configs/db');
const route = require('./routes');
const serverSide = require('./server');


db.connect();


route(app);

io.on("connection",(socket)=>{
    serverSide(io, socket);
})




server.listen(3000, ()=>{
    console.log('listening on port 3000');
})
