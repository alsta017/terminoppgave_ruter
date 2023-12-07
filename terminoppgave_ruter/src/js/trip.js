const i_h1el = document.querySelector("#i_h1");
let stopPlaceDatas = JSON.parse(localStorage.getItem("stopPlaceData"));
let avgangclickus = localStorage.getItem("avgangclicked");
let departuredisplayDiv = document.querySelector("#departuredisplay");
let trips = stopPlaceDatas.data.trip.tripPatterns;
let ivalue = "";
let visellerskulallestoppEl = document.querySelector("#visellerskulallestopp");

let visAlleDiv = document.createElement('button');
visAlleDiv.className = "button2";
visAlleDiv.setAttribute('id', 'visAlleStopp');
visAlleDiv.setAttribute('onclick', 'visAlleStopp()');
visAlleDiv.textContent = "Vis mellomstopp";
visellerskulallestoppEl.appendChild(visAlleDiv)


for (let i = 0; i < trips.length; i++) {
    if (i == avgangclickus) {
        ivalue = i;
    };
};

let this_departure = trips[ivalue];
console.log(this_departure);

let fullDiv = document.createElement('div');
fullDiv.className = "fullDiv";

let fullTimeDiv = document.createElement('div');
fullTimeDiv.className = "fulltimeDisplay";

let startDiv = document.createElement('div');
startDiv.className = "startDiv";

let startTimeAimDiv = document.createElement('div');
startTimeAimDiv.className = "timeDisplay";
startTimeAimDiv.textContent = new Date(this_departure.aimedStartTime).toLocaleTimeString('no-NO', {hour: '2-digit', minute: '2-digit'});
startDiv.appendChild(startTimeAimDiv);

let startTimeExpDiv = document.createElement('div');
startTimeExpDiv.className = "timeDisplayExp";
startTimeExpDiv.textContent = new Date(this_departure.expectedStartTime).toLocaleTimeString('no-NO', {hour: '2-digit', minute: '2-digit'});
if (startTimeExpDiv.textContent !== startTimeAimDiv.textContent) {
    startTimeAimDiv.className = "timeDisplayEdit";
    startDiv.appendChild(startTimeExpDiv);
};
fullTimeDiv.appendChild(startDiv);

let lineDiv = document.createElement('div');
lineDiv.className = "lineDiv";
lineDiv.textContent = "-";
fullTimeDiv.appendChild(lineDiv);

let endDiv = document.createElement('div');
endDiv.className = "endDiv";

let endTimeAimDiv = document.createElement('div');
endTimeAimDiv.className = "timeDisplay";
endTimeAimDiv.textContent = new Date(this_departure.aimedEndTime).toLocaleTimeString('no-NO', {hour: '2-digit', minute: '2-digit'});
endDiv.appendChild(endTimeAimDiv);

let endTimeExpDiv = document.createElement('div');
endTimeExpDiv.className = "timeDisplayExp";
endTimeExpDiv.textContent = new Date(this_departure.expectedEndTime).toLocaleTimeString('no-NO', {hour: '2-digit', minute: '2-digit'});
if (endTimeExpDiv.textContent !== endTimeAimDiv.textContent) {
    endTimeAimDiv.className = "timeDisplayEdit";
    endDiv.appendChild(endTimeExpDiv);
}
fullTimeDiv.appendChild(endDiv);

let totalTime = document.createElement('div');
totalTime.className = "totalTime";
totalTime.textContent = Math.floor(this_departure.duration/60) + " min";
fullTimeDiv.appendChild(totalTime);

departuredisplayDiv.appendChild(fullDiv);
fullDiv.appendChild(fullTimeDiv);

let legsDiv = document.createElement('div');
legsDiv.className = "legsDiv";

