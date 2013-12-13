(function(){
  'use strict';




  var config     = App.config
    , queue      = App.queue
    , dispatches = App.dispatches
    , filters    = App.filters
    , map
    , $list
    , $ageFilter
    , $categoryFilter



      // Called when the AJAX request fails.
    , ajaxError = function(jqXHR, status, error) {
        // TODO: handle ajax error
      }
    
      // After a successful AJAX request, parse the RSS into entries and add them to the processing queue.
      // Remember that our proxy server returns the RSS XML as one big JSONP string.
    , ajaxSuccess = function(data, status, jqXHR) {
        $($.parseXML(data)).find('entry').each(addDispatchToQueue);
      }
      
      // The options used for every AJAX request.
    , ajaxOptions = {
        cache:    false
      , dataType: 'jsonp'
      , success:  ajaxSuccess
      , error:    ajaxError
      }
      
      // Fetch the RSS feed via an AJAX JSONP request.
    , getData = function() {
        $.ajax(config.dataURL, ajaxOptions);
      }
      
      // When the DOM is loaded...
    , start = function() {
        // Render the Google Map
        map = new google.maps.Map(document.getElementById(config.mapDivID), config.mapOptions);
        // Fetch the RSS now and on an interval.
        getData();
        
        setInterval(getData, config.refreshRate);
        // Process the queue on an interval.
        setInterval(processDispatchQueue, config.processRate);
        // Update marker icon colors on interval.
        setInterval(updateMarkerIcons, config.iconUpdateRate);        
        // Filter the displayed dispatches on interval.
        setInterval(filterDispatches, config.filterRate);
        // Update every timeAgoInWords on interval.
        setInterval(updateTimeAgos, config.timeUpdateRate)
        
        // Get the DOM node where dispatch list items will be rendered.
        $list = $(config.listSelector);
        // Get the DOM noe for the select tag of the category filter
        $categoryFilter = $(config.categoryFilterSelector);
        // Get the DOM node for the select tag of the age filter.
        $ageFilter = $(config.ageFilterSelector);
        // Filter dispatches whenever the filter values change.
        $ageFilter.change(updateFilters).change();
        $categoryFilter.change(updateFilters).change();
      }
      
      // Add an unprocessed dispatch RSS entry to the queue.
    , addDispatchToQueue = function() {
        queue.push(this);
      }
      
      // Process a single entry in the queue unless the queue is empty.
    , processDispatchQueue = function() {
        if (queue.length > 0) {
          App.Dispatch.findOrCreate( $(queue.pop()), map, $list, $categoryFilter );
        }
      }
      
      // Update the icon of every marker on the map.
    , updateMarkerIcons = function() {
        var i = dispatches.length;
        while (i--) {
          dispatches[i].updateIcon();
        }
      }
      
      // Update the app filter values, then filter all dispatches.
    , updateFilters = function() {
        var categoryValue = $categoryFilter.val();
        filters.age = parseInt($ageFilter.val(), 10);
        filters.category = categoryValue ? App.Category.findOrCreate($categoryFilter.val()) : null;
        filterDispatches();
      }
      
      // Filter all dispatches.
    , filterDispatches = function() {
        var i = dispatches.length;
        while (i--) {
          dispatches[i].filter();
        }
      }
      
      // Update the timeAgo text for every dispatch.
    , updateTimeAgos = function() {
        var i = dispatches.length;
        while (i--) {
          dispatches[i].updateTimeAgo();
        }        
      }
    



  // Go go go!
  $(start);




}());