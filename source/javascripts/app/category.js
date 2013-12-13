(function(){
  'use strict';

  var p
    , config = App.config
    , categories = App.categories;




  App.Category = function($list, title, $select) {
    
    // Add this category to the App.categories array.
    categories.push(this);
    
    this.title = title;
    this.dispatches = [];
    
    this.$listGroup = $(this.listGroupHTML());
    this.$option = $(this.optionHTML());
    
    this.renderIn($list, $select);
    this.$itemsWrapper = this.$listGroup.find('.' + config.listItemsGroupClass);
    
  };
  
  
  
  
  // If a category exists with the given title, return that category.
  // Otherwise, return a new category.
  App.Category.findOrCreate = function(title, $list, $select) {
    var i = categories.length;
    while (i--) {
      if (categories[i].title === title) {
        return categories[i];
      }
    }
    return new App.Category($list, title, $select);
  };
  
  
  
  
  p = App.Category.prototype;
  
  // Return the HTML for this category in this list.
  p.listGroupHTML = function() {
    return '<div class="pdx911-category"><h2>' +
      this.title +
      '</h2><div class="' +
      config.listItemsGroupClass +
      '"></div></div>';
  };
  
  // Return the HTML for this category in the select menu.
  p.optionHTML = function() {
    return '<option value="' +
      this.title +
      '">' +
      this.title +
      "</option>";
  }
  
  // A function for sorting categories alphabetically by title.
  p.sorter = function(a, b) {
    return a.title < b.title ? -1 : 1;
  }

  // Added this category's HTML to the list.
  // The HTML is added in the appropriate alphabetical location.
  p.renderIn = function($list, $select) {
    var i;
    categories.sort(this.sorter);
    i = categories.indexOf(this);
    if (i === 0) {
      this.$listGroup.prependTo($list);
      this.$option.insertAfter($select.children().eq(0)); // Insert after the default option.
    } else {
      this.$listGroup.insertAfter(categories[i - 1].$listGroup);
      this.$option.insertAfter(categories[i - 1].$option);
    }
  }
  
  // This should be called whenever a change has been made to the list of dispatches in this category.
  // Hide this category if all of its dispatches are hidden.
  p.dispatchListChanged = function() {
    var i = this.dispatches.length;
    while (i--) {
      if (this.dispatches[i].marker.getVisible()) {
        return this.unhide();
      }
    }
    return this.hide();
  };
  
  // Hide this category from the list.
  p.hide = function() {
    if (!this.$listGroup.hasClass(config.hiddenItemClass)) {
      this.$listGroup.addClass(config.hiddenItemClass);
    }
  };
  
  // Show this category in the list.
  p.unhide = function() {
    if (this.$listGroup.hasClass(config.hiddenItemClass)) {
      this.$listGroup.removeClass(config.hiddenItemClass);
    }
  };




}());