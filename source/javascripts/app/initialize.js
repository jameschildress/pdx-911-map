(function(){
  'use strict';

  $(function(){
    
    
    
    
    var config = App.config

      , latestDispatchAt = 0

      , ajaxError = function(jqXHR, status, error){
          console.log(status + "  " + error);
        }
      
      , ajaxSuccess = function(data, status, jqXHR){
          var $xml = $($.parseXML(data));
          console.dir($xml.find('entry'));
        }
        
      , ajaxOptions = {
          cache:    false
        , dataType: 'jsonp'
        , success:  ajaxSuccess
        , error:    ajaxError
        }
          
      , getData = function(){
          $.ajax(config.dataURL, ajaxOptions);
        };
    
    
    
    
    getData();
    
    // setInterval(getData, config.refreshRate);
    
    

    
  });

}());