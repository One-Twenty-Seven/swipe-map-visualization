function buttonPress() {
    var swipedatacopy = swipedata.slice();

    var circs = document.getElementsByTagName("circle");
    for ( var i = 0; i < circs.length; i++ ){
        circs[i].setAttribute("r", 0);
    }

    var slides = document.getElementsByTagName("input");
    var slide1 = parseInt( slides[0].value );
    var slide2 = parseInt( slides[1].value );

    if ( slide1 > slide2 ) {
        var tmp = slide2;
        slide2 = slide1;
        slide1 = tmp;
    }

    while ( slide1 > swipedatacopy[0]["t"] && swipedatacopy.length !== 0 ) {
        swipedatacopy.shift();
    }

    for ( var i=slide1; i<=slide2; i++ ) {
        if (swipedatacopy[0]["t"] === i) {
            if (swipedatacopy[0]["v"] === 1) { // check if valid
                var elem = document.querySelectorAll("circle#" + swipedatacopy[0]["l"])[1];
            }
            else {  // otherwise invalid/denied
                var elem = document.querySelectorAll("circle#" + swipedatacopy[0]["l"])[0];
            }
            if (elem) {
                elem.setAttribute("r", parseFloat(elem.getAttribute("r")) + 0.025);
            }
            swipedatacopy.shift();
            if ( i !== slide2 ) {
                i--;
            }
        }
    }
}

function hideTooltip() {
    document.getElementById("js-tooltip-attach").style.display = "none";
}

function readjustViewbox(e) {
    hideTooltip();
    document.getElementById("campus-map-svg").setAttribute("viewBox", e.getAttribute("data-view"));
}

function showTooltip(e) {
    var reference = document.querySelectorAll("#" + e.id); // 0 is valid, 1 is denied
    var deniedCount = reference[0].getAttribute("r") / 0.025;
    var swipeCount = reference[1].getAttribute("r") / 0.025;
    var bounds = e.getBoundingClientRect();
    var elem = document.getElementById("js-tooltip-attach");
    elem.childNodes[3].innerText = reference[1].getAttribute("data-name"); // building name
    var swipes = elem.childNodes[8];
    var denied = elem.childNodes[13];
    swipes.innerText = Math.round(swipeCount);
    denied.innerText = Math.round(deniedCount);
    elem.style.top = bounds.y + (bounds.height / 2);
    elem.style.left = bounds.x + (bounds.width / 2);
    elem.style.display = "block";
}

function twelvetime(time) {
    var hours = (time.getHours() > 12 ? time.getHours() - 12 : time.getHours()) === 0 ? 12 : (time.getHours() > 12 ? time.getHours() - 12 : time.getHours());
    var am_pm = time.getHours() >= 12 ? "PM" : "AM";
    hours = hours < 10 ? "0" + hours : hours;
    var minutes = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();

    return hours + ":" + minutes + am_pm;
}

/* SLIDER */
var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function getVals() {
    hideTooltip();
    // Get slider values
    var parent = this.parentNode;
    var slides = parent.getElementsByTagName("input");
    var slide1 = parseFloat( slides[0].value );
    var slide2 = parseFloat( slides[1].value );

    // Neither slider will clip the other, so make sure we determine which is larger
    if( slide1 > slide2 ) {
        var tmp = slide2;
        slide2 = slide1;
        slide1 = tmp;
    }

    var displayElement = parent.getElementsByClassName("rangeValues")[0];
    var d1 = new Date(0);
    var d2 = new Date(0);
    d1.setUTCSeconds(slide1);
    d2.setUTCSeconds(slide2);
    displayElement.innerHTML = weekday[d1.getDay()] + " at " + twelvetime(d1) + " - " + weekday[d2.getDay()] + " at " + twelvetime(d2);
}

window.onload = function(){
    // Initialize Sliders
    var sliderSections = document.getElementsByClassName("range-slider");
    for ( var x = 0; x < sliderSections.length; x++ ) {
        var sliders = sliderSections[x].getElementsByTagName("input");
        for ( var y = 0; y < sliders.length; y++ ) {
            if ( sliders[y].type === "range" ) {
                sliders[y].oninput = getVals;
                // Manually trigger event first time to display values
                sliders[y].oninput();
                buttonPress();
            }
        }
    }
}
