const mysql = require("mysql");
const express = require("express");
const session = require("express-session");
var path = require("path");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 4;


// Koble til database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'IMKuben1337!',
    database: 'oppgavedb'
});

const app = express();

app.use(cookieParser());

app.use(bodyParser.urlencoded({
    extended: true
}));


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

app.post('/lagre_reisen', function(req, res) {
    res.redirect('/trip');
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
        connection.query('SELECT * from brukere WHERE brukernavn = ?', [username], function(error, result, fields) {
            console.log(result.length);
            if (error) throw error;
            if (result.length > 0) {
                // User found, now check the password
                bcrypt.compare(password, result[0].passord, function(err, passwordMatch) {
                    if (err) throw err;
                    if (passwordMatch) {
                        // Passwords match, set session and redirect to home page
                        req.session.loggedin = true;
                        req.session.username = username;
                        res.clearCookie('loggedin');
                        res.clearCookie('username');
                        res.cookie('loggedin', 'true');
                        res.cookie('username', username);
                        res.redirect('/');
                    } else {
                        // Passwords don't match, redirect to login page with an error message
                        res.cookie('errormessage', 'u_p');
                        res.redirect('/login');
                    }
                });
            } else {
                // User not found, redirect to login page with an error message
                res.cookie('errormessage', 'u_p');
                res.redirect('/login');
            }
        });
    } else {
        // Invalid input, redirect to login page with an error message
        res.cookie('errormessage', 'e_i');
        res.redirect('/login');
    }
});

app.post('/registerauth', function(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
        // Check if the username is already registered
        connection.query('SELECT * FROM brukere WHERE brukernavn = ?', [username], function(error, result, fields) {
            if (error) throw error;

            if (result.length > 0) {
                // Username is already taken, redirect to login page with an error message
                res.cookie('errormessage', 'u_t');
                res.redirect('/login');
            } else {
                // Username is not taken, proceed with registration
                bcrypt.hash(password, saltRounds, function(err, hash) {
                    if (err) throw err;

                    var sqlforregister = 'INSERT INTO brukere (brukernavn, passord) VALUES ?';
                    var values = [
                        [username, hash]
                    ];

                    // Perform the registration query
                    connection.query(sqlforregister, [values], function (err, result) {
                        if (err) throw err;

                        res.cookie('errormessage', 'r_s');
                        res.redirect('/login');
                    });
                });
            }
        });
    } else {
        // Invalid input, redirect to login page with an error message
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