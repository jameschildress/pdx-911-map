(function(){
  'use strict';
  
  var p
    , config = App.config;
  
  
  
  
  // A 911 dispatch parsed from a jQuery XML object.
  App.Dispatch = function($xml, map, $list) {
    
    // Parse the latitude and longitude.
    var geo = $xml.findNode('georss:point').text().split(" ")
      , lat = parseFloat(geo[0], 10)
      , lng = parseFloat(geo[1], 10)
      , $contentDDtags = $($.parseHTML(Encoder.htmlDecode($xml.find('content').text()))).find('dd')
        // If this dispatch category is empty, use the default category title found in App.config.
      , categoryTitle = $xml.find('category').attr('label').trim().toLowerCase() || config.uncategorizedDispatchTitle
      , self = this;

    // Add this dispatch to a new or existing category.
    this.category = App.Category.findOrCreate($list, categoryTitle);
    this.category.dispatches.push(this);
    
    // Parse properties from the XML.
    this.address  = $contentDDtags.eq(2).text();
    this.agency   = $contentDDtags.eq(3).text();
    this.date     = new Date($xml.find('updated').text());
    this.latlng   = new google.maps.LatLng(lat, lng);
    
    // Remember if this dispatch is highlighted on the list and map.
    this.highlighted = false;
    
    // Create and append this list item to the HTML list.
    this.$listItem = $(this.listItemHTML()).prependTo(this.category.$itemsWrapper);
    this.$timeAgo  = this.$listItem.find(config.timeSelector);
    
    // Create and display the Google Map marker for this dispatch.
    this.marker = new google.maps.Marker({
      position:  this.latlng
    , title:     this.category.title
    , animation: this.markerAnimation()
    , icon:      this.markerIcon()
    , map:       map
    });
        
    // Rig the click event of the map marker.
    google.maps.event.addListener(this.marker, 'click', function() {
      if (self.toggleHighlight()) {
        // Display the infoWindow.
        // NOTE: infoWindow text is updated when updateTimeAgo() is called when highlighting.
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
    return '<div class="pdx911-list-item"><p>' +
      this.address +
      '</p><time>' +
      App.timeAgoInWords(this.date) +
      '</time></div>';
  };
  
  // Return the HTML for this info window.
  p.infoWindowHTML = function() {
    return '<div class="pdx911-list-item"><h2>' +
      this.category.title +
      '</h2><p>' +
      this.address +
      '</p><time>' +
      App.timeAgoInWords(this.date) +
      '</time></div>';
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
  
  // Return the animation type for new dispatch markers.
  // Markers from the initially loaded feed should not be animated.
  p.markerAnimation = function(){
    return App.dispatches.length > config.feedSize ? google.maps.Animation.DROP : null;
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
    // Update the timeAgo for this list item.
    this.updateTimeAgo();
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
    // Inform the parent category that the dispatch list has changed.
    this.category.dispatchListChanged();
  }
  
  
  
  
  // Update the time-ago description for this list item and infoWindow.
  p.updateTimeAgo = function() {
    this.$timeAgo.text(App.timeAgoInWords(this.date));
    if (this.highlighted) {
      App.infoWindow.setContent(this.infoWindowHTML());
    }
  }
  
  
  
  
}());