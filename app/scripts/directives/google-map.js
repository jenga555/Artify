'use strict';

angular.module('app')
  .directive('googleMap', function() {
    return {
      template: '<div id="map"></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        // Google Maps Scripts
        var map = null;
        // When the window has finished loading create our google map below
        google.maps.event.addDomListener(window, 'resize', function() {
          map.setCenter(new google.maps.LatLng(45, 10));
        });

        // Basic options for a simple Google Map
        // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
        var mapOptions = {
          // How zoomed in you want the map to start at (always required)
          zoom: 2,

          // The latitude and longitude to center the map (always required)
          center: new google.maps.LatLng(20, 30), // New York

          // Disables the default Google Maps UI components
          disableDefaultUI: true,
          scrollwheel: false,
          draggable: false,

          // How you would like to style the map.
          // This is where you would paste any style found on Snazzy Maps.
          styles: [{
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
              "color": "#000000"
            }, {
              "lightness": 17
            }]
          }, {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{
              "color": "#000000"
            }, {
              "lightness": 20
            }]
          }, {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
              "color": "#000000"
            }, {
              "lightness": 17
            }]
          }, {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
              "color": "#000000"
            }, {
              "lightness": 29
            }, {
              "weight": 0.2
            }]
          }, {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{
              "color": "#000000"
            }, {
              "lightness": 18
            }]
          }, {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [{
              "color": "#000000"
            }, {
              "lightness": 16
            }]
          }, {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{
              "color": "#000000"
            }, {
              "lightness": 21
            }]
          }, {
            "elementType": "labels.text.stroke",
            "stylers": [{
              "visibility": "on"
            }, {
              "color": "#000000"
            }, {
              "lightness": 16
            }]
          }, {
            "elementType": "labels.text.fill",
            "stylers": [{
              "saturation": 36
            }, {
              "color": "#000000"
            }, {
              "lightness": 40
            }]
          }, {
            "elementType": "labels.icon",
            "stylers": [{
              "visibility": "off"
            }]
          }, {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{
              "color": "#000000"
            }, {
              "lightness": 19
            }]
          }, {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [{
              "color": "#000000"
            }, {
              "lightness": 20
            }]
          }, {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{
              "color": "#000000"
            }, {
              "lightness": 17
            }, {
              "weight": 1.2
            }]
          }]
        };

        // Get the HTML DOM element that will contain your map
        // We are using a div with id="map" seen below in the <body>
        var mapElement = document.getElementById('map');

        // Create the Google Map using out element and options defined above
        map = new google.maps.Map(mapElement, mapOptions);

        var image = {
          url: 'img/map-marker.png',
          scaledSize: new google.maps.Size(10, 17)
        };

        // List of countries from https://support.spotify.com/us/account_payment_help/subscription_information/full-list-of-territories-where-spotify-is-available/
        // Coords from Geolocaton
        $.getJSON("countries.json", function(data) {
          for (var country in data.countries) {
            var marker = new google.maps.Marker({
              map: map,
              position: data.countries[country].coord,
              title: data.countries[country].name,
              icon: image,
            });
          }
        });

      }
    };
  });
