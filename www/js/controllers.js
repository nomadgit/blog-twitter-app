angular.module('app')

.controller('AppCtrl', function($scope, $ionicModal, TwittSrv){
  'use strict';
  TwittSrv.getTwitts().then(function(twitts){
    $scope.twitts = twitts;
  });

  $scope.doRefresh = function(){
    TwittSrv.getNewTwitts().then(function(newTwitts){
      $scope.twitts = newTwitts.concat($scope.twitts);
    }).finally(function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.loadMore = function(){
    TwittSrv.getMoreTwitts().then(function(olderTwitts){
      $scope.twitts = $scope.twitts.concat(olderTwitts);
    }).finally(function() {
      // Stop the ion-infinite-scroll from spinning
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  var newTwittModal = null;
  $ionicModal.fromTemplateUrl('views/partials/new-twitt-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal){
    newTwittModal = modal;
  });
  $scope.writeTwitt = function(){
    newTwittModal.show();
  };
  $scope.cancelWriteTwitt = function(){
    newTwittModal.hide();
  };
  $scope.sendTwitt = function(twitt){
    newTwittModal.hide();
    TwittSrv.sendTwitt(twitt).then(function(newTwitt){
      $scope.twitts.unshift(newTwitt);
      twitt.content = '';
    });
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function(){
    newTwittModal.remove();
  });
});
