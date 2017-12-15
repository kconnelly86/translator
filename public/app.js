/* Translator (18.2.6)
 * front-end
 * ==================== */
 var searchQuery;
 var queryAPI;
 var lang;
 var theTranslation;

// Loads results onto the page
function getResults() {
  // Empty any results currently on the page
  $("#results").empty();
  // Grab all of the current translations
  $.getJSON("/all", function(data) {
    // For each translation...
    for (var i = 0; i < data.length; i++) {
      // ...populate #results with a p-tag that includes the translation's translate and object id
      $("#results").prepend("<p class='dataentry' data-id=" + data[i]._id + "><span class='datatranslate' data-id=" +
        data[i]._id + ">" + data[i].translate + "</span><span class=deleter>X</span></p>");
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
      // console.log("response");
      //console.log(response);
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
         created: Date.now()
       }
     })
     // If that API call succeeds, add the translate and a delete button for the translation to the page
     .done(function(data) {

       // Add the translate and delete button to the #results section
       $("#results").prepend("<p class='dataentry' data-id=" + data._id + "><span class='datatranslate' data-id=" +
         data._id + ">" + data.translate + "</span><span class=deleter>X</span></p>");
       // Clear the translation and translate inputs on the page
       $("#translation").val("");
       // $("#translate").val("");
   }
   );

});

});

  // dropdown menu
    $("select#selectLang").change(function(){
        lang = $("#selectLang option:selected").val();
        console.log("You have selected the country - " + lang);
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
$(document).on("click", ".datatranslate", function() {
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
      console.log("data.translation: " + data.translation);
      $("#translate").val(data.translate);
      // Make the #actionbutton an update button, so user can
      // Update the translation s/he chooses
      //$("#actionbutton").html("<button id='updater' data-id='" + data._id + "'>Update</button>");
    }
  });
});

// When user click's update button, update the specific translation
$(document).on("click", "#updater", function() {
  // Save the selected element
  var selected = $(this);
  // Make an AJAX POST request
  // This uses the data-id of the update button,
  // which is linked to the specific translation
  // that the user clicked before
  $.ajax({
    type: "POST",
    url: "/update/" + selected.attr("data-id"),
    dataType: "json",
    data: {
      translate: $("#translate").val(),
      translation: $("#translation").val()
    },
    // On successful call
    success: function(data) {
      // Clear the inputs
      $("#translation").val("");
      $("#translate").val("");
      // Revert action button to submit
      $("#actionbutton").html("<button id='makenew'>Submit</button>");
      // Grab the results from the db again, to populate the DOM
      getResults();
    }
  });
});
