//create Point class for viewModel point data
var Point = function(data) {
	this.name = ko.observable(data.name);
	this.des = ko.observable(data.des);
	this.loc = ko.observable(data.loc);
	this.URL = ko.observable(data.URL);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.marker = ko.observable(data.marker);
};
// create point array for points that are initially populated
initialPoints = [
	{
		name: "Rhema's Soul Cuisine",
		loc: "Queen Creek, AZ",
		des: "A great new family owned restaurant to get amazing Southern Barbeque!",
		URL: "http://www.rhemasoulcuisine.com/",
		lat: 33.2503745, 
		lng: -111.63395760000003,
	},
	{
		name: "Schnepf Farms", 
		loc: "Queen Creek, AZ",
		des: "A quaint farm that holds community events throughout the year.",
		URL: "http://www.schnepffarms.com/",
		lat: 33.2248179,
		lng: -111.59078,
	},
	{
		name: "Buffalo Wild Wings",
		loc: "Queen Creek, AZ",
		des: "There's never a bad time to get some fantastic wings!",
		URL: "http://www.buffalowildwings.com/en/locations/Detail/0601",
		lat: 33.2543078,
		lng: -111.6392,
	},
	{
		name: "Soda Shop",
		loc: "Gilbert, AZ",
		des: "A unique spin on some classic beverages.",
		URL: "http://www.thesodashop.co/",
		lat: 33.37834,
		lng: -111.74252,
	},
	{
		name: "Kokobelli Bagel Cafe",
		loc: "Mesa, AZ",
		des: "Always great to have a good place to get some delicious bagels.",
		URL: "https://www.facebook.com/KokobelliBagelCafe/",
		lat: 33.3948903,
		lng: -111.6841,
	}
];
// callback for googlemaps api to run
var map = new initMap();
// create global infowindow to move between points
var infoWindow =  new google.maps.InfoWindow({pixelOffset: new google.maps.Size(0,-40), maxWidth: 150});
// declare viewmodel for KO bindings
var viewModel = function() {
	//assign this to variable for better assignment and easier readability
	var self = this;

	this.list = ko.observable();
	//declare array to push points into
	self.pointList = ko.observableArray([]);
	//push points to observable array for bindings
	initialPoints.forEach(function(point) {
		self.pointList.push(new Point (point));
	});
	//declare observable filter for search function
	self.filter = ko.observable('');
	//focus function for listview
	self.focusMarker = function(point) {
		google.maps.event.trigger(point.marker(), 'click');
	};
	// for reset zoom button to set zoom back to default, for UI smoothness
	self.resetZoom = function() {
		var lat = 33.30989556699141
		var lng = -111.66665
		var position = {lat, lng};

		infoWindow.close();
		map.setZoom(12);
		map.setCenter(position);
	}
	//for use in toggling the list in case it gets in the way 
	self.hideList = function() {
		$('#pointList, #search').toggleClass('hide');
	}
	self.showList = function() {
		self.list(true);
	}
	// bindings for index, allows user input in filter to change list items
	self.filteredItems = ko.computed(function() {
	    var filter = ko.observable(this.filter().toLowerCase());
		    if (!filter) {
		        return self.pointList();
		    }  else {
			return ko.utils.arrayFilter(self.pointList(), function(data){
				var string = data.name().toLowerCase().indexOf(filter()) !== -1;
				if(!string){
					data.marker().setVisible(false);
				}
				return string;
			});
		}
	}, self);

	self.filter.subscribe(function(data){
		if(data == ''){
			ko.utils.arrayForEach(self.pointList(), function(point){
				point.marker().setVisible();
			})
		}
	});
};

ko.applyBindings(new viewModel());