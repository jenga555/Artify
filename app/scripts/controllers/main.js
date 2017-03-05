'use strict';

angular.module('app').controller('MainCtrl', ['$scope', 'Spotify', function($scope, Spotify) {

    $scope.user = {
        id: null,
        selectedPlaylist: null,
        playlists: null
    };
    var PLAYLIST_OPTIONS = {
        fields: "items(track(name,href,album(name,href,images))),total,next",
        offset: 0,
    };
    $scope.playlists = null;
    $scope.albums = [];

    $scope.login = function() {
        Spotify.login().then(function() {
            Spotify.getCurrentUser().then(function(data) {
                $scope.user.id = data.id;
                console.log(data);
                Spotify.getUserPlaylists($scope.user.id, {
                    limit: 50
                }).then(function(data) {
                    $scope.user.playlists = data.items;
                });
            });
        }, function() {
            console.log('didn\'t log in');
        })
    };


    $scope.submitPlaylist = function() {
        if ($scope.user.selectedPlaylist) {
            Spotify.getPlaylistTracks($scope.user.selectedPlaylist.owner.id, $scope.user.selectedPlaylist.id, PLAYLIST_OPTIONS).then(function(data) {
                // TOOD handle 'next'
                // offset + limit < total
                var tracks = data.items;
                var albums = [];
                $scope.albums.length = 0;
                var albumHref;
                for (var i in tracks) {
                    albumHref = tracks[i].track.album.href;
                    if (!albums[albumHref]) {
                        albums[albumHref] = {tracks: [], count: 0, image: tracks[i].track.album.images[0].url, name: tracks[i].track.album.name };
                    }
                    albums[albumHref].tracks.push({"href":tracks[i].track.href, "name": tracks[i].track.name});
                    albums[albumHref].count++;
                }

                for (var i in albums) {
                    $scope.albums.push(albums[i]);
                }

                console.log($scope.albums);

            });
        }

    }

}]);
