'use strict';

angular
  .module('app', [
    'spotify',
    'wu.masonry'
  ]).config(function(SpotifyProvider) {
    SpotifyProvider.setClientId('854e4a39ed614f8db67aa9d424093981');
    SpotifyProvider.setRedirectUri('http://localhost:8080/6/Artify/app/callback.html');
    SpotifyProvider.setScope('user-read-private playlist-read-private');
    // // If you already have an auth token
    // SpotifyProvider.setAuthToken('zoasliu1248sdfuiknuha7882iu4rnuwehifskmkiuwhjg23');
  });
