(function(){
  'use strict';




  var config = App.config
    , map




    , ajaxError = function(jqXHR, status, error) {
        console.log(status + "  " + error);
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
        getData();
        setInterval(getData, config.refreshRate);          
      }
      
    , renderDispatch = function() {
        var dispatch  = new App.Dispatch(this);
        dispatch.render(map);
      };
    



  $(start);




}());