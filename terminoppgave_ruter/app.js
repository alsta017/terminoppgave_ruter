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

// Bruk mappe /src
app.use('/src', express.static(path.join(__dirname + '/src')));

// Når man skriver inn ip adresse i nettleser
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/src/html/index.html');
});

// Når man kommer til ekstra valg
app.get('/ekstra_valg', function(req, res) {
    res.sendFile(__dirname + '/src/html/ekstra_valg.html');
});

// Når man kommer til reiseplanlegger
app.get('/reiseplanlegger', function(req, res) {
    res.sendFile(__dirname + '/src/html/reiseplanlegger.html');
});

// Når man kommer til trip
app.get('/trip', function(req, res) {
    res.sendFile(__dirname + '/src/html/trip.html');
});

// Ikke funksjonell
app.post('/lagre_reisen', function(req, res) {
    res.redirect('/trip');
});

// Når man kommer til login
app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/src/html/login.html');
});

// Når man kommer til registrer
app.get('/register', function(req, res) {
    res.sendFile(__dirname + '/src/html/register.html');
});

// Når man skriver inn noe og trykker på login
app.post('/loginauth', function(req, res) {
    // hent info fra html elementer
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
        // database spørring
        connection.query('SELECT * from brukere WHERE brukernavn = ?', [username], function(error, result, fields) {
            if (error) throw error;
            // Hvis brukernavn eksisterer
            if (result.length > 0) {
                // Skjekke om input stemmer med hashet passord
                bcrypt.compare(password, result[0].passord, function(err, passwordMatch) {
                    if (err) throw err;
                    if (passwordMatch) {
                        // Sette cookies for logged in
                        req.session.loggedin = true;
                        req.session.username = username;
                        res.clearCookie('loggedin');
                        res.clearCookie('username');
                        res.cookie('loggedin', 'true');
                        res.cookie('username', username);
                        res.redirect('/');
                    } else {
                        // Sette cookies for error
                        res.cookie('errormessage', 'u_p');
                        res.redirect('/login');
                    }
                });
            } else {
                // Bruker ikke funnet melding
                res.cookie('errormessage', 'u_p');
                res.redirect('/login');
            }
        });
    } else {
        // Ugylding input melding
        res.cookie('errormessage', 'e_i');
        res.redirect('/login');
    }
});

app.post('/registerauth', function(req, res) {
// hente info fra html
    let username = req.body.username;
    let password = req.body.password;

    //hvis brukernavn og passord er skrevet inn
    if (username && password) {
        //  database spørring
        connection.query('SELECT * FROM brukere WHERE brukernavn = ?', [username], function(error, result, fields) {
            if (error) throw error;

            // hvis resultatet stemmer
            if (result.length > 0) {
                // Bruker er allerede tatt error message
                res.cookie('errormessage', 'u_t');
                res.redirect('/login');
            } else {
                // Hashe passord
                bcrypt.hash(password, saltRounds, function(err, hash) {
                    if (err) throw err;

                    // Insert sql spørring
                    var sqlforregister = 'INSERT INTO brukere (brukernavn, passord) VALUES ?';
                    // Definere values
                    var values = [
                        [username, hash]
                    ];

                    // Gjør query spørring
                    connection.query(sqlforregister, [values], function (err, result) {
                        if (err) throw err;

                        // succesfull message
                        res.cookie('errormessage', 'r_s');
                        res.redirect('/login');
                    });
                });
            }
        });
    } else {
        // Ugylding input melding
        res.cookie('errormessage', 'e_uc');
        res.redirect('/login');
    }
});

// Når trykke logout
app.get('/logout', function(req, res) {
    // clear alle cookies og gå tilbake til hjemmeside
    req.session.loggedin = false;
    req.session.username = '';
    res.clearCookie('loggedin');
    res.clearCookie('username');
    res.cookie('loggedin', 'false');
    res.redirect('/');
});

app.listen(3000);