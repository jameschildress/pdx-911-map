(function(){
  'use strict';
  
  var p;
  
  
  
  
  App.Dispatch = function($xml) {
    
    var title  = $xml.find('category').attr('label')
      , date   = Date.parse($xml.find('updated').text())
      , georss = $xml.findNode('georss:point').text().split(" ")
      , lat    = parseFloat(georss[0], 10)
      , lng    = parseFloat(georss[1], 10);
      
      this.title  = title;
      this.date   = date;
      this.latlng = new google.maps.LatLng(lat, lng);
      
      this.marker = new google.maps.Marker({
        position: this.latlng
      , title:    this.title  
      });
      
  };
  
  
  
  
  p = App.Dispatch.prototype;
  
  p.render = function(map) {
    this.marker.setMap(map);
    this.marker.setAnimation(google.maps.Animation.DROP);
  }
  
  
  
  
}());