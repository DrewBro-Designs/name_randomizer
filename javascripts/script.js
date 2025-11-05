// Using third-party CORS proxy for GitHub Pages deployment
var sheetsUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQhNvI9ipnI3Xz6xIhV5eE0scK3xvOxixGgTJQcpF1FmkR5gq-ZzcQXqYoW3yXRJmlfGXZKvWoIFhzO/pub?output=csv";
var url = "https://api.allorigins.win/raw?url=" + encodeURIComponent(sheetsUrl);

// For local development with your own CORS proxy (see proxy_server.py):
// var url = "http://localhost:3000/names";

var getRequest = function(url, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      callback(xmlhttp.responseText);
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
};

var getNamesArray = function(responseText) {
  var namesArray = [];
  // Parse CSV data
  var lines = responseText.split('\n');

  // Skip the header row (index 0) and get names from first column
  for (var i = 1; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line) {
      // Get first column value (before first comma, or entire line if no comma)
      var name = line.split(',')[0].trim();
      if (name) {
        namesArray.push(name);
      }
    }
  }
  return namesArray;
};

var randomizer = function() {
  getRequest(url, function(responseText) {
    var names = getNamesArray(responseText);
    if (names.length > 0) {
      var randomNumber = Math.floor(Math.random() * names.length);
      document.getElementById("chosen-name").innerHTML = names[randomNumber];
    } else {
      document.getElementById("chosen-name").innerHTML = "No names found!";
    }
  });
};

