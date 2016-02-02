'use strict';

(function (angular, buildfire) {
  angular.module('youCanBookMePluginContent', ['ui.bootstrap'])
    .controller('ContentHomeCtrl', ['$scope', 'Buildfire', 'STATUS_CODE', 'TAG_NAMES', 'DataStore',
      function ($scope, Buildfire, STATUS_CODE, TAG_NAMES, DataStore) {
        var ContentHome = this;

      }])
})(window.angular, window.buildfire);