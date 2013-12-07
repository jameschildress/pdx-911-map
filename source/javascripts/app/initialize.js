(function(){
  'use strict';




  var config     = App.config
    , map        = App.map
    , uids       = App.uids
    , queue      = App.queue
    , dispatches = App.dispatches
    , $list




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
        $list = $(config.listSelector);
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
            dispatch = new App.Dispatch($xml, uid);
            uids.push(uid);
            dispatches.push(dispatch);
            dispatch.render(map, $list);
          }
        }
      };
    



  $(start);




}());