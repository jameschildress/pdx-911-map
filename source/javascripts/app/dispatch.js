(function(){
  'use strict';
  
  var p
    , config = App.config;
  
  
  
  
  // A 911 dispatch parsed from a jQuery XML object.
  App.Dispatch = function($xml, uid, map, $list) {
    
    // Parse the latitude and longitude.
    var geo = $xml.findNode('georss:point').text().split(" ")
      , lat = parseFloat(geo[0], 10)
      , lng = parseFloat(geo[1], 10)
      , $contentDDtags = $($.parseHTML(Encoder.htmlDecode($xml.find('content').text()))).find('dd')
      , self = this;
      
    // Parse properties from the XML.
    this.uid     = uid;
    this.title   = $xml.find('category').attr('label').toLowerCase();
    this.address = $contentDDtags.eq(2).text();
    this.agency  = $contentDDtags.eq(3).text();
    this.date    = new Date($xml.find('updated').text());
    this.latlng  = new google.maps.LatLng(lat, lng);
    
    // Create and display the Google Map marker for this dispatch.
    this.marker = new google.maps.Marker({
      position:  this.latlng
    , title:     this.title 
    , animation: google.maps.Animation.DROP
    , icon:      this.markerIcon()
    , map:       map
    });
        
    // Create and prepend this list item to the HTML list.
    this.$listItem = $(this.listItemHTML()).prependTo($list);
    
    // Rig the click event of the map marker.
    google.maps.event.addListener(this.marker, 'click', function() {
      self.highlight($list);
      // Scroll to this item in the list.
      $('html, body').scrollTop(self.$listItem.offset().top);
      return false;
    });
    
    // Rig the click event of the list item.
    this.$listItem.click(function(){
      self.highlight($list);
      // Center and zoom in on the map maker.
      map.setCenter(self.marker.position);
      map.setZoom(config.mapActiveZoom);
      return false;
    });
    
  };
  
  
  
  
  p = App.Dispatch.prototype;
    
  // Return the HTML for this list item.
  p.listItemHTML = function() {
    var html = '<div class="pdx911-list-item" data-uid="' +
      this.uid +
      '"><h2>' + 
      this.title +
      '</h2><p>' +
      this.address +
      '</p><time>' +
      this.date.toLocaleTimeString() +
      '</time></div>';
    return html;
  };
  
  
  
  
  // Return the icon that represents how long ago the dispatch occurred.
  p.markerIcon = function() {
    var icons    = App.markerIcons
      , count    = icons.length
      , i        = icons.length
      , now      = new Date()
      , timeSpan = config.timePerIconColor
      , maxTime
      , minTime
    while (i--) {
      minTime = now - (i * timeSpan);
      maxTime = now - ((i - 1) * timeSpan);
      if (this.date > minTime && this.date < maxTime) {
        return icons[count - i];
      }
    }
    return icons[0];
  }
  
  
  
  
  // Update the icon for this marker.
  p.updateIcon = function() {
    this.marker.setIcon(this.markerIcon());
  }
  
  
  
  
  // Highlight this dispatch on the list and map.
  p.highlight = function($list){
    var dispatches = App.dispatches
      , i = dispatches.length;
    // Remove the highlight CSS class from all list items.
    $list.find(config.listItemSelector).removeClass(config.activeItemClass);
    // Add the highlight CSS class to this list item.
    this.$listItem.addClass(config.activeItemClass);
    // Remove the bounce animation from any bouncing map markers.
    while (i--) {
      if (dispatches[i].marker.getAnimation() != null) {
        dispatches[i].marker.setAnimation(null);
      }
    }
    // Add the bounce animation to this map marker.
    this.marker.setAnimation(google.maps.Animation.BOUNCE);
  }
  
  
  
  
}());