(function(){
  'use strict';

  var p
    , config = App.config;




  App.Category = function($list, title) {
    
    this.title = title;
    this.$listGroup = $(this.listGroupHTML()).prependTo($list);
    this.$itemsWrapper = this.$listGroup.find('.' + config.listItemsGroupClass);
    
  };
  
  
  
  
  // If a category exists with the given title, return that title.
  // Otherwise, return a new category and append it to the categories array.
  App.Category.findOrCreate = function($list, title) {
    var categories = App.categories
      , i = categories.length
      , category;
    while (i--) {
      if (categories[i].title === title) {
        return categories[i];
      }
    }
    category = new App.Category($list, title);
    categories.push(category);
    return category;
  };
  
  
  
  
  p = App.Category.prototype;
  
  p.listGroupHTML = function() {
    return '<div class="pdx911-category"><h2>' +
      this.title +
      '</h2><div class="' +
      config.listItemsGroupClass +
      '"></div></div>';
  };




}());