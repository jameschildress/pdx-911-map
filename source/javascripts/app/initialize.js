(function(){
  'use strict';




  var config = App.config
    , map    = App.map
    , uids   = App.uids
    , queue  = App.queue




    , ajaxError = function(jqXHR, status, error) {
        console.log(status, error);
        // TODO: handle errors
      }
    
    , ajaxSuccess = function(data, status, jqXHR) {
        $($.parseXML(data)).find('entry').each(addDispatchToQueue);
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
        setInterval(processDispatchQueue, config.processRate);
      }
      
    , addDispatchToQueue = function() {
        queue.push(this);
      }
      
    , processDispatchQueue = function() {
        var $xml, uid, dispatch;
        if (queue.length > 0) {
          $xml = $(queue.pop());
          uid = $xml.find('id').text();
          if (uids.indexOf(uid) < 0) {
            uids.push(uid);
            dispatch = new App.Dispatch($xml);
            dispatch.render(map);
            console.log(uids.length, dispatch.title);
          }
        }
      };
    



  $(start);




}());