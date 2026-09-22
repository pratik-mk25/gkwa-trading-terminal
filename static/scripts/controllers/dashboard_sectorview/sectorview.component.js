//'use strict';

angular.module('sectorview').
component('sectorview',{
	templateUrl:'/static/scripts/templates/dashboard_sectorview_app.html',
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
	instrumentsOfSector,
	$rootScope, 
	$scope, 
	$http, 
	$interval)
	{
	if ($rootScope.user_permission['NEOTRADER_PRO']) {
		$scope.len_1 ;
		$scope.ChangeValue = ["Close"];
		$scope.SelectChangeValue = $scope.ChangeValue[0];
		$scope.size_of_each_bar_of_char = 23

		$scope.$on("$destroy", function(){
			try {
				clearTimeout(d_refresh_datetime_data_set_timeout);
				clearTimeout(d_market_view_change_data_interval_1);
			}
			catch(err) {
			}
			$scope.$destroy();
		});

		$scope.clear = function (){
			try {
				clearTimeout(d_refresh_datetime_data_set_timeout);
				clearTimeout(d_market_view_change_data_interval_1);
			}
			catch(err) {
			}
		};

		// Drop down for Timeframe value //

		function SetDropdownValues()
		{
			if(typeof $rootScope.GlobalExclusionList !== "undefined")
			{
				$scope.IndexValue = $rootScope.GetSpecificDropdownValues($rootScope.GlobalExclusionList.concat([]))
				if(typeof $scope.SelectIndexValue === "undefined")
				{
					$scope.SelectIndexValue = $scope.IndexValue[5];
				}
				else
				{

					if($scope.LastSelectUniverseIndex+1 > $scope.IndexValue.length)
					{
						$scope.SelectIndexValue = $scope.IndexValue[$scope.LastSelectUniverseIndex-1];
					}
					else
					{
						$scope.SelectIndexValue = $scope.IndexValue[$scope.LastSelectUniverseIndex];
					}

				}

				return
			}
			else
			{
				setTimeout(function(){ SetDropdownValues(); }, 100);
			}
		}

		SetDropdownValues();

		$http.get('/check_groups/').then(
			function(response){
				$scope.user_profile = response.data;
				if (!$scope.user_profile.CORPORATELITE){
					$scope.ChangeValue = ["Close","Open"];
					$scope.SelectChangeValue = $scope.ChangeValue[0];

				}
			});

		$scope.DataValue = ["Day","Week","Month","Quarter","Annual"];
		$scope.SelectDataValue = $scope.DataValue[0];

		$scope.service_response = null;

		$scope.DataValue_Timelapse = ["Day"];
		$scope.SelectDataValue_Timelapse = $scope.DataValue_Timelapse[0];


		// Drop down for Timeframe value ends //

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

			// ALL SECTORS CLOSE & Open Code starts here //

			var d_market_view_change_data_interval_1;

			function market_view_change_data(data_type, value){

				instrumentsOfSector.getData().then((all_sector_data_response)=>{
					$scope.instrumentsWithSector = all_sector_data_response

					if(data_type == 'Day'){
						var getdataService = getMarketViewChangeServiceFut.getData();
						getdataService.then(function(data){
							$scope.service_response = data;
							if(value == 'Close'){
								marketviewchange_close($scope.service_response);
								marketviewchange_close_stack($scope.service_response);
								marketviewchange_open_stack($scope.service_response);
								$scope.service_response = null;
							}
							if(value == 'Open'){
								marketviewchange_open($scope.service_response);
								marketviewchange_close_stack($scope.service_response);
								marketviewchange_open_stack($scope.service_response);
								$scope.service_response = null;
							}
						});
					}
					if(data_type == 'Week'){
						var getdataService = getMarketViewChangeServiceFutWeek.getData();
						getdataService.then(function(data){
							$scope.service_response = data;
							if(value == 'Close'){
								marketviewchange_close_Week($scope.service_response);
								marketviewchange_close_stack_Week($scope.service_response);
								marketviewchange_open_stack_Week($scope.service_response);
								$scope.service_response = null;
							}
							if(value == 'Open'){
								marketviewchange_open_Week($scope.service_response);
								marketviewchange_close_stack_Week($scope.service_response);
								marketviewchange_open_stack_Week($scope.service_response);
								$scope.service_response = null;
							}
						});
					}
					if(data_type == 'Month'){
						if ($rootScope.user_permission.BASIC != false){
							return
						}else
						{
							var getdataService = getMarketViewChangeServiceMonth.getData();
						}
						getdataService.then(function(data){
							$scope.service_response = data;
							if(value == 'Close'){
								marketviewchange_close_Month($scope.service_response);
								marketviewchange_close_stack_Month($scope.service_response);
								marketviewchange_open_stack_Month($scope.service_response);
								$scope.service_response = null;
	
							}
							if(value == 'Open'){
								marketviewchange_open_Month($scope.service_response);
								marketviewchange_close_stack_Month($scope.service_response);
								marketviewchange_open_stack_Month($scope.service_response);
								$scope.service_response = null;
							}
						});
					};
					if(data_type == 'Quarter'){
						if ($rootScope.user_permission.BASIC != false){
							return
						}else
						{
							var getdataService = getMarketViewChangeServiceQuarter.getData();
						}
						getdataService.then(function(data){
							$scope.service_response = data;
							if(value == 'Close'){
								marketviewchange_close_Quarter($scope.service_response);
								marketviewchange_close_stack_Quarter($scope.service_response);
								marketviewchange_open_stack_Quarter($scope.service_response);
								$scope.service_response = null;
	
							}
							if(value == 'Open'){
								marketviewchange_open_Quarter($scope.service_response);
								marketviewchange_close_stack_Quarter($scope.service_response);
								marketviewchange_open_stack_Quarter($scope.service_response);
								$scope.service_response = null;
							}
						});
					};
					if(data_type == 'Annual'){
						if ($rootScope.user_permission.BASIC != false){
							return
						}else
						{
							var getdataService = getMarketViewChangeServiceAnnual.getData();
						}
						getdataService.then(function(data){
							$scope.service_response = data;
							if(value == 'Close'){
								marketviewchange_close_Annual($scope.service_response);
								marketviewchange_close_stack_Annual($scope.service_response);
								marketviewchange_open_stack_Annual($scope.service_response);
								$scope.service_response = null;
	
							}
							if(value == 'Open'){
								marketviewchange_open_Annual($scope.service_response);
								marketviewchange_close_stack_Annual($scope.service_response);
								marketviewchange_open_stack_Annual($scope.service_response);
								$scope.service_response = null;
							}
						});
	
					};
	
					d_market_view_change_data_interval_1 = setTimeout(
						function() {
							market_view_change_data($scope.SelectDataValue,$scope.SelectChangeValue);
						} , 40000);
		
				})

				

			};

			$scope.market_view_change_data_onchange = function(data_type, value){


				if(data_type == 'Day'){
					var getdataService = getMarketViewChangeServiceFut.getData();
					getdataService.then(function(data){
						$scope.service_response = data;
						if(value == 'Close'){
							marketviewchange_close($scope.service_response);

							$scope.service_response = null;
						}
						if(value == 'Open'){
							marketviewchange_open($scope.service_response);
							$scope.service_response = null;
						}
					});

				};
				if(data_type == 'Week'){
				
					var getdataService = getMarketViewChangeServiceFutWeek.getData();
					getdataService.then(function(data){
						$scope.service_response = data;
						if(value == 'Close'){
							marketviewchange_close_Week($scope.service_response);
							marketviewchange_close_stack_Week($scope.service_response);
							marketviewchange_open_stack_Week($scope.service_response);
							$scope.service_response = null;

						}
						if(value == 'Open'){
							marketviewchange_open_Week($scope.service_response);
							marketviewchange_close_stack_Week($scope.service_response);
							marketviewchange_open_stack_Week($scope.service_response);
							$scope.service_response = null;
						}
					});

				};
				if(data_type == 'Month'){
				

					if ($rootScope.user_permission.BASIC != false){
						return
					}else
					{
						var getdataService = getMarketViewChangeServiceMonth.getData();
					}

					getdataService.then(function(data){

						$scope.service_response = data;
						if(value == 'Close'){

							marketviewchange_close_Month($scope.service_response);


							marketviewchange_close_stack_Month($scope.service_response);
							marketviewchange_open_stack_Month($scope.service_response);
							$scope.service_response = null;

						}
						if(value == 'Open'){
							marketviewchange_open_Month($scope.service_response);
							marketviewchange_close_stack_Month($scope.service_response);
							marketviewchange_open_stack_Month($scope.service_response);
							$scope.service_response = null;
						}
					});


				};
				if(data_type == 'Quarter'){
					
					if ($rootScope.user_permission.BASIC != false){
						return
					}else
					{
						var getdataService = getMarketViewChangeServiceQuarter.getData();
					}
					getdataService.then(function(data){
						$scope.service_response = data;
						if(value == 'Close'){
							marketviewchange_close_Quarter($scope.service_response);

							marketviewchange_close_stack_Quarter($scope.service_response);
							marketviewchange_open_stack_Quarter($scope.service_response);
							$scope.service_response = null;

						}
						if(value == 'Open'){
							marketviewchange_open_Quarter($scope.service_response);
							marketviewchange_close_stack_Quarter($scope.service_response);
							marketviewchange_open_stack_Quarter($scope.service_response);
							$scope.service_response = null;
						}
					});

				};
				if(data_type == 'Annual'){
					
					if ($rootScope.user_permission.BASIC != false){
						return
					}else
					{
						var getdataService = getMarketViewChangeServiceAnnual.getData();
					}
					getdataService.then(function(data){
						$scope.service_response = data;
						if(value == 'Close'){
							marketviewchange_close_Annual($scope.service_response);

							marketviewchange_close_stack_Annual($scope.service_response);
							marketviewchange_open_stack_Annual($scope.service_response);
							$scope.service_response = null;
						}
						if(value == 'Open'){
							marketviewchange_open_Annual($scope.service_response);
							marketviewchange_close_stack_Annual($scope.service_response);
							marketviewchange_open_stack_Annual($scope.service_response);
							$scope.service_response = null;
						}
					});

				};

			};

			function createChartObj(id){

				var chart = AmCharts.makeChart(id, {
					"type": "serial",
					"theme": "light",
					"valueAxes": [{
						"position": "bottom",
						"labelsEnabled": false,
						"gridThickness": 0
					}],
					"startDuration": 0,
					"graphs": [{
						"balloonText": "<span style='font-size:13px;'>[[SYMBOL]]: <b>([[A_DAY_CHG_P]])</b></span>",
						"title": "NAME",
						"type": "column",
						"fillAlphas": 0.8,
						"fillColors": "green",
						"negativeBase": 0,
						"negativeFillColors": "red",
						"valueField": "DAY_CHG_P",
						"colorField": "color",
						"balloon": {
							"fontSize": 8
						}
					}],
					"rotate": true,
					"categoryField": "SYMBOL",
					"autoMargins": false,
					"marginTop": 15,
					"marginBottom": 30,
					"marginLeft": 70,
					"marginRight": 20,
					"categoryAxis": {
						"fontSize": 8,
						"minHorizontalGap": 0,
						"minVerticalGap": 0,
						"gridThickness": 0,
					},
					"export": {
						"enabled": false
					},

				});

				return chart;


			};

			function createChartObj_Week(id){

				var chart = AmCharts.makeChart(id, {
					"type": "serial",
					"theme": "light",
					"valueAxes": [{
						"position": "bottom",
						"labelsEnabled": false,
						"gridThickness": 0
					}],
					"startDuration": 0,
					"graphs": [{
						"balloonText": "<span style='font-size:13px;'>[[SYMBOL]]: <b>([[A_WEEK_CHG_P]])</b></span>",
						"title": "NAME",
						"type": "column",
						"fillAlphas": 0.8,
						"fillColors": "green",
						"negativeBase": 0,
						"negativeFillColors": "red",
						"valueField": "WEEK_CHG_P",
						"colorField": "color",
						"balloon": {
							"fontSize": 8
						}
					}],
					"rotate": true,
					"categoryField": "SYMBOL",
					"autoMargins": false,
					"marginTop": 15,
					"marginBottom": 30,
					"marginLeft": 70,
					"marginRight": 20,
					"categoryAxis": {
						"fontSize": 8,
						"minHorizontalGap": 0,
						"minVerticalGap": 0,
						"gridThickness": 0,
					},
					"export": {
						"enabled": false
					},

				});

				return chart;
			};

			function createChartObj_Month(id){

				var chart = AmCharts.makeChart(id, {
					"type": "serial",
					"theme": "light",
					"valueAxes": [{
						"position": "bottom",
						"labelsEnabled": false,
						"gridThickness": 0
					}],
					"startDuration": 0,
					"graphs": [{
						"balloonText": "<span style='font-size:13px;'>[[SYMBOL]]: <b>([[A_MONTH_CHG_P]])</b></span>",
						"title": "NAME",
						"type": "column",
						"fillAlphas": 0.8,
						"fillColors": "green",
						"negativeBase": 0,
						"negativeFillColors": "red",
						"valueField": "MONTH_CHG_P",
						"colorField": "color",
						"balloon": {
							"fontSize": 8
						}
					}],
					"rotate": true,
					"categoryField": "SYMBOL",
					"autoMargins": false,
					"marginTop": 15,
					"marginBottom": 30,
					"marginLeft": 70,
					"marginRight": 20,
					"categoryAxis": {
						"fontSize": 8,
						"minHorizontalGap": 0,
						"minVerticalGap": 0,
						"gridThickness": 0,
					},
					"export": {
						"enabled": false
					},

				});
				return chart;
			};

			function createChartObj_Quarter(id){

				var chart = AmCharts.makeChart(id, {
					"type": "serial",
					"theme": "light",
					"valueAxes": [{
						"position": "bottom",
						"labelsEnabled": false,
						"gridThickness": 0
					}],
					"startDuration": 0,
					"graphs": [{
						"balloonText": "<span style='font-size:13px;'>[[SYMBOL]]: <b>([[A_QUARTER_CHG_P]])</b></span>",
						"title": "NAME",
						"type": "column",
						"fillAlphas": 0.8,
						"fillColors": "green",
						"negativeBase": 0,
						"negativeFillColors": "red",
						"valueField": "QUARTER_CHG_P",
						"colorField": "color",
						"balloon": {
							"fontSize": 8
						}
					}],
					"rotate": true, ////
					"categoryField": "SYMBOL",
					"autoMargins": false,
					"marginTop": 15,
					"marginBottom": 30,
					"marginLeft": 70,
					"marginRight": 20,
					"categoryAxis": {
						"fontSize": 8,
						"minHorizontalGap": 0,
						"minVerticalGap": 0,
						"gridThickness": 0,
						"labelRotation":90,
					},
					"export": {
						"enabled": false
					},

				});

				return chart;


			};

			function createChartObj_Annual(id){

				var chart = AmCharts.makeChart(id, {
					"type": "serial",
					"theme": "light",
					"valueAxes": [{
						"position": "bottom",
						"labelsEnabled": false,
						"gridThickness": 0
					}],
					"startDuration": 0,
					"graphs": [{
						"balloonText": "<span style='font-size:13px;'>[[SYMBOL]]: <b>([[A_ANNUAL_CHG_P]])</b></span>",
						"title": "NAME",
						"type": "column",
						"fillAlphas": 0.8,
						"fillColors": "green",
						"negativeBase": 0,
						"negativeFillColors": "red",
						"valueField": "ANNUAL_CHG_P",
						"colorField": "color",
						"balloon": {
							"fontSize": 8
						}
					}],
					"rotate": true,
					"categoryField": "SYMBOL",
					"autoMargins": false,
					"marginTop": 15,
					"marginBottom": 30,
					"marginLeft": 70,
					"marginRight": 20,
					"categoryAxis": {
						"fontSize": 8,
						"minHorizontalGap": 0,
						"minVerticalGap": 0,
						"gridThickness": 0,
					},
					"export": {
						"enabled": false
					},

				});

				return chart;


			};

			function createStackChartObj(id){

				var chart = AmCharts.makeChart(id, {
					"type": "serial",
					"theme": "light",
					"valueAxes": [{
						"stackType": "regular",
						"axisAlpha": 0.3,
						"gridAlpha": 0,
						"maximum": 100,
					}],
					"graphs": [{
						"balloonText": "<b>[[group1_range]]</b><br><span style='font-size:14px'>[[sector]]<b>([[countgroup1]]):[[group1]]%</b></span>",
						"fillAlphas": 0.8,
						"labelText": "[[group1]]",
						"lineAlpha": 0.3,
						"title": "< -2",
						"type": "column",
						"color": "#000000",
						"valueField": "group1",
						"fillColors": "#FF0033"
					}, {
						"balloonText": "<b>[[group2_range]]</b><br><span style='font-size:14px'>[[sector]]<b>([[countgroup2]]):[[group2]]%</b></span>",
						"fillAlphas": 0.8,
						"labelText": "[[group2]]",
						"lineAlpha": 0.3,
						"title": "0 to -2",
						"type": "column",
						"color": "#000000",
						"valueField": "group2",
						"fillColors": "#FF9999"
					}, {
						"balloonText": "<b>[[group3_range]]</b><br><span style='font-size:14px'>[[sector]]<b>([[countgroup3]]):[[group3]]%</b></span>",
						"fillAlphas": 0.8,
						"labelText": "[[group3]]",
						"lineAlpha": 0.3,
						"title": "0 to 2",
						"type": "column",
						"color": "#000000",
						"valueField": "group3",
						"fillColors": "#99FFCC"
					}, {
						"balloonText": "<b>[[group4_range]]</b><br><span style='font-size:14px'>[[sector]]<b>([[countgroup4]]):[[group4]]%</b></span>",
						"fillAlphas": 0.8,
						"labelText": "[[group4]]",
						"lineAlpha": 0.3,
						"title": "> 2",
						"type": "column",
						"color": "#000000",
						"valueField": "group4",
						"fillColors": "#00CC99"
					}],

					"categoryField": "sector",
					"categoryAxis": {
						"gridPosition": "start",
						"axisAlpha": 0,
						"gridAlpha": 0,
						"position": "left",
						"labelRotation": "45"

					},



				});
				return chart;

			}

			function setChartData(json_data, sector, type){

				json_data = sectorFilter(json_data,$scope.instrumentsWithSector,sector)

				chartdata = [];

				$.each(json_data, function(idx, obj1) {
					charttmp = {};
					$.each(obj1, function(idx, obj2) {
						if(idx=="SYMBOL"){
							charttmp["SYMBOL"] = obj2;
						};
						if(idx=="SECTOR"){
							charttmp["SECTOR"] = obj2;
						};
						if(idx=="DAY_CLOSE_CHG_P" && type=='Close'){
							charttmp["DAY_CHG_P"] = parseFloat(obj2).toFixed(1);
							if (charttmp["DAY_CHG_P"] > 0){
								charttmp["value"] = 1;
								charttmp["A_DAY_CHG_P"] = charttmp["DAY_CHG_P"];
							}
							else{
								charttmp["value"] = 0;
								charttmp["A_DAY_CHG_P"] = charttmp["DAY_CHG_P"];
								charttmp["DAY_CHG_P"] = charttmp["DAY_CHG_P"] * -1
							}
						};
						if(idx=="DAY_OPEN_CHG_P" && type=='Open'){
							charttmp["DAY_CHG_P"] = parseFloat(obj2).toFixed(1);
							if (charttmp["DAY_CHG_P"] > 0){
								charttmp["value"] = 1;
								charttmp["A_DAY_CHG_P"] = charttmp["DAY_CHG_P"];
							}
							else{
								charttmp["value"] = 0;
								charttmp["A_DAY_CHG_P"] = charttmp["DAY_CHG_P"];
								charttmp["DAY_CHG_P"] = charttmp["DAY_CHG_P"] * -1
							}
						};
						if(idx=="NSE_INDEX"){
							charttmp["NSE_INDEX"] = parseInt(obj2);
						};
						if(idx=="FNO_FLAG"){
							charttmp["FNO_FLAG"] = parseInt(obj2);
						};
					});
					if(charttmp["SECTOR"] == sector){
						chartdata.push(charttmp);
					};

				});
				chartdata = chartdata.sort(function (a, b) {
					var x = a.A_DAY_CHG_P;
					var y = b.A_DAY_CHG_P;

					if (x === 0 && y === 0)
					return 1 / x - 1 / y || 0;
					else return y - x;
				});
				return chartdata;

			}

			function setChartData_Week(json_data, sector, type){
				json_data = sectorFilter(json_data,$scope.instrumentsWithSector,sector)


				chartdata = [];

				$.each(json_data, function(idx, obj1) {
					charttmp = {};
					$.each(obj1, function(idx, obj2) {
						if(idx=="SYMBOL"){
							charttmp["SYMBOL"] = obj2;
						};
						if(idx=="SECTOR"){
							charttmp["SECTOR"] = obj2;
						};
						if(idx=="WEEK_CLOSE_CHG_P" && type=='Close'){
							charttmp["WEEK_CHG_P"] = parseFloat(obj2).toFixed(1);
							if (charttmp["WEEK_CHG_P"] > 0){
								charttmp["value"] = 1;
								charttmp["A_WEEK_CHG_P"] = charttmp["WEEK_CHG_P"];
							}
							else{
								charttmp["value"] = 0;
								charttmp["A_WEEK_CHG_P"] = charttmp["WEEK_CHG_P"];
								charttmp["WEEK_CHG_P"] = charttmp["WEEK_CHG_P"] * -1
							}
						};
						if(idx=="WEEK_OPEN_CHG_P" && type=='Open'){
							charttmp["WEEK_CHG_P"] = parseFloat(obj2).toFixed(1);
							if (charttmp["WEEK_CHG_P"] > 0){
								charttmp["value"] = 1;
								charttmp["A_WEEK_CHG_P"] = charttmp["WEEK_CHG_P"];
							}
							else{
								charttmp["value"] = 0;
								charttmp["A_WEEK_CHG_P"] = charttmp["WEEK_CHG_P"];
								charttmp["WEEK_CHG_P"] = charttmp["WEEK_CHG_P"] * -1
							}
						};
						if(idx=="NSE_INDEX"){
							charttmp["NSE_INDEX"] = parseInt(obj2);
						};
						if(idx=="FNO_FLAG"){
							charttmp["FNO_FLAG"] = parseInt(obj2);
						};
					});

					if(charttmp["SECTOR"] == sector){
						chartdata.push(charttmp);
					};

				});
				chartdata = chartdata.sort(function (a, b) {
					var x = a.A_WEEK_CHG_P;
					var y = b.A_WEEK_CHG_P;

					if (x === 0 && y === 0)
					return 1 / x - 1 / y || 0;
					else return y - x;
				});
				return chartdata;

			}

			function setChartData_Month(json_data, sector, type){
				json_data = sectorFilter(json_data,$scope.instrumentsWithSector,sector)


				chartdata = [];

				$.each(json_data, function(idx, obj1) {
					charttmp = {};
					$.each(obj1, function(idx, obj2) {
						if(idx=="SYMBOL"){
							charttmp["SYMBOL"] = obj2;
						};
						if(idx=="SECTOR"){
							charttmp["SECTOR"] = obj2;
						};
						if(idx=="MONTH_CLOSE_CHG_P" && type=='Close'){
							charttmp["MONTH_CHG_P"] = parseFloat(obj2).toFixed(1);
							if (charttmp["MONTH_CHG_P"] > 0){
								charttmp["value"] = 1;
								charttmp["A_MONTH_CHG_P"] = charttmp["MONTH_CHG_P"];
							}
							else{
								charttmp["value"] = 0;
								charttmp["A_MONTH_CHG_P"] = charttmp["MONTH_CHG_P"];
								charttmp["MONTH_CHG_P"] = charttmp["MONTH_CHG_P"] * -1
							}
						};
						if(idx=="MONTH_OPEN_CHG_P" && type=='Open'){
							charttmp["MONTH_CHG_P"] = parseFloat(obj2).toFixed(1);
							if (charttmp["MONTH_CHG_P"] > 0){
								charttmp["value"] = 1;
								charttmp["A_MONTH_CHG_P"] = charttmp["MONTH_CHG_P"];
							}
							else{
								charttmp["value"] = 0;
								charttmp["A_MONTH_CHG_P"] = charttmp["MONTH_CHG_P"];
								charttmp["MONTH_CHG_P"] = charttmp["MONTH_CHG_P"] * -1
							}
						};
						if(idx=="NSE_INDEX"){
							charttmp["NSE_INDEX"] = parseInt(obj2);
						};
						if(idx=="FNO_FLAG"){
							charttmp["FNO_FLAG"] = parseInt(obj2);
						};
					});
					if(charttmp["SECTOR"] == sector){
						chartdata.push(charttmp);
					};

				});
				chartdata = chartdata.sort(function (a, b) {
					var x = a.A_MONTH_CHG_P;
					var y = b.A_MONTH_CHG_P;

					if (x === 0 && y === 0)
					return 1 / x - 1 / y || 0;
					else return y - x;
				});
				return chartdata;

			}

			function setChartData_Quarter(json_data, sector, type){
				json_data = sectorFilter(json_data,$scope.instrumentsWithSector,sector)


				chartdata = [];
				$.each(json_data, function(idx, obj1) {
					charttmp = {};
					$.each(obj1, function(idx, obj2) {
						if(idx=="SYMBOL"){
							charttmp["SYMBOL"] = obj2;
						};
						if(idx=="SECTOR"){
							charttmp["SECTOR"] = obj2;
						};
						if(idx=="QUARTER_CLOSE_CHG_P" && type=='Close'){
							charttmp["QUARTER_CHG_P"] = parseFloat(obj2).toFixed(1);
							if (charttmp["QUARTER_CHG_P"] > 0){
								charttmp["value"] = 1;
								charttmp["A_QUARTER_CHG_P"] = charttmp["QUARTER_CHG_P"];
							}
							else{
								charttmp["value"] = 0;
								charttmp["A_QUARTER_CHG_P"] = charttmp["QUARTER_CHG_P"];
								charttmp["QUARTER_CHG_P"] = charttmp["QUARTER_CHG_P"] * -1
							}
						};
						if(idx=="QUARTER_OPEN_CHG_P" && type=='Open'){
							charttmp["QUARTER_CHG_P"] = parseFloat(obj2).toFixed(1);
							if (charttmp["QUARTER_CHG_P"] > 0){
								charttmp["value"] = 1;
								charttmp["A_QUARTER_CHG_P"] = charttmp["QUARTER_CHG_P"];
							}
							else{
								charttmp["value"] = 0;
								charttmp["A_QUARTER_CHG_P"] = charttmp["QUARTER_CHG_P"];
								charttmp["QUARTER_CHG_P"] = charttmp["QUARTER_CHG_P"] * -1
							}
						};
						if(idx=="NSE_INDEX"){
							charttmp["NSE_INDEX"] = parseInt(obj2);
						};
						if(idx=="FNO_FLAG"){
							charttmp["FNO_FLAG"] = parseInt(obj2);
						};
					});
					if(charttmp["SECTOR"] == sector){
						chartdata.push(charttmp);
					};

				});
				chartdata = chartdata.sort(function (a, b) {
					var x = a.A_QUARTER_CHG_P;
					var y = b.A_QUARTER_CHG_P;

					if (x === 0 && y === 0)
					return 1 / x - 1 / y || 0;
					else return y - x;
				});
				return chartdata;

			}

			function setChartData_Annual(json_data, sector, type){
				json_data = sectorFilter(json_data,$scope.instrumentsWithSector,sector)


				chartdata = [];

				$.each(json_data, function(idx, obj1) {
					charttmp = {};
					$.each(obj1, function(idx, obj2) {
						if(idx=="SYMBOL"){
							charttmp["SYMBOL"] = obj2;
						};
						if(idx=="SECTOR"){
							charttmp["SECTOR"] = obj2;
						};
						if(idx=="ANNUAL_CLOSE_CHG_P" && type=='Close'){
							charttmp["ANNUAL_CHG_P"] = parseFloat(obj2).toFixed(1);
							if (charttmp["ANNUAL_CHG_P"] > 0){
								charttmp["value"] = 1;
								charttmp["A_ANNUAL_CHG_P"] = charttmp["ANNUAL_CHG_P"];
							}
							else{
								charttmp["value"] = 0;
								charttmp["A_ANNUAL_CHG_P"] = charttmp["ANNUAL_CHG_P"];
								charttmp["ANNUAL_CHG_P"] = charttmp["ANNUAL_CHG_P"] * -1
							}
						};
						if(idx=="ANNUAL_OPEN_CHG_P" && type=='Open'){
							charttmp["ANNUAL_CHG_P"] = parseFloat(obj2).toFixed(1);
							if (charttmp["ANNUAL_CHG_P"] > 0){
								charttmp["value"] = 1;
								charttmp["A_ANNUAL_CHG_P"] = charttmp["ANNUAL_CHG_P"];
							}
							else{
								charttmp["value"] = 0;
								charttmp["A_ANNUAL_CHG_P"] = charttmp["ANNUAL_CHG_P"];
								charttmp["ANNUAL_CHG_P"] = charttmp["ANNUAL_CHG_P"] * -1
							}
						};
						if(idx=="NSE_INDEX"){
							charttmp["NSE_INDEX"] = parseInt(obj2);
						};
						if(idx=="FNO_FLAG"){
							charttmp["FNO_FLAG"] = parseInt(obj2);
						};
					});
					if(charttmp["SECTOR"] == sector){
						chartdata.push(charttmp);
					};

				});
				chartdata = chartdata.sort(function (a, b) {
					var x = a.A_ANNUAL_CHG_P;
					var y = b.A_ANNUAL_CHG_P;

					if (x === 0 && y === 0)
					return 1 / x - 1 / y || 0;
					else return y - x;
				});
				return chartdata;

			}

			function setChartHeight(id,number_of_elements){
				if(number_of_elements<=2){
					$(id).css("height", (number_of_elements*40).toString().concat("px"));
				}else if(number_of_elements==3){
					$(id).css("height", (number_of_elements*36).toString().concat("px"));

				}else if(number_of_elements==4){
					$(id).css("height", (number_of_elements*33).toString().concat("px"));


				}else if(number_of_elements === 5 || number_of_elements === 6){
					$(id).css("height", (number_of_elements*28).toString().concat("px"));


				}else{
					$(id).css("height", (number_of_elements*$scope.size_of_each_bar_of_char).toString().concat("px"));
				}
			}

			function marketviewchange_close(data){
				json_data = data;
				NAME = [];
				CHGPCT = [];
				CHGPCTSTR = [];
				COLOR = [];
				LTP = [];
				LTPSTR = [];
				chartdata_auto = [];
				chartdata_it = [];
				chartdata_bank = [];
				chartdata_finance = [];
				chartdata_indus_mfg = [];
				chartdata_fmcg = [];
				chartdata_cement = [];
				chartdata_chemical = [];
				chartdata_construction = [];
				chartdata_energy = [];
				chartdata_metals = [];
				chartdata_pharma = [];
				chartdata_media = [];
				chartdata_realty = [];
				chartdata_textiles = [];
				chartdata_telecom = [];
				chartdata_healthcare = [];
				chartdata_others = [];

				chart_auto = createChartObj('m_chart_auto_sector_view');
				chartdata_auto = setChartData(json_data, 'AUTO', 'Close');
				setChartHeight('#m_chart_auto_sector_view',chartdata_auto.length);

				$scope.autolenght = Object.keys(chartdata_auto).length;
				$scope.chartdata_auto_close_final = JSON.stringify(chartdata_auto);
				chart_auto.dataProvider = eval($scope.chartdata_auto_close_final);
				chartdata_auto = null;
				$scope.chartdata_auto_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_auto.dataProvider[i].value == 1){
						chart_auto.dataProvider[i].color = "green";
					}
					else{
						chart_auto.dataProvider[i].color = "red";
					}
				}
				chart_auto.validateData();


				chart_fmcg = createChartObj('m_chart_fmcg_sector_view');
				chartdata_fmcg = setChartData(json_data, 'FMCG', 'Close');
				setChartHeight('#m_chart_fmcg_sector_view',chartdata_fmcg.length);
				$scope.autolenght = Object.keys(chartdata_fmcg).length;
				$scope.chartdata_fmcg_close_final = JSON.stringify(chartdata_fmcg);
				chart_fmcg.dataProvider = eval($scope.chartdata_fmcg_close_final);
				chartdata_fmcg = null;
				$scope.chartdata_fmcg_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_fmcg.dataProvider[i].value == 1){
						chart_fmcg.dataProvider[i].color = "green";
					}
					else{
						chart_fmcg.dataProvider[i].color = "red";
					}
				}
				chart_fmcg.validateData();

				chart_pvt_bank = createChartObj('m_chart_pvt_bank_sector_view');
				chartdata_pvt_bank = setChartData(json_data, 'PVT BANK', 'Close');
				setChartHeight('#m_chart_pvt_bank_sector_view',chartdata_pvt_bank.length);

				$scope.autolenght = Object.keys(chartdata_pvt_bank).length;
				$scope.chartdata_pvt_bank_close_final = JSON.stringify(chartdata_pvt_bank);
				chart_pvt_bank.dataProvider = eval($scope.chartdata_pvt_bank_close_final);
				chartdata_pvt_bank = null;
				$scope.chartdata_pvt_bank_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pvt_bank.dataProvider[i].value == 1){
						chart_pvt_bank.dataProvider[i].color = "green";
					}
					else{
						chart_pvt_bank.dataProvider[i].color = "red";
					}
				}
				chart_pvt_bank.validateData();


				chart_finance = createChartObj('m_chart_finance_sector_view');
				chartdata_finance = setChartData(json_data, 'FIN-SERV', 'Close');
				$scope.len_1 = chartdata_finance.length
				setChartHeight('#m_chart_finance_sector_view',chartdata_finance.length);
				$scope.autolenght = Object.keys(chartdata_finance).length;
				$scope.chartdata_finance_close_final = JSON.stringify(chartdata_finance);
				chart_finance.dataProvider = eval($scope.chartdata_finance_close_final);
				chartdata_finance = null;
				$scope.chartdata_finance_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_finance.dataProvider[i].value == 1){
						chart_finance.dataProvider[i].color = "green";
					}
					else{
						chart_finance.dataProvider[i].color = "red";
					}
				}
				chart_finance.validateData();

				chart_psu_bank = createChartObj('m_chart_psu_bank_sector_view');
				chartdata_psu_bank = setChartData(json_data, 'PSU BANK', 'Close');
				setChartHeight('#m_chart_psu_bank_sector_view',chartdata_psu_bank.length);
				$scope.autolenght = Object.keys(chartdata_psu_bank).length;
				$scope.chartdata_psu_bank_close_final = JSON.stringify(chartdata_psu_bank);
				chart_psu_bank.dataProvider = eval($scope.chartdata_psu_bank_close_final);
				chartdata_psu_bank = null;
				$scope.chartdata_psu_bank_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_psu_bank.dataProvider[i].value == 1){
						chart_psu_bank.dataProvider[i].color = "green";
					}
					else{
						chart_psu_bank.dataProvider[i].color = "red";
					}
				}
				chart_psu_bank.validateData();


				
				chart_it = createChartObj('m_chart_it_sector_view');
				chartdata_it = setChartData(json_data, 'IT', 'Close');
				setChartHeight('#m_chart_it_sector_view',chartdata_it.length);
				$scope.autolenght = Object.keys(chartdata_it).length;
				$scope.chartdata_it_close_final = JSON.stringify(chartdata_it);
				chart_it.dataProvider = eval($scope.chartdata_it_close_final);
				chartdata_it = null;
				$scope.chartdata_it_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_it.dataProvider[i].value == 1){
						chart_it.dataProvider[i].color = "green";
					}
					else{
						chart_it.dataProvider[i].color = "red";
					}
				}
				chart_it.validateData();

				let chartdata_infra = []
				chart_infra = createChartObj('m_chart_infra_sector_view');
				chartdata_infra = setChartData(json_data, 'INFRA', 'Close');
				setChartHeight('#m_chart_infra_sector_view',chartdata_infra.length);
				$scope.autolenght = Object.keys(chartdata_infra).length;
				$scope.chartdata_infra_close_final = JSON.stringify(chartdata_infra);
				chart_infra.dataProvider = eval($scope.chartdata_infra_close_final);
				chartdata_infra = null;
				$scope.chartdata_infra_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_infra.dataProvider[i].value == 1){
						chart_infra.dataProvider[i].color = "green";
					}
					else{
						chart_infra.dataProvider[i].color = "red";
					}
				}
				chart_infra.validateData();

				chart_metals = createChartObj('m_chart_metals_sector_view');
				chartdata_metals = setChartData(json_data, 'METAL', 'Close');
				setChartHeight('#m_chart_metals_sector_view',chartdata_metals.length);

				$scope.autolenght = Object.keys(chartdata_metals).length;
				$scope.chartdata_metals_close_final = JSON.stringify(chartdata_metals);
				chart_metals.dataProvider = eval($scope.chartdata_metals_close_final);
				chartdata_metals = null;
				$scope.chartdata_metals_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_metals.dataProvider[i].value == 1){
						chart_metals.dataProvider[i].color = "green";
					}
					else{
						chart_metals.dataProvider[i].color = "red";
					}
				}
				chart_metals.validateData();


				chart_pharma = createChartObj('m_chart_pharma_sector_view');
				chartdata_pharma = setChartData(json_data, 'PHARMA', 'Close');
				setChartHeight('#m_chart_pharma_sector_view',chartdata_pharma.length);
				$scope.autolenght = Object.keys(chartdata_pharma).length;
				$scope.chartdata_pharma_close_final = JSON.stringify(chartdata_pharma);
				chart_pharma.dataProvider = eval($scope.chartdata_pharma_close_final);
				chartdata_pharma = null;
				$scope.chartdata_pharma_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pharma.dataProvider[i].value == 1){
						chart_pharma.dataProvider[i].color = "green";
					}
					else{
						chart_pharma.dataProvider[i].color = "red";
					}
				}
				chart_pharma.validateData();



				
				chart_realty = createChartObj('m_chart_realty_sector_view');
				chartdata_realty = setChartData(json_data, 'REALTY', 'Close');
				setChartHeight('#m_chart_realty_sector_view',chartdata_realty.length);
				$scope.autolenght = Object.keys(chartdata_realty).length;
				$scope.chartdata_realty_close_final = JSON.stringify(chartdata_realty);
				chart_realty.dataProvider = eval($scope.chartdata_realty_close_final);
				chartdata_realty = null;
				$scope.chartdata_realty_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_realty.dataProvider[i].value == 1){
						chart_realty.dataProvider[i].color = "green";
					}
					else{
						chart_realty.dataProvider[i].color = "red";
					}
				}
				chart_realty.validateData();





				let chartdata_commodities = []
				chart_commodities = createChartObj('m_chart_commodities_sector_view');
				chartdata_commodities = setChartData(json_data, 'COMMODITIES', 'Close');
				setChartHeight('#m_chart_commodities_sector_view',chartdata_commodities.length);
				$scope.autolenght = Object.keys(chartdata_commodities).length;
				$scope.chartdata_commodities_close_final = JSON.stringify(chartdata_commodities);
				chart_commodities.dataProvider = eval($scope.chartdata_commodities_close_final);
				chartdata_commodities = null;
				$scope.chartdata_commodities_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_commodities.dataProvider[i].value == 1){
						chart_commodities.dataProvider[i].color = "green";
					}
					else{
						chart_commodities.dataProvider[i].color = "red";
					}
				}
				chart_commodities.validateData();

				
				let chartdata_consumption = []
				chart_consumption = createChartObj('m_chart_consumption_sector_view');
				chartdata_consumption = setChartData(json_data, 'CONSUMPTION', 'Close');
				setChartHeight('#m_chart_consumption_sector_view',chartdata_consumption.length);
				$scope.autolenght = Object.keys(chartdata_consumption).length;
				$scope.chartdata_consumption_close_final = JSON.stringify(chartdata_consumption);
				chart_consumption.dataProvider = eval($scope.chartdata_consumption_close_final);
				chartdata_consumption = null;
				$scope.chartdata_consumption_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_consumption.dataProvider[i].value == 1){
						chart_consumption.dataProvider[i].color = "green";
					}
					else{
						chart_consumption.dataProvider[i].color = "red";
					}
				}
				chart_consumption.validateData();


				chart_energy = createChartObj('m_chart_energy_sector_view');
				chartdata_energy = setChartData(json_data, 'ENERGY', 'Close');
				setChartHeight('#m_chart_energy_sector_view',chartdata_energy.length);
				$scope.autolenght = Object.keys(chartdata_energy).length;
				$scope.chartdata_energy_close_final = JSON.stringify(chartdata_energy);
				chart_energy.dataProvider = eval($scope.chartdata_energy_close_final);
				chartdata_energy = null;
				$scope.chartdata_energy_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_energy.dataProvider[i].value == 1){
						chart_energy.dataProvider[i].color = "green";
					}
					else{
						chart_energy.dataProvider[i].color = "red";
					}
				}
				chart_energy.validateData();


				let chartdata_cpse = []
				chart_cpse = createChartObj('m_chart_cpse_sector_view');
				chartdata_cpse = setChartData(json_data, 'CPSE', 'Close');
				setChartHeight('#m_chart_cpse_sector_view',chartdata_cpse.length);
				$scope.autolenght = Object.keys(chartdata_cpse).length;
				$scope.chartdata_cpse_close_final = JSON.stringify(chartdata_cpse);
				chart_cpse.dataProvider = eval($scope.chartdata_cpse_close_final);
				chartdata_cpse = null;
				$scope.chartdata_cpse_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_cpse.dataProvider[i].value == 1){
						chart_cpse.dataProvider[i].color = "green";
					}
					else{
						chart_cpse.dataProvider[i].color = "red";
					}
				}
				chart_cpse.validateData();


				let chartdata_pse = []
				chart_pse = createChartObj('m_chart_pse_sector_view');
				chartdata_pse = setChartData(json_data, 'PSE', 'Close');
				setChartHeight('#m_chart_pse_sector_view',chartdata_pse.length);
				$scope.autolenght = Object.keys(chartdata_pse).length;
				$scope.chartdata_pse_close_final = JSON.stringify(chartdata_pse);
				chart_pse.dataProvider = eval($scope.chartdata_pse_close_final);
				chartdata_pse = null;
				$scope.chartdata_pse_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pse.dataProvider[i].value == 1){
						chart_pse.dataProvider[i].color = "green";
					}
					else{
						chart_pse.dataProvider[i].color = "red";
					}
				}
				chart_pse.validateData();


				chart_media = createChartObj('m_chart_media_sector_view');
				chartdata_media = setChartData(json_data, 'MEDIA', 'Close');
				setChartHeight('#m_chart_media_sector_view',chartdata_media.length);

				$scope.autolenght = Object.keys(chartdata_media).length;
				$scope.chartdata_media_close_final = JSON.stringify(chartdata_media);
				chart_media.dataProvider = eval($scope.chartdata_media_close_final);
				chartdata_media = null;
				$scope.chartdata_media_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_media.dataProvider[i].value == 1){
						chart_media.dataProvider[i].color = "green";
					}
					else{
						chart_media.dataProvider[i].color = "red";
					}
				}
				chart_media.validateData();


				json_data = null;




			};

			function marketviewchange_open(data) {
				json_data = data;
				NAME = [];
				CHGPCT = [];
				CHGPCTSTR = [];
				COLOR = [];
				LTP = [];
				LTPSTR = [];
				chartdata_auto = [];
				chartdata_it = [];
				chartdata_bank = [];
				chartdata_finance = [];
				chartdata_indus_mfg = [];
				chartdata_fmcg = [];
				chartdata_cement = [];
				chartdata_chemical = [];
				chartdata_construction = [];
				chartdata_energy = [];
				chartdata_metals = [];
				chartdata_pharma = [];
				chartdata_media = [];
				chartdata_realty = [];
				chartdata_textiles = [];
				chartdata_telecom = [];
				chartdata_healthcare = [];
				chartdata_others = [];


				chart_auto = createChartObj('m_chart_auto_sector_view');
				chartdata_auto = setChartData(json_data, 'AUTO', 'Open');
				setChartHeight('#m_chart_auto_sector_view',chartdata_auto.length);

				$scope.autolenght = Object.keys(chartdata_auto).length;
				$scope.chartdata_auto_close_final = JSON.stringify(chartdata_auto);
				chart_auto.dataProvider = eval($scope.chartdata_auto_close_final);
				chartdata_auto = null;
				$scope.chartdata_auto_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_auto.dataProvider[i].value == 1){
						chart_auto.dataProvider[i].color = "green";
					}
					else{
						chart_auto.dataProvider[i].color = "red";
					}
				}
				chart_auto.validateData();


				chart_fmcg = createChartObj('m_chart_fmcg_sector_view');
				chartdata_fmcg = setChartData(json_data, 'FMCG', 'Open');
				setChartHeight('#m_chart_fmcg_sector_view',chartdata_fmcg.length);
				$scope.autolenght = Object.keys(chartdata_fmcg).length;
				$scope.chartdata_fmcg_close_final = JSON.stringify(chartdata_fmcg);
				chart_fmcg.dataProvider = eval($scope.chartdata_fmcg_close_final);
				chartdata_fmcg = null;
				$scope.chartdata_fmcg_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_fmcg.dataProvider[i].value == 1){
						chart_fmcg.dataProvider[i].color = "green";
					}
					else{
						chart_fmcg.dataProvider[i].color = "red";
					}
				}
				chart_fmcg.validateData();

				chart_pvt_bank = createChartObj('m_chart_pvt_bank_sector_view');
				chartdata_pvt_bank = setChartData(json_data, 'PVT BANK', 'Open');
				setChartHeight('#m_chart_pvt_bank_sector_view',chartdata_pvt_bank.length);

				$scope.autolenght = Object.keys(chartdata_pvt_bank).length;
				$scope.chartdata_pvt_bank_close_final = JSON.stringify(chartdata_pvt_bank);
				chart_pvt_bank.dataProvider = eval($scope.chartdata_pvt_bank_close_final);
				chartdata_pvt_bank = null;
				$scope.chartdata_pvt_bank_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pvt_bank.dataProvider[i].value == 1){
						chart_pvt_bank.dataProvider[i].color = "green";
					}
					else{
						chart_pvt_bank.dataProvider[i].color = "red";
					}
				}
				chart_pvt_bank.validateData();


				chart_finance = createChartObj('m_chart_finance_sector_view');
				chartdata_finance = setChartData(json_data, 'FIN-SERV', 'Open');
				$scope.len_1 = chartdata_finance.length
				setChartHeight('#m_chart_finance_sector_view',chartdata_finance.length);
				$scope.autolenght = Object.keys(chartdata_finance).length;
				$scope.chartdata_finance_close_final = JSON.stringify(chartdata_finance);
				chart_finance.dataProvider = eval($scope.chartdata_finance_close_final);
				chartdata_finance = null;
				$scope.chartdata_finance_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_finance.dataProvider[i].value == 1){
						chart_finance.dataProvider[i].color = "green";
					}
					else{
						chart_finance.dataProvider[i].color = "red";
					}
				}
				chart_finance.validateData();

				chart_psu_bank = createChartObj('m_chart_psu_bank_sector_view');
				chartdata_psu_bank = setChartData(json_data, 'PSU BANK', 'Open');
				setChartHeight('#m_chart_psu_bank_sector_view',chartdata_psu_bank.length);
				$scope.autolenght = Object.keys(chartdata_psu_bank).length;
				$scope.chartdata_psu_bank_close_final = JSON.stringify(chartdata_psu_bank);
				chart_psu_bank.dataProvider = eval($scope.chartdata_psu_bank_close_final);
				chartdata_psu_bank = null;
				$scope.chartdata_psu_bank_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_psu_bank.dataProvider[i].value == 1){
						chart_psu_bank.dataProvider[i].color = "green";
					}
					else{
						chart_psu_bank.dataProvider[i].color = "red";
					}
				}
				chart_psu_bank.validateData();


				
				chart_it = createChartObj('m_chart_it_sector_view');
				chartdata_it = setChartData(json_data, 'IT', 'Open');
				setChartHeight('#m_chart_it_sector_view',chartdata_it.length);
				$scope.autolenght = Object.keys(chartdata_it).length;
				$scope.chartdata_it_close_final = JSON.stringify(chartdata_it);
				chart_it.dataProvider = eval($scope.chartdata_it_close_final);
				chartdata_it = null;
				$scope.chartdata_it_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_it.dataProvider[i].value == 1){
						chart_it.dataProvider[i].color = "green";
					}
					else{
						chart_it.dataProvider[i].color = "red";
					}
				}
				chart_it.validateData();

				let chartdata_infra = []
				chart_infra = createChartObj('m_chart_infra_sector_view');
				chartdata_infra = setChartData(json_data, 'INFRA', 'Open');
				setChartHeight('#m_chart_infra_sector_view',chartdata_infra.length);
				$scope.autolenght = Object.keys(chartdata_infra).length;
				$scope.chartdata_infra_close_final = JSON.stringify(chartdata_infra);
				chart_infra.dataProvider = eval($scope.chartdata_infra_close_final);
				chartdata_infra = null;
				$scope.chartdata_infra_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_infra.dataProvider[i].value == 1){
						chart_infra.dataProvider[i].color = "green";
					}
					else{
						chart_infra.dataProvider[i].color = "red";
					}
				}
				chart_infra.validateData();

				chart_metals = createChartObj('m_chart_metals_sector_view');
				chartdata_metals = setChartData(json_data, 'METAL', 'Open');
				setChartHeight('#m_chart_metals_sector_view',chartdata_metals.length);

				$scope.autolenght = Object.keys(chartdata_metals).length;
				$scope.chartdata_metals_close_final = JSON.stringify(chartdata_metals);
				chart_metals.dataProvider = eval($scope.chartdata_metals_close_final);
				chartdata_metals = null;
				$scope.chartdata_metals_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_metals.dataProvider[i].value == 1){
						chart_metals.dataProvider[i].color = "green";
					}
					else{
						chart_metals.dataProvider[i].color = "red";
					}
				}
				chart_metals.validateData();


				chart_pharma = createChartObj('m_chart_pharma_sector_view');
				chartdata_pharma = setChartData(json_data, 'PHARMA', 'Open');
				setChartHeight('#m_chart_pharma_sector_view',chartdata_pharma.length);
				$scope.autolenght = Object.keys(chartdata_pharma).length;
				$scope.chartdata_pharma_close_final = JSON.stringify(chartdata_pharma);
				chart_pharma.dataProvider = eval($scope.chartdata_pharma_close_final);
				chartdata_pharma = null;
				$scope.chartdata_pharma_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pharma.dataProvider[i].value == 1){
						chart_pharma.dataProvider[i].color = "green";
					}
					else{
						chart_pharma.dataProvider[i].color = "red";
					}
				}
				chart_pharma.validateData();



				
				chart_realty = createChartObj('m_chart_realty_sector_view');
				chartdata_realty = setChartData(json_data, 'REALTY', 'Open');
				setChartHeight('#m_chart_realty_sector_view',chartdata_realty.length);
				$scope.autolenght = Object.keys(chartdata_realty).length;
				$scope.chartdata_realty_close_final = JSON.stringify(chartdata_realty);
				chart_realty.dataProvider = eval($scope.chartdata_realty_close_final);
				chartdata_realty = null;
				$scope.chartdata_realty_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_realty.dataProvider[i].value == 1){
						chart_realty.dataProvider[i].color = "green";
					}
					else{
						chart_realty.dataProvider[i].color = "red";
					}
				}
				chart_realty.validateData();





				let chartdata_commodities = []
				chart_commodities = createChartObj('m_chart_commodities_sector_view');
				chartdata_commodities = setChartData(json_data, 'COMMODITIES', 'Open');
				setChartHeight('#m_chart_commodities_sector_view',chartdata_commodities.length);
				$scope.autolenght = Object.keys(chartdata_commodities).length;
				$scope.chartdata_commodities_close_final = JSON.stringify(chartdata_commodities);
				chart_commodities.dataProvider = eval($scope.chartdata_commodities_close_final);
				chartdata_commodities = null;
				$scope.chartdata_commodities_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_commodities.dataProvider[i].value == 1){
						chart_commodities.dataProvider[i].color = "green";
					}
					else{
						chart_commodities.dataProvider[i].color = "red";
					}
				}
				chart_commodities.validateData();

				
				let chartdata_consumption = []
				chart_consumption = createChartObj('m_chart_consumption_sector_view');
				chartdata_consumption = setChartData(json_data, 'CONSUMPTION', 'Open');
				setChartHeight('#m_chart_consumption_sector_view',chartdata_consumption.length);
				$scope.autolenght = Object.keys(chartdata_consumption).length;
				$scope.chartdata_consumption_close_final = JSON.stringify(chartdata_consumption);
				chart_consumption.dataProvider = eval($scope.chartdata_consumption_close_final);
				chartdata_consumption = null;
				$scope.chartdata_consumption_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_consumption.dataProvider[i].value == 1){
						chart_consumption.dataProvider[i].color = "green";
					}
					else{
						chart_consumption.dataProvider[i].color = "red";
					}
				}
				chart_consumption.validateData();


				chart_energy = createChartObj('m_chart_energy_sector_view');
				chartdata_energy = setChartData(json_data, 'ENERGY', 'Open');
				setChartHeight('#m_chart_energy_sector_view',chartdata_energy.length);
				$scope.autolenght = Object.keys(chartdata_energy).length;
				$scope.chartdata_energy_close_final = JSON.stringify(chartdata_energy);
				chart_energy.dataProvider = eval($scope.chartdata_energy_close_final);
				chartdata_energy = null;
				$scope.chartdata_energy_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_energy.dataProvider[i].value == 1){
						chart_energy.dataProvider[i].color = "green";
					}
					else{
						chart_energy.dataProvider[i].color = "red";
					}
				}
				chart_energy.validateData();


				let chartdata_cpse = []
				chart_cpse = createChartObj('m_chart_cpse_sector_view');
				chartdata_cpse = setChartData(json_data, 'CPSE', 'Open');
				setChartHeight('#m_chart_cpse_sector_view',chartdata_cpse.length);
				$scope.autolenght = Object.keys(chartdata_cpse).length;
				$scope.chartdata_cpse_close_final = JSON.stringify(chartdata_cpse);
				chart_cpse.dataProvider = eval($scope.chartdata_cpse_close_final);
				chartdata_cpse = null;
				$scope.chartdata_cpse_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_cpse.dataProvider[i].value == 1){
						chart_cpse.dataProvider[i].color = "green";
					}
					else{
						chart_cpse.dataProvider[i].color = "red";
					}
				}
				chart_cpse.validateData();


				let chartdata_pse = []
				chart_pse = createChartObj('m_chart_pse_sector_view');
				chartdata_pse = setChartData(json_data, 'PSE', 'Open');
				setChartHeight('#m_chart_pse_sector_view',chartdata_pse.length);
				$scope.autolenght = Object.keys(chartdata_pse).length;
				$scope.chartdata_pse_close_final = JSON.stringify(chartdata_pse);
				chart_pse.dataProvider = eval($scope.chartdata_pse_close_final);
				chartdata_pse = null;
				$scope.chartdata_pse_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pse.dataProvider[i].value == 1){
						chart_pse.dataProvider[i].color = "green";
					}
					else{
						chart_pse.dataProvider[i].color = "red";
					}
				}
				chart_pse.validateData();


				chart_media = createChartObj('m_chart_media_sector_view');
				chartdata_media = setChartData(json_data, 'MEDIA', 'Open');
				setChartHeight('#m_chart_media_sector_view',chartdata_media.length);

				$scope.autolenght = Object.keys(chartdata_media).length;
				$scope.chartdata_media_close_final = JSON.stringify(chartdata_media);
				chart_media.dataProvider = eval($scope.chartdata_media_close_final);
				chartdata_media = null;
				$scope.chartdata_media_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_media.dataProvider[i].value == 1){
						chart_media.dataProvider[i].color = "green";
					}
					else{
						chart_media.dataProvider[i].color = "red";
					}
				}
				chart_media.validateData();


				json_data = null;

			};

			function marketviewchange_close_Week(data){
				json_data = data;
				NAME = [];
				CHGPCT = [];
				CHGPCTSTR = [];
				COLOR = [];
				LTP = [];
				LTPSTR = [];
				chartdata_auto = [];
				chartdata_it = [];
				chartdata_bank = [];
				chartdata_finance = [];
				chartdata_indus_mfg = [];
				chartdata_fmcg = [];
				chartdata_cement = [];
				chartdata_chemical = [];
				chartdata_construction = [];
				chartdata_energy = [];
				chartdata_metals = [];
				chartdata_pharma = [];
				chartdata_media = [];
				chartdata_realty = [];
				chartdata_textiles = [];
				chartdata_telecom = [];
				chartdata_healthcare = [];
				chartdata_others = [];


				chart_auto = createChartObj_Week('m_chart_auto_sector_view');
				chartdata_auto = setChartData_Week(json_data, 'AUTO', 'Close');
				setChartHeight('#m_chart_auto_sector_view',chartdata_auto.length);

				$scope.autolenght = Object.keys(chartdata_auto).length;
				$scope.chartdata_auto_close_final = JSON.stringify(chartdata_auto);
				chart_auto.dataProvider = eval($scope.chartdata_auto_close_final);
				chartdata_auto = null;
				$scope.chartdata_auto_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_auto.dataProvider[i].value == 1){
						chart_auto.dataProvider[i].color = "green";
					}
					else{
						chart_auto.dataProvider[i].color = "red";
					}
				}
				chart_auto.validateData();


				chart_fmcg = createChartObj_Week('m_chart_fmcg_sector_view');
				chartdata_fmcg = setChartData_Week(json_data, 'FMCG', 'Close');
				setChartHeight('#m_chart_fmcg_sector_view',chartdata_fmcg.length);
				$scope.autolenght = Object.keys(chartdata_fmcg).length;
				$scope.chartdata_fmcg_close_final = JSON.stringify(chartdata_fmcg);
				chart_fmcg.dataProvider = eval($scope.chartdata_fmcg_close_final);
				chartdata_fmcg = null;
				$scope.chartdata_fmcg_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_fmcg.dataProvider[i].value == 1){
						chart_fmcg.dataProvider[i].color = "green";
					}
					else{
						chart_fmcg.dataProvider[i].color = "red";
					}
				}
				chart_fmcg.validateData();

				chart_pvt_bank = createChartObj_Week('m_chart_pvt_bank_sector_view');
				chartdata_pvt_bank = setChartData_Week(json_data, 'PVT BANK', 'Close');
				setChartHeight('#m_chart_pvt_bank_sector_view',chartdata_pvt_bank.length);

				$scope.autolenght = Object.keys(chartdata_pvt_bank).length;
				$scope.chartdata_pvt_bank_close_final = JSON.stringify(chartdata_pvt_bank);
				chart_pvt_bank.dataProvider = eval($scope.chartdata_pvt_bank_close_final);
				chartdata_pvt_bank = null;
				$scope.chartdata_pvt_bank_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pvt_bank.dataProvider[i].value == 1){
						chart_pvt_bank.dataProvider[i].color = "green";
					}
					else{
						chart_pvt_bank.dataProvider[i].color = "red";
					}
				}
				chart_pvt_bank.validateData();


				chart_finance = createChartObj_Week('m_chart_finance_sector_view');
				chartdata_finance = setChartData_Week(json_data, 'FIN-SERV', 'Close');
				$scope.len_1 = chartdata_finance.length
				setChartHeight('#m_chart_finance_sector_view',chartdata_finance.length);
				$scope.autolenght = Object.keys(chartdata_finance).length;
				$scope.chartdata_finance_close_final = JSON.stringify(chartdata_finance);
				chart_finance.dataProvider = eval($scope.chartdata_finance_close_final);
				chartdata_finance = null;
				$scope.chartdata_finance_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_finance.dataProvider[i].value == 1){
						chart_finance.dataProvider[i].color = "green";
					}
					else{
						chart_finance.dataProvider[i].color = "red";
					}
				}
				chart_finance.validateData();

				chart_psu_bank = createChartObj_Week('m_chart_psu_bank_sector_view');
				chartdata_psu_bank = setChartData_Week(json_data, 'PSU BANK', 'Close');
				setChartHeight('#m_chart_psu_bank_sector_view',chartdata_psu_bank.length);
				$scope.autolenght = Object.keys(chartdata_psu_bank).length;
				$scope.chartdata_psu_bank_close_final = JSON.stringify(chartdata_psu_bank);
				chart_psu_bank.dataProvider = eval($scope.chartdata_psu_bank_close_final);
				chartdata_psu_bank = null;
				$scope.chartdata_psu_bank_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_psu_bank.dataProvider[i].value == 1){
						chart_psu_bank.dataProvider[i].color = "green";
					}
					else{
						chart_psu_bank.dataProvider[i].color = "red";
					}
				}
				chart_psu_bank.validateData();


				
				chart_it = createChartObj_Week('m_chart_it_sector_view');
				chartdata_it = setChartData_Week(json_data, 'IT', 'Close');
				setChartHeight('#m_chart_it_sector_view',chartdata_it.length);
				$scope.autolenght = Object.keys(chartdata_it).length;
				$scope.chartdata_it_close_final = JSON.stringify(chartdata_it);
				chart_it.dataProvider = eval($scope.chartdata_it_close_final);
				chartdata_it = null;
				$scope.chartdata_it_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_it.dataProvider[i].value == 1){
						chart_it.dataProvider[i].color = "green";
					}
					else{
						chart_it.dataProvider[i].color = "red";
					}
				}
				chart_it.validateData();

				let chartdata_infra = []
				chart_infra = createChartObj_Week('m_chart_infra_sector_view');
				chartdata_infra = setChartData_Week(json_data, 'INFRA', 'Close');
				setChartHeight('#m_chart_infra_sector_view',chartdata_infra.length);
				$scope.autolenght = Object.keys(chartdata_infra).length;
				$scope.chartdata_infra_close_final = JSON.stringify(chartdata_infra);
				chart_infra.dataProvider = eval($scope.chartdata_infra_close_final);
				chartdata_infra = null;
				$scope.chartdata_infra_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_infra.dataProvider[i].value == 1){
						chart_infra.dataProvider[i].color = "green";
					}
					else{
						chart_infra.dataProvider[i].color = "red";
					}
				}
				chart_infra.validateData();

				chart_metals = createChartObj_Week('m_chart_metals_sector_view');
				chartdata_metals = setChartData_Week(json_data, 'METAL', 'Close');
				setChartHeight('#m_chart_metals_sector_view',chartdata_metals.length);

				$scope.autolenght = Object.keys(chartdata_metals).length;
				$scope.chartdata_metals_close_final = JSON.stringify(chartdata_metals);
				chart_metals.dataProvider = eval($scope.chartdata_metals_close_final);
				chartdata_metals = null;
				$scope.chartdata_metals_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_metals.dataProvider[i].value == 1){
						chart_metals.dataProvider[i].color = "green";
					}
					else{
						chart_metals.dataProvider[i].color = "red";
					}
				}
				chart_metals.validateData();


				chart_pharma = createChartObj_Week('m_chart_pharma_sector_view');
				chartdata_pharma = setChartData_Week(json_data, 'PHARMA', 'Close');
				setChartHeight('#m_chart_pharma_sector_view',chartdata_pharma.length);
				$scope.autolenght = Object.keys(chartdata_pharma).length;
				$scope.chartdata_pharma_close_final = JSON.stringify(chartdata_pharma);
				chart_pharma.dataProvider = eval($scope.chartdata_pharma_close_final);
				chartdata_pharma = null;
				$scope.chartdata_pharma_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pharma.dataProvider[i].value == 1){
						chart_pharma.dataProvider[i].color = "green";
					}
					else{
						chart_pharma.dataProvider[i].color = "red";
					}
				}
				chart_pharma.validateData();



				
				chart_realty = createChartObj_Week('m_chart_realty_sector_view');
				chartdata_realty = setChartData_Week(json_data, 'REALTY', 'Close');
				setChartHeight('#m_chart_realty_sector_view',chartdata_realty.length);
				$scope.autolenght = Object.keys(chartdata_realty).length;
				$scope.chartdata_realty_close_final = JSON.stringify(chartdata_realty);
				chart_realty.dataProvider = eval($scope.chartdata_realty_close_final);
				chartdata_realty = null;
				$scope.chartdata_realty_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_realty.dataProvider[i].value == 1){
						chart_realty.dataProvider[i].color = "green";
					}
					else{
						chart_realty.dataProvider[i].color = "red";
					}
				}
				chart_realty.validateData();





				let chartdata_commodities = []
				chart_commodities = createChartObj_Week('m_chart_commodities_sector_view');
				chartdata_commodities = setChartData_Week(json_data, 'COMMODITIES', 'Close');
				setChartHeight('#m_chart_commodities_sector_view',chartdata_commodities.length);
				$scope.autolenght = Object.keys(chartdata_commodities).length;
				$scope.chartdata_commodities_close_final = JSON.stringify(chartdata_commodities);
				chart_commodities.dataProvider = eval($scope.chartdata_commodities_close_final);
				chartdata_commodities = null;
				$scope.chartdata_commodities_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_commodities.dataProvider[i].value == 1){
						chart_commodities.dataProvider[i].color = "green";
					}
					else{
						chart_commodities.dataProvider[i].color = "red";
					}
				}
				chart_commodities.validateData();

				
				let chartdata_consumption = []
				chart_consumption = createChartObj_Week('m_chart_consumption_sector_view');
				chartdata_consumption = setChartData_Week(json_data, 'CONSUMPTION', 'Close');
				setChartHeight('#m_chart_consumption_sector_view',chartdata_consumption.length);
				$scope.autolenght = Object.keys(chartdata_consumption).length;
				$scope.chartdata_consumption_close_final = JSON.stringify(chartdata_consumption);
				chart_consumption.dataProvider = eval($scope.chartdata_consumption_close_final);
				chartdata_consumption = null;
				$scope.chartdata_consumption_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_consumption.dataProvider[i].value == 1){
						chart_consumption.dataProvider[i].color = "green";
					}
					else{
						chart_consumption.dataProvider[i].color = "red";
					}
				}
				chart_consumption.validateData();


				chart_energy = createChartObj_Week('m_chart_energy_sector_view');
				chartdata_energy = setChartData_Week(json_data, 'ENERGY', 'Close');
				setChartHeight('#m_chart_energy_sector_view',chartdata_energy.length);
				$scope.autolenght = Object.keys(chartdata_energy).length;
				$scope.chartdata_energy_close_final = JSON.stringify(chartdata_energy);
				chart_energy.dataProvider = eval($scope.chartdata_energy_close_final);
				chartdata_energy = null;
				$scope.chartdata_energy_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_energy.dataProvider[i].value == 1){
						chart_energy.dataProvider[i].color = "green";
					}
					else{
						chart_energy.dataProvider[i].color = "red";
					}
				}
				chart_energy.validateData();


				let chartdata_cpse = []
				chart_cpse = createChartObj_Week('m_chart_cpse_sector_view');
				chartdata_cpse = setChartData_Week(json_data, 'CPSE', 'Close');
				setChartHeight('#m_chart_cpse_sector_view',chartdata_cpse.length);
				$scope.autolenght = Object.keys(chartdata_cpse).length;
				$scope.chartdata_cpse_close_final = JSON.stringify(chartdata_cpse);
				chart_cpse.dataProvider = eval($scope.chartdata_cpse_close_final);
				chartdata_cpse = null;
				$scope.chartdata_cpse_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_cpse.dataProvider[i].value == 1){
						chart_cpse.dataProvider[i].color = "green";
					}
					else{
						chart_cpse.dataProvider[i].color = "red";
					}
				}
				chart_cpse.validateData();


				let chartdata_pse = []
				chart_pse = createChartObj_Week('m_chart_pse_sector_view');
				chartdata_pse = setChartData_Week(json_data, 'PSE', 'Close');
				setChartHeight('#m_chart_pse_sector_view',chartdata_pse.length);
				$scope.autolenght = Object.keys(chartdata_pse).length;
				$scope.chartdata_pse_close_final = JSON.stringify(chartdata_pse);
				chart_pse.dataProvider = eval($scope.chartdata_pse_close_final);
				chartdata_pse = null;
				$scope.chartdata_pse_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pse.dataProvider[i].value == 1){
						chart_pse.dataProvider[i].color = "green";
					}
					else{
						chart_pse.dataProvider[i].color = "red";
					}
				}
				chart_pse.validateData();


				chart_media = createChartObj_Week('m_chart_media_sector_view');
				chartdata_media = setChartData_Week(json_data, 'MEDIA', 'Close');
				setChartHeight('#m_chart_media_sector_view',chartdata_media.length);

				$scope.autolenght = Object.keys(chartdata_media).length;
				$scope.chartdata_media_close_final = JSON.stringify(chartdata_media);
				chart_media.dataProvider = eval($scope.chartdata_media_close_final);
				chartdata_media = null;
				$scope.chartdata_media_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_media.dataProvider[i].value == 1){
						chart_media.dataProvider[i].color = "green";
					}
					else{
						chart_media.dataProvider[i].color = "red";
					}
				}
				chart_media.validateData();


				json_data = null;
			};

			function marketviewchange_open_Week(data) {
				json_data = data;
				NAME = [];
				CHGPCT = [];
				CHGPCTSTR = [];
				COLOR = [];
				LTP = [];
				LTPSTR = [];
				chartdata_auto = [];
				chartdata_it = [];
				chartdata_bank = [];
				chartdata_finance = [];
				chartdata_indus_mfg = [];
				chartdata_fmcg = [];
				chartdata_cement = [];
				chartdata_chemical = [];
				chartdata_construction = [];
				chartdata_energy = [];
				chartdata_metals = [];
				chartdata_pharma = [];
				chartdata_media = [];
				chartdata_realty = [];
				chartdata_textiles = [];
				chartdata_telecom = [];
				chartdata_healthcare = [];
				chartdata_others = [];


				chart_auto = createChartObj_Week('m_chart_auto_sector_view');
				chartdata_auto = setChartData_Week(json_data, 'AUTO', 'Open');
				setChartHeight('#m_chart_auto_sector_view',chartdata_auto.length);

				$scope.autolenght = Object.keys(chartdata_auto).length;
				$scope.chartdata_auto_close_final = JSON.stringify(chartdata_auto);
				chart_auto.dataProvider = eval($scope.chartdata_auto_close_final);
				chartdata_auto = null;
				$scope.chartdata_auto_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_auto.dataProvider[i].value == 1){
						chart_auto.dataProvider[i].color = "green";
					}
					else{
						chart_auto.dataProvider[i].color = "red";
					}
				}
				chart_auto.validateData();


				chart_fmcg = createChartObj_Week('m_chart_fmcg_sector_view');
				chartdata_fmcg = setChartData_Week(json_data, 'FMCG', 'Open');
				setChartHeight('#m_chart_fmcg_sector_view',chartdata_fmcg.length);
				$scope.autolenght = Object.keys(chartdata_fmcg).length;
				$scope.chartdata_fmcg_close_final = JSON.stringify(chartdata_fmcg);
				chart_fmcg.dataProvider = eval($scope.chartdata_fmcg_close_final);
				chartdata_fmcg = null;
				$scope.chartdata_fmcg_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_fmcg.dataProvider[i].value == 1){
						chart_fmcg.dataProvider[i].color = "green";
					}
					else{
						chart_fmcg.dataProvider[i].color = "red";
					}
				}
				chart_fmcg.validateData();

				chart_pvt_bank = createChartObj_Week('m_chart_pvt_bank_sector_view');
				chartdata_pvt_bank = setChartData_Week(json_data, 'PVT BANK', 'Open');
				setChartHeight('#m_chart_pvt_bank_sector_view',chartdata_pvt_bank.length);

				$scope.autolenght = Object.keys(chartdata_pvt_bank).length;
				$scope.chartdata_pvt_bank_close_final = JSON.stringify(chartdata_pvt_bank);
				chart_pvt_bank.dataProvider = eval($scope.chartdata_pvt_bank_close_final);
				chartdata_pvt_bank = null;
				$scope.chartdata_pvt_bank_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pvt_bank.dataProvider[i].value == 1){
						chart_pvt_bank.dataProvider[i].color = "green";
					}
					else{
						chart_pvt_bank.dataProvider[i].color = "red";
					}
				}
				chart_pvt_bank.validateData();


				chart_finance = createChartObj_Week('m_chart_finance_sector_view');
				chartdata_finance = setChartData_Week(json_data, 'FIN-SERV', 'Open');
				$scope.len_1 = chartdata_finance.length
				setChartHeight('#m_chart_finance_sector_view',chartdata_finance.length);
				$scope.autolenght = Object.keys(chartdata_finance).length;
				$scope.chartdata_finance_close_final = JSON.stringify(chartdata_finance);
				chart_finance.dataProvider = eval($scope.chartdata_finance_close_final);
				chartdata_finance = null;
				$scope.chartdata_finance_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_finance.dataProvider[i].value == 1){
						chart_finance.dataProvider[i].color = "green";
					}
					else{
						chart_finance.dataProvider[i].color = "red";
					}
				}
				chart_finance.validateData();

				chart_psu_bank = createChartObj_Week('m_chart_psu_bank_sector_view');
				chartdata_psu_bank = setChartData_Week(json_data, 'PSU BANK', 'Open');
				setChartHeight('#m_chart_psu_bank_sector_view',chartdata_psu_bank.length);
				$scope.autolenght = Object.keys(chartdata_psu_bank).length;
				$scope.chartdata_psu_bank_close_final = JSON.stringify(chartdata_psu_bank);
				chart_psu_bank.dataProvider = eval($scope.chartdata_psu_bank_close_final);
				chartdata_psu_bank = null;
				$scope.chartdata_psu_bank_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_psu_bank.dataProvider[i].value == 1){
						chart_psu_bank.dataProvider[i].color = "green";
					}
					else{
						chart_psu_bank.dataProvider[i].color = "red";
					}
				}
				chart_psu_bank.validateData();


				
				chart_it = createChartObj_Week('m_chart_it_sector_view');
				chartdata_it = setChartData_Week(json_data, 'IT', 'Open');
				setChartHeight('#m_chart_it_sector_view',chartdata_it.length);
				$scope.autolenght = Object.keys(chartdata_it).length;
				$scope.chartdata_it_close_final = JSON.stringify(chartdata_it);
				chart_it.dataProvider = eval($scope.chartdata_it_close_final);
				chartdata_it = null;
				$scope.chartdata_it_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_it.dataProvider[i].value == 1){
						chart_it.dataProvider[i].color = "green";
					}
					else{
						chart_it.dataProvider[i].color = "red";
					}
				}
				chart_it.validateData();

				let chartdata_infra = []
				chart_infra = createChartObj_Week('m_chart_infra_sector_view');
				chartdata_infra = setChartData_Week(json_data, 'INFRA', 'Open');
				setChartHeight('#m_chart_infra_sector_view',chartdata_infra.length);
				$scope.autolenght = Object.keys(chartdata_infra).length;
				$scope.chartdata_infra_close_final = JSON.stringify(chartdata_infra);
				chart_infra.dataProvider = eval($scope.chartdata_infra_close_final);
				chartdata_infra = null;
				$scope.chartdata_infra_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_infra.dataProvider[i].value == 1){
						chart_infra.dataProvider[i].color = "green";
					}
					else{
						chart_infra.dataProvider[i].color = "red";
					}
				}
				chart_infra.validateData();

				chart_metals = createChartObj_Week('m_chart_metals_sector_view');
				chartdata_metals = setChartData_Week(json_data, 'METAL', 'Open');
				setChartHeight('#m_chart_metals_sector_view',chartdata_metals.length);

				$scope.autolenght = Object.keys(chartdata_metals).length;
				$scope.chartdata_metals_close_final = JSON.stringify(chartdata_metals);
				chart_metals.dataProvider = eval($scope.chartdata_metals_close_final);
				chartdata_metals = null;
				$scope.chartdata_metals_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_metals.dataProvider[i].value == 1){
						chart_metals.dataProvider[i].color = "green";
					}
					else{
						chart_metals.dataProvider[i].color = "red";
					}
				}
				chart_metals.validateData();


				chart_pharma = createChartObj_Week('m_chart_pharma_sector_view');
				chartdata_pharma = setChartData_Week(json_data, 'PHARMA', 'Open');
				setChartHeight('#m_chart_pharma_sector_view',chartdata_pharma.length);
				$scope.autolenght = Object.keys(chartdata_pharma).length;
				$scope.chartdata_pharma_close_final = JSON.stringify(chartdata_pharma);
				chart_pharma.dataProvider = eval($scope.chartdata_pharma_close_final);
				chartdata_pharma = null;
				$scope.chartdata_pharma_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pharma.dataProvider[i].value == 1){
						chart_pharma.dataProvider[i].color = "green";
					}
					else{
						chart_pharma.dataProvider[i].color = "red";
					}
				}
				chart_pharma.validateData();



				
				chart_realty = createChartObj_Week('m_chart_realty_sector_view');
				chartdata_realty = setChartData_Week(json_data, 'REALTY', 'Open');
				setChartHeight('#m_chart_realty_sector_view',chartdata_realty.length);
				$scope.autolenght = Object.keys(chartdata_realty).length;
				$scope.chartdata_realty_close_final = JSON.stringify(chartdata_realty);
				chart_realty.dataProvider = eval($scope.chartdata_realty_close_final);
				chartdata_realty = null;
				$scope.chartdata_realty_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_realty.dataProvider[i].value == 1){
						chart_realty.dataProvider[i].color = "green";
					}
					else{
						chart_realty.dataProvider[i].color = "red";
					}
				}
				chart_realty.validateData();





				let chartdata_commodities = []
				chart_commodities = createChartObj_Week('m_chart_commodities_sector_view');
				chartdata_commodities = setChartData_Week(json_data, 'COMMODITIES', 'Open');
				setChartHeight('#m_chart_commodities_sector_view',chartdata_commodities.length);
				$scope.autolenght = Object.keys(chartdata_commodities).length;
				$scope.chartdata_commodities_close_final = JSON.stringify(chartdata_commodities);
				chart_commodities.dataProvider = eval($scope.chartdata_commodities_close_final);
				chartdata_commodities = null;
				$scope.chartdata_commodities_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_commodities.dataProvider[i].value == 1){
						chart_commodities.dataProvider[i].color = "green";
					}
					else{
						chart_commodities.dataProvider[i].color = "red";
					}
				}
				chart_commodities.validateData();

				
				let chartdata_consumption = []
				chart_consumption = createChartObj_Week('m_chart_consumption_sector_view');
				chartdata_consumption = setChartData_Week(json_data, 'CONSUMPTION', 'Open');
				setChartHeight('#m_chart_consumption_sector_view',chartdata_consumption.length);
				$scope.autolenght = Object.keys(chartdata_consumption).length;
				$scope.chartdata_consumption_close_final = JSON.stringify(chartdata_consumption);
				chart_consumption.dataProvider = eval($scope.chartdata_consumption_close_final);
				chartdata_consumption = null;
				$scope.chartdata_consumption_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_consumption.dataProvider[i].value == 1){
						chart_consumption.dataProvider[i].color = "green";
					}
					else{
						chart_consumption.dataProvider[i].color = "red";
					}
				}
				chart_consumption.validateData();


				chart_energy = createChartObj_Week('m_chart_energy_sector_view');
				chartdata_energy = setChartData_Week(json_data, 'ENERGY', 'Open');
				setChartHeight('#m_chart_energy_sector_view',chartdata_energy.length);
				$scope.autolenght = Object.keys(chartdata_energy).length;
				$scope.chartdata_energy_close_final = JSON.stringify(chartdata_energy);
				chart_energy.dataProvider = eval($scope.chartdata_energy_close_final);
				chartdata_energy = null;
				$scope.chartdata_energy_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_energy.dataProvider[i].value == 1){
						chart_energy.dataProvider[i].color = "green";
					}
					else{
						chart_energy.dataProvider[i].color = "red";
					}
				}
				chart_energy.validateData();


				let chartdata_cpse = []
				chart_cpse = createChartObj_Week('m_chart_cpse_sector_view');
				chartdata_cpse = setChartData_Week(json_data, 'CPSE', 'Open');
				setChartHeight('#m_chart_cpse_sector_view',chartdata_cpse.length);
				$scope.autolenght = Object.keys(chartdata_cpse).length;
				$scope.chartdata_cpse_close_final = JSON.stringify(chartdata_cpse);
				chart_cpse.dataProvider = eval($scope.chartdata_cpse_close_final);
				chartdata_cpse = null;
				$scope.chartdata_cpse_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_cpse.dataProvider[i].value == 1){
						chart_cpse.dataProvider[i].color = "green";
					}
					else{
						chart_cpse.dataProvider[i].color = "red";
					}
				}
				chart_cpse.validateData();


				let chartdata_pse = []
				chart_pse = createChartObj_Week('m_chart_pse_sector_view');
				chartdata_pse = setChartData_Week(json_data, 'PSE', 'Open');
				setChartHeight('#m_chart_pse_sector_view',chartdata_pse.length);
				$scope.autolenght = Object.keys(chartdata_pse).length;
				$scope.chartdata_pse_close_final = JSON.stringify(chartdata_pse);
				chart_pse.dataProvider = eval($scope.chartdata_pse_close_final);
				chartdata_pse = null;
				$scope.chartdata_pse_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pse.dataProvider[i].value == 1){
						chart_pse.dataProvider[i].color = "green";
					}
					else{
						chart_pse.dataProvider[i].color = "red";
					}
				}
				chart_pse.validateData();


				chart_media = createChartObj_Week('m_chart_media_sector_view');
				chartdata_media = setChartData_Week(json_data, 'MEDIA', 'Open');
				setChartHeight('#m_chart_media_sector_view',chartdata_media.length);

				$scope.autolenght = Object.keys(chartdata_media).length;
				$scope.chartdata_media_close_final = JSON.stringify(chartdata_media);
				chart_media.dataProvider = eval($scope.chartdata_media_close_final);
				chartdata_media = null;
				$scope.chartdata_media_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_media.dataProvider[i].value == 1){
						chart_media.dataProvider[i].color = "green";
					}
					else{
						chart_media.dataProvider[i].color = "red";
					}
				}
				chart_media.validateData();


				json_data = null;

			};

			function marketviewchange_close_Month(data){
				json_data = data;
				NAME = [];
				CHGPCT = [];
				CHGPCTSTR = [];
				COLOR = [];
				LTP = [];
				LTPSTR = [];
				chartdata_auto = [];
				chartdata_it = [];
				chartdata_bank = [];
				chartdata_finance = [];
				chartdata_indus_mfg = [];
				chartdata_fmcg = [];
				chartdata_cement = [];
				chartdata_chemical = [];
				chartdata_construction = [];
				chartdata_energy = [];
				chartdata_metals = [];
				chartdata_pharma = [];
				chartdata_media = [];
				chartdata_realty = [];
				chartdata_textiles = [];
				chartdata_telecom = [];
				chartdata_healthcare = [];
				chartdata_others = [];


				chart_auto = createChartObj_Month('m_chart_auto_sector_view');
				chartdata_auto = setChartData_Month(json_data, 'AUTO', 'Close');
				setChartHeight('#m_chart_auto_sector_view',chartdata_auto.length);

				$scope.autolenght = Object.keys(chartdata_auto).length;
				$scope.chartdata_auto_close_final = JSON.stringify(chartdata_auto);
				chart_auto.dataProvider = eval($scope.chartdata_auto_close_final);
				chartdata_auto = null;
				$scope.chartdata_auto_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_auto.dataProvider[i].value == 1){
						chart_auto.dataProvider[i].color = "green";
					}
					else{
						chart_auto.dataProvider[i].color = "red";
					}
				}
				chart_auto.validateData();


				chart_fmcg = createChartObj_Month('m_chart_fmcg_sector_view');
				chartdata_fmcg = setChartData_Month(json_data, 'FMCG', 'Close');
				setChartHeight('#m_chart_fmcg_sector_view',chartdata_fmcg.length);
				$scope.autolenght = Object.keys(chartdata_fmcg).length;
				$scope.chartdata_fmcg_close_final = JSON.stringify(chartdata_fmcg);
				chart_fmcg.dataProvider = eval($scope.chartdata_fmcg_close_final);
				chartdata_fmcg = null;
				$scope.chartdata_fmcg_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_fmcg.dataProvider[i].value == 1){
						chart_fmcg.dataProvider[i].color = "green";
					}
					else{
						chart_fmcg.dataProvider[i].color = "red";
					}
				}
				chart_fmcg.validateData();

				chart_pvt_bank = createChartObj_Month('m_chart_pvt_bank_sector_view');
				chartdata_pvt_bank = setChartData_Month(json_data, 'PVT BANK', 'Close');
				setChartHeight('#m_chart_pvt_bank_sector_view',chartdata_pvt_bank.length);

				$scope.autolenght = Object.keys(chartdata_pvt_bank).length;
				$scope.chartdata_pvt_bank_close_final = JSON.stringify(chartdata_pvt_bank);
				chart_pvt_bank.dataProvider = eval($scope.chartdata_pvt_bank_close_final);
				chartdata_pvt_bank = null;
				$scope.chartdata_pvt_bank_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pvt_bank.dataProvider[i].value == 1){
						chart_pvt_bank.dataProvider[i].color = "green";
					}
					else{
						chart_pvt_bank.dataProvider[i].color = "red";
					}
				}
				chart_pvt_bank.validateData();


				chart_finance = createChartObj_Month('m_chart_finance_sector_view');
				chartdata_finance = setChartData_Month(json_data, 'FIN-SERV', 'Close');
				$scope.len_1 = chartdata_finance.length
				setChartHeight('#m_chart_finance_sector_view',chartdata_finance.length);
				$scope.autolenght = Object.keys(chartdata_finance).length;
				$scope.chartdata_finance_close_final = JSON.stringify(chartdata_finance);
				chart_finance.dataProvider = eval($scope.chartdata_finance_close_final);
				chartdata_finance = null;
				$scope.chartdata_finance_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_finance.dataProvider[i].value == 1){
						chart_finance.dataProvider[i].color = "green";
					}
					else{
						chart_finance.dataProvider[i].color = "red";
					}
				}
				chart_finance.validateData();

				chart_psu_bank = createChartObj_Month('m_chart_psu_bank_sector_view');
				chartdata_psu_bank = setChartData_Month(json_data, 'PSU BANK', 'Close');
				setChartHeight('#m_chart_psu_bank_sector_view',chartdata_psu_bank.length);
				$scope.autolenght = Object.keys(chartdata_psu_bank).length;
				$scope.chartdata_psu_bank_close_final = JSON.stringify(chartdata_psu_bank);
				chart_psu_bank.dataProvider = eval($scope.chartdata_psu_bank_close_final);
				chartdata_psu_bank = null;
				$scope.chartdata_psu_bank_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_psu_bank.dataProvider[i].value == 1){
						chart_psu_bank.dataProvider[i].color = "green";
					}
					else{
						chart_psu_bank.dataProvider[i].color = "red";
					}
				}
				chart_psu_bank.validateData();


				
				chart_it = createChartObj_Month('m_chart_it_sector_view');
				chartdata_it = setChartData_Month(json_data, 'IT', 'Close');
				setChartHeight('#m_chart_it_sector_view',chartdata_it.length);
				$scope.autolenght = Object.keys(chartdata_it).length;
				$scope.chartdata_it_close_final = JSON.stringify(chartdata_it);
				chart_it.dataProvider = eval($scope.chartdata_it_close_final);
				chartdata_it = null;
				$scope.chartdata_it_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_it.dataProvider[i].value == 1){
						chart_it.dataProvider[i].color = "green";
					}
					else{
						chart_it.dataProvider[i].color = "red";
					}
				}
				chart_it.validateData();

				let chartdata_infra = []
				chart_infra = createChartObj_Month('m_chart_infra_sector_view');
				chartdata_infra = setChartData_Month(json_data, 'INFRA', 'Close');
				setChartHeight('#m_chart_infra_sector_view',chartdata_infra.length);
				$scope.autolenght = Object.keys(chartdata_infra).length;
				$scope.chartdata_infra_close_final = JSON.stringify(chartdata_infra);
				chart_infra.dataProvider = eval($scope.chartdata_infra_close_final);
				chartdata_infra = null;
				$scope.chartdata_infra_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_infra.dataProvider[i].value == 1){
						chart_infra.dataProvider[i].color = "green";
					}
					else{
						chart_infra.dataProvider[i].color = "red";
					}
				}
				chart_infra.validateData();

				chart_metals = createChartObj_Month('m_chart_metals_sector_view');
				chartdata_metals = setChartData_Month(json_data, 'METAL', 'Close');
				setChartHeight('#m_chart_metals_sector_view',chartdata_metals.length);

				$scope.autolenght = Object.keys(chartdata_metals).length;
				$scope.chartdata_metals_close_final = JSON.stringify(chartdata_metals);
				chart_metals.dataProvider = eval($scope.chartdata_metals_close_final);
				chartdata_metals = null;
				$scope.chartdata_metals_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_metals.dataProvider[i].value == 1){
						chart_metals.dataProvider[i].color = "green";
					}
					else{
						chart_metals.dataProvider[i].color = "red";
					}
				}
				chart_metals.validateData();


				chart_pharma = createChartObj_Month('m_chart_pharma_sector_view');
				chartdata_pharma = setChartData_Month(json_data, 'PHARMA', 'Close');
				setChartHeight('#m_chart_pharma_sector_view',chartdata_pharma.length);
				$scope.autolenght = Object.keys(chartdata_pharma).length;
				$scope.chartdata_pharma_close_final = JSON.stringify(chartdata_pharma);
				chart_pharma.dataProvider = eval($scope.chartdata_pharma_close_final);
				chartdata_pharma = null;
				$scope.chartdata_pharma_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pharma.dataProvider[i].value == 1){
						chart_pharma.dataProvider[i].color = "green";
					}
					else{
						chart_pharma.dataProvider[i].color = "red";
					}
				}
				chart_pharma.validateData();



				
				chart_realty = createChartObj_Month('m_chart_realty_sector_view');
				chartdata_realty = setChartData_Month(json_data, 'REALTY', 'Close');
				setChartHeight('#m_chart_realty_sector_view',chartdata_realty.length);
				$scope.autolenght = Object.keys(chartdata_realty).length;
				$scope.chartdata_realty_close_final = JSON.stringify(chartdata_realty);
				chart_realty.dataProvider = eval($scope.chartdata_realty_close_final);
				chartdata_realty = null;
				$scope.chartdata_realty_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_realty.dataProvider[i].value == 1){
						chart_realty.dataProvider[i].color = "green";
					}
					else{
						chart_realty.dataProvider[i].color = "red";
					}
				}
				chart_realty.validateData();





				let chartdata_commodities = []
				chart_commodities = createChartObj_Month('m_chart_commodities_sector_view');
				chartdata_commodities = setChartData_Month(json_data, 'COMMODITIES', 'Close');
				setChartHeight('#m_chart_commodities_sector_view',chartdata_commodities.length);
				$scope.autolenght = Object.keys(chartdata_commodities).length;
				$scope.chartdata_commodities_close_final = JSON.stringify(chartdata_commodities);
				chart_commodities.dataProvider = eval($scope.chartdata_commodities_close_final);
				chartdata_commodities = null;
				$scope.chartdata_commodities_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_commodities.dataProvider[i].value == 1){
						chart_commodities.dataProvider[i].color = "green";
					}
					else{
						chart_commodities.dataProvider[i].color = "red";
					}
				}
				chart_commodities.validateData();

				
				let chartdata_consumption = []
				chart_consumption = createChartObj_Month('m_chart_consumption_sector_view');
				chartdata_consumption = setChartData_Month(json_data, 'CONSUMPTION', 'Close');
				setChartHeight('#m_chart_consumption_sector_view',chartdata_consumption.length);
				$scope.autolenght = Object.keys(chartdata_consumption).length;
				$scope.chartdata_consumption_close_final = JSON.stringify(chartdata_consumption);
				chart_consumption.dataProvider = eval($scope.chartdata_consumption_close_final);
				chartdata_consumption = null;
				$scope.chartdata_consumption_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_consumption.dataProvider[i].value == 1){
						chart_consumption.dataProvider[i].color = "green";
					}
					else{
						chart_consumption.dataProvider[i].color = "red";
					}
				}
				chart_consumption.validateData();


				chart_energy = createChartObj_Month('m_chart_energy_sector_view');
				chartdata_energy = setChartData_Month(json_data, 'ENERGY', 'Close');
				setChartHeight('#m_chart_energy_sector_view',chartdata_energy.length);
				$scope.autolenght = Object.keys(chartdata_energy).length;
				$scope.chartdata_energy_close_final = JSON.stringify(chartdata_energy);
				chart_energy.dataProvider = eval($scope.chartdata_energy_close_final);
				chartdata_energy = null;
				$scope.chartdata_energy_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_energy.dataProvider[i].value == 1){
						chart_energy.dataProvider[i].color = "green";
					}
					else{
						chart_energy.dataProvider[i].color = "red";
					}
				}
				chart_energy.validateData();


				let chartdata_cpse = []
				chart_cpse = createChartObj_Month('m_chart_cpse_sector_view');
				chartdata_cpse = setChartData_Month(json_data, 'CPSE', 'Close');
				setChartHeight('#m_chart_cpse_sector_view',chartdata_cpse.length);
				$scope.autolenght = Object.keys(chartdata_cpse).length;
				$scope.chartdata_cpse_close_final = JSON.stringify(chartdata_cpse);
				chart_cpse.dataProvider = eval($scope.chartdata_cpse_close_final);
				chartdata_cpse = null;
				$scope.chartdata_cpse_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_cpse.dataProvider[i].value == 1){
						chart_cpse.dataProvider[i].color = "green";
					}
					else{
						chart_cpse.dataProvider[i].color = "red";
					}
				}
				chart_cpse.validateData();


				let chartdata_pse = []
				chart_pse = createChartObj_Month('m_chart_pse_sector_view');
				chartdata_pse = setChartData_Month(json_data, 'PSE', 'Close');
				setChartHeight('#m_chart_pse_sector_view',chartdata_pse.length);
				$scope.autolenght = Object.keys(chartdata_pse).length;
				$scope.chartdata_pse_close_final = JSON.stringify(chartdata_pse);
				chart_pse.dataProvider = eval($scope.chartdata_pse_close_final);
				chartdata_pse = null;
				$scope.chartdata_pse_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pse.dataProvider[i].value == 1){
						chart_pse.dataProvider[i].color = "green";
					}
					else{
						chart_pse.dataProvider[i].color = "red";
					}
				}
				chart_pse.validateData();


				chart_media = createChartObj_Month('m_chart_media_sector_view');
				chartdata_media = setChartData_Month(json_data, 'MEDIA', 'Close');
				setChartHeight('#m_chart_media_sector_view',chartdata_media.length);

				$scope.autolenght = Object.keys(chartdata_media).length;
				$scope.chartdata_media_close_final = JSON.stringify(chartdata_media);
				chart_media.dataProvider = eval($scope.chartdata_media_close_final);
				chartdata_media = null;
				$scope.chartdata_media_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_media.dataProvider[i].value == 1){
						chart_media.dataProvider[i].color = "green";
					}
					else{
						chart_media.dataProvider[i].color = "red";
					}
				}
				chart_media.validateData();


				json_data = null;
			};

			function marketviewchange_open_Month(data) {
				json_data = data;
				NAME = [];
				CHGPCT = [];
				CHGPCTSTR = [];
				COLOR = [];
				LTP = [];
				LTPSTR = [];
				chartdata_auto = [];
				chartdata_it = [];
				chartdata_bank = [];
				chartdata_finance = [];
				chartdata_indus_mfg = [];
				chartdata_fmcg = [];
				chartdata_cement = [];
				chartdata_chemical = [];
				chartdata_construction = [];
				chartdata_energy = [];
				chartdata_metals = [];
				chartdata_pharma = [];
				chartdata_media = [];
				chartdata_realty = [];
				chartdata_textiles = [];
				chartdata_telecom = [];
				chartdata_healthcare = [];
				chartdata_others = [];


				chart_auto = createChartObj_Month('m_chart_auto_sector_view');
				chartdata_auto = setChartData_Month(json_data, 'AUTO', 'Open');
				setChartHeight('#m_chart_auto_sector_view',chartdata_auto.length);

				$scope.autolenght = Object.keys(chartdata_auto).length;
				$scope.chartdata_auto_close_final = JSON.stringify(chartdata_auto);
				chart_auto.dataProvider = eval($scope.chartdata_auto_close_final);
				chartdata_auto = null;
				$scope.chartdata_auto_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_auto.dataProvider[i].value == 1){
						chart_auto.dataProvider[i].color = "green";
					}
					else{
						chart_auto.dataProvider[i].color = "red";
					}
				}
				chart_auto.validateData();


				chart_fmcg = createChartObj_Month('m_chart_fmcg_sector_view');
				chartdata_fmcg = setChartData_Month(json_data, 'FMCG', 'Open');
				setChartHeight('#m_chart_fmcg_sector_view',chartdata_fmcg.length);
				$scope.autolenght = Object.keys(chartdata_fmcg).length;
				$scope.chartdata_fmcg_close_final = JSON.stringify(chartdata_fmcg);
				chart_fmcg.dataProvider = eval($scope.chartdata_fmcg_close_final);
				chartdata_fmcg = null;
				$scope.chartdata_fmcg_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_fmcg.dataProvider[i].value == 1){
						chart_fmcg.dataProvider[i].color = "green";
					}
					else{
						chart_fmcg.dataProvider[i].color = "red";
					}
				}
				chart_fmcg.validateData();

				chart_pvt_bank = createChartObj_Month('m_chart_pvt_bank_sector_view');
				chartdata_pvt_bank = setChartData_Month(json_data, 'PVT BANK', 'Open');
				setChartHeight('#m_chart_pvt_bank_sector_view',chartdata_pvt_bank.length);

				$scope.autolenght = Object.keys(chartdata_pvt_bank).length;
				$scope.chartdata_pvt_bank_close_final = JSON.stringify(chartdata_pvt_bank);
				chart_pvt_bank.dataProvider = eval($scope.chartdata_pvt_bank_close_final);
				chartdata_pvt_bank = null;
				$scope.chartdata_pvt_bank_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pvt_bank.dataProvider[i].value == 1){
						chart_pvt_bank.dataProvider[i].color = "green";
					}
					else{
						chart_pvt_bank.dataProvider[i].color = "red";
					}
				}
				chart_pvt_bank.validateData();


				chart_finance = createChartObj_Month('m_chart_finance_sector_view');
				chartdata_finance = setChartData_Month(json_data, 'FIN-SERV', 'Open');
				$scope.len_1 = chartdata_finance.length
				setChartHeight('#m_chart_finance_sector_view',chartdata_finance.length);
				$scope.autolenght = Object.keys(chartdata_finance).length;
				$scope.chartdata_finance_close_final = JSON.stringify(chartdata_finance);
				chart_finance.dataProvider = eval($scope.chartdata_finance_close_final);
				chartdata_finance = null;
				$scope.chartdata_finance_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_finance.dataProvider[i].value == 1){
						chart_finance.dataProvider[i].color = "green";
					}
					else{
						chart_finance.dataProvider[i].color = "red";
					}
				}
				chart_finance.validateData();

				chart_psu_bank = createChartObj_Month('m_chart_psu_bank_sector_view');
				chartdata_psu_bank = setChartData_Month(json_data, 'PSU BANK', 'Open');
				setChartHeight('#m_chart_psu_bank_sector_view',chartdata_psu_bank.length);
				$scope.autolenght = Object.keys(chartdata_psu_bank).length;
				$scope.chartdata_psu_bank_close_final = JSON.stringify(chartdata_psu_bank);
				chart_psu_bank.dataProvider = eval($scope.chartdata_psu_bank_close_final);
				chartdata_psu_bank = null;
				$scope.chartdata_psu_bank_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_psu_bank.dataProvider[i].value == 1){
						chart_psu_bank.dataProvider[i].color = "green";
					}
					else{
						chart_psu_bank.dataProvider[i].color = "red";
					}
				}
				chart_psu_bank.validateData();


				
				chart_it = createChartObj_Month('m_chart_it_sector_view');
				chartdata_it = setChartData_Month(json_data, 'IT', 'Open');
				setChartHeight('#m_chart_it_sector_view',chartdata_it.length);
				$scope.autolenght = Object.keys(chartdata_it).length;
				$scope.chartdata_it_close_final = JSON.stringify(chartdata_it);
				chart_it.dataProvider = eval($scope.chartdata_it_close_final);
				chartdata_it = null;
				$scope.chartdata_it_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_it.dataProvider[i].value == 1){
						chart_it.dataProvider[i].color = "green";
					}
					else{
						chart_it.dataProvider[i].color = "red";
					}
				}
				chart_it.validateData();

				let chartdata_infra = []
				chart_infra = createChartObj_Month('m_chart_infra_sector_view');
				chartdata_infra = setChartData_Month(json_data, 'INFRA', 'Open');
				setChartHeight('#m_chart_infra_sector_view',chartdata_infra.length);
				$scope.autolenght = Object.keys(chartdata_infra).length;
				$scope.chartdata_infra_close_final = JSON.stringify(chartdata_infra);
				chart_infra.dataProvider = eval($scope.chartdata_infra_close_final);
				chartdata_infra = null;
				$scope.chartdata_infra_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_infra.dataProvider[i].value == 1){
						chart_infra.dataProvider[i].color = "green";
					}
					else{
						chart_infra.dataProvider[i].color = "red";
					}
				}
				chart_infra.validateData();

				chart_metals = createChartObj_Month('m_chart_metals_sector_view');
				chartdata_metals = setChartData_Month(json_data, 'METAL', 'Open');
				setChartHeight('#m_chart_metals_sector_view',chartdata_metals.length);

				$scope.autolenght = Object.keys(chartdata_metals).length;
				$scope.chartdata_metals_close_final = JSON.stringify(chartdata_metals);
				chart_metals.dataProvider = eval($scope.chartdata_metals_close_final);
				chartdata_metals = null;
				$scope.chartdata_metals_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_metals.dataProvider[i].value == 1){
						chart_metals.dataProvider[i].color = "green";
					}
					else{
						chart_metals.dataProvider[i].color = "red";
					}
				}
				chart_metals.validateData();


				chart_pharma = createChartObj_Month('m_chart_pharma_sector_view');
				chartdata_pharma = setChartData_Month(json_data, 'PHARMA', 'Open');
				setChartHeight('#m_chart_pharma_sector_view',chartdata_pharma.length);
				$scope.autolenght = Object.keys(chartdata_pharma).length;
				$scope.chartdata_pharma_close_final = JSON.stringify(chartdata_pharma);
				chart_pharma.dataProvider = eval($scope.chartdata_pharma_close_final);
				chartdata_pharma = null;
				$scope.chartdata_pharma_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pharma.dataProvider[i].value == 1){
						chart_pharma.dataProvider[i].color = "green";
					}
					else{
						chart_pharma.dataProvider[i].color = "red";
					}
				}
				chart_pharma.validateData();



				
				chart_realty = createChartObj_Month('m_chart_realty_sector_view');
				chartdata_realty = setChartData_Month(json_data, 'REALTY', 'Open');
				setChartHeight('#m_chart_realty_sector_view',chartdata_realty.length);
				$scope.autolenght = Object.keys(chartdata_realty).length;
				$scope.chartdata_realty_close_final = JSON.stringify(chartdata_realty);
				chart_realty.dataProvider = eval($scope.chartdata_realty_close_final);
				chartdata_realty = null;
				$scope.chartdata_realty_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_realty.dataProvider[i].value == 1){
						chart_realty.dataProvider[i].color = "green";
					}
					else{
						chart_realty.dataProvider[i].color = "red";
					}
				}
				chart_realty.validateData();





				let chartdata_commodities = []
				chart_commodities = createChartObj_Month('m_chart_commodities_sector_view');
				chartdata_commodities = setChartData_Month(json_data, 'COMMODITIES', 'Open');
				setChartHeight('#m_chart_commodities_sector_view',chartdata_commodities.length);
				$scope.autolenght = Object.keys(chartdata_commodities).length;
				$scope.chartdata_commodities_close_final = JSON.stringify(chartdata_commodities);
				chart_commodities.dataProvider = eval($scope.chartdata_commodities_close_final);
				chartdata_commodities = null;
				$scope.chartdata_commodities_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_commodities.dataProvider[i].value == 1){
						chart_commodities.dataProvider[i].color = "green";
					}
					else{
						chart_commodities.dataProvider[i].color = "red";
					}
				}
				chart_commodities.validateData();

				
				let chartdata_consumption = []
				chart_consumption = createChartObj_Month('m_chart_consumption_sector_view');
				chartdata_consumption = setChartData_Month(json_data, 'CONSUMPTION', 'Open');
				setChartHeight('#m_chart_consumption_sector_view',chartdata_consumption.length);
				$scope.autolenght = Object.keys(chartdata_consumption).length;
				$scope.chartdata_consumption_close_final = JSON.stringify(chartdata_consumption);
				chart_consumption.dataProvider = eval($scope.chartdata_consumption_close_final);
				chartdata_consumption = null;
				$scope.chartdata_consumption_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_consumption.dataProvider[i].value == 1){
						chart_consumption.dataProvider[i].color = "green";
					}
					else{
						chart_consumption.dataProvider[i].color = "red";
					}
				}
				chart_consumption.validateData();


				chart_energy = createChartObj_Month('m_chart_energy_sector_view');
				chartdata_energy = setChartData_Month(json_data, 'ENERGY', 'Open');
				setChartHeight('#m_chart_energy_sector_view',chartdata_energy.length);
				$scope.autolenght = Object.keys(chartdata_energy).length;
				$scope.chartdata_energy_close_final = JSON.stringify(chartdata_energy);
				chart_energy.dataProvider = eval($scope.chartdata_energy_close_final);
				chartdata_energy = null;
				$scope.chartdata_energy_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_energy.dataProvider[i].value == 1){
						chart_energy.dataProvider[i].color = "green";
					}
					else{
						chart_energy.dataProvider[i].color = "red";
					}
				}
				chart_energy.validateData();


				let chartdata_cpse = []
				chart_cpse = createChartObj_Month('m_chart_cpse_sector_view');
				chartdata_cpse = setChartData_Month(json_data, 'CPSE', 'Open');
				setChartHeight('#m_chart_cpse_sector_view',chartdata_cpse.length);
				$scope.autolenght = Object.keys(chartdata_cpse).length;
				$scope.chartdata_cpse_close_final = JSON.stringify(chartdata_cpse);
				chart_cpse.dataProvider = eval($scope.chartdata_cpse_close_final);
				chartdata_cpse = null;
				$scope.chartdata_cpse_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_cpse.dataProvider[i].value == 1){
						chart_cpse.dataProvider[i].color = "green";
					}
					else{
						chart_cpse.dataProvider[i].color = "red";
					}
				}
				chart_cpse.validateData();


				let chartdata_pse = []
				chart_pse = createChartObj_Month('m_chart_pse_sector_view');
				chartdata_pse = setChartData_Month(json_data, 'PSE', 'Open');
				setChartHeight('#m_chart_pse_sector_view',chartdata_pse.length);
				$scope.autolenght = Object.keys(chartdata_pse).length;
				$scope.chartdata_pse_close_final = JSON.stringify(chartdata_pse);
				chart_pse.dataProvider = eval($scope.chartdata_pse_close_final);
				chartdata_pse = null;
				$scope.chartdata_pse_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pse.dataProvider[i].value == 1){
						chart_pse.dataProvider[i].color = "green";
					}
					else{
						chart_pse.dataProvider[i].color = "red";
					}
				}
				chart_pse.validateData();


				chart_media = createChartObj_Month('m_chart_media_sector_view');
				chartdata_media = setChartData_Month(json_data, 'MEDIA', 'Open');
				setChartHeight('#m_chart_media_sector_view',chartdata_media.length);

				$scope.autolenght = Object.keys(chartdata_media).length;
				$scope.chartdata_media_close_final = JSON.stringify(chartdata_media);
				chart_media.dataProvider = eval($scope.chartdata_media_close_final);
				chartdata_media = null;
				$scope.chartdata_media_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_media.dataProvider[i].value == 1){
						chart_media.dataProvider[i].color = "green";
					}
					else{
						chart_media.dataProvider[i].color = "red";
					}
				}
				chart_media.validateData();


				json_data = null;

			};

			function marketviewchange_close_Quarter(data){
				json_data = data;
				NAME = [];
				CHGPCT = [];
				CHGPCTSTR = [];
				COLOR = [];
				LTP = [];
				LTPSTR = [];
				chartdata_auto = [];
				chartdata_it = [];
				chartdata_bank = [];
				chartdata_finance = [];
				chartdata_indus_mfg = [];
				chartdata_fmcg = [];
				chartdata_cement = [];
				chartdata_chemical = [];
				chartdata_construction = [];
				chartdata_energy = [];
				chartdata_metals = [];
				chartdata_pharma = [];
				chartdata_media = [];
				chartdata_realty = [];
				chartdata_textiles = [];
				chartdata_telecom = [];
				chartdata_healthcare = [];
				chartdata_others = [];


				chart_auto = createChartObj_Quarter('m_chart_auto_sector_view');
				chartdata_auto = setChartData_Quarter(json_data, 'AUTO', 'Close');
				setChartHeight('#m_chart_auto_sector_view',chartdata_auto.length);

				$scope.autolenght = Object.keys(chartdata_auto).length;
				$scope.chartdata_auto_close_final = JSON.stringify(chartdata_auto);
				chart_auto.dataProvider = eval($scope.chartdata_auto_close_final);
				chartdata_auto = null;
				$scope.chartdata_auto_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_auto.dataProvider[i].value == 1){
						chart_auto.dataProvider[i].color = "green";
					}
					else{
						chart_auto.dataProvider[i].color = "red";
					}
				}
				chart_auto.validateData();


				chart_fmcg = createChartObj_Quarter('m_chart_fmcg_sector_view');
				chartdata_fmcg = setChartData_Quarter(json_data, 'FMCG', 'Close');
				setChartHeight('#m_chart_fmcg_sector_view',chartdata_fmcg.length);
				$scope.autolenght = Object.keys(chartdata_fmcg).length;
				$scope.chartdata_fmcg_close_final = JSON.stringify(chartdata_fmcg);
				chart_fmcg.dataProvider = eval($scope.chartdata_fmcg_close_final);
				chartdata_fmcg = null;
				$scope.chartdata_fmcg_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_fmcg.dataProvider[i].value == 1){
						chart_fmcg.dataProvider[i].color = "green";
					}
					else{
						chart_fmcg.dataProvider[i].color = "red";
					}
				}
				chart_fmcg.validateData();

				chart_pvt_bank = createChartObj_Quarter('m_chart_pvt_bank_sector_view');
				chartdata_pvt_bank = setChartData_Quarter(json_data, 'PVT BANK', 'Close');
				setChartHeight('#m_chart_pvt_bank_sector_view',chartdata_pvt_bank.length);

				$scope.autolenght = Object.keys(chartdata_pvt_bank).length;
				$scope.chartdata_pvt_bank_close_final = JSON.stringify(chartdata_pvt_bank);
				chart_pvt_bank.dataProvider = eval($scope.chartdata_pvt_bank_close_final);
				chartdata_pvt_bank = null;
				$scope.chartdata_pvt_bank_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pvt_bank.dataProvider[i].value == 1){
						chart_pvt_bank.dataProvider[i].color = "green";
					}
					else{
						chart_pvt_bank.dataProvider[i].color = "red";
					}
				}
				chart_pvt_bank.validateData();


				chart_finance = createChartObj_Quarter('m_chart_finance_sector_view');
				chartdata_finance = setChartData_Quarter(json_data, 'FIN-SERV', 'Close');
				$scope.len_1 = chartdata_finance.length
				setChartHeight('#m_chart_finance_sector_view',chartdata_finance.length);
				$scope.autolenght = Object.keys(chartdata_finance).length;
				$scope.chartdata_finance_close_final = JSON.stringify(chartdata_finance);
				chart_finance.dataProvider = eval($scope.chartdata_finance_close_final);
				chartdata_finance = null;
				$scope.chartdata_finance_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_finance.dataProvider[i].value == 1){
						chart_finance.dataProvider[i].color = "green";
					}
					else{
						chart_finance.dataProvider[i].color = "red";
					}
				}
				chart_finance.validateData();

				chart_psu_bank = createChartObj_Quarter('m_chart_psu_bank_sector_view');
				chartdata_psu_bank = setChartData_Quarter(json_data, 'PSU BANK', 'Close');
				setChartHeight('#m_chart_psu_bank_sector_view',chartdata_psu_bank.length);
				$scope.autolenght = Object.keys(chartdata_psu_bank).length;
				$scope.chartdata_psu_bank_close_final = JSON.stringify(chartdata_psu_bank);
				chart_psu_bank.dataProvider = eval($scope.chartdata_psu_bank_close_final);
				chartdata_psu_bank = null;
				$scope.chartdata_psu_bank_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_psu_bank.dataProvider[i].value == 1){
						chart_psu_bank.dataProvider[i].color = "green";
					}
					else{
						chart_psu_bank.dataProvider[i].color = "red";
					}
				}
				chart_psu_bank.validateData();


				
				chart_it = createChartObj_Quarter('m_chart_it_sector_view');
				chartdata_it = setChartData_Quarter(json_data, 'IT', 'Close');
				setChartHeight('#m_chart_it_sector_view',chartdata_it.length);
				$scope.autolenght = Object.keys(chartdata_it).length;
				$scope.chartdata_it_close_final = JSON.stringify(chartdata_it);
				chart_it.dataProvider = eval($scope.chartdata_it_close_final);
				chartdata_it = null;
				$scope.chartdata_it_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_it.dataProvider[i].value == 1){
						chart_it.dataProvider[i].color = "green";
					}
					else{
						chart_it.dataProvider[i].color = "red";
					}
				}
				chart_it.validateData();

				let chartdata_infra = []
				chart_infra = createChartObj_Quarter('m_chart_infra_sector_view');
				chartdata_infra = setChartData_Quarter(json_data, 'INFRA', 'Close');
				setChartHeight('#m_chart_infra_sector_view',chartdata_infra.length);
				$scope.autolenght = Object.keys(chartdata_infra).length;
				$scope.chartdata_infra_close_final = JSON.stringify(chartdata_infra);
				chart_infra.dataProvider = eval($scope.chartdata_infra_close_final);
				chartdata_infra = null;
				$scope.chartdata_infra_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_infra.dataProvider[i].value == 1){
						chart_infra.dataProvider[i].color = "green";
					}
					else{
						chart_infra.dataProvider[i].color = "red";
					}
				}
				chart_infra.validateData();

				chart_metals = createChartObj_Quarter('m_chart_metals_sector_view');
				chartdata_metals = setChartData_Quarter(json_data, 'METAL', 'Close');
				setChartHeight('#m_chart_metals_sector_view',chartdata_metals.length);

				$scope.autolenght = Object.keys(chartdata_metals).length;
				$scope.chartdata_metals_close_final = JSON.stringify(chartdata_metals);
				chart_metals.dataProvider = eval($scope.chartdata_metals_close_final);
				chartdata_metals = null;
				$scope.chartdata_metals_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_metals.dataProvider[i].value == 1){
						chart_metals.dataProvider[i].color = "green";
					}
					else{
						chart_metals.dataProvider[i].color = "red";
					}
				}
				chart_metals.validateData();


				chart_pharma = createChartObj_Quarter('m_chart_pharma_sector_view');
				chartdata_pharma = setChartData_Quarter(json_data, 'PHARMA', 'Close');
				setChartHeight('#m_chart_pharma_sector_view',chartdata_pharma.length);
				$scope.autolenght = Object.keys(chartdata_pharma).length;
				$scope.chartdata_pharma_close_final = JSON.stringify(chartdata_pharma);
				chart_pharma.dataProvider = eval($scope.chartdata_pharma_close_final);
				chartdata_pharma = null;
				$scope.chartdata_pharma_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pharma.dataProvider[i].value == 1){
						chart_pharma.dataProvider[i].color = "green";
					}
					else{
						chart_pharma.dataProvider[i].color = "red";
					}
				}
				chart_pharma.validateData();



				
				chart_realty = createChartObj_Quarter('m_chart_realty_sector_view');
				chartdata_realty = setChartData_Quarter(json_data, 'REALTY', 'Close');
				setChartHeight('#m_chart_realty_sector_view',chartdata_realty.length);
				$scope.autolenght = Object.keys(chartdata_realty).length;
				$scope.chartdata_realty_close_final = JSON.stringify(chartdata_realty);
				chart_realty.dataProvider = eval($scope.chartdata_realty_close_final);
				chartdata_realty = null;
				$scope.chartdata_realty_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_realty.dataProvider[i].value == 1){
						chart_realty.dataProvider[i].color = "green";
					}
					else{
						chart_realty.dataProvider[i].color = "red";
					}
				}
				chart_realty.validateData();





				let chartdata_commodities = []
				chart_commodities = createChartObj_Quarter('m_chart_commodities_sector_view');
				chartdata_commodities = setChartData_Quarter(json_data, 'COMMODITIES', 'Close');
				setChartHeight('#m_chart_commodities_sector_view',chartdata_commodities.length);
				$scope.autolenght = Object.keys(chartdata_commodities).length;
				$scope.chartdata_commodities_close_final = JSON.stringify(chartdata_commodities);
				chart_commodities.dataProvider = eval($scope.chartdata_commodities_close_final);
				chartdata_commodities = null;
				$scope.chartdata_commodities_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_commodities.dataProvider[i].value == 1){
						chart_commodities.dataProvider[i].color = "green";
					}
					else{
						chart_commodities.dataProvider[i].color = "red";
					}
				}
				chart_commodities.validateData();

				
				let chartdata_consumption = []
				chart_consumption = createChartObj_Quarter('m_chart_consumption_sector_view');
				chartdata_consumption = setChartData_Quarter(json_data, 'CONSUMPTION', 'Close');
				setChartHeight('#m_chart_consumption_sector_view',chartdata_consumption.length);
				$scope.autolenght = Object.keys(chartdata_consumption).length;
				$scope.chartdata_consumption_close_final = JSON.stringify(chartdata_consumption);
				chart_consumption.dataProvider = eval($scope.chartdata_consumption_close_final);
				chartdata_consumption = null;
				$scope.chartdata_consumption_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_consumption.dataProvider[i].value == 1){
						chart_consumption.dataProvider[i].color = "green";
					}
					else{
						chart_consumption.dataProvider[i].color = "red";
					}
				}
				chart_consumption.validateData();


				chart_energy = createChartObj_Quarter('m_chart_energy_sector_view');
				chartdata_energy = setChartData_Quarter(json_data, 'ENERGY', 'Close');
				setChartHeight('#m_chart_energy_sector_view',chartdata_energy.length);
				$scope.autolenght = Object.keys(chartdata_energy).length;
				$scope.chartdata_energy_close_final = JSON.stringify(chartdata_energy);
				chart_energy.dataProvider = eval($scope.chartdata_energy_close_final);
				chartdata_energy = null;
				$scope.chartdata_energy_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_energy.dataProvider[i].value == 1){
						chart_energy.dataProvider[i].color = "green";
					}
					else{
						chart_energy.dataProvider[i].color = "red";
					}
				}
				chart_energy.validateData();


				let chartdata_cpse = []
				chart_cpse = createChartObj_Quarter('m_chart_cpse_sector_view');
				chartdata_cpse = setChartData_Quarter(json_data, 'CPSE', 'Close');
				setChartHeight('#m_chart_cpse_sector_view',chartdata_cpse.length);
				$scope.autolenght = Object.keys(chartdata_cpse).length;
				$scope.chartdata_cpse_close_final = JSON.stringify(chartdata_cpse);
				chart_cpse.dataProvider = eval($scope.chartdata_cpse_close_final);
				chartdata_cpse = null;
				$scope.chartdata_cpse_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_cpse.dataProvider[i].value == 1){
						chart_cpse.dataProvider[i].color = "green";
					}
					else{
						chart_cpse.dataProvider[i].color = "red";
					}
				}
				chart_cpse.validateData();


				let chartdata_pse = []
				chart_pse = createChartObj_Quarter('m_chart_pse_sector_view');
				chartdata_pse = setChartData_Quarter(json_data, 'PSE', 'Close');
				setChartHeight('#m_chart_pse_sector_view',chartdata_pse.length);
				$scope.autolenght = Object.keys(chartdata_pse).length;
				$scope.chartdata_pse_close_final = JSON.stringify(chartdata_pse);
				chart_pse.dataProvider = eval($scope.chartdata_pse_close_final);
				chartdata_pse = null;
				$scope.chartdata_pse_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pse.dataProvider[i].value == 1){
						chart_pse.dataProvider[i].color = "green";
					}
					else{
						chart_pse.dataProvider[i].color = "red";
					}
				}
				chart_pse.validateData();


				chart_media = createChartObj_Quarter('m_chart_media_sector_view');
				chartdata_media = setChartData_Quarter(json_data, 'MEDIA', 'Close');
				setChartHeight('#m_chart_media_sector_view',chartdata_media.length);

				$scope.autolenght = Object.keys(chartdata_media).length;
				$scope.chartdata_media_close_final = JSON.stringify(chartdata_media);
				chart_media.dataProvider = eval($scope.chartdata_media_close_final);
				chartdata_media = null;
				$scope.chartdata_media_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_media.dataProvider[i].value == 1){
						chart_media.dataProvider[i].color = "green";
					}
					else{
						chart_media.dataProvider[i].color = "red";
					}
				}
				chart_media.validateData();


				json_data = null;
			};

			function marketviewchange_open_Quarter(data) {
				json_data = data;
				NAME = [];
				CHGPCT = [];
				CHGPCTSTR = [];
				COLOR = [];
				LTP = [];
				LTPSTR = [];
				chartdata_auto = [];
				chartdata_it = [];
				chartdata_bank = [];
				chartdata_finance = [];
				chartdata_indus_mfg = [];
				chartdata_fmcg = [];
				chartdata_cement = [];
				chartdata_chemical = [];
				chartdata_construction = [];
				chartdata_energy = [];
				chartdata_metals = [];
				chartdata_pharma = [];
				chartdata_media = [];
				chartdata_realty = [];
				chartdata_textiles = [];
				chartdata_telecom = [];
				chartdata_healthcare = [];
				chartdata_others = [];


				chart_auto = createChartObj_Quarter('m_chart_auto_sector_view');
				chartdata_auto = setChartData_Quarter(json_data, 'AUTO', 'Open');
				setChartHeight('#m_chart_auto_sector_view',chartdata_auto.length);

				$scope.autolenght = Object.keys(chartdata_auto).length;
				$scope.chartdata_auto_close_final = JSON.stringify(chartdata_auto);
				chart_auto.dataProvider = eval($scope.chartdata_auto_close_final);
				chartdata_auto = null;
				$scope.chartdata_auto_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_auto.dataProvider[i].value == 1){
						chart_auto.dataProvider[i].color = "green";
					}
					else{
						chart_auto.dataProvider[i].color = "red";
					}
				}
				chart_auto.validateData();


				chart_fmcg = createChartObj_Quarter('m_chart_fmcg_sector_view');
				chartdata_fmcg = setChartData_Quarter(json_data, 'FMCG', 'Open');
				setChartHeight('#m_chart_fmcg_sector_view',chartdata_fmcg.length);
				$scope.autolenght = Object.keys(chartdata_fmcg).length;
				$scope.chartdata_fmcg_close_final = JSON.stringify(chartdata_fmcg);
				chart_fmcg.dataProvider = eval($scope.chartdata_fmcg_close_final);
				chartdata_fmcg = null;
				$scope.chartdata_fmcg_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_fmcg.dataProvider[i].value == 1){
						chart_fmcg.dataProvider[i].color = "green";
					}
					else{
						chart_fmcg.dataProvider[i].color = "red";
					}
				}
				chart_fmcg.validateData();

				chart_pvt_bank = createChartObj_Quarter('m_chart_pvt_bank_sector_view');
				chartdata_pvt_bank = setChartData_Quarter(json_data, 'PVT BANK', 'Open');
				setChartHeight('#m_chart_pvt_bank_sector_view',chartdata_pvt_bank.length);

				$scope.autolenght = Object.keys(chartdata_pvt_bank).length;
				$scope.chartdata_pvt_bank_close_final = JSON.stringify(chartdata_pvt_bank);
				chart_pvt_bank.dataProvider = eval($scope.chartdata_pvt_bank_close_final);
				chartdata_pvt_bank = null;
				$scope.chartdata_pvt_bank_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pvt_bank.dataProvider[i].value == 1){
						chart_pvt_bank.dataProvider[i].color = "green";
					}
					else{
						chart_pvt_bank.dataProvider[i].color = "red";
					}
				}
				chart_pvt_bank.validateData();


				chart_finance = createChartObj_Quarter('m_chart_finance_sector_view');
				chartdata_finance = setChartData_Quarter(json_data, 'FIN-SERV', 'Open');
				$scope.len_1 = chartdata_finance.length
				setChartHeight('#m_chart_finance_sector_view',chartdata_finance.length);
				$scope.autolenght = Object.keys(chartdata_finance).length;
				$scope.chartdata_finance_close_final = JSON.stringify(chartdata_finance);
				chart_finance.dataProvider = eval($scope.chartdata_finance_close_final);
				chartdata_finance = null;
				$scope.chartdata_finance_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_finance.dataProvider[i].value == 1){
						chart_finance.dataProvider[i].color = "green";
					}
					else{
						chart_finance.dataProvider[i].color = "red";
					}
				}
				chart_finance.validateData();

				chart_psu_bank = createChartObj_Quarter('m_chart_psu_bank_sector_view');
				chartdata_psu_bank = setChartData_Quarter(json_data, 'PSU BANK', 'Open');
				setChartHeight('#m_chart_psu_bank_sector_view',chartdata_psu_bank.length);
				$scope.autolenght = Object.keys(chartdata_psu_bank).length;
				$scope.chartdata_psu_bank_close_final = JSON.stringify(chartdata_psu_bank);
				chart_psu_bank.dataProvider = eval($scope.chartdata_psu_bank_close_final);
				chartdata_psu_bank = null;
				$scope.chartdata_psu_bank_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_psu_bank.dataProvider[i].value == 1){
						chart_psu_bank.dataProvider[i].color = "green";
					}
					else{
						chart_psu_bank.dataProvider[i].color = "red";
					}
				}
				chart_psu_bank.validateData();


				
				chart_it = createChartObj_Quarter('m_chart_it_sector_view');
				chartdata_it = setChartData_Quarter(json_data, 'IT', 'Open');
				setChartHeight('#m_chart_it_sector_view',chartdata_it.length);
				$scope.autolenght = Object.keys(chartdata_it).length;
				$scope.chartdata_it_close_final = JSON.stringify(chartdata_it);
				chart_it.dataProvider = eval($scope.chartdata_it_close_final);
				chartdata_it = null;
				$scope.chartdata_it_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_it.dataProvider[i].value == 1){
						chart_it.dataProvider[i].color = "green";
					}
					else{
						chart_it.dataProvider[i].color = "red";
					}
				}
				chart_it.validateData();

				let chartdata_infra = []
				chart_infra = createChartObj_Quarter('m_chart_infra_sector_view');
				chartdata_infra = setChartData_Quarter(json_data, 'INFRA', 'Open');
				setChartHeight('#m_chart_infra_sector_view',chartdata_infra.length);
				$scope.autolenght = Object.keys(chartdata_infra).length;
				$scope.chartdata_infra_close_final = JSON.stringify(chartdata_infra);
				chart_infra.dataProvider = eval($scope.chartdata_infra_close_final);
				chartdata_infra = null;
				$scope.chartdata_infra_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_infra.dataProvider[i].value == 1){
						chart_infra.dataProvider[i].color = "green";
					}
					else{
						chart_infra.dataProvider[i].color = "red";
					}
				}
				chart_infra.validateData();

				chart_metals = createChartObj_Quarter('m_chart_metals_sector_view');
				chartdata_metals = setChartData_Quarter(json_data, 'METAL', 'Open');
				setChartHeight('#m_chart_metals_sector_view',chartdata_metals.length);

				$scope.autolenght = Object.keys(chartdata_metals).length;
				$scope.chartdata_metals_close_final = JSON.stringify(chartdata_metals);
				chart_metals.dataProvider = eval($scope.chartdata_metals_close_final);
				chartdata_metals = null;
				$scope.chartdata_metals_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_metals.dataProvider[i].value == 1){
						chart_metals.dataProvider[i].color = "green";
					}
					else{
						chart_metals.dataProvider[i].color = "red";
					}
				}
				chart_metals.validateData();


				chart_pharma = createChartObj_Quarter('m_chart_pharma_sector_view');
				chartdata_pharma = setChartData_Quarter(json_data, 'PHARMA', 'Open');
				setChartHeight('#m_chart_pharma_sector_view',chartdata_pharma.length);
				$scope.autolenght = Object.keys(chartdata_pharma).length;
				$scope.chartdata_pharma_close_final = JSON.stringify(chartdata_pharma);
				chart_pharma.dataProvider = eval($scope.chartdata_pharma_close_final);
				chartdata_pharma = null;
				$scope.chartdata_pharma_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pharma.dataProvider[i].value == 1){
						chart_pharma.dataProvider[i].color = "green";
					}
					else{
						chart_pharma.dataProvider[i].color = "red";
					}
				}
				chart_pharma.validateData();



				
				chart_realty = createChartObj_Quarter('m_chart_realty_sector_view');
				chartdata_realty = setChartData_Quarter(json_data, 'REALTY', 'Open');
				setChartHeight('#m_chart_realty_sector_view',chartdata_realty.length);
				$scope.autolenght = Object.keys(chartdata_realty).length;
				$scope.chartdata_realty_close_final = JSON.stringify(chartdata_realty);
				chart_realty.dataProvider = eval($scope.chartdata_realty_close_final);
				chartdata_realty = null;
				$scope.chartdata_realty_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_realty.dataProvider[i].value == 1){
						chart_realty.dataProvider[i].color = "green";
					}
					else{
						chart_realty.dataProvider[i].color = "red";
					}
				}
				chart_realty.validateData();





				let chartdata_commodities = []
				chart_commodities = createChartObj_Quarter('m_chart_commodities_sector_view');
				chartdata_commodities = setChartData_Quarter(json_data, 'COMMODITIES', 'Open');
				setChartHeight('#m_chart_commodities_sector_view',chartdata_commodities.length);
				$scope.autolenght = Object.keys(chartdata_commodities).length;
				$scope.chartdata_commodities_close_final = JSON.stringify(chartdata_commodities);
				chart_commodities.dataProvider = eval($scope.chartdata_commodities_close_final);
				chartdata_commodities = null;
				$scope.chartdata_commodities_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_commodities.dataProvider[i].value == 1){
						chart_commodities.dataProvider[i].color = "green";
					}
					else{
						chart_commodities.dataProvider[i].color = "red";
					}
				}
				chart_commodities.validateData();

				
				let chartdata_consumption = []
				chart_consumption = createChartObj_Quarter('m_chart_consumption_sector_view');
				chartdata_consumption = setChartData_Quarter(json_data, 'CONSUMPTION', 'Open');
				setChartHeight('#m_chart_consumption_sector_view',chartdata_consumption.length);
				$scope.autolenght = Object.keys(chartdata_consumption).length;
				$scope.chartdata_consumption_close_final = JSON.stringify(chartdata_consumption);
				chart_consumption.dataProvider = eval($scope.chartdata_consumption_close_final);
				chartdata_consumption = null;
				$scope.chartdata_consumption_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_consumption.dataProvider[i].value == 1){
						chart_consumption.dataProvider[i].color = "green";
					}
					else{
						chart_consumption.dataProvider[i].color = "red";
					}
				}
				chart_consumption.validateData();


				chart_energy = createChartObj_Quarter('m_chart_energy_sector_view');
				chartdata_energy = setChartData_Quarter(json_data, 'ENERGY', 'Open');
				setChartHeight('#m_chart_energy_sector_view',chartdata_energy.length);
				$scope.autolenght = Object.keys(chartdata_energy).length;
				$scope.chartdata_energy_close_final = JSON.stringify(chartdata_energy);
				chart_energy.dataProvider = eval($scope.chartdata_energy_close_final);
				chartdata_energy = null;
				$scope.chartdata_energy_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_energy.dataProvider[i].value == 1){
						chart_energy.dataProvider[i].color = "green";
					}
					else{
						chart_energy.dataProvider[i].color = "red";
					}
				}
				chart_energy.validateData();


				let chartdata_cpse = []
				chart_cpse = createChartObj_Quarter('m_chart_cpse_sector_view');
				chartdata_cpse = setChartData_Quarter(json_data, 'CPSE', 'Open');
				setChartHeight('#m_chart_cpse_sector_view',chartdata_cpse.length);
				$scope.autolenght = Object.keys(chartdata_cpse).length;
				$scope.chartdata_cpse_close_final = JSON.stringify(chartdata_cpse);
				chart_cpse.dataProvider = eval($scope.chartdata_cpse_close_final);
				chartdata_cpse = null;
				$scope.chartdata_cpse_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_cpse.dataProvider[i].value == 1){
						chart_cpse.dataProvider[i].color = "green";
					}
					else{
						chart_cpse.dataProvider[i].color = "red";
					}
				}
				chart_cpse.validateData();


				let chartdata_pse = []
				chart_pse = createChartObj_Quarter('m_chart_pse_sector_view');
				chartdata_pse = setChartData_Quarter(json_data, 'PSE', 'Open');
				setChartHeight('#m_chart_pse_sector_view',chartdata_pse.length);
				$scope.autolenght = Object.keys(chartdata_pse).length;
				$scope.chartdata_pse_close_final = JSON.stringify(chartdata_pse);
				chart_pse.dataProvider = eval($scope.chartdata_pse_close_final);
				chartdata_pse = null;
				$scope.chartdata_pse_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pse.dataProvider[i].value == 1){
						chart_pse.dataProvider[i].color = "green";
					}
					else{
						chart_pse.dataProvider[i].color = "red";
					}
				}
				chart_pse.validateData();


				chart_media = createChartObj_Quarter('m_chart_media_sector_view');
				chartdata_media = setChartData_Quarter(json_data, 'MEDIA', 'Open');
				setChartHeight('#m_chart_media_sector_view',chartdata_media.length);

				$scope.autolenght = Object.keys(chartdata_media).length;
				$scope.chartdata_media_close_final = JSON.stringify(chartdata_media);
				chart_media.dataProvider = eval($scope.chartdata_media_close_final);
				chartdata_media = null;
				$scope.chartdata_media_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_media.dataProvider[i].value == 1){
						chart_media.dataProvider[i].color = "green";
					}
					else{
						chart_media.dataProvider[i].color = "red";
					}
				}
				chart_media.validateData();


				json_data = null;

			};

			function marketviewchange_close_Annual(data){
				json_data = data;
				NAME = [];
				CHGPCT = [];
				CHGPCTSTR = [];
				COLOR = [];
				LTP = [];
				LTPSTR = [];
				chartdata_auto = [];
				chartdata_it = [];
				chartdata_bank = [];
				chartdata_finance = [];
				chartdata_indus_mfg = [];
				chartdata_fmcg = [];
				chartdata_cement = [];
				chartdata_chemical = [];
				chartdata_construction = [];
				chartdata_energy = [];
				chartdata_metals = [];
				chartdata_pharma = [];
				chartdata_media = [];
				chartdata_realty = [];
				chartdata_textiles = [];
				chartdata_telecom = [];
				chartdata_healthcare = [];
				chartdata_others = [];


				chart_auto = createChartObj_Annual('m_chart_auto_sector_view');
				chartdata_auto = setChartData_Annual(json_data, 'AUTO', 'Close');
				setChartHeight('#m_chart_auto_sector_view',chartdata_auto.length);

				$scope.autolenght = Object.keys(chartdata_auto).length;
				$scope.chartdata_auto_close_final = JSON.stringify(chartdata_auto);
				chart_auto.dataProvider = eval($scope.chartdata_auto_close_final);
				chartdata_auto = null;
				$scope.chartdata_auto_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_auto.dataProvider[i].value == 1){
						chart_auto.dataProvider[i].color = "green";
					}
					else{
						chart_auto.dataProvider[i].color = "red";
					}
				}
				chart_auto.validateData();


				chart_fmcg = createChartObj_Annual('m_chart_fmcg_sector_view');
				chartdata_fmcg = setChartData_Annual(json_data, 'FMCG', 'Close');
				setChartHeight('#m_chart_fmcg_sector_view',chartdata_fmcg.length);
				$scope.autolenght = Object.keys(chartdata_fmcg).length;
				$scope.chartdata_fmcg_close_final = JSON.stringify(chartdata_fmcg);
				chart_fmcg.dataProvider = eval($scope.chartdata_fmcg_close_final);
				chartdata_fmcg = null;
				$scope.chartdata_fmcg_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_fmcg.dataProvider[i].value == 1){
						chart_fmcg.dataProvider[i].color = "green";
					}
					else{
						chart_fmcg.dataProvider[i].color = "red";
					}
				}
				chart_fmcg.validateData();

				chart_pvt_bank = createChartObj_Annual('m_chart_pvt_bank_sector_view');
				chartdata_pvt_bank = setChartData_Annual(json_data, 'PVT BANK', 'Close');
				setChartHeight('#m_chart_pvt_bank_sector_view',chartdata_pvt_bank.length);

				$scope.autolenght = Object.keys(chartdata_pvt_bank).length;
				$scope.chartdata_pvt_bank_close_final = JSON.stringify(chartdata_pvt_bank);
				chart_pvt_bank.dataProvider = eval($scope.chartdata_pvt_bank_close_final);
				chartdata_pvt_bank = null;
				$scope.chartdata_pvt_bank_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pvt_bank.dataProvider[i].value == 1){
						chart_pvt_bank.dataProvider[i].color = "green";
					}
					else{
						chart_pvt_bank.dataProvider[i].color = "red";
					}
				}
				chart_pvt_bank.validateData();


				chart_finance = createChartObj_Annual('m_chart_finance_sector_view');
				chartdata_finance = setChartData_Annual(json_data, 'FIN-SERV', 'Close');
				$scope.len_1 = chartdata_finance.length
				setChartHeight('#m_chart_finance_sector_view',chartdata_finance.length);
				$scope.autolenght = Object.keys(chartdata_finance).length;
				$scope.chartdata_finance_close_final = JSON.stringify(chartdata_finance);
				chart_finance.dataProvider = eval($scope.chartdata_finance_close_final);
				chartdata_finance = null;
				$scope.chartdata_finance_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_finance.dataProvider[i].value == 1){
						chart_finance.dataProvider[i].color = "green";
					}
					else{
						chart_finance.dataProvider[i].color = "red";
					}
				}
				chart_finance.validateData();

				chart_psu_bank = createChartObj_Annual('m_chart_psu_bank_sector_view');
				chartdata_psu_bank = setChartData_Annual(json_data, 'PSU BANK', 'Close');
				setChartHeight('#m_chart_psu_bank_sector_view',chartdata_psu_bank.length);
				$scope.autolenght = Object.keys(chartdata_psu_bank).length;
				$scope.chartdata_psu_bank_close_final = JSON.stringify(chartdata_psu_bank);
				chart_psu_bank.dataProvider = eval($scope.chartdata_psu_bank_close_final);
				chartdata_psu_bank = null;
				$scope.chartdata_psu_bank_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_psu_bank.dataProvider[i].value == 1){
						chart_psu_bank.dataProvider[i].color = "green";
					}
					else{
						chart_psu_bank.dataProvider[i].color = "red";
					}
				}
				chart_psu_bank.validateData();


				
				chart_it = createChartObj_Annual('m_chart_it_sector_view');
				chartdata_it = setChartData_Annual(json_data, 'IT', 'Close');
				setChartHeight('#m_chart_it_sector_view',chartdata_it.length);
				$scope.autolenght = Object.keys(chartdata_it).length;
				$scope.chartdata_it_close_final = JSON.stringify(chartdata_it);
				chart_it.dataProvider = eval($scope.chartdata_it_close_final);
				chartdata_it = null;
				$scope.chartdata_it_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_it.dataProvider[i].value == 1){
						chart_it.dataProvider[i].color = "green";
					}
					else{
						chart_it.dataProvider[i].color = "red";
					}
				}
				chart_it.validateData();

				let chartdata_infra = []
				chart_infra = createChartObj_Annual('m_chart_infra_sector_view');
				chartdata_infra = setChartData_Annual(json_data, 'INFRA', 'Close');
				setChartHeight('#m_chart_infra_sector_view',chartdata_infra.length);
				$scope.autolenght = Object.keys(chartdata_infra).length;
				$scope.chartdata_infra_close_final = JSON.stringify(chartdata_infra);
				chart_infra.dataProvider = eval($scope.chartdata_infra_close_final);
				chartdata_infra = null;
				$scope.chartdata_infra_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_infra.dataProvider[i].value == 1){
						chart_infra.dataProvider[i].color = "green";
					}
					else{
						chart_infra.dataProvider[i].color = "red";
					}
				}
				chart_infra.validateData();

				chart_metals = createChartObj_Annual('m_chart_metals_sector_view');
				chartdata_metals = setChartData_Annual(json_data, 'METAL', 'Close');
				setChartHeight('#m_chart_metals_sector_view',chartdata_metals.length);

				$scope.autolenght = Object.keys(chartdata_metals).length;
				$scope.chartdata_metals_close_final = JSON.stringify(chartdata_metals);
				chart_metals.dataProvider = eval($scope.chartdata_metals_close_final);
				chartdata_metals = null;
				$scope.chartdata_metals_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_metals.dataProvider[i].value == 1){
						chart_metals.dataProvider[i].color = "green";
					}
					else{
						chart_metals.dataProvider[i].color = "red";
					}
				}
				chart_metals.validateData();


				chart_pharma = createChartObj_Annual('m_chart_pharma_sector_view');
				chartdata_pharma = setChartData_Annual(json_data, 'PHARMA', 'Close');
				setChartHeight('#m_chart_pharma_sector_view',chartdata_pharma.length);
				$scope.autolenght = Object.keys(chartdata_pharma).length;
				$scope.chartdata_pharma_close_final = JSON.stringify(chartdata_pharma);
				chart_pharma.dataProvider = eval($scope.chartdata_pharma_close_final);
				chartdata_pharma = null;
				$scope.chartdata_pharma_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pharma.dataProvider[i].value == 1){
						chart_pharma.dataProvider[i].color = "green";
					}
					else{
						chart_pharma.dataProvider[i].color = "red";
					}
				}
				chart_pharma.validateData();



				
				chart_realty = createChartObj_Annual('m_chart_realty_sector_view');
				chartdata_realty = setChartData_Annual(json_data, 'REALTY', 'Close');
				setChartHeight('#m_chart_realty_sector_view',chartdata_realty.length);
				$scope.autolenght = Object.keys(chartdata_realty).length;
				$scope.chartdata_realty_close_final = JSON.stringify(chartdata_realty);
				chart_realty.dataProvider = eval($scope.chartdata_realty_close_final);
				chartdata_realty = null;
				$scope.chartdata_realty_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_realty.dataProvider[i].value == 1){
						chart_realty.dataProvider[i].color = "green";
					}
					else{
						chart_realty.dataProvider[i].color = "red";
					}
				}
				chart_realty.validateData();





				let chartdata_commodities = []
				chart_commodities = createChartObj_Annual('m_chart_commodities_sector_view');
				chartdata_commodities = setChartData_Annual(json_data, 'COMMODITIES', 'Close');
				setChartHeight('#m_chart_commodities_sector_view',chartdata_commodities.length);
				$scope.autolenght = Object.keys(chartdata_commodities).length;
				$scope.chartdata_commodities_close_final = JSON.stringify(chartdata_commodities);
				chart_commodities.dataProvider = eval($scope.chartdata_commodities_close_final);
				chartdata_commodities = null;
				$scope.chartdata_commodities_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_commodities.dataProvider[i].value == 1){
						chart_commodities.dataProvider[i].color = "green";
					}
					else{
						chart_commodities.dataProvider[i].color = "red";
					}
				}
				chart_commodities.validateData();

				
				let chartdata_consumption = []
				chart_consumption = createChartObj_Annual('m_chart_consumption_sector_view');
				chartdata_consumption = setChartData_Annual(json_data, 'CONSUMPTION', 'Close');
				setChartHeight('#m_chart_consumption_sector_view',chartdata_consumption.length);
				$scope.autolenght = Object.keys(chartdata_consumption).length;
				$scope.chartdata_consumption_close_final = JSON.stringify(chartdata_consumption);
				chart_consumption.dataProvider = eval($scope.chartdata_consumption_close_final);
				chartdata_consumption = null;
				$scope.chartdata_consumption_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_consumption.dataProvider[i].value == 1){
						chart_consumption.dataProvider[i].color = "green";
					}
					else{
						chart_consumption.dataProvider[i].color = "red";
					}
				}
				chart_consumption.validateData();


				chart_energy = createChartObj_Annual('m_chart_energy_sector_view');
				chartdata_energy = setChartData_Annual(json_data, 'ENERGY', 'Close');
				setChartHeight('#m_chart_energy_sector_view',chartdata_energy.length);
				$scope.autolenght = Object.keys(chartdata_energy).length;
				$scope.chartdata_energy_close_final = JSON.stringify(chartdata_energy);
				chart_energy.dataProvider = eval($scope.chartdata_energy_close_final);
				chartdata_energy = null;
				$scope.chartdata_energy_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_energy.dataProvider[i].value == 1){
						chart_energy.dataProvider[i].color = "green";
					}
					else{
						chart_energy.dataProvider[i].color = "red";
					}
				}
				chart_energy.validateData();


				let chartdata_cpse = []
				chart_cpse = createChartObj_Annual('m_chart_cpse_sector_view');
				chartdata_cpse = setChartData_Annual(json_data, 'CPSE', 'Close');
				setChartHeight('#m_chart_cpse_sector_view',chartdata_cpse.length);
				$scope.autolenght = Object.keys(chartdata_cpse).length;
				$scope.chartdata_cpse_close_final = JSON.stringify(chartdata_cpse);
				chart_cpse.dataProvider = eval($scope.chartdata_cpse_close_final);
				chartdata_cpse = null;
				$scope.chartdata_cpse_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_cpse.dataProvider[i].value == 1){
						chart_cpse.dataProvider[i].color = "green";
					}
					else{
						chart_cpse.dataProvider[i].color = "red";
					}
				}
				chart_cpse.validateData();


				let chartdata_pse = []
				chart_pse = createChartObj_Annual('m_chart_pse_sector_view');
				chartdata_pse = setChartData_Annual(json_data, 'PSE', 'Close');
				setChartHeight('#m_chart_pse_sector_view',chartdata_pse.length);
				$scope.autolenght = Object.keys(chartdata_pse).length;
				$scope.chartdata_pse_close_final = JSON.stringify(chartdata_pse);
				chart_pse.dataProvider = eval($scope.chartdata_pse_close_final);
				chartdata_pse = null;
				$scope.chartdata_pse_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pse.dataProvider[i].value == 1){
						chart_pse.dataProvider[i].color = "green";
					}
					else{
						chart_pse.dataProvider[i].color = "red";
					}
				}
				chart_pse.validateData();


				chart_media = createChartObj_Annual('m_chart_media_sector_view');
				chartdata_media = setChartData_Annual(json_data, 'MEDIA', 'Close');
				setChartHeight('#m_chart_media_sector_view',chartdata_media.length);

				$scope.autolenght = Object.keys(chartdata_media).length;
				$scope.chartdata_media_close_final = JSON.stringify(chartdata_media);
				chart_media.dataProvider = eval($scope.chartdata_media_close_final);
				chartdata_media = null;
				$scope.chartdata_media_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_media.dataProvider[i].value == 1){
						chart_media.dataProvider[i].color = "green";
					}
					else{
						chart_media.dataProvider[i].color = "red";
					}
				}
				chart_media.validateData();


				json_data = null;
			};

			function marketviewchange_open_Annual(data) {
				json_data = data;
				NAME = [];
				CHGPCT = [];
				CHGPCTSTR = [];
				COLOR = [];
				LTP = [];
				LTPSTR = [];
				chartdata_auto = [];
				chartdata_it = [];
				chartdata_bank = [];
				chartdata_finance = [];
				chartdata_indus_mfg = [];
				chartdata_fmcg = [];
				chartdata_cement = [];
				chartdata_chemical = [];
				chartdata_construction = [];
				chartdata_energy = [];
				chartdata_metals = [];
				chartdata_pharma = [];
				chartdata_media = [];
				chartdata_realty = [];
				chartdata_textiles = [];
				chartdata_telecom = [];
				chartdata_healthcare = [];
				chartdata_others = [];


				chart_auto = createChartObj_Annual('m_chart_auto_sector_view');
				chartdata_auto = setChartData_Annual(json_data, 'AUTO', 'Open');
				setChartHeight('#m_chart_auto_sector_view',chartdata_auto.length);

				$scope.autolenght = Object.keys(chartdata_auto).length;
				$scope.chartdata_auto_close_final = JSON.stringify(chartdata_auto);
				chart_auto.dataProvider = eval($scope.chartdata_auto_close_final);
				chartdata_auto = null;
				$scope.chartdata_auto_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_auto.dataProvider[i].value == 1){
						chart_auto.dataProvider[i].color = "green";
					}
					else{
						chart_auto.dataProvider[i].color = "red";
					}
				}
				chart_auto.validateData();


				chart_fmcg = createChartObj_Annual('m_chart_fmcg_sector_view');
				chartdata_fmcg = setChartData_Annual(json_data, 'FMCG', 'Open');
				setChartHeight('#m_chart_fmcg_sector_view',chartdata_fmcg.length);
				$scope.autolenght = Object.keys(chartdata_fmcg).length;
				$scope.chartdata_fmcg_close_final = JSON.stringify(chartdata_fmcg);
				chart_fmcg.dataProvider = eval($scope.chartdata_fmcg_close_final);
				chartdata_fmcg = null;
				$scope.chartdata_fmcg_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_fmcg.dataProvider[i].value == 1){
						chart_fmcg.dataProvider[i].color = "green";
					}
					else{
						chart_fmcg.dataProvider[i].color = "red";
					}
				}
				chart_fmcg.validateData();

				chart_pvt_bank = createChartObj_Annual('m_chart_pvt_bank_sector_view');
				chartdata_pvt_bank = setChartData_Annual(json_data, 'PVT BANK', 'Open');
				setChartHeight('#m_chart_pvt_bank_sector_view',chartdata_pvt_bank.length);

				$scope.autolenght = Object.keys(chartdata_pvt_bank).length;
				$scope.chartdata_pvt_bank_close_final = JSON.stringify(chartdata_pvt_bank);
				chart_pvt_bank.dataProvider = eval($scope.chartdata_pvt_bank_close_final);
				chartdata_pvt_bank = null;
				$scope.chartdata_pvt_bank_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pvt_bank.dataProvider[i].value == 1){
						chart_pvt_bank.dataProvider[i].color = "green";
					}
					else{
						chart_pvt_bank.dataProvider[i].color = "red";
					}
				}
				chart_pvt_bank.validateData();


				chart_finance = createChartObj_Annual('m_chart_finance_sector_view');
				chartdata_finance = setChartData_Annual(json_data, 'FIN-SERV', 'Open');
				$scope.len_1 = chartdata_finance.length
				setChartHeight('#m_chart_finance_sector_view',chartdata_finance.length);
				$scope.autolenght = Object.keys(chartdata_finance).length;
				$scope.chartdata_finance_close_final = JSON.stringify(chartdata_finance);
				chart_finance.dataProvider = eval($scope.chartdata_finance_close_final);
				chartdata_finance = null;
				$scope.chartdata_finance_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_finance.dataProvider[i].value == 1){
						chart_finance.dataProvider[i].color = "green";
					}
					else{
						chart_finance.dataProvider[i].color = "red";
					}
				}
				chart_finance.validateData();

				chart_psu_bank = createChartObj_Annual('m_chart_psu_bank_sector_view');
				chartdata_psu_bank = setChartData_Annual(json_data, 'PSU BANK', 'Open');
				setChartHeight('#m_chart_psu_bank_sector_view',chartdata_psu_bank.length);
				$scope.autolenght = Object.keys(chartdata_psu_bank).length;
				$scope.chartdata_psu_bank_close_final = JSON.stringify(chartdata_psu_bank);
				chart_psu_bank.dataProvider = eval($scope.chartdata_psu_bank_close_final);
				chartdata_psu_bank = null;
				$scope.chartdata_psu_bank_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_psu_bank.dataProvider[i].value == 1){
						chart_psu_bank.dataProvider[i].color = "green";
					}
					else{
						chart_psu_bank.dataProvider[i].color = "red";
					}
				}
				chart_psu_bank.validateData();


				
				chart_it = createChartObj_Annual('m_chart_it_sector_view');
				chartdata_it = setChartData_Annual(json_data, 'IT', 'Open');
				setChartHeight('#m_chart_it_sector_view',chartdata_it.length);
				$scope.autolenght = Object.keys(chartdata_it).length;
				$scope.chartdata_it_close_final = JSON.stringify(chartdata_it);
				chart_it.dataProvider = eval($scope.chartdata_it_close_final);
				chartdata_it = null;
				$scope.chartdata_it_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_it.dataProvider[i].value == 1){
						chart_it.dataProvider[i].color = "green";
					}
					else{
						chart_it.dataProvider[i].color = "red";
					}
				}
				chart_it.validateData();

				let chartdata_infra = []
				chart_infra = createChartObj_Annual('m_chart_infra_sector_view');
				chartdata_infra = setChartData_Annual(json_data, 'INFRA', 'Open');
				setChartHeight('#m_chart_infra_sector_view',chartdata_infra.length);
				$scope.autolenght = Object.keys(chartdata_infra).length;
				$scope.chartdata_infra_close_final = JSON.stringify(chartdata_infra);
				chart_infra.dataProvider = eval($scope.chartdata_infra_close_final);
				chartdata_infra = null;
				$scope.chartdata_infra_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_infra.dataProvider[i].value == 1){
						chart_infra.dataProvider[i].color = "green";
					}
					else{
						chart_infra.dataProvider[i].color = "red";
					}
				}
				chart_infra.validateData();

				chart_metals = createChartObj_Annual('m_chart_metals_sector_view');
				chartdata_metals = setChartData_Annual(json_data, 'METAL', 'Open');
				setChartHeight('#m_chart_metals_sector_view',chartdata_metals.length);

				$scope.autolenght = Object.keys(chartdata_metals).length;
				$scope.chartdata_metals_close_final = JSON.stringify(chartdata_metals);
				chart_metals.dataProvider = eval($scope.chartdata_metals_close_final);
				chartdata_metals = null;
				$scope.chartdata_metals_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_metals.dataProvider[i].value == 1){
						chart_metals.dataProvider[i].color = "green";
					}
					else{
						chart_metals.dataProvider[i].color = "red";
					}
				}
				chart_metals.validateData();


				chart_pharma = createChartObj_Annual('m_chart_pharma_sector_view');
				chartdata_pharma = setChartData_Annual(json_data, 'PHARMA', 'Open');
				setChartHeight('#m_chart_pharma_sector_view',chartdata_pharma.length);
				$scope.autolenght = Object.keys(chartdata_pharma).length;
				$scope.chartdata_pharma_close_final = JSON.stringify(chartdata_pharma);
				chart_pharma.dataProvider = eval($scope.chartdata_pharma_close_final);
				chartdata_pharma = null;
				$scope.chartdata_pharma_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pharma.dataProvider[i].value == 1){
						chart_pharma.dataProvider[i].color = "green";
					}
					else{
						chart_pharma.dataProvider[i].color = "red";
					}
				}
				chart_pharma.validateData();



				
				chart_realty = createChartObj_Annual('m_chart_realty_sector_view');
				chartdata_realty = setChartData_Annual(json_data, 'REALTY', 'Open');
				setChartHeight('#m_chart_realty_sector_view',chartdata_realty.length);
				$scope.autolenght = Object.keys(chartdata_realty).length;
				$scope.chartdata_realty_close_final = JSON.stringify(chartdata_realty);
				chart_realty.dataProvider = eval($scope.chartdata_realty_close_final);
				chartdata_realty = null;
				$scope.chartdata_realty_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_realty.dataProvider[i].value == 1){
						chart_realty.dataProvider[i].color = "green";
					}
					else{
						chart_realty.dataProvider[i].color = "red";
					}
				}
				chart_realty.validateData();





				let chartdata_commodities = []
				chart_commodities = createChartObj_Annual('m_chart_commodities_sector_view');
				chartdata_commodities = setChartData_Annual(json_data, 'COMMODITIES', 'Open');
				setChartHeight('#m_chart_commodities_sector_view',chartdata_commodities.length);
				$scope.autolenght = Object.keys(chartdata_commodities).length;
				$scope.chartdata_commodities_close_final = JSON.stringify(chartdata_commodities);
				chart_commodities.dataProvider = eval($scope.chartdata_commodities_close_final);
				chartdata_commodities = null;
				$scope.chartdata_commodities_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_commodities.dataProvider[i].value == 1){
						chart_commodities.dataProvider[i].color = "green";
					}
					else{
						chart_commodities.dataProvider[i].color = "red";
					}
				}
				chart_commodities.validateData();

				
				let chartdata_consumption = []
				chart_consumption = createChartObj_Annual('m_chart_consumption_sector_view');
				chartdata_consumption = setChartData_Annual(json_data, 'CONSUMPTION', 'Open');
				setChartHeight('#m_chart_consumption_sector_view',chartdata_consumption.length);
				$scope.autolenght = Object.keys(chartdata_consumption).length;
				$scope.chartdata_consumption_close_final = JSON.stringify(chartdata_consumption);
				chart_consumption.dataProvider = eval($scope.chartdata_consumption_close_final);
				chartdata_consumption = null;
				$scope.chartdata_consumption_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_consumption.dataProvider[i].value == 1){
						chart_consumption.dataProvider[i].color = "green";
					}
					else{
						chart_consumption.dataProvider[i].color = "red";
					}
				}
				chart_consumption.validateData();


				chart_energy = createChartObj_Annual('m_chart_energy_sector_view');
				chartdata_energy = setChartData_Annual(json_data, 'ENERGY', 'Open');
				setChartHeight('#m_chart_energy_sector_view',chartdata_energy.length);
				$scope.autolenght = Object.keys(chartdata_energy).length;
				$scope.chartdata_energy_close_final = JSON.stringify(chartdata_energy);
				chart_energy.dataProvider = eval($scope.chartdata_energy_close_final);
				chartdata_energy = null;
				$scope.chartdata_energy_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_energy.dataProvider[i].value == 1){
						chart_energy.dataProvider[i].color = "green";
					}
					else{
						chart_energy.dataProvider[i].color = "red";
					}
				}
				chart_energy.validateData();


				let chartdata_cpse = []
				chart_cpse = createChartObj_Annual('m_chart_cpse_sector_view');
				chartdata_cpse = setChartData_Annual(json_data, 'CPSE', 'Open');
				setChartHeight('#m_chart_cpse_sector_view',chartdata_cpse.length);
				$scope.autolenght = Object.keys(chartdata_cpse).length;
				$scope.chartdata_cpse_close_final = JSON.stringify(chartdata_cpse);
				chart_cpse.dataProvider = eval($scope.chartdata_cpse_close_final);
				chartdata_cpse = null;
				$scope.chartdata_cpse_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_cpse.dataProvider[i].value == 1){
						chart_cpse.dataProvider[i].color = "green";
					}
					else{
						chart_cpse.dataProvider[i].color = "red";
					}
				}
				chart_cpse.validateData();


				let chartdata_pse = []
				chart_pse = createChartObj_Annual('m_chart_pse_sector_view');
				chartdata_pse = setChartData_Annual(json_data, 'PSE', 'Open');
				setChartHeight('#m_chart_pse_sector_view',chartdata_pse.length);
				$scope.autolenght = Object.keys(chartdata_pse).length;
				$scope.chartdata_pse_close_final = JSON.stringify(chartdata_pse);
				chart_pse.dataProvider = eval($scope.chartdata_pse_close_final);
				chartdata_pse = null;
				$scope.chartdata_pse_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_pse.dataProvider[i].value == 1){
						chart_pse.dataProvider[i].color = "green";
					}
					else{
						chart_pse.dataProvider[i].color = "red";
					}
				}
				chart_pse.validateData();


				chart_media = createChartObj_Annual('m_chart_media_sector_view');
				chartdata_media = setChartData_Annual(json_data, 'MEDIA', 'Open');
				setChartHeight('#m_chart_media_sector_view',chartdata_media.length);

				$scope.autolenght = Object.keys(chartdata_media).length;
				$scope.chartdata_media_close_final = JSON.stringify(chartdata_media);
				chart_media.dataProvider = eval($scope.chartdata_media_close_final);
				chartdata_media = null;
				$scope.chartdata_media_close_final = null;
				for(i=0; i < $scope.autolenght; i++){
					if(chart_media.dataProvider[i].value == 1){
						chart_media.dataProvider[i].color = "green";
					}
					else{
						chart_media.dataProvider[i].color = "red";
					}
				}
				chart_media.validateData();


				json_data = null;

			};

			let sectorFilter = (universe_data,sector_data,sector_name)=>{

				sector_data = sector_data.filter((obj)=>{
					return obj.sector_name == sector_name
				})
				sector_data = _.pluck(sector_data,'symbol')
				
				universe_data = universe_data.filter((obj)=>{
					return sector_data.includes(obj.SYMBOL)
				})

				universe_data = universe_data.map((obj) => ({
					...obj,
					SECTOR: sector_name
					}));
					

				return universe_data

			}

			function marketviewchange_close_stack(data){
				//alert('inside marketviewchange_close_stack');
				let json_data = data;
				let chartdata_stack = [];

				chartdata_stack_automobile = setChartDataStack(json_data, 'AUTO', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'FMCG', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'PVT BANK', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'FIN-SERV', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'PSU BANK', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'IT', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'INFRA', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'METAL', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'PHARMA', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'REALTY', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'COMMODITIES', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'CONSUMPTION', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'ENERGY', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'CPSE', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'PSE', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'MEDIA', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chart_stack = createStackChartObj('m_chart_sector_stack_view')

				chartdata = JSON.stringify(chartdata_stack);
				chart_stack.dataProvider = eval(chartdata);
				chart_stack.validateData();

				json_data = null;
				chartdata_stack = null;
				chartdata = null;

			}

			function marketviewchange_close_stack_Week(data){
				json_data = data;
				chartdata_stack = [];

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'AUTO', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'FMCG', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'PVT BANK', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'FIN-SERV', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'PSU BANK', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'IT', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'INFRA', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'METAL', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'PHARMA', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'REALTY', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'COMMODITIES', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'CONSUMPTION', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'ENERGY', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'CPSE', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'PSE', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'MEDIA', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata = JSON.stringify(chartdata_stack);
				chart_stack.dataProvider = eval(chartdata);
				chart_stack.validateData();

				json_data = null;
				chartdata_stack = null;
				chartdata = null;

			}

			function marketviewchange_close_stack_Month(data){
				json_data = data;
				chartdata_stack = [];

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'AUTO', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'FMCG', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'PVT BANK', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'FIN-SERV', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'PSU BANK', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'IT', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'INFRA', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'METAL', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'PHARMA', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'REALTY', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'COMMODITIES', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'CONSUMPTION', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'ENERGY', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'CPSE', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'PSE', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'MEDIA', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata = JSON.stringify(chartdata_stack);
				chart_stack.dataProvider = eval(chartdata);
				chart_stack.validateData();

				json_data = null;
				chartdata_stack = null;
				chartdata = null;

			}

			function marketviewchange_close_stack_Quarter(data){
				json_data = data;
				chartdata_stack = [];

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'AUTO', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'FMCG', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'PVT BANK', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'FIN-SERV', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'PSU BANK', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'IT', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'INFRA', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'METAL', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'PHARMA', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'REALTY', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'COMMODITIES', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'CONSUMPTION', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'ENERGY', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'CPSE', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'PSE', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'MEDIA', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				//chart_stack = createStackChartObj('m_chart_sector_stack_view')

				chartdata = JSON.stringify(chartdata_stack);
				chart_stack.dataProvider = eval(chartdata);
				chart_stack.validateData();

				json_data = null;
				chartdata_stack = null;
				chartdata = null;

			}

			function marketviewchange_close_stack_Annual(data){
				json_data = data;
				chartdata_stack = [];

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'AUTO', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'FMCG', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'PVT BANK', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'FIN-SERV', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'PSU BANK', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'IT', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'INFRA', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'METAL', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'PHARMA', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'REALTY', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'COMMODITIES', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'CONSUMPTION', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'ENERGY', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'CPSE', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'PSE', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'MEDIA', 'Close');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata = JSON.stringify(chartdata_stack);
				chart_stack.dataProvider = eval(chartdata);
				chart_stack.validateData();

				json_data = null;
				chartdata_stack = null;
				chartdata = null;

			}

			function marketviewchange_open_stack(data){
				json_data = data;
				chartdata_stack = [];

				chartdata_stack_automobile = setChartDataStack(json_data, 'AUTO', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'FMCG', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'PVT BANK', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'FIN-SERV', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'PSU BANK', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'IT', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'INFRA', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'METAL', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'PHARMA', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'REALTY', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'COMMODITIES', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'CONSUMPTION', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'ENERGY', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'CPSE', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'PSE', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack(json_data, 'MEDIA', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chart_stack_open = createStackChartObj('m_chart_sector_stack_view_open')

				chartdata = JSON.stringify(chartdata_stack);
				chart_stack_open.dataProvider = eval(chartdata);
				chart_stack_open.validateData();

				json_data = null;
				chartdata_stack = null;
				chartdata = null;

			}

			function marketviewchange_open_stack_Week(data){
				json_data = data;
				chartdata_stack = [];

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'AUTO', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'FMCG', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'PVT BANK', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'FIN-SERV', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'PSU BANK', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'IT', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'INFRA', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'METAL', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'PHARMA', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'REALTY', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'COMMODITIES', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'CONSUMPTION', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'ENERGY', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'CPSE', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'PSE', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Week(json_data, 'MEDIA', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				//chart_stack = createStackChartObj('m_chart_sector_stack_view')


				chartdata = JSON.stringify(chartdata_stack);
				chart_stack_open.dataProvider = eval(chartdata);
				chart_stack_open.validateData();

				json_data = null;
				chartdata_stack = null;
				chartdata = null;

			}

			function marketviewchange_open_stack_Month(data){
				json_data = data;
				chartdata_stack = [];

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'AUTO', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'FMCG', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'PVT BANK', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'FIN-SERV', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'PSU BANK', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'IT', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'INFRA', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'METAL', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'PHARMA', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'REALTY', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'COMMODITIES', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'CONSUMPTION', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'ENERGY', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'CPSE', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'PSE', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Month(json_data, 'MEDIA', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;


				//chart_stack = createStackChartObj('m_chart_sector_stack_view')


				chartdata = JSON.stringify(chartdata_stack);
				chart_stack_open.dataProvider = eval(chartdata);
				chart_stack_open.validateData();

				json_data = null;
				chartdata_stack = null;
				chartdata = null;

			}

			function marketviewchange_open_stack_Quarter(data){
				json_data = data;
				chartdata_stack = [];

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'AUTO', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'FMCG', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'PVT BANK', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'FIN-SERV', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'PSU BANK', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'IT', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'INFRA', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'METAL', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'PHARMA', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'REALTY', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'COMMODITIES', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'CONSUMPTION', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'ENERGY', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'CPSE', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'PSE', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Quarter(json_data, 'MEDIA', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;



				//chart_stack = createStackChartObj('m_chart_sector_stack_view')


				chartdata = JSON.stringify(chartdata_stack);
				chart_stack_open.dataProvider = eval(chartdata);
				chart_stack_open.validateData();

				json_data = null;
				chartdata_stack = null;
				chartdata = null;

			}

			function marketviewchange_open_stack_Annual(data){
				json_data = data;
				chartdata_stack = [];

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'AUTO', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'FMCG', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'PVT BANK', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'FIN-SERV', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'PSU BANK', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'IT', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'INFRA', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'METAL', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'PHARMA', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'REALTY', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'COMMODITIES', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'CONSUMPTION', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'ENERGY', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'CPSE', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'PSE', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				chartdata_stack_automobile = setChartDataStack_Annual(json_data, 'MEDIA', 'Open');
				chartdata_stack.push(chartdata_stack_automobile);
				chartdata_stack_automobile = null;

				//chart_stack = createStackChartObj('m_chart_sector_stack_view')

				chartdata = JSON.stringify(chartdata_stack);
				chart_stack_open.dataProvider = eval(chartdata);
				chart_stack_open.validateData();

				json_data = null;
				chartdata_stack = null;
				chartdata = null;

			}

			function setChartDataStack(json_data, sector, type){

				json_data = sectorFilter(json_data,$scope.instrumentsWithSector,sector)
				

				group1 = 0;
				group2 = 0;
				group3 = 0;
				group4 = 0;
				total = 0;

				$.each(json_data, function(idx, obj1) {
					charttmp = {};

					$.each(obj1, function(idx, obj2) {
						if(idx=="SECTOR"){
							charttmp["SECTOR"] = obj2;
						};

						if(idx=="DAY_CLOSE_CHG_P"){
							if(type=='Close'){
								charttmp["DAY_CHG_P"] = parseFloat(obj2).toFixed(1);
							}

						};

						if(idx=="DAY_OPEN_CHG_P"){
							if(type=='Open'){
								charttmp["DAY_CHG_P"] = parseFloat(obj2).toFixed(1);
							}
						};

						if(idx=="NSE_INDEX"){
							charttmp["NSE_INDEX"] = parseInt(obj2);
						};

						if(idx=="FNO_FLAG"){
							charttmp["FNO_FLAG"] = parseInt(obj2);
						};
					});

					


					if(charttmp["SECTOR"] == sector){
						total++;
						if(charttmp["DAY_CHG_P"] < -2){
							group1++;
						}
						else if (charttmp["DAY_CHG_P"] >= -2 && charttmp["DAY_CHG_P"] <= 0){
							group2++;
						}
						else if (charttmp["DAY_CHG_P"] > 0 && charttmp["DAY_CHG_P"] <= 2){
							group3++;
						}
						else
						{
							group4++;
						}
					};

				});

				


				group1perc = parseFloat(((group1/total)*100)).toFixed(0);
				group2perc = parseFloat(((group2/total)*100)).toFixed(0);
				group3perc = parseFloat(((group3/total)*100)).toFixed(0);
				group4perc = parseFloat(((group4/total)*100)).toFixed(0);
				group1_range = '< -2%'
				group2_range = '0% to -2%'
				group3_range = '0% to 2%'
				group4_range = '> 2%'

				group = [
					{'name':'group1perc','value':group1perc},
					{'name':'group2perc','value':group2perc},
					{'name':'group3perc','value':group3perc},
					{'name':'group4perc','value':group4perc}
				];

				groupsort = group.sort(function(a, b){return b.value - a.value});

				rank = 100 - (parseInt(groupsort[1].value) + parseInt(groupsort[2].value) + parseInt(groupsort[3].value));

				if(groupsort[0].name == 'group1perc'){
					group1perc = rank;
				}else if(groupsort[0].name == 'group2perc'){
					group2perc = rank;
				}else if(groupsort[0].name == 'group3perc'){
					group3perc = rank;
				}else if(groupsort[0].name == 'group4perc'){
					group4perc = rank;
				}

				chartdata = {
					'sector': sector,
					'group1':group1perc,
					'group2': group2perc, 
					'group3': group3perc, 
					'group4': group4perc, 
					'countgroup1': group1, 
					'countgroup2': group2, 
					'countgroup3': group3, 
					'countgroup4':  group4,
					'group1_range': group1_range,
					'group2_range': group2_range,
					'group3_range': group3_range,
					'group4_range': group4_range
				};

				

				return chartdata;
			}

			function setChartDataStack_Week(json_data, sector, type){
				json_data = sectorFilter(json_data,$scope.instrumentsWithSector,sector)
				
				group1 = 0;
				group2 = 0;
				group3 = 0;
				group4 = 0;
				total = 0;

				$.each(json_data, function(idx, obj1) {
					charttmp = {};

					$.each(obj1, function(idx, obj2) {
						if(idx=="SECTOR"){
							charttmp["SECTOR"] = obj2;
						};
						if(idx=="WEEK_CLOSE_CHG_P"){
							if(type=='Close'){
								charttmp["WEEK_CHG_P"] = parseFloat(obj2).toFixed(1);
							}

						};
						if(idx=="WEEK_OPEN_CHG_P"){
							if(type=='Open'){
								charttmp["WEEK_CHG_P"] = parseFloat(obj2).toFixed(1);
							}
						};
						if(idx=="NSE_INDEX"){
							charttmp["NSE_INDEX"] = parseInt(obj2);
						};
						if(idx=="FNO_FLAG"){
							charttmp["FNO_FLAG"] = parseInt(obj2);
						};
					});
					if(charttmp["SECTOR"] == sector){
						total++;
						if(charttmp["WEEK_CHG_P"] < -4){
							group1++;
						}
						else if (charttmp["WEEK_CHG_P"] >= -4 && charttmp["WEEK_CHG_P"] <= 0){
							group2++;
						}
						else if (charttmp["WEEK_CHG_P"] > 0 && charttmp["WEEK_CHG_P"] <= 4){
							group3++;
						}
						else
						{
							group4++;
						}
					};

				});
				group1perc = parseFloat(((group1/total)*100)).toFixed(0);
				group2perc = parseFloat(((group2/total)*100)).toFixed(0);
				group3perc = parseFloat(((group3/total)*100)).toFixed(0);
				group4perc = parseFloat(((group4/total)*100)).toFixed(0);
				group1_range = '< -4%'
				group2_range = '0% to -4%'
				group3_range = '0% to 4%'
				group4_range = '> 4%'
				group = [{'name':'group1perc','value':group1perc},{'name':'group2perc','value':group2perc},{'name':'group3perc','value':group3perc},{'name':'group4perc','value':group4perc}];

				groupsort = group.sort(function(a, b){return b.value - a.value});
				rank = 100 - (parseInt(groupsort[1].value) + parseInt(groupsort[2].value) + parseInt(groupsort[3].value));
				if(groupsort[0].name == 'group1perc'){
					group1perc = rank;
				}else if(groupsort[0].name == 'group2perc'){
					group2perc = rank;
				}else if(groupsort[0].name == 'group3perc'){
					group3perc = rank;
				}else if(groupsort[0].name == 'group4perc'){
					group4perc = rank;
				}

				chartdata = {'sector': sector,'group1':group1perc,'group2': group2perc, 'group3': group3perc, 'group4': group4perc, 'countgroup1': group1, 'countgroup2': group2, 'countgroup3': group3, 'countgroup4':  group4,'group1_range': group1_range,'group2_range': group2_range,'group3_range': group3_range,'group4_range': group4_range};

				return chartdata;
			}

			function setChartDataStack_Month(json_data, sector, type){
				json_data = sectorFilter(json_data,$scope.instrumentsWithSector,sector)

				group1 = 0;
				group2 = 0;
				group3 = 0;
				group4 = 0;
				total = 0;

				$.each(json_data, function(idx, obj1) {
					charttmp = {};

					$.each(obj1, function(idx, obj2) {
						if(idx=="SECTOR"){
							charttmp["SECTOR"] = obj2;
						};
						if(idx=="MONTH_CLOSE_CHG_P"){
							if(type=='Close'){
								charttmp["MONTH_CHG_P"] = parseFloat(obj2).toFixed(1);
							}

						};
						if(idx=="MONTH_OPEN_CHG_P"){
							if(type=='Open'){
								charttmp["MONTH_CHG_P"] = parseFloat(obj2).toFixed(1);
							}
						};
						if(idx=="NSE_INDEX"){
							charttmp["NSE_INDEX"] = parseInt(obj2);
						};
						if(idx=="FNO_FLAG"){
							charttmp["FNO_FLAG"] = parseInt(obj2);
						};
					});
					if(charttmp["SECTOR"] == sector){
						total++;
						if(charttmp["MONTH_CHG_P"] < -8){
							group1++;
						}
						else if (charttmp["MONTH_CHG_P"] >= -8 && charttmp["MONTH_CHG_P"] <= 0){
							group2++;
						}
						else if (charttmp["MONTH_CHG_P"] > 0 && charttmp["MONTH_CHG_P"] <= 8){
							group3++;
						}
						else
						{
							group4++;
						}
					};

				});
				group1perc = parseFloat(((group1/total)*100)).toFixed(0);
				group2perc = parseFloat(((group2/total)*100)).toFixed(0);
				group3perc = parseFloat(((group3/total)*100)).toFixed(0);
				group4perc = parseFloat(((group4/total)*100)).toFixed(0);
				group1_range = '< -8%'
				group2_range = '0% to -8%'
				group3_range = '0% to 8%'
				group4_range = '> 8%'
				group = [{'name':'group1perc','value':group1perc},{'name':'group2perc','value':group2perc},{'name':'group3perc','value':group3perc},{'name':'group4perc','value':group4perc}];

				groupsort = group.sort(function(a, b){return b.value - a.value});

				rank = 100 - (parseInt(groupsort[1].value) + parseInt(groupsort[2].value) + parseInt(groupsort[3].value));
				if(groupsort[0].name == 'group1perc'){
					group1perc = rank;
				}else if(groupsort[0].name == 'group2perc'){
					group2perc = rank;
				}else if(groupsort[0].name == 'group3perc'){
					group3perc = rank;
				}else if(groupsort[0].name == 'group4perc'){
					group4perc = rank;
				}

				chartdata = {'sector': sector,'group1':group1perc,'group2': group2perc, 'group3': group3perc, 'group4': group4perc, 'countgroup1': group1, 'countgroup2': group2, 'countgroup3': group3, 'countgroup4':  group4,'group1_range': group1_range,'group2_range': group2_range,'group3_range': group3_range,'group4_range': group4_range};

				return chartdata;
			}

			function setChartDataStack_Quarter(json_data, sector, type){
				json_data = sectorFilter(json_data,$scope.instrumentsWithSector,sector)
				
				group1 = 0;
				group2 = 0;
				group3 = 0;
				group4 = 0;
				total = 0;

				$.each(json_data, function(idx, obj1) {
					charttmp = {};

					$.each(obj1, function(idx, obj2) {
						if(idx=="SECTOR"){
							charttmp["SECTOR"] = obj2;
						};
						if(idx=="QUARTER_CLOSE_CHG_P"){
							if(type=='Close'){
								charttmp["QUARTER_CHG_P"] = parseFloat(obj2).toFixed(1);
							}

						};
						if(idx=="QUARTER_OPEN_CHG_P"){
							if(type=='Open'){
								charttmp["QUARTER_CHG_P"] = parseFloat(obj2).toFixed(1);
							}
						};
						if(idx=="NSE_INDEX"){
							charttmp["NSE_INDEX"] = parseInt(obj2);
						};
						if(idx=="FNO_FLAG"){
							charttmp["FNO_FLAG"] = parseInt(obj2);
						};
					});
					if(charttmp["SECTOR"] == sector){
						total++;
						if(charttmp["QUARTER_CHG_P"] < -12){
							group1++;
						}
						else if (charttmp["QUARTER_CHG_P"] >= -12 && charttmp["QUARTER_CHG_P"] <= 0){
							group2++;
						}
						else if (charttmp["QUARTER_CHG_P"] > 0 && charttmp["QUARTER_CHG_P"] <= 12){
							group3++;
						}
						else
						{
							group4++;
						}
					};

				});
				group1perc = parseFloat(((group1/total)*100)).toFixed(0);
				group2perc = parseFloat(((group2/total)*100)).toFixed(0);
				group3perc = parseFloat(((group3/total)*100)).toFixed(0);
				group4perc = parseFloat(((group4/total)*100)).toFixed(0);
				group1_range = '< -12%'
				group2_range = '0% to -12%'
				group3_range = '0% to 12%'
				group4_range = '> 12%'
				group = [{'name':'group1perc','value':group1perc},{'name':'group2perc','value':group2perc},{'name':'group3perc','value':group3perc},{'name':'group4perc','value':group4perc}];
				groupsort = group.sort(function(a, b){return b.value - a.value});
				rank = 100 - (parseInt(groupsort[1].value) + parseInt(groupsort[2].value) + parseInt(groupsort[3].value));
				if(groupsort[0].name == 'group1perc'){
					group1perc = rank;
				}else if(groupsort[0].name == 'group2perc'){
					group2perc = rank;
				}else if(groupsort[0].name == 'group3perc'){
					group3perc = rank;
				}else if(groupsort[0].name == 'group4perc'){
					group4perc = rank;
				}


				chartdata = {'sector': sector,'group1':group1perc,'group2': group2perc, 'group3': group3perc, 'group4': group4perc, 'countgroup1': group1, 'countgroup2': group2, 'countgroup3': group3, 'countgroup4':  group4,'group1_range': group1_range,'group2_range': group2_range,'group3_range': group3_range,'group4_range': group4_range};

				return chartdata;
			}

			function setChartDataStack_Annual(json_data, sector, type){
				json_data = sectorFilter(json_data,$scope.instrumentsWithSector,sector)
				
				group1 = 0;
				group2 = 0;
				group3 = 0;
				group4 = 0;
				total = 0;

				$.each(json_data, function(idx, obj1) {
					charttmp = {};

					$.each(obj1, function(idx, obj2) {
						if(idx=="SECTOR"){
							charttmp["SECTOR"] = obj2;
						};
						if(idx=="ANNUAL_CLOSE_CHG_P"){
							if(type=='Close'){
								charttmp["ANNUAL_CHG_P"] = parseFloat(obj2).toFixed(1);
							}

						};
						if(idx=="ANNUAL_OPEN_CHG_P"){
							if(type=='Open'){
								charttmp["ANNUAL_CHG_P"] = parseFloat(obj2).toFixed(1);
							}
						};
						if(idx=="NSE_INDEX"){
							charttmp["NSE_INDEX"] = parseInt(obj2);
						};
						if(idx=="FNO_FLAG"){
							charttmp["FNO_FLAG"] = parseInt(obj2);
						};
					});
					if(charttmp["SECTOR"] == sector){
						total++;
						if(charttmp["ANNUAL_CHG_P"] < -16){
							group1++;
						}
						else if (charttmp["ANNUAL_CHG_P"] >= -16 && charttmp["ANNUAL_CHG_P"] <= 0){
							group2++;
						}
						else if (charttmp["ANNUAL_CHG_P"] > 0 && charttmp["ANNUAL_CHG_P"] <= 16){
							group3++;
						}
						else
						{
							group4++;
						}
					};

				});
				group1perc = parseFloat(((group1/total)*100)).toFixed(0);
				group2perc = parseFloat(((group2/total)*100)).toFixed(0);
				group3perc = parseFloat(((group3/total)*100)).toFixed(0);
				group4perc = parseFloat(((group4/total)*100)).toFixed(0);
				group1_range = '< -16%'
				group2_range = '0% to -16%'
				group3_range = '0% to 16%'
				group4_range = '> 16%'
				group = [{'name':'group1perc','value':group1perc},{'name':'group2perc','value':group2perc},{'name':'group3perc','value':group3perc},{'name':'group4perc','value':group4perc}];
				groupsort = group.sort(function(a, b){return b.value - a.value});
				rank = 100 - (parseInt(groupsort[1].value) + parseInt(groupsort[2].value) + parseInt(groupsort[3].value));
				if(groupsort[0].name == 'group1perc'){
					group1perc = rank;
				}else if(groupsort[0].name == 'group2perc'){
					group2perc = rank;
				}else if(groupsort[0].name == 'group3perc'){
					group3perc = rank;
				}else if(groupsort[0].name == 'group4perc'){
					group4perc = rank;
				}


				chartdata = {'sector': sector,'group1':group1perc,'group2': group2perc, 'group3': group3perc, 'group4': group4perc, 'countgroup1': group1, 'countgroup2': group2, 'countgroup3': group3, 'countgroup4':  group4,'group1_range': group1_range,'group2_range': group2_range,'group3_range': group3_range,'group4_range': group4_range};

				return chartdata;
			}
				
			market_view_change_data($scope.SelectDataValue,$scope.SelectChangeValue);
			
	} 
	}
	});
