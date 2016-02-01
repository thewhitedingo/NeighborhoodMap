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
    yelpSearch(initialPoints[i]);
  };

  for (var i = 0; i < initialPoints.length; i++) {
    createMapMarker(map, initialPoints[i]);
  };

  return map;
}

var yelpSearch = function(point) {
 
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
  var yelpContent;
  var marker = new google.maps.Marker({
    map: map,
    position: LatLng,
    title: name
  });
   //yelp API auth keys
  var auth = {
    con_key:  "h8iP1qgBVONI_B_Sm4OJJQ",
    con_secret: "ReEKS4TFZjEfkq3M-qEaS-aUxeM",
    token:  "28bgKQZYi-231boZjCPtLzbO_iLdz8lJ",
    token_secret: "Cet2iIeb0OWR8Asa5bky8a2CHes",
    sig_method: "hmac-sha1"
  };

  var terms = 'food';
  var near = 'San+Francisco';

  var accessor = {
      consumerSecret : auth.con_secret,
      tokenSecret : auth.token_secret
  };
  parameters = [];
  parameters.push(['term', point.name]);
  parameters.push(['location', point.loc]);
  parameters.push(['callback', 'cb']);
  parameters.push(['oauth_consumer_key', auth.con_key]);
  parameters.push(['oauth_consumer_secret', auth.con_secret]);
  parameters.push(['oauth_token', auth.token]);
  parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

  var message = {
      'action' : 'http://api.yelp.com/v2/search',
      'method' : 'GET',
      'parameters' : parameters
    };

  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);

  var parameterMap = OAuth.getParameterMap(message.parameters);

  $.ajax({
    'url' : message.action,
    'data' : parameterMap,
    'dataType' : 'jsonp',
    'jsonpCallback' : 'cb',
    'timeout': 5000,
    'success' : function(data, textStats, XMLHttpRequest) {
      console.log(data);
      var place = data['businesses'][0];
      address = place.location.display_address;
      rating = place.rating_img_url_small;
      snippet = place.snippet_text;

      yelpContent = '<p>' + snippet + '</p><p>' + address + '</p><p>\
        <image src="' + rating + '"></p>';
    }
  });

  var content = '<h4>' + point.name + '</h4>' + yelpContent;

  marker.addListener('mouseover', function() {
    infoWindow.setContent(content);
    infoWindow.setPosition(LatLng);
    infoWindow.open(map);
  });

  marker.addListener('mouseout', function() {
      infoWindow.close();
  });

  marker.addListener('click', function() {
    map.setZoom(18);
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