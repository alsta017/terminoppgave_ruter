const mysql = require("mysql");
const express = require("express");
const session = require("express-session");
var path = require("path");


// Koble til database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'IMKuben1337!',
    database: 'oppgavedb'
});

const app = express();

// Ny session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/src', express.static(path.join(__dirname + '/src')));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/src/html/index.html');
});

app.get('/ekstra_valg', function(req, res) {
    res.sendFile(__dirname + '/src/html/ekstra_valg.html');
});

app.get('/reiseplanlegger', function(req, res) {
    res.sendFile(__dirname + '/src/html/reiseplanlegger.html');
});

app.get('/trip', function(req, res) {
    res.sendFile(__dirname + '/src/html/trip.html');
});

app.get('/lagre_reisen', function(req, res) {
    res.sendFile(__dirname + '')
});

app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/src/html/login.html');
})

app.listen(3000);