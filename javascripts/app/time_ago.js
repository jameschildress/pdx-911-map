(function(){
  'use strict';



  
  var second = 1000
    , minute = second * 60
    , hour   = minute * 60

  App.timeAgoInWords = function(date) {
    
    var now     = new Date()
      , age     = now - date
      , strings = []
      , hours   = Math.floor(age / hour)
      , minutes = Math.floor((age % hour) / minute);
    
    if (hours + minutes === 0) {
      return "less than 1 minute ago";
    }
    if (hours) {
      strings.push(hours + " " + (hours === 1 ? "hour" : "hours"));
    }
    if (minutes) {
      strings.push(minutes + " " + (minutes === 1 ? "minute" : "minutes"));
    }

    return strings.join(' and ') + ' ago';
    
  };




}());
