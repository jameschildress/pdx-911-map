$.fn.findNode = function(name) {
  return this.find('*').filter(function() {
    return this.nodeName === name;
  });
};
