const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { response } = require('express');

const app = express();
const port = process.env.PORT || 5500

app.use(express.urlencoded({extended: true})); app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname + '/public/views/home.html'))
})

app.get('/login', (req,res) => {
    res.sendFile(path.join(__dirname + '/public/views/login.html'))
})

app.get('/register', (req,res) => {
    res.sendFile(path.join(__dirname + '/public/views/register.html'))
})

app.post('/login', (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    try {
        if(username && password) {
            // response.send('Nieprawidłowa nazwa użytkownika lub hasło));
            // response.end();
        } else {
            res.send('Wprowadz nazwe użytkownika i hasło');
            res.end();
        }
    }
    catch {
        res.send('Internal server error');
    }
})

app.post('/register', (req,res) => {

})

app.listen(port, () => console.log(`Listening on port ${port}`))