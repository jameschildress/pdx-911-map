(function(){
  'use strict';




  var config     = App.config
    , dispatches = App.dispatches
    , map        = App.map
    , uids       = App.uids




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
        var $xml = $(this)
          , uid = $xml.find('id').text()
          , dispatch;
        if (uids.indexOf(uid) < 0) {
          uids.push(uid);
          dispatch = new App.Dispatch($xml);
          dispatches.push(dispatch);
          dispatch.render(map);
          console.log(dispatches.length, dispatch.title);
        }
      };
    



  $(start);




}());