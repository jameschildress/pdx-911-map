(function(){
  'use strict';

  $(function(){
    
    
    
    
    var config = App.config
      , functions = {}
      , latestDispatchAt = 0
      
      , ajaxOptions = {
          cache:    false
        , dataType: 'xml'
        , success:  functions.ajaxSuccess
        , error:    functions.ajaxError
        };
    
    
    
    
    functions = {
      
      getData: function(){
        $.ajax(config.dataURL, ajaxOptions);
      }
      
    , ajaxError: function(jqXHR, status, error){
        console.log(status + "  " + error);
      }
      
    , ajaxSuccess: function(data, status, jqXHR){
        console.log(data);
      }
      
    };
    
    
    
    
    functions.getData();
    
    setInterval(functions.getData, config.refreshRate);
    
    
    
    
  });

}());