(function(){
  'use strict';




  // Use the new Google Maps style.
  google.maps.visualRefresh = true;



  
  // App namespace and configuration.
  window.App = {
  
    config: {  
      
      dataURL:  'http://pdx911.childr.es/feed'
    , feedSize: 100
      
    , refreshRate:    60000
    , processRate:    30
    , iconUpdateRate: 890000
    , filterRate:     59000
    , timeUpdateRate: 60000
    
    , mapDivID:            'pdx911-map'
    , listSelector:        '#pdx911-list'
    , listItemSelector:    '.pdx911-list-item'
    , ageFilterSelector:   '#pdx911-age-filter'
    , categoryFilterSelector: '#pdx911-category-filter'
    , timeSelector:        'time'
    , listItemsGroupClass: 'pdx911-category-list' 
    , activeItemClass:     'current'
    , hiddenItemClass:     'hidden'
    
    , uncategorizedDispatchTitle: 'uncategorized dispatch'
    
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
    , timePerIconColor: 1200000 // 20 minutes in milliseconds
      
    } // end of config
    
    
    
    
    // Arrays used throughout the app.
  , queue:       []  // a queue of unprocessed dispatch RSS entries
  , dispatches:  []  // an array of every dispatch rendered on the map
  , markerIcons: []  // an array of map marker icons
  , categories:  []  // an array of unique identifiers for each category
  
    // Single infoWindow used for all map markers.
  , infoWindow: new google.maps.InfoWindow()
  
    // Filters used to determine which dispatches are displayed.
    // TODO: filter by category and agency
  , filters: {
      age:      0
    , category: null
    , agency:   null
    }
  
  };




}());