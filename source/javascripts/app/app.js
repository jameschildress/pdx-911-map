(function(){
  'use strict';




  // Use the new Google Maps style.
  google.maps.visualRefresh = true;



  
  // App namespace and configuration.
  window.App = {
  
    config: {  
      
      dataURL:     'http://pdx911.childr.es'
    , refreshRate:    60000
    , processRate:    300
    , iconUpdateRate: 100000
    
    , mapDivID:         'pdx911-map'
    , listSelector:     '#pdx911-list'
    , listItemSelector: '.pdx911-list-item'
    , activeItemClass:  'current'
    
    , mapActiveZoom: 14
    , mapOptions: {
        zoom:    12
      , minZoom: 11
      , center: new google.maps.LatLng(45.5278, -122.5702)
      , streetViewControl: false
      }
    
    , markerIcons: {
        height: 35
      , width:  22
      , spriteCount: 5
      , imageURL: './images/markers.png'
      }
    , timePerIconColor: 1800000 // 30 minutes in milliseconds
      
    } // end of config
    
    
    
    
    // Objects used throughout the app.
  , map:         {}  // the Google Map object
  , uids:        []  // an array of unique identifiers for each dispatch
  , queue:       []  // a queue of unprocessed dispatch RSS entries
  , dispatches:  []  // an array of every dispatch rendered on the map
  , markerIcons: []  // an array of map marker icons
  
  };




}());