let resultaterEl = document.getElementById("resultater");
let fraEl = localStorage.getItem("Fra");
let tilEl = localStorage.getItem("Til");
let i_h1el = document.getElementById("i_h1");
let trips = "";
let avgangEl = localStorage.getItem("avgang");
let ankomstEl = localStorage.getItem("ankomst");
let arriveBy = "false";
let avgangogavkomstel = "";
if (ankomstEl) {
    avgangogavkomstel = ankomstEl;
    arriveBy = "true";
} else if (avgangEl) {
    avgangogavkomstel = avgangEl;
} else {
    avgangogavkomstel = new Date().toISOString();
}
let byttetid2El = localStorage.getItem("byttetid");
let byttetid2ElSec = byttetid2El * 60;


reise();
function reise () {
    fetch('https://api.entur.io/journey-planner/v3/graphql', {
    method: 'POST',
    headers: {
    // Replace this with your own client name:
    'ET-Client-Name': 'alsta-bussen',
    'Content-Type': 'application/json'
    },
    // GraphQL Query
    // https://api.entur.io/graphql-explorer/journey-planner-v3?query=%7B%0A%20%20trip%28%0A%20%20%20%20from%3A%20%7Bplace%3A%20"NSR%3AStopPlace%3A58227"%7D%0A%20%20%20%20to%3A%20%7Bplace%3A%20"NSR%3AStopPlace%3A5920"%7D%0A%20%20%20%20walkSpeed%3A%201.3%0A%20%20%20%20dateTime%3A%20"2023-12-11T15%3A00%3A00.000Z"%0A%20%20%20%20arriveBy%3A%20false%0A%20%20%20%20includePlannedCancellations%3A%20true%0A%20%20%20%20includeRealtimeCancellations%3A%20true%0A%20%20%29%20%7B%0A%20%20%20%20fromPlace%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%7D%0A%20%20%20%20toPlace%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%7D%0A%20%20%20%20tripPatterns%20%7B%0A%20%20%20%20%20%20aimedStartTime%0A%20%20%20%20%20%20expectedStartTime%0A%20%20%20%20%20%20aimedEndTime%0A%20%20%20%20%20%20expectedEndTime%0A%20%20%20%20%20%20streetDistance%0A%20%20%20%20%20%20walkTime%0A%20%20%20%20%20%20duration%0A%20%20%20%20%20%20legs%20%7B%0A%20%20%20%20%20%20%20%20aimedStartTime%0A%20%20%20%20%20%20%20%20expectedStartTime%0A%20%20%20%20%20%20%20%20aimedEndTime%0A%20%20%20%20%20%20%20%20expectedEndTime%0A%20%20%20%20%20%20%20%20mode%0A%20%20%20%20%20%20%20%20duration%0A%20%20%20%20%20%20%20%20line%20%7B%0A%20%20%20%20%20%20%20%20%20%20publicCode%0A%20%20%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20fromEstimatedCall%20%7B%0A%20%20%20%20%20%20%20%20%20%20destinationDisplay%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20frontText%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20fromPlace%20%7B%0A%20%20%20%20%20%20%20%20%20%20quay%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20toPlace%20%7B%0A%20%20%20%20%20%20%20%20%20%20quay%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20intermediateEstimatedCalls%20%7B%0A%20%20%20%20%20%20%20%20%20%20quay%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20aimedArrivalTime%0A%20%20%20%20%20%20%20%20%20%20expectedArrivalTime%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A&variables=
    body: JSON.stringify({ 
        query: `{
            trip(
                from: {place: "${fraEl}"}
                to: {place: "${tilEl}"}
                dateTime: "${avgangogavkomstel}"
                arriveBy: ${arriveBy}
                walkSpeed: 1.3
                includePlannedCancellations: true
                includeRealtimeCancellations: true
                transferSlack: ${byttetid2ElSec}
            ) {
                fromPlace {
                    name
                }
                toPlace {
                    name
                }
                tripPatterns {
                    aimedStartTime
                    expectedStartTime
                    aimedEndTime
                    expectedEndTime
                    streetDistance
                    walkTime
                    duration
                    legs {
                        aimedStartTime
                        expectedStartTime
                        aimedEndTime
                        expectedEndTime
                        mode
                        duration
                        line {
                            publicCode
                        }
                        fromEstimatedCall {
                            destinationDisplay {
                                frontText
                            }
                        }
                        fromPlace {
                            quay {
                                name
                            }
                        }
                        toPlace {
                            quay {
                                name
                            }
                        }
                        intermediateEstimatedCalls {
                            quay {
                              name
                            }
                            aimedArrivalTime
                            expectedArrivalTime
                        }
                    }
                }
            }
        }`
    }),
    })
    .then(res => res.json())
    .then(stopPlaceData => {
        localStorage.setItem("stopPlaceData", JSON.stringify(stopPlaceData));
        p = 0;
        let html = '';
        const search = stopPlaceData.data.trip;
        trips = search.tripPatterns;
        i_h1el.innerText = `Resultater fra ${search.fromPlace.name} til ${search.toPlace.name}`;
        // For alle avanger length
        for (let i = 0; i < trips.length; i++) {
            const thisTrip = trips[i];
            const aimedStart = new Date(thisTrip.aimedStartTime).toLocaleTimeString('no-NO', {hour: '2-digit', minute:'2-digit'});
            const expectedStartingTime = new Date(thisTrip.expectedStartTime).toLocaleTimeString('no-NO', {hour: '2-digit', minute:'2-digit'});
            const aimedEnd = new Date(thisTrip.aimedEndTime).toLocaleTimeString('no-NO', {hour: '2-digit', minute:'2-digit'});
            const expectedEndingTime = new Date(thisTrip.expectedEndTime).toLocaleTimeString('no-NO', {hour: '2-digit', minute:'2-digit'});
            const lineDiv = thisTrip;

            const departureF = document.createElement('div');
            departureF.className = "departureDiv";
            departureF.id = p;
            departureF.setAttribute("onclick","avgangclick(this.id)");

            const aimedStartF = document.createElement('div');
            aimedStartF.className = 'aimedStartDiv';
            aimedStartF.textContent = aimedStart + "-";

            const aimedEndF = document.createElement('div');
            aimedEndF.className = 'aimedEndDiv';
            aimedEndF.textContent = aimedEnd;

            departureF.appendChild(aimedStartF);
            departureF.appendChild(aimedEndF);

            for (b = 0; b < thisTrip.legs.length; b++) {
                if (thisTrip.legs[b].mode !== "foot") {
                    if (thisTrip.legs[b].line.publicCode) {
                        const lineDivF = document.createElement('div');
                        lineDivF.className = "lineDiv2";
                        lineDivF.textContent = thisTrip.legs[b].line.publicCode;
                            if (thisTrip.legs[b].line.publicCode > 0 && thisTrip.legs[b].line.publicCode < 10 && thisTrip.legs[b].line.publicCode.length < 2) {
                                lineDivF.className = lineDivF.classList + ' orange';
                            } else if (thisTrip.legs[b].line.publicCode > 9 && thisTrip.legs[b].line.publicCode < 20) {
                                lineDivF.className = lineDivF.classList + ' blue';
                            } else if (thisTrip.legs[b].line.publicCode.length > 1 && thisTrip.legs[b].line.publicCode.replace(/\D/g,'') > 19 && thisTrip.legs[b].line.publicCode.replace(/\D/g,'') < 99 | thisTrip.legs[b].line.publicCode == "110" | thisTrip.legs[b].line.publicCode == "100" | thisTrip.legs[b].line.publicCode == "300") {
                                lineDivF.className = lineDivF.classList + ' red';
                            } else if (thisTrip.legs[b].line.publicCode.length > 1 && thisTrip.legs[b].line.publicCode.replace(/\D/g,'') > 99 && thisTrip.legs[b].line.publicCode.replace(/\D/g,'') < 4000) {
                                lineDivF.className = lineDivF.classList + ' green';
                            } else {
                                lineDivF.className = lineDivF.classList + ' other';
                            };
                        departureF.appendChild(lineDivF);
                    } else if (thisTrip.legs[b].mode == "air") {
                        const lineDivF = document.createElement('img');
                        lineDivF.className = "flyDiv";
                        lineDivF.src = "/src/images/plane.png";
                        departureF.appendChild(lineDivF);
                    }
                } else {
                    const lineDivF = document.createElement('img');
                    lineDivF.className = "walkDiv";
                    lineDivF.src = "/src/images/walk.png";
                    departureF.appendChild(lineDivF);
                };
            };

            resultaterEl.appendChild(departureF);
            p++;
        };
    // textel.innerHTML = `Avganger fra: ${stopPlaceData.data.stopPlace.name}`;
    // originaltidEl.innerHTML = "Ruter/Entur API (Testing)";
});
};

function avgangclick(avgangid) {
    localStorage.setItem("avgangclicked", avgangid);
    window.location.replace("/trip");
};