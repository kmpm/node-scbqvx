'use strict';
var explorerApp = angular.module('explorerApp', ['ngAnimate', 'ui.router', 'ui.bootstrap', 'ncy-angular-breadcrumb', 'explorerControllers', 'explorerServices']);

explorerApp.run(['$rootScope', '$state', '$stateParams', function ($rootScope,   $state,   $stateParams) {

    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
    // to active whenever 'contacts.list' or one of its decendents is active.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }
]);

explorerApp.config(function($breadcrumbProvider) {
  $breadcrumbProvider.setOptions({
    prefixStateName: 'subject',
    // template: 'bootstrap3'
  });
})
.config(function($stateProvider, $urlRouterProvider){
  // For any unmatched url, send to /start
  $urlRouterProvider.otherwise("/subject")

  $stateProvider
    .state('subject', {
        url: "/subject",
        templateUrl: "/explorer/templates/subject_list.html",
        controller: 'SubjectListCtrl',
        ncyBreadcrumb: {
          label: 'Subjects'
        }
    })
    .state('subject.level', {
      url: '/{subjectId}/level',
      templateUrl : '/explorer/templates/level_list.html',
      controller: 'LevelListCtrl',
      ncyBreadcrumb: {
          label: '{{$stateParams.subjectId}}'
      }
    })
    .state('subject.level.next', {
      url: '/{levelId}',
      templateUrl: '/explorer/templates/level_detail.html',
      controller: 'LevelCtrl',
      ncyBreadcrumb: {
          label: '{{$stateParams.levelId}}'
      }
    })
    .state('subject.level.next.table', {
      url: '/{tableId}',
      templateUrl: '/explorer/templates/table_meta.html',
      controller: 'TableCtrl',
      ncyBreadcrumb: {
          label: '{{$stateParams.tableId}}'
      }
    });


    //   .state('route1.list', {
    //       url: "/list",
    //       templateUrl: "route1.list.html",
    //       controller: function($scope){
    //         $scope.items = ["A", "List", "Of", "Items"];
    //       }
    //   })
    //
    // .state('route2', {
    //     url: "/route2",
    //     templateUrl: "route2.html"
    // })
    //   .state('route2.list', {
    //       url: "/list",
    //       templateUrl: "route2.list.html",
    //       controller: function($scope){
    //         $scope.things = ["A", "Set", "Of", "Things"];
    //       }
    //   })
})
