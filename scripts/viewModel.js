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
	  lng: -111.63395760000003
	},
	{
	  name: "Schnepf Farms", 
	  loc: "Queen Creek, AZ",
	  des: "A quaint farm that holds community events throughout the year.",
	  URL: "http://www.schnepffarms.com/",
	  lat: 33.2248179,
	  lng: -111.59078
	},
	{
	  name: "Buffalo Wild Wings",
	  loc: "Queen Creek, AZ",
	  des: "There's never a bad time to get some fantastic wings!",
	  URL: "http://www.buffalowildwings.com/en/locations/Detail/0601",
	  lat: 33.2543078,
	  lng: -111.6392
	},
	{
	  name: "Soda Shop",
	  loc: "Gilbert, AZ",
	  des: "A unique spin on some classic beverages.",
	  URL: "http://www.thesodashop.co/",
	  lat: 33.37834,
	  lng: -111.74252
	},
	{
	  name: "Kokobelli Bagel Cafe",
	  loc: "Mesa, AZ",
	  des: "Always great to have a good place to get some delicious bagels.",
	  URL: "https://www.facebook.com/KokobelliBagelCafe/",
	  lat: 33.3948903,
	  lng: -111.6841
	}
]
// callback for googlemaps api to run
var map = new initMap();
var infoWindow =  new google.maps.InfoWindow({pixelOffset: new google.maps.Size(0,-40)});

var viewModel = function() {
  var self = this;
  var search = $('#searchTextField');

  self.pointList = ko.observableArray([]);

  initialPoints.forEach(function(point) {
    self.pointList.push(new Point (point));
  });

  self.focusMarker = function(point) {
  	var lat = point.lat();
    var lng = point.lng();
    var LatLng = {lat, lng};
    var content = '<h4>' + point.name() + '</h4><p>' + point.des() + '</p>';

    map.setZoom(18);
    map.setCenter(point.marker().getPosition());
    infoWindow.close();
	infoWindow.setContent(content);
	infoWindow.setPosition(LatLng);
	infoWindow.open(map);
   };
};

ko.applyBindings(new viewModel());