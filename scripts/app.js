
var interestPoints = ["Rhema's Soul Cuisine, Queen Creek, AZ", "Schnepf Farms, Queen Creek, AZ", "Buffalo Wild Wings, Queen Creek, AZ"];

var map;

function initMap() {
  //declare location array for input and markers
  var locations;
  var mapOptions = {
    disableDefaultUI: true,
    center: {lat: 33.25179, lng: -111.641777},
    zoom: 14
  }
  
  //grab map and center it to specified location and append it to DOM
  map = new google.maps.Map(document.getElementById('map'),mapOptions);

  var locationFinder = function() {

    var locations = [];

    for (var point in interestPoints) {
      locations.push(interestPoints[point]);
    }

    return locations;
  }

  var createMapMarker = function (pointData) {
    var lat = pointData.geometry.location.lat();
    var lon = pointData.geometry.location.lng();
    var name = pointData.formatted_address;
    var bounds = window.mapBounds;

    var marker = new google.maps.Marker({
      map: map,
      position: pointData.geometry.location,
      title: name
    });

    var infoWindow = new google.maps.InfoWindow({
      content:name
    });

    bounds.extend(new google.maps.LatLng(lat, lon));
    map.fitBounds(bounds);
    map.setCenter(bounds.getCenter());
  }
// callback for the Maps API search
  var callback = function(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMapMarker(results[0])
    }
  };

  var markerPlacer = function(locations) {
    var service = new google.maps.places.PlacesService(map);

    for (var point in locations) {
      var request = {
        query: locations[point]
      };

      service.textSearch(request, callback);
    }
  }

  window.mapBounds = new google.maps.LatLngBounds();

  locations = locationFinder();

  markerPlacer(locations);

  var input = document.getElementById('searchTextField');
  var options = {
    bounds: window.mapBounds,
    types: ['establishment', 'address', 'geocode']
  };

  autocomplete = new google.maps.places.Autocomplete(input, options);
}
