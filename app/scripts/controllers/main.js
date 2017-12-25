'use strict';

angular.module('app').controller('MainCtrl', ['$scope', 'Spotify', function($scope, Spotify) {

    var PLAYLIST_FIELDS = "items(track(name,href,album(name,href,images))),total,next";
    $scope.user = {
        id: null
    };
    $scope.selectedPlaylist = null;
    $scope.playlistList = null;
    $scope.albums = [];
    $scope.showForm = true;
    $scope.downloadLoading = false;

    if (localStorage.getItem('spotify-token')) {
        Spotify.getCurrentUser().then(function(data) {
            getPlaylists();
        }, function(){
            getFeaturedPlaylists();
        });
    } else {
        getFeaturedPlaylists();
    }

    function getPlaylists() {
        Spotify.getCurrentUser().then(function(data) {
            $scope.user.id = data.id;
            $scope.playlistList = [];
            getUserPlaylists(0);
        }, function(){
            alert("Please refresh and log back in.");
        });
    }

    function getFeaturedPlaylists() {
        $.getJSON("https://spotify-server.herokuapp.com/token", function(data) {
            if (data.access_token) {
                Spotify.setAuthToken(data.access_token);
                Spotify.getFeaturedPlaylists({}).then(function(data) {
                    $scope.playlistList = data.playlists.items;
                });
            } else {
                alert("Sorry. This feature is currently down.");
            }
        });
    }

    $scope.login = function() {
        Spotify.login().then(function() {
            getPlaylists();
        }, function() {
            console.log('didn\'t log in');
        })
    };

    function getUserPlaylists(offset) {
        Spotify.getUserPlaylists($scope.user.id, {
            limit: 50,
            offset: offset
        }).then(function(data) {
            $scope.playlistList = $scope.playlistList.concat(data.items);
            if (data.next) {
                getUserPlaylists(offset+50);
            }
        });
    }

    $scope.submitPlaylist = function() {
        if ($scope.selectedPlaylist) {
            $scope.albums = [];
            getPlaylistTracks([], 0);
        }
    }

    function getPlaylistTracks(albums, offset) {
        Spotify.getPlaylistTracks($scope.selectedPlaylist.owner.id, $scope.selectedPlaylist.id, {fields: PLAYLIST_FIELDS, offset: offset}).then(function(data) {
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

    $scope.toggleForm = function() {
        $scope.showForm = !$scope.showForm;
    }

    $scope.downloadCollage = function () {
        if (!$scope.downloadLoading) {
            $scope.downloadLoading = true;
            domtoimage.toBlob(document.getElementById('collage'), {'bgcolor': 'black'})
                .then(function (blob) {
                    window.saveAs(blob, $scope.selectedPlaylist.name + '.png');
                    $scope.downloadLoading = false;
                    $scope.$apply();
                });
        }
    }

}]);
