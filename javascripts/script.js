var url = "https://spreadsheets.google.com/feeds/list/1tGmDDUFdojmPIxkuDYMUee7daWc4zVXHD9bOAdIkuj8/od6/public/basic?hl=en_US&alt=json";

var getRequest = function(url) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  return xmlhttp;
};

var getNamesArray = function(aRequest) {
  var namesArray = [];
  for (i in JSON.parse(aRequest)['feed']['entry']) {
    namesArray.push(JSON.parse(aRequest)['feed']['entry'][i]['title']['$t']);
  }
  return namesArray;
};

var randomizer = function() {
  var randomName = function(names) {
    var randomNumber = Math.floor(Math.random() * names.length);
    document.getElementById("chosen-name").innerHTML = names[randomNumber];
  };
  return randomName(getNamesArray(myRequest["responseText"]))
};

var myRequest = getRequest(url);

