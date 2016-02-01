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
		address: "",
		snippet: "",
		rating: ""
	},
	{
		name: "Schnepf Farms", 
		loc: "Queen Creek, AZ",
		des: "A quaint farm that holds community events throughout the year.",
		URL: "http://www.schnepffarms.com/",
		lat: 33.2248179,
		lng: -111.59078,
		address: "",
		snippet: "",
		rating: ""
	},
	{
		name: "Buffalo Wild Wings",
		loc: "Queen Creek, AZ",
		des: "There's never a bad time to get some fantastic wings!",
		URL: "http://www.buffalowildwings.com/en/locations/Detail/0601",
		lat: 33.2543078,
		lng: -111.6392,
		address: "",
		snippet: "",
		rating: ""
	},
	{
		name: "Soda Shop",
		loc: "Gilbert, AZ",
		des: "A unique spin on some classic beverages.",
		URL: "http://www.thesodashop.co/",
		lat: 33.37834,
		lng: -111.74252,
		address: "",
		snippet: "",
		rating: ""
	},
	{
		name: "Kokobelli Bagel Cafe",
		loc: "Mesa, AZ",
		des: "Always great to have a good place to get some delicious bagels.",
		URL: "https://www.facebook.com/KokobelliBagelCafe/",
		lat: 33.3948903,
		lng: -111.6841,
		address: "",
		snippet: "",
		rating: ""
	}
];
var yelp = [];
// modified ko.util.stringStartsWith function to suit the map
// taken from Knockout JavaScript API
var stringStartsWith = function (string, startsWith, data) {  	
	string = string || "";
	if (startsWith.length > string.length) {
		return false;
	} else {
		if (string.substring(0, startsWith.length) != startsWith)
		return false;
		data.marker().setVisible(true);
		return string.substring(0, startsWith.length) === startsWith;
	};
};
// callback for googlemaps api to run
var map = new initMap();
// create global infowindow to move between points
var infoWindow =  new google.maps.InfoWindow({pixelOffset: new google.maps.Size(0,-40)});
// declare viewmodel for KO bindings
var viewModel = function() {
	//assign this to variable for better assignment and easier readability
	var self = this;
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
		var lat = point.lat();
		var lng = point.lng();
		var LatLng = {lat, lng};

		var content = '<h4>' + point.name() + '</h4><p>' + yelp.snippet + '</p>';
		//set zoom, move infowindow, replace infowindo content
		map.setZoom(18);
		map.setCenter(point.marker().getPosition());
		infoWindow.close();
		infoWindow.setContent(content);
		infoWindow.setPosition(LatLng);
		infoWindow.open(map);
	};
	// for reset zoom button to set zoom back to default, for UI smoothness
	self.resetZoom = function() {
		var lat = 33.30989556699141
		var lng = -111.66665
		var position = {lat, lng};

		map.setZoom(11);
		map.setCenter(position);
	}
	// bindings for index, allows filter to change list items
	self.filteredItems = ko.computed(function() {
	    var filter = self.filter().toLowerCase();
		    if (!filter) {
		        return self.pointList();
		    } else {
		        return ko.utils.arrayFilter(self.pointList(), function(data) {
		        	data.marker().setVisible(false);
		            return stringStartsWith(data.name().toLowerCase(), filter, data);
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