(function(){
  'use strict';
  
  var p;
  
  
  
  
  App.Dispatch = function($xml, uid) {
    
    var title  = $xml.find('category').attr('label').toLowerCase()
      , date   = Date.parse($xml.find('updated').text())
      , georss = $xml.findNode('georss:point').text().split(" ")
      , lat    = parseFloat(georss[0], 10)
      , lng    = parseFloat(georss[1], 10);
      
      this.uid    = uid;
      this.title  = title;
      this.date   = date;
      this.latlng = new google.maps.LatLng(lat, lng);
      
      this.marker = new google.maps.Marker({
        position: this.latlng
      , title:    this.title  
      });
      
  };
  
  
  
  
  p = App.Dispatch.prototype;
  
  p.render = function(map, $list) {
    this.marker.setMap(map);
    this.marker.setAnimation(google.maps.Animation.DROP);
    $list.prepend(this.listItemHTML());
  };
  
  p.listItemHTML = function() {
    var html = '<div class="pdx911-list-item" data-uid="' +
      this.uid +
      '"><h2>' + 
      this.title +
      '</h2><p>' +
      this.date +
      '</p></div>';
    return html;
  };
  
  
  
  
}());