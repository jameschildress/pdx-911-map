(function(){
  'use strict';





  var m      = App.config.mapMarker
    , i      = m.spriteCount
    , size   = new google.maps.Size(m.width, m.height)
    , anchor = new google.maps.Point(0, m.width / 2)
  
  while (i--) {
    App.markerIcons.push({
      url:    m.imageURL
    , size:   size
    , anchor: anchor 
    , origin: new google.maps.Point(((i-1) * m.width), 0)
    });    
  }
  




}());