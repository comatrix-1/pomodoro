let title = document.querySelector("title");
let counter = document.querySelector("#counter p");
let pauseButton = document.querySelector("#pause-button");
let stopButton = document.querySelector("#stop-button");
let focusButton = document.querySelector("#focus-button");
let breakButton = document.querySelector("#break-button");
var timer;

let focusDistance = 1000 * 60 * 25;
let breakDistance = 1000 * 60 * 5;
let currentFocusDistance = focusDistance;
let currentBreakDistance = breakDistance;

var distance = focusDistance;
let counting = "no";

let mode = "focus";

let vidForm = document.querySelector("form");
let iframe = document.querySelector("iframe");

// Set the date we're counting down to
var now = Date.now();
let countDownDate = now + distance;

// toTitleCase definition for strings
String.prototype.toProperCase = function() {
    return this.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

// timer start countdown function
const countdown = function() {
    // set fixed countDownDate to work towards
    now = Date.now();
    countDownDate = now + distance;

    counting = "yes";

    // Update the count down every 1 second
    timer = setInterval(function() {
        now = Date.now();
        // Find the distance between now and the count down date
        distance = countDownDate - now;

        // If the count down is over, write some text
        if (distance <= 0) {
            clearInterval(timer);
            distance = 0;
            let audio = document.querySelector("audio");
            audio.play();
        }

        showValue(distance, counter);
        showValue(distance, title);
    }, 1000);
};

// select chosen time to distance parameter, and update paragraph
const showValue = function(value = 0, element = title) {
    if (Number(value) >= 0) {
        let minutes = Math.floor((value % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((value % (1000 * 60)) / 1000);
        element.innerHTML = minutes + "m " + seconds + "s ";
    } else if (value.toString) {
        element.innerHTML = value.toString().toProperCase();
    } else {
        console.error("Value is neither number nor string in showValue function");
    }
};

const reset = function(parameterDistance) {
    counting = "no";
    clearInterval(timer);
    distance = parameterDistance;
    showValue(distance, counter);
    pauseButton.innerText = "Start countdown";
};

pauseButton.addEventListener("click", () => {
    if (counting == "no") {
        counting = "yes";
        countdown();
        pauseButton.innerText = "Pause countdown";
    } else {
        counting = "no";
        showValue(`${mode} - Pomodoro`, title);
        clearInterval(timer);
        pauseButton.innerText = "Resume countdown";
    }
});

stopButton.addEventListener("click", () => {
    mode == "focus" ? reset(focusDistance) : reset(breakDistance);
    showValue(mode, title);
});

focusButton.addEventListener("click", () => {
    if (mode == "break") {
        currentBreakDistance = distance;
        mode = "focus";
        showValue(`${mode} - Pomodoro`, title);
        reset(currentFocusDistance);
        breakButton.classList.add("inactive");
        focusButton.classList.remove("inactive");
    }
});

breakButton.addEventListener("click", () => {
    if (mode == "focus") {
        currentFocusDistance = distance;
        mode = "break";
        showValue(`${mode} - Pomodoro`, title);
        reset(currentBreakDistance);

        focusButton.classList.add("inactive");
        breakButton.classList.remove("inactive");
    }
});

vidForm.addEventListener("submit", function(event) {
    event.preventDefault();
    let formValue = vidForm.querySelector("input").value;
    iframe.setAttribute(
        "src",
        `https://www.youtube-nocookie.com/embed/${formValue}`
    );
    vidForm.querySelector("input").value = "";
});

// set intial timer
showValue(distance, counter);
