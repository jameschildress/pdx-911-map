(function(){
  'use strict';




  window.App = {
  
    config: {  
      dataURL:          'http://pdx911.childr.es'
    , refreshRate:      60000
    , processRate:      300
    , mapDivID:         'pdx911-map'
    , listSelector:     '#pdx911-list'
    , listItemSelector: '.pdx911-list-item'
    , activeItemClass:  'current'
    , mapActiveZoom:    14
    , mapOptions: {
        zoom:    12
      , minZoom: 11
      , center: new google.maps.LatLng(45.5278, -122.5702)
      , streetViewControl: false
      }
    }
    
  , map:        {}
  , uids:       []
  , queue:      []
  , dispatches: []
  
  };




}());
