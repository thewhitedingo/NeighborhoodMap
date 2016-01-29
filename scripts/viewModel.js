//create Point class for point data
var Point = function(data) {
	this.name = ko.observable(data.name);
	this.loc = ko.observable(data.loc);
	this.des = ko.observable(data.des);
	this.URL = ko.observable(data.URL);
	this.marker = ko.observable(data.marker);
};

initialPoints = [
	{
		name: "Rhema's Soul Cuisine",
	  loc: "Queen Creek, AZ",
	},
	{
	  name: "Schnepf Farms", 
	  loc: "Queen Creek, AZ",
	},
	{
	  name: "Buffalo Wild Wings",
	  loc: "Queen Creek, AZ",
	},
	{
	  name: "Soda Shop",
	  loc: "Gilbert, AZ",
	},
	{
	  name: "Kokobelli Bagel Cafe",
	  loc: "Mesa, AZ",
	}
]

var viewModel = function() {

	var self = this;
	var search = $('#searchTextField');

	self.pointList = ko.observableArray([]);

	self.markerListKO = ko.observableArray([]);

	initialPoints.forEach(function(point) {
  	self.pointList.push(new Point (point));
	});

	self.markerFocus = function(point) {
		map.setZoom(16);
    map.setCenter(point.marker().getPosition());
	}

	self.focusMarker = function(point) {
    self.markerFocus(point)
  };
};