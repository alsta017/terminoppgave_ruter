const mysql = require("mysql");
const express = require("express");
const session = require("express-session");
var path = require("path");
const cookieParser = require('cookie-parser');



// Koble til database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'IMKuben1337!',
    database: 'oppgavedb'
});

const app = express();

app.use(cookieParser());


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
});

app.get('/register', function(req, res) {
    res.sendFile(__dirname + '/src/html/register.html');
});

app.post('/loginauth', function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
        connection.query('SELECT * from brukere WHERE brukernavn = ? and passord = ?', [username, password], function(error, result, fields) {
            if (error) throw error;
            if (result.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                res.clearCookie('loggedin');
                res.clearCookie('username');
                res.cookie('loggedin', 'true');
                res.cookie('username', username);
                res.redirect('/');
            } else {
                res.cookie('errormessage', 'u_p');
                res.redirect('/login');
            }
        })
    } else {
        res.cookie('errormessage', 'e_i');
        res.redirect('/login');
    }
});

app.post('/registerauth', function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
        var sql = 'INSERT INTO brukere (brukernavn, passord) VALUES ?';
        // Variabler den skal bruke i spørringen
        var values = [
            [username, password]
        ]
        // Spørring
        connection.query(sql, [values], function (err, result) {
            if (err) throw err;
            // FUnket det eller ikke?
        })
        res.cookie('errormessage', 'r_s');
        res.redirect('/login');
    } else {
        res.cookie('errormessage', 'e_uc');
        res.redirect('/login');
    }
});

app.get('/logout', function(req, res) {
    req.session.loggedin = false;
    req.session.username = '';
    res.clearCookie('loggedin');
    res.clearCookie('username');
    res.cookie('loggedin', 'false');
    res.redirect('/');
});

app.listen(3000);