for (let c = 0; c < this_departure.legs.length; c++) {

    let legDiv = document.createElement('div');
    legDiv.className = "legDiv";

    let legDivLine1 = document.createElement('div');
    legDivLine1.className = "legDivLine1";

    let startTimeExpDivLeg = document.createElement('div');
    startTimeExpDivLeg.className = "startTimeAimDivLeg";
    startTimeExpDivLeg.textContent = new Date(this_departure.legs[c].expectedStartTime).toLocaleTimeString('no-NO', {hour: '2-digit', minute: '2-digit'});
    legDivLine1.appendChild(startTimeExpDivLeg);

    let lineDivLeg = document.createElement('div');
    lineDivLeg.className = "lineDivLeg";
    lineDivLeg.textContent = "-";
    legDivLine1.appendChild(lineDivLeg);

    let endTimeExpDivLeg = document.createElement('div');
    endTimeExpDivLeg.className = "startTimeExpDivLeg";
    endTimeExpDivLeg.textContent = new Date(this_departure.legs[c].expectedEndTime).toLocaleTimeString('no-NO', {hour: '2-digit', minute: '2-digit'});
    legDivLine1.appendChild(endTimeExpDivLeg);
    if (this_departure.legs[c].mode == "air") {

        let flyDiv = document.createElement('img');
        flyDiv.className = "flyDiv2";
        flyDiv.src = "/src/images/plane.png"
        legDivLine1.appendChild(flyDiv);

    } else if (this_departure.legs[c].fromEstimatedCall !== null) {

        let lineNumberDiv = document.createElement('div');
        lineNumberDiv.className = "lineNumberDiv";
        lineNumberDiv.textContent = this_departure.legs[c].line.publicCode;

        if (this_departure.legs[c].line.publicCode > 0 && this_departure.legs[c].line.publicCode < 10 && this_departure.legs[c].line.publicCode.length < 2) {
            lineNumberDiv.className = lineNumberDiv.classList + ' orange';
        } else if (this_departure.legs[c].line.publicCode > 9 && this_departure.legs[c].line.publicCode < 20) {
            lineNumberDiv.className = lineNumberDiv.classList + ' blue';
        } else if (this_departure.legs[c].line.publicCode.length > 1 && this_departure.legs[c].line.publicCode.replace(/\D/g,'') > 19 && this_departure.legs[c].line.publicCode.replace(/\D/g,'') < 99 | this_departure.legs[c].line.publicCode == "110" | this_departure.legs[c].line.publicCode == "100" | this_departure.legs[c].line.publicCode == "300"){
            lineNumberDiv.className = lineNumberDiv.classList + ' red';
        } else if (this_departure.legs[c].line.publicCode.length > 1 && this_departure.legs[c].line.publicCode.replace(/\D/g,'') > 99 && this_departure.legs[c].line.publicCode.replace(/\D/g,'') < 4000) {
            lineNumberDiv.className = lineNumberDiv.classList + ' green';
        } else {
            lineNumberDiv.className = lineNumberDiv.classList + ' other';
        };
        
        let lineTextDiv = document.createElement('div');
        lineTextDiv.className = "lineTextDiv";
        lineTextDiv.textContent = this_departure.legs[c].fromEstimatedCall.destinationDisplay.frontText;
        if (lineTextDiv.textContent === "Majorstuen") {
            lineTextDiv.textContent = "Majorstua";
        }
        legDivLine1.appendChild(lineNumberDiv);
        legDivLine1.appendChild(lineTextDiv);

    } else if (this_departure.legs[c].mode == "foot") {

        let walkDiv = document.createElement('img');
        walkDiv.className = "walkDiv2";
        walkDiv.src = "/src/images/walk.png"

        legDivLine1.appendChild(walkDiv);
    }

    let legDivLine2 = document.createElement('div');
    legDivLine2.className = "legDivLine2";

    let stopsDiv = document.createElement('div');
    stopsDiv.className = "stopsDiv";

    let startPlaceDiv = document.createElement('div');
    startPlaceDiv.className = "startPlaceDiv"
    startPlaceDiv.textContent = this_departure.legs[c].fromPlace.quay.name + " →";
    legDivLine2.appendChild(startPlaceDiv);

    let endPlaceDiv = document.createElement('div');
    endPlaceDiv.className = "endPlaceDiv";

    let stopPlaceCount = document.createElement('div');
    stopPlaceCount.className = "stopPlaceCount";
    stopPlaceCount.textContent = this_departure.legs[c].intermediateEstimatedCalls.length + " stopp"

    for (let d = 0; d < this_departure.legs[c].intermediateEstimatedCalls.length; d++) {
        let stopDivExp = document.createElement('div');
        let stopDivAim = document.createElement('div');
        let stopDiv = document.createElement('div');
        let stopName = document.createElement('div')
        stopDiv.className = "stopDiv";
        stopDivExp.className = "stopDivExp";
        stopDivAim.className = "stopDivAim";
        stopName.className = "stopName";
        stopDivExp.textContent = new Date(this_departure.legs[c].intermediateEstimatedCalls[d].expectedArrivalTime).toLocaleTimeString('no-NO', {hour: '2-digit', minute: '2-digit'});
        stopDivAim.textContent = new Date(this_departure.legs[c].intermediateEstimatedCalls[d].aimedArrivalTime).toLocaleTimeString('no-NO', {hour: '2-digit', minute: '2-digit'});
        stopName.textContent = " - " + this_departure.legs[c].intermediateEstimatedCalls[d].quay.name;
        if (stopDivExp.textContent !== stopDivAim.textContent) {
            stopDiv.appendChild(stopDivAim);
            stopDiv.appendChild(stopDivExp);
        } else {
            stopDiv.appendChild(stopDivExp);
        }
        stopDiv.appendChild(stopName);
        stopsDiv.appendChild(stopDiv);
        endPlaceDiv.textContent = "→ ";
        stopsDiv.style.display = "none";
        legDivLine2.appendChild(stopPlaceCount)
    }
    if (this_departure.legs[c].intermediateEstimatedCalls.length) {
        legDivLine2.appendChild(stopsDiv);
    }

    endPlaceDiv.textContent = endPlaceDiv.textContent + this_departure.legs[c].toPlace.quay.name;
    legDivLine2.appendChild(endPlaceDiv);
    legDiv.appendChild(legDivLine1);
    legDiv.appendChild(legDivLine2);
    legsDiv.appendChild(legDiv);
}

let skulButton = document.createElement("button");
skulButton.className = "button2";
skulButton.setAttribute("id", "skulAlleStopp");
skulButton.setAttribute("onclick", "skulAlleStopp()");
skulButton.textContent = "Skul mellomstopp";

function visAlleStopp () {
    let visButton = document.getElementById("visAlleStopp");
    document.querySelectorAll(".stopPlaceCount").forEach(a=>a.style.display = "none");
    document.querySelectorAll(".stopsDiv").forEach(a=>a.style.display = "block");
    visButton.style.display = "none";
    visellerskulallestoppEl.appendChild(skulButton);
    skulButton.style.display = "block";
}
function skulAlleStopp () {
    let skulButton = document.getElementById("skulAlleStopp");
    let visButton = document.getElementById("visAlleStopp");
    document.querySelectorAll(".stopPlaceCount").forEach(a=>a.style.display = "block");
    document.querySelectorAll(".stopsDiv").forEach(a=>a.style.display = "none");
    skulButton.style.display = "none";
    visButton.style.display = "block";
}

function lagre_reise() {
    location.replace("/lagre_reisen");
};

fullDiv.appendChild(legsDiv);

i_h1el.innerHTML = `Fra ${stopPlaceDatas.data.trip.fromPlace.name} til ${stopPlaceDatas.data.trip.toPlace.name}`;