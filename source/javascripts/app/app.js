(function(){
  'use strict';




  window.App = {
  
    config: {  
      dataURL:      'http://childr.es'
    , refreshRate:  30000
    , processRate:  200
    , mapDivID:     'pdx911-map'
    , mapOptions: {
        zoom:    12
      , minZoom: 11
      , center: new google.maps.LatLng(45.5174, -122.6699)
      , streetViewControl: false
      }
    }
    
  , map:   {}
  , uids:  []
  , queue: []
  
  };




}());