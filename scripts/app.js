function initMap() {
  var map;
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

var yelpToPoint = function(point, content) {
  point.yelp = content;
}

var yelpSearch = function(point, marker, map, LatLng) {
   //yelp API auth keys
  var auth = {
    con_key:  "h8iP1qgBVONI_B_Sm4OJJQ",
    con_secret: "ReEKS4TFZjEfkq3M-qEaS-aUxeM",
    token:  "28bgKQZYi-231boZjCPtLzbO_iLdz8lJ",
    token_secret: "Cet2iIeb0OWR8Asa5bky8a2CHes",
    sig_method: "hmac-sha1"
  };

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
    'timeout': 5000,
    'success' : function(data, textStats, XMLHttpRequest) {
      var place = data['businesses'][0];
      address = place.location.display_address;
      rating = place.rating_img_url_small;
      reviewCount = place.review_count;
      snippet = place.snippet_text;
      url = place.url;
      phone = place.phone;
      yelp = 'http://s3-media2.fl.yelpcdn.com/assets/srv0/www_pages/95212dafe621/assets/img/brand_guidelines/yelp-2c.png'
      //set content for infowindows
      yelpContent = '<p>' + phone + '</p><p>' + snippet + '<a href="' + url + '"">read more</a></p><p>' + address + '</p><p>\
        <image src="' + rating + '"> (' + reviewCount + ')</p><p><image src="' + yelp + '" style="width:15%;height:10%;"></p>';

      var content = '<h4>' + point.name + '</h4>' + yelpContent;
      // once the data has returned then add listeners to the markers to correctly set content
      marker.addListener('mouseover', function() {
        infoWindow.setContent(content);
        infoWindow.setPosition(LatLng);
        infoWindow.open(map);
      });

      marker.addListener('mouseout', function() {
        infoWindow.close();
      });

      marker.addListener('click', function() {
        infoWindow.close();
        infoWindow.setContent(content);
        infoWindow.setPosition(LatLng);
        infoWindow.open(map);
        map.setZoom(18);
        map.setCenter(marker.getPosition());
      });
    },
    'error' : function(data, textStats, XMLHttpRequest) {
      console.log(point.name + ' did not return resuls, possible connnection error.');
      console.log(XMLHttpRequest);
      yelpContent = '<p>' + point.des + '</p>';
      var content = '<h4>' + point.name + '</h4>' + yelpContent;

      marker.addListener('mouseover', function() {
          infoWindow.setContent(content);
          infoWindow.setPosition(LatLng);
          infoWindow.open(map);
      });
    }
  });
}

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

  yelpSearch(point, marker, map, LatLng);

  bounds.extend(new google.maps.LatLng(lat, lng));
  bounds.extend(new google.maps.LatLng(lat, lng));
  map.fitBounds(bounds);
  map.setCenter(bounds.getCenter());
  markerToPoint(point, marker);
};