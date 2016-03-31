'use strict';


var explorerControllers = angular.module('explorerControllers', []);


explorerControllers.controller('SubjectListCtrl', ['$scope', '$rootScope', 'Subject', function ($scope, $rootScope, Subject) {
  $scope.selected = $scope.selected || {};
  $scope.subjects = Subject.query();
}]);

explorerControllers.controller('LevelListCtrl', ['$scope', '$rootScope', 'Level', '$filter', function ($scope, $rootScope, Level, $filter) {
  console.log('LevelListCtrl');
  $scope.selected = $scope.selected || {};
  $scope.selected.subjectId = $rootScope.$stateParams.subjectId

  $scope.subject = $filter('filter')($scope.subjects, {id: $scope.selected.subjectId})[0];

  if ($scope.selected.subjectId) {
    $scope.levels = Level.query({subjectId: $scope.selected.subjectId});
  }
}]);



explorerControllers.controller('LevelCtrl', ['$scope', '$rootScope', 'Level', function ($scope, $rootScope, Level) {
  console.log('LevelCtrl');
  $scope.selected = $scope.selected || {};
  $scope.selected.levelId = $rootScope.$stateParams.levelId;

  $scope.tables = Level.query({subjectId: $scope.selected.subjectId, levelId: $scope.selected.levelId})
}]);


explorerControllers.controller('TableCtrl', ['$scope', '$rootScope', 'Table', function ($scope, $rootScope, Table) {
  console.log('LevelCtrl');
  $scope.selected = $scope.selected || {};
  $scope.selected.tableId = $rootScope.$stateParams.tableId;

  $scope.meta = Table.query({subjectId: $scope.selected.subjectId, levelId: $scope.selected.levelId, tableId: $scope.selected.tableId});
}]);
