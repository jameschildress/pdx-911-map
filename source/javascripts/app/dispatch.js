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
    
    // Remember if this dispatch is highlighted on the list and map.
    this.highlighted = false;
    
    // Create and display the Google Map marker for this dispatch.
    this.marker = new google.maps.Marker({
      position:  this.latlng
    , title:     this.title 
    , animation: google.maps.Animation.DROP
    , icon:      this.markerIcon()
    , map:       map
    });
        
    // Create and append this list item to the HTML list.
    this.$listItem = $(this.listItemHTML()).appendTo($list);
    
    // Rig the click event of the map marker.
    google.maps.event.addListener(this.marker, 'click', function() {
      if (self.toggleHighlight()) {
        // Display the infoWindow.
        App.infoWindow.setContent(self.listItemHTML());
        App.infoWindow.open(self.marker.getMap(), self.marker);
      }
    });
    
    // Rig the click event of the list item.
    this.$listItem.click(function(){
      if (self.toggleHighlight()) {
        // Center on the map maker.
        map.setCenter(self.marker.position);
        // Bounce the map marker.
        self.marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    });
    
    // Hide or show this dispatch based on filter values.
    this.filter();
    
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
  };
  
  // Update the icon for this marker, UNLESS the marker is highlighted.
  p.updateIcon = function() {
    if (!this.highlighted) {
      this.marker.setIcon(this.markerIcon());
    }
  };
  
  
  
  
  // Highlight this dispatch on the list and map.
  p.highlight = function() {
    var dispatches = App.dispatches
      , i = dispatches.length;
    // Unhighlist all other dispatches.
    while (i--) {
      dispatches[i].unhighlight();
    }
    // Add the active item class to this list item.
    this.$listItem.addClass(config.activeItemClass);
    // Change the marker icon to the highlight color.
    this.marker.setIcon(App.highlightIcon);
    this.highlighted = true;
  };
  
  // Remove the highlighting of this dispatch on the list and map.
  p.unhighlight = function() {
    if (this.highlighted) {
      // Remove the active item class from this list item.
      this.$listItem.removeClass(config.activeItemClass);
      // Return the marker icon to its original color.
      this.marker.setIcon(this.markerIcon());
      // Close the infoWindow.
      App.infoWindow.close();
      // Stop the bouncing map marker.
      if (this.marker.getAnimation() != null) {
        this.marker.setAnimation(null);
      }
    }
    this.highlighted = false;
  };
  
  // Only highlight this dispatch if it is not currently highlighted.
  // Return 'true' if this dispatch is highlighted.
  p.toggleHighlight = function() {
    if (this.highlighted) {
      this.unhighlight();
    } else {
      this.highlight();
    }
    return this.highlighted;
  };
  
  
  
  
  // Hide this item from the list and map.
  p.hide = function() {
    if (this.marker.getVisible()) {
      this.marker.setVisible(false);
    }
    if (!this.$listItem.hasClass(config.hiddenItemClass)) {
      this.$listItem.addClass(config.hiddenItemClass);
    }
  };
  
  // Unhide this item from the list and map.
  p.unhide = function() {
    if (!this.marker.getVisible()) {
      this.marker.setVisible(true);
    }
    if (this.$listItem.hasClass(config.hiddenItemClass)) {
      this.$listItem.removeClass(config.hiddenItemClass);
    }
  };
  
  
  
  
  // Determine whether to show or hide this dispatch, based on filter values.
  // Unhighlight any dispatches that are to be hidden.
  p.filter = function() {
    var age = App.filters.age;
    if (age && this.date < (new Date()) - age) {
      this.unhighlight();
      this.hide();
    } else {
      this.unhide();
    }
  }
  
  
  
  
}());