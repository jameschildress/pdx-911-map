(function(){
  'use strict';




  var m      = App.config.markerIcons
    , i      = m.spriteCount
    , size   = new google.maps.Size(m.width, m.height)
    , anchor = new google.maps.Point(m.width / 2, m.height)

  // Generate the 'highlight' map marker icon.
  App.highlightIcon = {
    url:    m.imageURL
  , size:   size
  , anchor: anchor 
  , origin: new google.maps.Point(i * m.width, 0)
  }

  // Generate the array of map marker icons.
  while (i--) {
    App.markerIcons.push({
      url:    m.imageURL
    , size:   size
    , anchor: anchor 
    , origin: new google.maps.Point(i * m.width, 0)
    });    
  }
  
  




}());
