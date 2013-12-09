(function(){
  'use strict';





  // Generate the array of map marker icons.

  var m      = App.config.markerIcons
    , i      = m.spriteCount
    , size   = new google.maps.Size(m.width, m.height)
    , anchor = new google.maps.Point(m.width / 2, m.height)
  
  while (i--) {
    App.markerIcons.push({
      url:    m.imageURL
    , size:   size
    , anchor: anchor 
    , origin: new google.maps.Point((i * m.width), 0)
    });    
  }
  




}());
