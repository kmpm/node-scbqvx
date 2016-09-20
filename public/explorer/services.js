'use strict';

var explorerServices = angular.module('explorerServices', ['ngResource']);

explorerServices.factory('Subject', ['$resource',
  function($resource){
  return $resource('subject/:subjectId', {}, {
      query: {method:'GET', params:{subjectId:''}, isArray:true}
    });
  }]);


explorerServices.factory('Level', ['$resource',
  function($resource){
  return $resource('subject/:subjectId/level/:levelId', {}, {
      query: {method:'GET', params:{levelId:''}, isArray:true}
    });
  }]);

explorerServices.factory('Table', ['$resource',
  function($resource){
  return $resource('subject/:subjectId/level/:levelId/:tableId', {}, {
      query: {method:'GET', params:{tableId:''}, isArray:false}
    });
  }]);

//TODO: ScbQuery
/* 
 * Some kind of query that does what is described at http://www.scb.se/sv_/Om-SCB/Oppna-data-API/API-for-Statistikdatabasen/ 
 */
