var Point = function(data) {
  this.name = ko.observable(data.name);
  this.loc = ko.observable(data.loc);
  this.des = ko.observable(data.des);
  this.URL = ko.observable(data.URL);

  this.location = ko.computed(function() {
  })
};


initialPoints = [
  {
    name: "Rhema's Soul Cuisine",
    loc: "Queen Creek, AZ",
    des: "A wonderful place to get some Southen-Style Barbeque, you'll be back for days after!",
    URL: "http://www.rhemasoulcuisine.com/" 
  },
  {
    name: "Schnepf Farms", 
    loc: "Queen Creek, AZ",
    des: "A nice farm to visit. They hold special events for the community throughout the year.",
    URL: "http://www.schnepffarms.com/"
  },
  {
    name: "Buffalo Wild Wings",
    loc: "Queen Creek, AZ",
    des: "Always a great place to eat!",
    URL: "http://www.buffalowildwings.com/en/locations/Detail/0601"
  },
  {
    name: "Soda Shop",
    loc: "Gilbert, AZ",
    des: "A new spin on classic drinks.",
    URL: "http://www.thesodashop.co/"
  },
  {
    name: "Kokobelli Bagel Cafe",
    loc: "Mesa, AZ",
    des: "A bagel for breakfast or lunch. Better bagels are always good.",
    URL: "https://www.facebook.com/KokobelliBagelCafe/"
  }
]

var viewModel = function() {
  var self = this;
  var search = $('#searchTextField');

  self.pointList = ko.observableArray([]);

  initialPoints.forEach(function(point) {
    self.pointList.push(new Point (point));
  });

  search.on('focusin', function() {
    search.attr('value', '');
  });

  search.on('focusout', function() {
    search.attr('value', 'Search a Marker');
  });
};

ko.applyBindings(new viewModel());