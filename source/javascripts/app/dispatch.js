(function(){
  'use strict';
  
  var p
    , config = App.config;
  
  
  
  
  // A 911 dispatch parsed from a jQuery XML object.
  App.Dispatch = function($xml, uid) {
    
    // Parse the latitude and longitude.
    var geo = $xml.findNode('georss:point').text().split(" ")
      , lat = parseFloat(geo[0], 10)
      , lng = parseFloat(geo[1], 10)
      , $contentDDtags = $($.parseHTML(Encoder.htmlDecode($xml.find('content').text()))).find('dd');
      
      // Parse properties from the XML.
      this.uid     = uid;
      this.title   = $xml.find('category').attr('label').toLowerCase();
      this.address = $contentDDtags.eq(2).text();
      this.agency  = $contentDDtags.eq(3).text();
      this.date    = new Date($xml.find('updated').text());
      this.latlng  = new google.maps.LatLng(lat, lng);
      
      // Create, but don't display, the Google Map marker for this dispatch.
      this.marker = new google.maps.Marker({
        position:  this.latlng
      , title:     this.title 
      , animation: google.maps.Animation.DROP
      , icon:      App.markerIcons[0]
      });
      
  };
  
  
  
  
  p = App.Dispatch.prototype;
  
  // Display and rig events for the map marker and list item for this dispatch.
  p.render = function(map, $list) {
    var $thisListItem
      , highlightThisItem
      , self = this;
    
    // Show the map marker.
    this.marker.setMap(map);
    
    // Add this list item to the top of the HTML list.
    $list.prepend(this.listItemHTML());
    
    // Find the newly added list item
    // TODO: can this be fetched from the previous prepend() call?
    $thisListItem = $list.find(config.listItemSelector).eq(0);
    
    // A function for highlighting this marker and list item.
    highlightThisItem = function(){
      var dispatches = App.dispatches
        , i = dispatches.length;
      // Remove the highlight CSS class from all list items.
      $list.find(config.listItemSelector).removeClass(config.activeItemClass);
      // Add the highlight CSS class to this list item.
      $thisListItem.addClass(config.activeItemClass);
      // Remove the bounce animation from any bouncing map markers.
      while (i--) {
        if (dispatches[i].marker.getAnimation() != null) {
          dispatches[i].marker.setAnimation(null);
        }
      }
      // Add the bounce animation to this map marker.
      self.marker.setAnimation(google.maps.Animation.BOUNCE);
    }
    
    // Rig the click event of the map marker.
    google.maps.event.addListener(this.marker, 'click', function() {
      highlightThisItem();
      // Scroll to this item in the list.
      $('html, body').scrollTop($thisListItem.offset().top);
      return false;
    });
    
    // Rig the click event of the list item.
    $thisListItem.click(function(){
      highlightThisItem();
      // Center and zoom in on the map maker.
      map.setCenter(self.marker.position);
      map.setZoom(config.mapActiveZoom);
      return false;
    });
    
  };
  
  
  
  // Return the HTML for this list item.
  p.listItemHTML = function() {
    var html = '<div class="pdx911-list-item" data-uid="' +
      this.uid +
      '"><h2>' + 
      this.title +
      '</h2><p>' +
      this.address +
      '</p><time>' +
      this.date.toLocaleTimeString(); +
      '</time></div>';
    return html;
  };
  
  
  
  
}());