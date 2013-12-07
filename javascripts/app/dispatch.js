(function(){
  'use strict';
  
  var p
    , config = App.config;
  
  
  
  
  App.Dispatch = function($xml, uid) {
    
    var title  = $xml.find('category').attr('label').toLowerCase()
      , date   = new Date($xml.find('updated').text())
      , georss = $xml.findNode('georss:point').text().split(" ")
      , lat    = parseFloat(georss[0], 10)
      , lng    = parseFloat(georss[1], 10);
      
      this.uid    = uid;
      this.title  = title;
      this.date   = date;
      this.latlng = new google.maps.LatLng(lat, lng);
      
      this.marker = new google.maps.Marker({
        position:  this.latlng
      , title:     this.title 
      , animation: google.maps.Animation.DROP
      });
      
  };
  
  
  
  
  p = App.Dispatch.prototype;
  
  p.render = function(map, $list) {
    var $thisListItem
      , highlightThisItem
      , self = this;
    
    this.marker.setMap(map);
    $list.prepend(this.listItemHTML());
    
    $thisListItem = $list.find(config.listItemSelector).eq(0);
    
    highlightThisItem = function(){
      var dispatches = App.dispatches
        , i = dispatches.length;
      $list.find(config.listItemSelector).removeClass(config.activeItemClass);
      $thisListItem.addClass(config.activeItemClass);
      while (i--) {
        if (dispatches[i].marker.getAnimation() != null) {
          dispatches[i].marker.setAnimation(null);
        }
      }
      self.marker.setAnimation(google.maps.Animation.BOUNCE);
    }
    
    google.maps.event.addListener(this.marker, 'click', function() {
      highlightThisItem();
      $('html, body').scrollTop($thisListItem.offset().top);
      return false;
    });
    
    $thisListItem.click(function(){
      highlightThisItem();
      map.setCenter(self.marker.position);
      map.setZoom(config.mapActiveZoom);
      return false;
    });
    
  };
  
  p.listItemHTML = function() {
    var html = '<div class="pdx911-list-item" data-uid="' +
      this.uid +
      '"><h2>' + 
      this.title +
      '</h2><p>' +
      this.date.toLocaleTimeString(); +
      '</p></div>';
    return html;
  };
  
  
  
  
}());
