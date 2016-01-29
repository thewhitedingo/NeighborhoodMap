function initMap() {

    //grab map to paint map to page
  var mapOptions = {
    disableDefaultUI: true,
    center: {lat: 33.25179, lng: -111.641777},
    zoom: 14
  }

  map = new google.maps.Map(document.getElementById('map'),mapOptions);

//declare location array for input and markers
  var locations;
  var j = 1;
  var markerList = [];
  var addressList = [];
  var nameList = [];

  var locationFinder = function() {

    var locations = [];

    for (var point in initialPoints) {
      locations.push(initialPoints[point]);
    }

    return locations;
  }

  var markerToPoint = function() {
    for (var i = 0; i < initialPoints.length; i++) {
      initialPoints[i].marker = markerList[i];
      initialPoints[i].name = nameList[i];
      initialPoints[i].loc = addressList[i];
    };
  };

  var createMapMarker = function (pointData) {
    var lat = pointData.geometry.location.lat();
    var lon = pointData.geometry.location.lng();
    var name = pointData.name;
    var bounds = window.mapBounds;
    var address = pointData.formatted_address;
    var marker = new google.maps.Marker({
      map: map,
      position: pointData.geometry.location,
      title: name
    });

    var infoContent = '<h4 class="info">' + pointData.name + '</h4><p>' + pointData.formatted_address + '</p>';

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
      map.setZoom(14);
      map.setCenter(marker.getPosition());
    });

    bounds.extend(new google.maps.LatLng(lat, lon));
    map.fitBounds(bounds);
    map.setCenter(bounds.getCenter());
    markerList.push(marker);
    addressList.push(address);
    nameList.push(name);
    markerToPoint();

    if (j == locations.length) {

      ko.applyBindings(new viewModel());
    } else {
      j++;
    };
  }
// callback for the Maps API search
  var callback = function(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMapMarker(results[0]);
    }
  };

  var markerPlacer = function() {
    var service = new google.maps.places.PlacesService(map);

    locations = locationFinder();

    for (var point in locations) {
      var query = locations[point].name + ' ' + locations[point].loc;

      var request = {
        query: query
      };

      service.textSearch(request, callback);
    }
  }

  window.mapBounds = new google.maps.LatLngBounds();



  markerPlacer();
};