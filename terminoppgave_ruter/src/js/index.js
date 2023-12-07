let fraEl = document.getElementById("i_ifra");
let tilEl = document.getElementById("i_til");
let tilElinput = document.getElementById("i_itil");
let velgEl = document.getElementById("velg");
let iplEl = document.getElementById("i_pl");
let fraDivEl = document.getElementById("fra_div_input");
let tildivEl = document.getElementById("til_div");
let tildivElinput = document.getElementById("til_div_input");
let headerEl = document.getElementById("header");
var searchTimeout;
var velgEnArr = [];
var navnArr = [];
tildivEl.style.display = "none"
fraEl.disabled = false;

const loggedinvalue = ('; '+document.cookie).split(`; loggedin=`).pop().split(';')[0];
const usernamevalue = ('; '+document.cookie).split(`; username=`).pop().split(';')[0];

if (loggedinvalue !== "true") {
    let loggedinbuttondiv = document.createElement("button");
    loggedinbuttondiv.className = "loginbutton button3";
    loggedinbuttondiv.setAttribute("onclick", "login()");
    loggedinbuttondiv.textContent = "Log in";
    headerEl.appendChild(loggedinbuttondiv);
} else {
    let loggedintextdiv = document.createElement("div");
    let loggedintext = document.createElement("p")
    let logoutbutton = document.createElement("button")
    loggedintextdiv.className = "loggedintextdiv";
    loggedintext.className = "loggedintext";
    logoutbutton.className = "logoutbutton button2";
    logoutbutton.setAttribute("onclick", "logout()");
    loggedintext.innerHTML = "Logged in as " + usernamevalue;
    logoutbutton.textContent = "Log out";
    loggedintextdiv.appendChild(loggedintext);
    loggedintextdiv.appendChild(logoutbutton);
    headerEl.appendChild(loggedintextdiv);
}

fraEl.onkeydown = function () {
    velgEnArr = [];
    fraDivEl.textContent = "";

    // Element mens den laster inn
    // "Laster inn..." tekst
    if (!loadingelement) {
        var loadingelement = document.createElement("p");
        loadingelement.className = "loadingtextindex";
        loadingelement.textContent = "Laster inn...";
        fraDivEl.appendChild(loadingelement);
    };
    // Delay så den ikke sender inn autocomplete API requests hele tiden
    if (searchTimeout != undefined) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(valg, 500);
};
function valg () {
    fetch(`https://api.entur.io/geocoder/v1/autocomplete?text=${fraEl.value}`, {
            headers: {
                "ET-Client-Name": "alsta-bussen",
            },
        })
        .then(response => response.json())
        .then(data => {
            navnArr = [];
            velgEnArr = [];
            fraDivEl.textContent = "";
            a = 0;
            // For lengden av stasjoner
            for (x = 0; x < data.features.length; x++) {
                if (data.features[x].properties.id.includes("NSR:StopPlace")) {
                    a++;
                    // lage ny p element og knappen med class og id og alt
                    var stasjonspelement = document.createElement('p');
                    var stasjonsbutton = document.createElement('button');
                    stasjonspelement.className = "stasjonspelement";
                    stasjonsbutton.className = "stasjonsbutton";
                    stasjonsbutton.setAttribute("id", `${a}`);
                    stasjonspelement.setAttribute("id", `${a}`);
                    stasjonspelement.setAttribute("onclick", "buttonclicked(this.id)");
                    stasjonspelement.textContent = data.features[x].properties.name + ", " + data.features[x].properties.locality;
                    var velgEnArrel = data.features[x].properties.id;
                    stasjonsbutton.textContent = "Velg";
                    var stasjonsnavn = data.features[x].properties.name + ", " + data.features[x].properties.locality;
                    stasjonspelement.appendChild(stasjonsbutton);
                    fraDivEl.appendChild(stasjonspelement);
                    velgEnArr.push(velgEnArrel);
                    navnArr.push(stasjonsnavn);
                }
            }
            // skjekk lasting eller ingen resultater
            if (velgEnArr.length === 0) {
                var nodataelement = document.createElement("p");
                nodataelement.className = "loadingtextindex";
                if (fraEl.value.length == 0) {
                    nodataelement.textContent = "";
                } else {
                    nodataelement.textContent = "Ingen resultater.";
                };
                fraDivEl.appendChild(nodataelement);
            };
        })
        .catch(error => {
            // hvis error
            console.error("Error fetching data:", error);
        });
    };
