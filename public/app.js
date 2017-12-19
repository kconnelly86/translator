/* Translator
* front-end
* ==================== */
var searchQuery;
var queryAPI;
var lang;
var theTranslation;
var langFull;
// Loads results onto the page
function getResults() {
// Empty any results currently on the page
$("#results").empty();
// Grab all of the current translations
$.getJSON("/all", function(data) { console.log(data);
// For each translation...
for (var i = 0; i < data.length; i++) {
// ...populate #results with a p-tag that includes the translation's translate and object id
$("#results").prepend("<div id='cont1' data-id=" + data[i]._id + ">" + "<p class='dataentry' data-id=" + data[i]._id + "><span class='datatranslate' data-id=" + data[i]._id + ">" + data[i].translate + "</span> <span class=deleter>X</span> <span class='datatranslation' data-id=" +
data[i]._id + ">" + data[i].translation + "</span> <span class='datatranslation' data-id=" +
data[i]._id + ">" + data[i].langFull + "</span> </p>" + "</div>");
console.log(data[i]._id);
}
});
}
// Runs the getResults function as soon as the script is executed
getResults();
// When the #makenew button is clicked
$(document).on("click", "#makenew", function() {
// AJAX POST call to the submit route on the server
// This will take the data from the form and send it to the server
searchQuery = $("#translate").val();
queryAPI = "https://translation.googleapis.com/language/translate/v2?key=AIzaSyDfyQpiTmaKJG9ri-xKSX_wnG5f2MUY6TY&target=" + lang +"&q=" + searchQuery;
$.ajax({
type: "GET",
dataType: "json",
url: queryAPI,
// On a successful call, clear the #results section
success: function(response) {
console.log(response);
theTranslation = response.data.translations[0].translatedText;
console.log(response.data.translations[0].translatedText);
$("#translation").text(response.data.translations[0].translatedText);
}
}).done(function(response) {
$.ajax({
type: "POST",
dataType: "json",
url: "/submit",
data: {
translate: $("#translate").val(),
translation: theTranslation,
langFull: langFull,
created: Date.now()
}
})
// If that API call succeeds, add the translate and a delete button for the translation to the page
.done(function(data) {
// Add the translate and delete button to the #results section, "what was to be translated and the x".
$("#results").prepend("<p class='dataentry' data-id=" + data._id + "> <span class='datatranslate' data-id=" +
data._id + ">" + data.translate + "</span> <span class=deleter>X</span> <span class='datatranslation' data-id=" +
data._id + "> " + theTranslation + " </span> <span class='langFull' data-id=" +
data._id + "> " + langFull + " </span> </p>");
// // Clear the translation and translate inputs on the page
// $("#translation").val(""); //this can be commented out or in and it has no affect since other code had been implemented to make the translation stay in the window.
// $("#translate").val(""); //if this is commented in it will clear the translate field after submission and we dont want that.
}
);
});
});
// dropdown menu

$("select#selectLang").change(function(){
lang = $("#selectLang option:selected").val();
console.log("You have selected the country - " + lang);
langFull = $("#selectLang option:selected").text();
});
// When the #clearall button is pressed
$("#clearall").on("click", function() {
// Make an AJAX GET request to delete the translations from the db
$.ajax({
type: "GET",
dataType: "json",
url: "/clearall",
// On a successful call, clear the #results section
success: function(response) {
$("#results").empty();
}
});
});
// When user clicks the deleter button for a translation
//$('#cont1', '.datatranslate', 'datatranslation').on('click', function(){})
$(document).on("click", ".deleter", function() {
// Save the p tag that encloses the button
var selected = $(this).parent();
// Make an AJAX GET request to delete the specific translation
// this uses the data-id of the p-tag, which is linked to the specific translation
$.ajax({
type: "GET",
url: "/delete/" + selected.attr("data-id"),
// On successful call
success: function(response) {
// Remove the p-tag from the DOM
selected.remove();
// Clear the translation and translate inputs
$("#translation").val("");
$("#translate").val("");
// Make sure the #actionbutton is submit (in case it's update)
$("#actionbutton").html("<button id='makenew'>Submit</button>");
}
});
});
// When user click's on translation, show the translation, and allow for updates
$(document).on("click", "#cont1",  function() {
// Grab the element
var selected = $(this);
// Make an ajax call to find the translation
// This uses the data-id of the p-tag, which is linked to the specific translation
$.ajax({
type: "GET",
url: "/find/" + selected.attr("data-id"),
success: function(data) {
// Fill the inputs with the data that the ajax call collected
$("#translation").text(data.translation);

$("#translate").val(data.translate);
// Make the #actionbutton an update button, so user can
// Update the translation s/he chooses
//$("#actionbutton").html("<button id='updater' data-id='" + data._id + "'>Update</button>");
}
});
});
// reseting the page without having to refresh everytime.
function myFunction() {
$('#translation').empty();
$('#translate').val("");

}





