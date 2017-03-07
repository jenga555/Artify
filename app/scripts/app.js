'use strict';

angular
  .module('app', [
    'spotify',
    'wu.masonry'
  ]).config(function(SpotifyProvider) {
    SpotifyProvider.setClientId('854e4a39ed614f8db67aa9d424093981');
    SpotifyProvider.setRedirectUri('https://julia-eng.github.io/Artify/app/callback.html');
    SpotifyProvider.setScope('user-read-private playlist-read-private playlist-read-collaborative');
  });
