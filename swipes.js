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

function readjustViewbox(e) {
    document.getElementById("campus-map-svg").setAttribute("viewBox", e.getAttribute("data-view"));
}

function showTooltip(e) {
    console.log(document.querySelectorAll("#" + e.id)); // 0 is valid, 1 is denied
}

/* SLIDER */
var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function getVals() {
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
    displayElement.innerHTML = weekday[d1.getDay()] + " at " + d1.getHours() + ":" + ('0' + d1.getMinutes()).slice(-2) + " - " + weekday[d2.getDay()] + " at " + d2.getHours() + ":" + ('0' + d2.getMinutes()).slice(-2);
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
