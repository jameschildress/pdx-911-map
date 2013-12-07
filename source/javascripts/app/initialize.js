(function(){
  'use strict';




  var config     = App.config
    , dispatches = App.dispatches
    , map        = App.map




    , ajaxError = function(jqXHR, status, error) {
        console.log(status, error);
        // TODO: handle errors
      }
    
    , ajaxSuccess = function(data, status, jqXHR) {
        $($.parseXML(data)).find('entry').each(renderDispatch);
      }
      
    , ajaxOptions = {
        cache:    false
      , dataType: 'jsonp'
      , success:  ajaxSuccess
      , error:    ajaxError
      }
        
    , getData = function() {
        $.ajax(config.dataURL, ajaxOptions);
      }
      
    , start = function() {
        map = new google.maps.Map(document.getElementById(config.mapDivID), config.mapOptions);
        getData();
        setInterval(getData, config.refreshRate);          
      }
      
    , renderDispatch = function() {
        dispatches.push(new App.Dispatch(this, map));
      };
    



  $(start);




}());