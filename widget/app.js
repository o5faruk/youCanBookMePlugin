'use strict';

(function (angular) {
  angular.module('youCanBookMePluginWidget', ['ui.bootstrap'])
    .controller('WidgetHomeCtrl', ['$scope', 'Buildfire', 'DataStore', 'TAG_NAMES', 'STATUS_CODE',
      function ($scope, Buildfire, DataStore, TAG_NAMES, STATUS_CODE) {
        var WidgetHome = this;
        /*
         * Fetch user's data from datastore
         */
        WidgetHome.init = function () {
          WidgetHome.success = function (result) {
            WidgetHome.data = result.data;
            if (!WidgetHome.data.content)
              WidgetHome.data.content = {};
            console.log(">>>>>", WidgetHome.data);
          }
          WidgetHome.error = function (err) {
            if (err && err.code !== STATUS_CODE.NOT_FOUND) {
              console.error('Error while getting data', err);
            }
          };
          DataStore.get(TAG_NAMES.SCHEDULING_INFO).then(WidgetHome.success, WidgetHome.error);
        };

        WidgetHome.onUpdateCallback = function (event) {
          if (event && event.tag === TAG_NAMES.SCHEDULING_INFO) {
            WidgetHome.data = event.data;
            if (WidgetHome.data&&!WidgetHome.data.design)
              WidgetHome.data.design = {};
            if (WidgetHome.data&&!WidgetHome.data.content)
              WidgetHome.data.content = {};
          }
        };

        DataStore.onUpdate().then(null, null, WidgetHome.onUpdateCallback);

        WidgetHome.init();

      }])
      .filter('returnUrl', ['$sce', function ($sce) {
        return function (url) {
          return $sce.trustAsResourceUrl(url+"?noframe=true&skipHeaderFooter=true");
        }
      }]);
})(window.angular);