function buttonclicked(clicked_id) {
    fraDivEl.style.display = "none";
    fraEl.disabled = true;
    fraEl.value = navnArr[clicked_id - 1];
    localStorage.setItem("Fra", velgEnArr[clicked_id - 1])
    velgEnArr = [];
    tildivEl.style.display = "flex";
};
tilEl.onkeydown = function () {
    velgEnArr = [];
    tildivElinput.textContent = "";
    // Element mens den laster inn
    if (!loadingelement) {
        var loadingelement = document.createElement("p");
        loadingelement.className = "loadingtextindex";
        loadingelement.textContent = "Laster inn...";
        tildivElinput.appendChild(loadingelement);
    };
    // Delay så den ikke sender inn autocomplete API requests hele tiden
    if (searchTimeout != undefined) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(valg2, 500);
};
function valg2 () {
    tilElinput = document.getElementById("i_itil");
    fetch(`https://api.entur.io/geocoder/v1/autocomplete?text=${tilElinput.value}`, {
            headers: {
                "ET-Client-Name": "alsta-bussen",
            },
        })
        .then(response => response.json())
        .then(data => {
            navnArr = [];
            velgEnArr = [];
            tildivElinput.textContent = "";
            a = 0;
            // For lengden av stasjoner
            for (x = 0; x < data.features.length; x++) {
                if (data.features[x].properties.id.includes("NSR:StopPlace")) {
                    a++;
                    // lage ny p element og knappen med class og id og alt
                    var stasjonspelement = document.createElement('p');
                    var stasjonsbutton = document.createElement('button');
                    stasjonspelement.className = "stasjonspelement";
                    stasjonsbutton.className = "stasjonsbutton";
                    stasjonsbutton.setAttribute("id", `${a}`);
                    stasjonspelement.setAttribute("id", `${a}`);
                    stasjonspelement.setAttribute("onclick", "buttonclicked2(this.id)");
                    stasjonspelement.textContent = data.features[x].properties.name + ", " + data.features[x].properties.locality;
                    var velgEnArrel = data.features[x].properties.id;
                    stasjonsbutton.textContent = "Velg";
                    var stasjonsnavn = data.features[x].properties.name + ", " + data.features[x].properties.locality;
                    stasjonspelement.appendChild(stasjonsbutton);
                    tildivElinput.appendChild(stasjonspelement);
                    velgEnArr.push(velgEnArrel);
                    navnArr.push(stasjonsnavn);
                }
            }
            // skjekk lasting eller ingen resultater
            if (velgEnArr.length === 0) {
                var nodataelement = document.createElement("p");
                nodataelement.className = "loadingtextindex";
                if (tilEl.value.length == 0) {
                    nodataelement.textContent = "";
                } else {
                    nodataelement.textContent = "Ingen resultater.";
                };
                tildivElinput.appendChild(nodataelement);
            };
        })
        .catch(error => {
            // hvis error
            console.error("Error fetching data:", error);
        });
    };
    function buttonclicked2(clicked_id) {
        tilElinput.disabled = true;
        tilElinput.value = navnArr[clicked_id - 1];
        localStorage.setItem("Til", velgEnArr[clicked_id - 1]);
        velgEnArr = [];
        tildivElinput.textContent = "";
        window.location.replace("/ekstra_valg");
    };
    

function login() {
    location.replace("/login");
};

function logout() {
    location.replace("/logout");
};