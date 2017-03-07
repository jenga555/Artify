'use strict';

angular.module('app').controller('MainCtrl', ['$scope', 'Spotify', function($scope, Spotify) {

    var PLAYLIST_FIELDS = "items(track(name,href,album(name,href,images))),total,next";
    $scope.user = {
        id: null,
        selectedPlaylist: null,
        playlists: null
    };
    $scope.playlists = null;
    $scope.albums = [];

    $scope.login = function() {
        Spotify.login().then(function() {
            Spotify.getCurrentUser().then(function(data) {
                $scope.user.id = data.id;
                $scope.user.playlists = [];
                getUserPlaylists(0);
            });
        }, function() {
            console.log('didn\'t log in');
        })
    };

    function getUserPlaylists(offset) {
        Spotify.getUserPlaylists($scope.user.id, {
            limit: 50,
            offset: offset
        }).then(function(data) {
            $scope.user.playlists = $scope.user.playlists.concat(data.items);
            if (data.next) {
                getUserPlaylists(offset+50);
            }
        });
    }


    $scope.submitPlaylist = function() {
        if ($scope.user.selectedPlaylist) {
            $scope.albums = [];
            getPlaylistTracks([], 0);
        }
    }

    function getPlaylistTracks(albums, offset) {
        Spotify.getPlaylistTracks($scope.user.selectedPlaylist.owner.id, $scope.user.selectedPlaylist.id, {fields: PLAYLIST_FIELDS, offset: offset}).then(function(data) {
            var tracks = data.items;
            var albumHref;
            for (var i in tracks) {
                albumHref = tracks[i].track.album.href;
                if (tracks[i].track.album.images.length) {
                    if (!albums[albumHref]) {
                        albums[albumHref] = {tracks: [], count: 0, image: tracks[i].track.album.images[0].url, name: tracks[i].track.album.name };
                    }
                    albums[albumHref].tracks.push({"href":tracks[i].track.href, "name": tracks[i].track.name});
                    albums[albumHref].count++;
                }
            }

            if (data.next) {
                getPlaylistTracks(albums, offset+100)
            } else {
                for (var i in albums) {
                    $scope.albums.push(albums[i]);
                }
            }

        });
    }

}]);
