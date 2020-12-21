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
            let urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has("bookingUrl")) {
              WidgetHome.data = {
                content: {
                  custom: urlParams.get("bookingUrl")
                }
              }
            } else if (result.data && result.id) {
              WidgetHome.data = result.data;
              if (!WidgetHome.data.content)
                WidgetHome.data.content = {};
            } else {
              WidgetHome.data = {
                content: {}
              };
              var dummyData = {
                custom: "https://awesomeninja.youcanbook.me/",
                subDomain: "awesomeninja"
              };
              WidgetHome.data.content.custom = dummyData.custom;
              WidgetHome.data.content.subDomain = dummyData.subDomain;
            }

            buildfire.getContext(function (err, context) {
              if (context) {
                if (WidgetHome.data.content.custom && context.device.platform == "web") {
                  WidgetHome.isWebPlatform = true;
                } else {
                  if (WidgetHome.data.content.custom){
                    buildfire.navigation.openWindow(WidgetHome.data.content.custom, "_blank");
                    buildfire.navigation.goBack();
                  }
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
