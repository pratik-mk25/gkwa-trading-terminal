//'use strict';

angular.module('dashboardstats').
component('dashboardstats',{
templateUrl:'/static/scripts/templates/dashboard_stats_app.html',
controller:function(
	getDashboardGapSummaryService,
	getMarketViewChangeServiceAnnual,
	getMarketViewChangeServiceQuarter,
	getMarketViewChangeServiceMonth, 
	getDashboardHeatmapDataService, 
	getDashboardHeatmapDataServiceOpenClose, 
	getDashboardStatsDataService, 
	getDashboardLastRefreshDatetimeService,
	getMarketViewChangeService , 
	getMarketViewChangeServiceWeek, 
	getMarketViewChangeServiceFut, 
	getMarketViewChangeServiceFutWeek, 
	getMarketViewChangeSpotFutService,
	$rootScope, 
	$scope, 
	$http, 
	$interval )
{
	if ($rootScope.user_permission['NEOTRADER_PRO']) {
		$scope.$on("$destroy", function(){
		try {
			clearTimeout(d_stats_data_set_timeout);
			clearTimeout(d_refresh_datetime_data_set_timeout);
		}
		catch(err) {
			console.log(err)
		}
		$scope.$destroy();
		});

		$scope.clear = function (){
			try {
				clearTimeout(d_stats_data_set_timeout);
				clearTimeout(d_refresh_datetime_data_set_timeout);
			}
			catch(err) {
				console.log(err)
			}
		};

		// $("#clear").click(function () {
		// 	console.log("dashboard controller destroy called");
		// 	try {
		// 		clearTimeout(d_stats_data_set_timeout);
		// 		clearTimeout(d_refresh_datetime_data_set_timeout);
		// 	}
		// 	catch(err) {
		// 		console.log(err)
		// 	}
		// });

		var d_stats_data_set_timeout;
		// Refresh DateTime Coding ///

		$scope.lrdatetime = null;
		var d_refresh_datetime_data_set_timeout;

		$scope.last_refresh_datetime = function () {
			var getlastDatatime = getDashboardLastRefreshDatetimeService.getData();
			getlastDatatime.then(function (data) {
			$scope.dashboard_last_datetime = data;
			refresh_datetime();
			if (
				new Date().toLocaleTimeString("en-US", {
				hour12: false,
				hour: "numeric",
				minute: "numeric",
				}) < "16:00" &&
				new Date().toLocaleTimeString("en-US", {
				hour12: false,
				hour: "numeric",
				minute: "numeric",
				}) > "09:00"
			) {
				d_refresh_datetime_data_set_timeout = setTimeout(function () {
				$scope.last_refresh_datetime();
				}, 10000);
			}
			});
		};

		function refresh_datetime() {
			lrdate = $scope.dashboard_last_datetime.data;
			$.each(lrdate, function (idx, obj1) {
			$.each(obj1, function (idx, obj2) {
				if (idx == "ATTRIBUTE_KEY") {
				$scope.lrdatetime = obj2;
				}
			});
			});
		}

		$scope.last_refresh_datetime();


		// Refresh DateTime Coding Ended //


		// Dashboard Stats Logic Code Starts //
		$scope.dashboard_stats_data = function(index){
			//alert(index);
			var getStatsData = getDashboardStatsDataService.getData();
			getStatsData.then(function(data){
				$scope.dashboard_stats_data_response = data;
				$scope.dashboard_gap_summary_data_function()
				d_stats_data_set_timeout = setTimeout(
					function() {
						$scope.dashboard_stats_data();
					} , 40000);

				});

		};

		$scope.dashboard_stats_data();

		$scope.dashboard_gap_summary_data_function = function(){
			//alert(index);
			if ($rootScope.user_permission.BASIC != false){
				return
			}else
			{
				var getGapSummaryData = getDashboardGapSummaryService.getData();
			}
			getGapSummaryData.then(function(data){
				$scope.dashboard_gap_summary_data = data;
				dashboard_stats();
			});
		};

		function dashboard_stats(){
			json_data = $scope.dashboard_stats_data_response;
			gap_summary_data = $scope.dashboard_gap_summary_data.data;
			stats = [];
			gap_summary = [];
			$.each(json_data.data, function(idx, obj1){
				stats_temp = {};
				$.each(obj1, function(idx, obj2){
					if(idx == "VALUE"){
						stats_temp = obj2;
					}
				});
				stats.push(stats_temp);
			});

			$.each(gap_summary_data, function(idx, obj1){
				gap_summary_temp = {};
				$.each(obj1, function(idx, obj2){
					gap_summary_temp[idx] = obj2;
				});
				gap_summary.push(gap_summary_temp);
			});
			$scope.GAP_DOWN_FOLLOW_THRU = [];
			$scope.GAP_DOWN_NO_FOLLOW_THRU = [];
			$scope.GAP_UP_FOLLOW_THRU = [];
			$scope.GAP_UP_NO_FOLLOW_THRU = [];
			$.each(gap_summary,function (idx,value) {
				if(value.GAP_TYPE == "GAP_DOWN_FOLLOW_THRU"){
					$scope.GAP_DOWN_FOLLOW_THRU.push(value.SYMBOL)
				}
				else if(value.GAP_TYPE == "GAP_DOWN_NO_FOLLOW_THRU"){
					$scope.GAP_DOWN_NO_FOLLOW_THRU.push(value.SYMBOL)
				}
				else if(value.GAP_TYPE == "GAP_UP_FOLLOW_THRU"){
					$scope.GAP_UP_FOLLOW_THRU.push(value.SYMBOL)
				}
				else if(value.GAP_TYPE == "GAP_UP_NO_FOLLOW_THRU"){
					$scope.GAP_UP_NO_FOLLOW_THRU.push(value.SYMBOL)
				}

			})
			$scope.GAP_DOWN_FOLLOW_THRU = _.uniq($scope.GAP_DOWN_FOLLOW_THRU);
			$scope.GAP_DOWN_NO_FOLLOW_THRU = _.uniq($scope.GAP_DOWN_NO_FOLLOW_THRU);
			$scope.GAP_UP_FOLLOW_THRU = _.uniq($scope.GAP_UP_FOLLOW_THRU);
			$scope.GAP_UP_NO_FOLLOW_THRU = _.uniq($scope.GAP_UP_NO_FOLLOW_THRU);

			$scope.count_0_2 = stats[0];
			$scope.count_2_3 = stats[1];
			$scope.count_3_4 = stats[2];
			$scope.count_4_5 = stats[3];
			$scope.count_5 = stats[4];
			$scope._count_0_2 = stats[5];
			$scope._count_2_3 = stats[6];
			$scope._count_3_4 = stats[7];
			$scope._count_4_5 = stats[8];
			$scope._count_5 = stats[9];
			$scope.R4 = stats[10];
			$scope.R3_R4 = stats[11];
			$scope.R2_R3 = stats[12];
			$scope.R1_R2 = stats[13];
			$scope.S4 = stats[14];
			$scope.S3_S4 = stats[15];
			$scope.S2_S3 = stats[16];
			$scope.S1_S2 = stats[17];
			$scope.P_S1 = stats[18];
			$scope.P_R1 = stats[19];
			$scope.count_0_2_close = stats[20];
			$scope.count_2_3_close = stats[21];
			$scope.count_3_4_close = stats[22];
			$scope.count_4_5_close = stats[23];
			$scope.count_5_close = stats[24];
			$scope._count_0_2_close = stats[25];
			$scope._count_2_3_close = stats[26];
			$scope._count_3_4_close = stats[27];
			$scope._count_4_5_close = stats[28];
			$scope._count_5_close = stats[29];
			$scope.gap_up_follow_through = stats[30];
			$scope.gap_down_follow_through = stats[31];
			$scope.gap_up_no_follow_through = stats[32];
			$scope.gap_down_no_follow_through = stats[33];
			$scope.cloud_above = stats[34];
			$scope.cloud_below = stats[35];
			$scope.trident_buy = stats[36];
			$scope.trident_sell = stats[37];

			$scope.nifty_straddle_price = stats[38].toFixed(2);
			$scope.nifty_straddle_price_low = stats[39];
			$scope.nifty_straddle_price_high = stats[40];
			$scope.nifty_straddle_price_prev = stats[41];
			$scope.nifty_straddle_price_chg_prev = stats[42];

			$scope.nifty_strangle_price = stats[43].toFixed(2);
			$scope.nifty_strangle_price_high = stats[44];
			$scope.nifty_strangle_price_low = stats[45];
			$scope.nifty_strangle_price_prev = stats[46];
			$scope.nifty_strangle_price_chg_prev = stats[47];

			json_data = null;
			stats = null;

		};
		// Dashboard Stats Logic Code Ends //
	} 
}
});
	