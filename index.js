const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { response } = require('express');
const { application } = require('express');

const app = express();
const port = process.env.PORT || 5500

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'logging'
});

connection.connect((error) => {
    if(error) {
        console.log("Nie mozna polaczyc sie do bazy");
        return;
    } else {
        console.log("Polaczono sie z baza danych");
    }
});

app.use(express.urlencoded({extended: true})); app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname + '/public/views/home.html'))
})

app.get('/login', (req,res) => {
    res.sendFile(path.join(__dirname + '/public/views/login.html'))
})

app.get('/dashboard', (req,res) => {
    res.sendFile(path.join(__dirname + '/public/views/index.html'))
});

app.get('/register', (req,res) => {
    res.sendFile(path.join(__dirname + '/public/views/register.html'))
})

app.post('/login', (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    if(username && password) {
        connection.query(`SELECT * FROM accounts WHERE username = "${username}" AND password = "${password}"`, (error, results, fields) => {
            if(error) throw error

            if(results.length > 0) {
                res.redirect('/dashboard');
            } else {
                res.send("Nieprawidłowa nazwa użytkownika lub hasło");
            }
            res.end();

            
        })
    } else {
        res.send('Wprowadz nazwe użytkownika i hasło');
        res.end();
    }
})

app.post('/register', (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;

    if(username && password && email) {
        connection.query(`INSERT INTO accounts (username, email, password) VALUES ("${username}","${email}","${password}")`, (error,results,fields) => {
            if(error) throw error;
            console.log("Dodano użytkownika");
            res.redirect('/login');
        });
    } else {
        res.send('Wprowadz wszystkie dane');
    }
})

app.listen(port, () => console.log(`Listening on port ${port}`))