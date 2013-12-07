(function(){
  'use strict';
  
  var p;
  
  
  
  
  App.Dispatch = function(xml) {
    
    var $xml   = $(xml)
      , title  = $xml.find('category').attr('label')
      , date   = Date.parse($xml.find('updated').text())
      , georss = $xml.find('georss:point').text().split(" ")
      , lat    = parseFloat(georss[0], 10)
      , lng    = parseFloat(georss[1], 10);
      
      this.title  = title;
      this.date   = date;
      this.latlng = new google.maps.LatLng(lat, lng);
      
  };
  
  
  
  
  p = App.Dispatch.prototype;
  
  p.render = function(map) {
    console.log(this.title);
  };
  
  
  
  
}());