'use strict';

(function (angular, buildfire) {
  angular.module('youCanBookMePluginWidget', ['ui.bootstrap'])
    .controller('WidgetHomeCtrl', ['$scope', 'Buildfire', 'DataStore', 'TAG_NAMES', 'STATUS_CODE',
      function ($scope, Buildfire, DataStore, TAG_NAMES, STATUS_CODE) {
        var WidgetHome = this;
        WidgetHome.isWebPlatform = false;
        /*
         * Fetch user's data from datastore
         */
        WidgetHome.init = function () {
          WidgetHome.success = function (result) {
            WidgetHome.data = result.data;
            if (!WidgetHome.data.content)
              WidgetHome.data.content = {};
            buildfire.getContext(function (err, context) {
              if (context) {
                if (WidgetHome.data.content.custom && context.device.platform == "web") {
                  WidgetHome.isWebPlatform = true;
                } else {
                  if (WidgetHome.data.content.custom)
                    buildfire.navigation.openWindow(WidgetHome.data.content.custom, "_blank");
                }
              }
              else {
                console.log("Error getting context: ", err);
              }

            });
          };
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
            if (WidgetHome.data && !WidgetHome.data.design)
              WidgetHome.data.design = {};
            if (WidgetHome.data && !WidgetHome.data.content)
              WidgetHome.data.content = {};
          }
        };

        DataStore.onUpdate().then(null, null, WidgetHome.onUpdateCallback);

        WidgetHome.init();

      }])
    .filter('returnUrl', ['$sce', function ($sce) {
      return function (url) {
        return $sce.trustAsResourceUrl(url + "?noframe=true&skipHeaderFooter=true");
      }
    }]);
})(window.angular, window.buildfire);
