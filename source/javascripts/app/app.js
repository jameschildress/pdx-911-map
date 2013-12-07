(function(){
  'use strict';




  window.App = {
  
    config: {  
      dataURL:      'http://childr.es'
    , refreshRate:  30000
    , processRate:  200
    , mapDivID:     'pdx911-map'
    , listSelector: '#pdx911-list'
    , mapOptions: {
        zoom:    12
      , minZoom: 11
      , center: new google.maps.LatLng(45.5278, -122.5702)
      , streetViewControl: false
      }
    }
    
  , map:   {}
  , uids:  []
  , queue: []
  
  };




}());