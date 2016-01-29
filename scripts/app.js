function initMap() {
  var map;
  var infoWindow;
    //grab map to paint map to page
  var mapOptions = {
    disableDefaultUI: true,
    center: {lat: 33.25179, lng: -111.641777},
    zoom: 14
  };
  window.mapBounds = new google.maps.LatLngBounds();

  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  for (var i = 0; i < initialPoints.length; i++) {
    createMapMarker(map, initialPoints[i]);
  };

  return map;
}


var markerToPoint = function(point, marker) {
    point.marker = marker;
};

var createMapMarker = function (map, point) {
    var lat = point.lat;
    var lng = point.lng;
    var LatLng = {lat, lng};
    var name = point.name;
    var bounds = window.mapBounds;
    var marker = new google.maps.Marker({
      map: map,
      position: LatLng,
      title: name
    });

    var infoContent = '<h4>' + point.name + '</h4><p>' + point.des + '</p>';

    var infoWindow = new google.maps.InfoWindow({
      content: infoContent
    });

    marker.addListener('mouseover', function() {
      infoWindow.open(map, marker);
    });

    marker.addListener('mouseout', function() {
        infoWindow.close();
    });

    marker.addListener('click', function() {
      map.setZoom(16);
      map.setCenter(marker.getPosition());
    });

    bounds.extend(new google.maps.LatLng(lat, lng));
    bounds.extend(new google.maps.LatLng(lat, lng));
    map.fitBounds(bounds);
    map.setCenter(bounds.getCenter());
    markerToPoint(point, marker);
};
// callback for the Maps API search
var callback = function(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    createMapMarker(results[0]);
  }
};

var locationFinder = function() {

  var locations = [];

  for (var point in initialPoints) {
    locations.push(initialPoints[point]);
  }

  return locations;
};

var placeSearch = function() {
  var service = new google.maps.places.PlacesService(map);

  locations = locationFinder();

  for (var point in locations) {
    var query = locations[point].name + ' ' + locations[point].loc;

    var request = {
      query: query
    };

    service.textSearch(request, callback);
  }
};