function initMap() {
//create Point class for point data
  var Point = function(data) {
    this.name = ko.observable(data.name);
    this.loc = ko.observable(data.loc);
    this.des = ko.observable(data.des);
    this.URL = ko.observable(data.URL);
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

    for (var point in initialPoints) {
      locations.push(initialPoints[point]);
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
      title: name,
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
      console.log(marker.title);
    });

    bounds.extend(new google.maps.LatLng(lat, lon));
    map.fitBounds(bounds);
    map.setCenter(bounds.getCenter());
  }
// callback for the Maps API search
  var callback = function(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMapMarker(results[0], locations)
    }
  };

  var markerPlacer = function(locations) {
    var service = new google.maps.places.PlacesService(map);

    for (var point in locations) {
      var query = locations[point].name + ' ' + locations[point].loc;

      var request = {
        query: query
      };

      service.textSearch(request, callback);
    }
  }

  window.mapBounds = new google.maps.LatLngBounds();

  locations = locationFinder();

  markerPlacer(locations);

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
};