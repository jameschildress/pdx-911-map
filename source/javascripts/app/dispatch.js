(function(){
  'use strict';
  
  
  
  
  App.Dispatch = function(xml, map) {
    
    var $xml   = $(xml)
      , id     = $xml.find('id').text()
      , title  = $xml.find('category').attr('label')
      , date   = Date.parse($xml.find('updated').text())
      , georss = $xml.findNode('georss:point').text().split(" ")
      , lat    = parseFloat(georss[0], 10)
      , lng    = parseFloat(georss[1], 10);
      
      console.log(georss);
      
      this.id     = id;
      this.title  = title;
      this.date   = date;
      this.latlng = new google.maps.LatLng(lat, lng);
      
      this.marker = new google.maps.Marker({
        map:      map
      , position: this.latlng
      , title:    this.title  
      });
      
  };
  
  
  
  
}());