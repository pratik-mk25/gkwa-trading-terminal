angular
    .module('app')
	.service('getDashboardHeatmapDataService',['$http','$q', function($http, $q){
		//var deferobject;
		//console.log('In Inside Service');
		var getDashboardHeatMapData = {

			getData: function(){
				var promise = $http.get('/dashboard/Live_HeatMap/?format=json');
				var deferobject = $q.defer();
				//console.log('In Inside getData function');
				promise.then(function(response){deferobject.resolve(response.data);});
				return deferobject.promise;

			}

		};
		return getDashboardHeatMapData;

	}])
  .service('getDashboardHeatmapDataServiceOpenClose',['$http','$q', function($http, $q){
		//var deferobject;
		//console.log('In Inside Service');
		var getDashboardHeatMapDataOpen = {

			getData: function(){
        // var promise = $http.get('/dashboard/Live_HeatMap_Open_Close/?format=json');
				var promise = $http.get('/dashboard/Live_HeatMap_Open_Close/?format=json');
				var deferobject = $q.defer();
				//console.log('In Inside getData function');
				promise.then(function(response){deferobject.resolve(response.data);});
				return deferobject.promise;

			}

		};
		return getDashboardHeatMapDataOpen;

	}])
	.service('getDashboardStatsDataService',['$http','$q', function($http, $q){
		//var deferobject;
		//console.log('In Inside Service');
		var getDashboardStatsData = {

			getData: function(){
				var promise = $http.get('/dashboard/Dashboard_Stats_Getdata/?format=json');
				var deferobject = $q.defer();
				//console.log('In Inside getData function');
				promise.then(function(response){deferobject.resolve(response.data);});
				return deferobject.promise;

			}

		};
		return getDashboardStatsData;

	}])
	.service('getDashboardGapSummaryService',['$http','$q', function($http, $q){
		//var deferobject;
		//console.log('In Inside Service');
		var getDashboardGapSummaryData = {

			getData: function(){
				var promise = $http.get('/dashboard/Dashboard_Gap_Summary_Getdata/?format=json');
				var deferobject = $q.defer();
				//console.log('In Inside getData function');
				promise.then(function(response){deferobject.resolve(response.data);});
				return deferobject.promise;

			}

		};
		return getDashboardGapSummaryData;

	}])

	.service('getDashboardLastRefreshDatetimeService',['$http','$q', function($http, $q){
		var getDashboardLastRefreshDatetime = {

			getData: function(){
        // var promise = $http.get('/dashboard/Dashboard_Last_Refresh_Datetime/?format=json');

        var promise = $http.get('/dashboard/Dashboard_Last_Refresh_Datetime/?format=json');
				var deferobject = $q.defer();
				//console.log('In Inside getData function');
				promise.then(function(response){deferobject.resolve(response.data);});
				return deferobject.promise;

			}

		};
		return getDashboardLastRefreshDatetime;

	}]);
