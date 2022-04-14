const express = require('express');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');

const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { response } = require('express');

require('dotenv').config()

const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT
const SESSION_SECRET = process.env.SESSION_SECRET

const port = process.env.PORT

const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE
});

connection.connect((error) => {
    if(error) {
        console.log("Nie można połączyć się z bazą danych");
        return;
    } else {
        console.log("Polączono się z bazą danych");
    }
});

app.set('views', path.join(__dirname, '/views'));
app.set('view engine','ejs');

app.use(session({
    secret: SESSION_SECRET,
    saveUninitialized: true,
    resave: true
}));

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, '/public')));
app.use(flash());

app.get('/', (req,res) => {
    res.render('home.ejs');
})

app.get('/login', (req,res) => {
    res.render('login.ejs');
})

app.get('/dashboard', (req,res) => {
    res.render('index.ejs', {msg});
});

app.get('/register', (req,res) => {
    res.render('register.ejs');
})

app.post('/login', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    connection.query(`SELECT * FROM accounts WHERE username = "${username}" AND password = "${password}"`, (error, results, fields) => {
        if(error) throw error

        if(results.length > 0) {
            res.redirect('/dashboard', {msg: `Witaj ${username}`});
        } else {
            res.redirect('/login');
        }
    })
})

app.post('/register', (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;

    connection.query(`INSERT INTO accounts (username, email, password) VALUES ("${username}","${email}","${password}")`, (error,results,fields) => {
        if(error) throw error;
        res.redirect('/login');
    });
})

app.listen(port, () => console.log(`Listening on port ${port}`))