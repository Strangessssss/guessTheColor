const colors = [
    "#FF0000", // Red
    "#00FF00", // Lime
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
    "#FFA500", // Orange
    "#800080"  // Purple
];

let attempt = 0;

function shuffle(array) {
    let tempArray = [...array]
    for (let i = tempArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
    }
    return tempArray;
}

$("#restart").on("click", function() {
    location.reload();
})

let newColors = shuffle(colors);
let shuffledColors = shuffle(colors);

const $field = $("#field");
const $count = $("#count");
const $attempt = $("#attempts");

$("#start").on("click", function() {
    const count = $("#count").text();
    console.log(count);
    window.location.href = `index.html`;
})

$(function() {
    start();
})

function start(){
    $field.empty();
    $("win").css("visibility", "hidden");
    let i = 0;
    for (const color of newColors) {
        $field.append("<div class='space container'/>");
        $field.children().last().append(`<div class='color' space-idx=${i} color="${color}" style='background: ${color}'/>`);
        dragElement($field.children().last().children().first());
        i++;
    }
    $count.text("Corrects: " +getCorrectColors());
    $attempt.text("Attempts: " + attempt);
}


function dragElement(element){
    element.on("touchmove", function(e){
        e.preventDefault();
        $("body").append(element);
        element.css("position", "absolute");
        let touch = e.targetTouches[0];
        element.css("left", touch.pageX - element.outerWidth() / 2 + "px");
        element.css("top", touch.pageY - element.outerHeight() / 2 + "px");
    })

    element.on("touchend", function(e){
        $field.children().eq(element.attr("space-idx")).append(element);
        element.css("position", "relative");
        element.css("left", '');
        element.css("top", '');
        const foundSpaceIdx = findSpace(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
        if (foundSpaceIdx !== -1){
            const color = $field.children().eq(foundSpaceIdx).children().first();
            $field.children().eq(foundSpaceIdx).append(element);
            $field.children().eq(parseInt(element.attr("space-idx"))).append(color);
            color.attr("space-idx", element.attr("space-idx"));
            element.attr("space-idx", foundSpaceIdx);
            attempt++;
        }
        $count.text("Corrects: " +getCorrectColors());
        $attempt.text("Attempts: " + attempt);})
        if (getCorrectColors() === 8){
            $("#win").removeClass("hidden");
        }
}

function getCorrectColors(){
    let correctCount = 0;
    let i = 0;
    for (const space of $field.children()) {
        if ($(space).children().first().attr("color") === shuffledColors[i]){
            correctCount++;
        }
        i++;
    }
    return correctCount;
}
function findSpace(x, y){
    for (let i = 0; i < $field.children().length; i++) {
        if (x >= $($field.children()[i]).offset().left &&
            x <= $($field.children()[i]).offset().left + $($field.children()[i]).outerWidth() &&
            y >= $($field.children()[i]).offset().top &&
            y <= $($field.children()[i]).offset().top + $($field.children()[i]).outerHeight()) {
            return i;
        }
    }
    return -1;
}