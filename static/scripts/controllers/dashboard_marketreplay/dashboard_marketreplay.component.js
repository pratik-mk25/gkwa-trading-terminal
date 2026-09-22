//'use strict';

angular.module('marketreplay').
component('marketreplay',{
	templateUrl:'/static/scripts/templates/dashboard_marketreplay_app.html',
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
		$interval)
		{
			if ($rootScope.user_permission['NEOTRADER_PRO']) {

				$scope.$on("$destroy", function(){
					try {
						clearTimeout(d_refresh_datetime_data_set_timeout);
						clearTimeout(loop_func_c);
						clearTimeout(loop_func_c1);
						clearTimeout(loop_func_o1);
						clearTimeout(loop_func_o);
					}
					catch(err) {
						console.log(err)
					}
					$scope.$destroy();
				});

				$scope.clear = function (){
					try {
						clearTimeout(d_refresh_datetime_data_set_timeout);
						clearTimeout(loop_func_c);
						clearTimeout(loop_func_c1);
						clearTimeout(loop_func_o1);
						clearTimeout(loop_func_o);
					}
					catch(err) {
						console.log(err)
					}
				};

				var loop_func_c;
				var loop_func_c1;
				var loop_func_o1;
				var loop_func_o;

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


				// Time Frame Drop down logic Coding ///

				$scope.DataValue_Timelapse = ["Day"];
				$scope.SelectDataValue_Timelapse = $scope.DataValue_Timelapse[0];

				// Time Frame Drop down logic Coding Ended ///


				// All Sectors Timelapse - Open logic Coding ///

				var paused_open = false;
				$scope.Snapshot_Time_Open = '0000-00-00 00:00:00';

				$scope.chartdata_timelapse = [];

				$scope.marketviewchange_open_stack_timelapse = function(snapshot_id){
					//	var snapshot_id = 1;
					url = '/app/Markets_View_Change_Fut_Timelapse/'+String(snapshot_id)+'/';
					count = $scope.timelapse_count;

					$.ajax({
						type: "GET",
						url: url,
						// This is the dictionary you are SENDING to your Django code.
						// We are sending the 'action':add_car and the 'id: $car_id
						// which is a variable that contains what car the user selected
						datatype: "json",
						//data: {'array':array},
						error: function(XMLHttpRequest, textStatus, errorThrown){
							//alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
							if(XMLHttpRequest.status == 0)
							window.location.href = '/auth/login/';
						},
						success: function(data){
							//$scope.service_response = data;
							json_data = data;
							chartdata_stack = [];

							// chartdata_stack_finance = setChartDataStack_Timelapse_Open(json_data, 'FINANCIAL SERVICES');
							// chartdata_stack.push(chartdata_stack_finance);
							// chartdata_stack_finance = null;

							chartdata_stack_automobile = setChartDataStack_Timelapse_Open(json_data, 'AUTO', 'Open');
							chartdata_stack.push(chartdata_stack_automobile);
							chartdata_stack_automobile = null;

							chartdata_stack_cement = setChartDataStack_Timelapse_Open(json_data, 'CEMENT', 'Open');
							chartdata_stack.push(chartdata_stack_cement);
							chartdata_stack_cement = null;

							chartdata_stack_chemicals = setChartDataStack_Timelapse_Open(json_data, 'CHEMICALS & FERTILISERS', 'Open');
							chartdata_stack.push(chartdata_stack_chemicals);
							chartdata_stack_chemicals = null;

							chartdata_stack_construction = setChartDataStack_Timelapse_Open(json_data, 'CONSTRUCTION', 'Open');
							chartdata_stack.push(chartdata_stack_construction);
							chartdata_stack_construction = null;

							chartdata_stack_fmcg = setChartDataStack_Timelapse_Open(json_data, 'CONSUMER GOODS', 'Open');
							chartdata_stack.push(chartdata_stack_fmcg);
							chartdata_stack_fmcg = null;

							chartdata_stack_energy = setChartDataStack_Timelapse_Open(json_data, 'ENERGY', 'Open');
							chartdata_stack.push(chartdata_stack_energy);
							chartdata_stack_energy = null;

							chartdata_stack_finance = setChartDataStack_Timelapse_Open(json_data, 'FINANCIAL SERVICES', 'Open');
							chartdata_stack.push(chartdata_stack_finance);
							chartdata_stack_finance = null;

							chartdata_stack_industrial = setChartDataStack_Timelapse_Open(json_data, 'INDUSTRIAL MANUFACTURING', 'Open');
							chartdata_stack.push(chartdata_stack_industrial);
							chartdata_stack_industrial = null;

							chartdata_stack_it = setChartDataStack_Timelapse_Open(json_data, 'IT', 'Open');
							chartdata_stack.push(chartdata_stack_it);
							chartdata_stack_it = null;

							chartdata_stack_media = setChartDataStack_Timelapse_Open(json_data, 'MEDIA', 'Open');
							chartdata_stack.push(chartdata_stack_media);
							chartdata_stack_media = null;

							chartdata_stack_metals = setChartDataStack_Timelapse_Open(json_data, 'METALS', 'Open');
							chartdata_stack.push(chartdata_stack_metals);
							chartdata_stack_metals = null;

							chartdata_stack_misc = setChartDataStack_Timelapse_Open(json_data, 'MISC', 'Open');
							chartdata_stack.push(chartdata_stack_misc);
							chartdata_stack_misc = null;

							chartdata_stack_pharma = setChartDataStack_Timelapse_Open(json_data, 'PHARMA', 'Open');
							chartdata_stack.push(chartdata_stack_pharma);
							chartdata_stack_pharma = null;

							chartdata_stack_pvt_bank = setChartDataStack_Timelapse_Open(json_data, 'PRIVATE BANK', 'Open');
							chartdata_stack.push(chartdata_stack_pvt_bank);
							chartdata_stack_pvt_bank = null;

							chartdata_stack_psu_bank = setChartDataStack_Timelapse_Open(json_data, 'PSU BANK', 'Open');
							chartdata_stack.push(chartdata_stack_psu_bank);
							chartdata_stack_psu_bank = null;

							chartdata_stack_services = setChartDataStack_Timelapse_Open(json_data, 'SERVICES', 'Open');
							chartdata_stack.push(chartdata_stack_services);
							chartdata_stack_services = null;

							chartdata_stack_telecom = setChartDataStack_Timelapse_Open(json_data, 'TELECOM', 'Open');
							chartdata_stack.push(chartdata_stack_telecom);
							chartdata_stack_telecom = null;

							chartdata_stack_textiles = setChartDataStack_Timelapse_Open(json_data, 'TEXTILES', 'Open');
							chartdata_stack.push(chartdata_stack_textiles);
							chartdata_stack_textiles = null;

							$scope.chartdata_timelapse = chartdata_stack;

							json_data = null;
							return data;
						}
						,
						async: false
					});
					return $scope.chartdata_timelapse;
				};

				function setChartDataStack_Timelapse_Open(json_data, sector){
					//alert('setChartDataStack');
					group1 = 0;
					group2 = 0;
					group3 = 0;
					group4 = 0;
					total = 0;
					time = 0;

					
					$.each(json_data, function(idx, obj1) {

						charttmp = {};

						$.each(obj1, function(idx, obj2) {


							if(idx=="SECTOR"){
								charttmp["SECTOR"] = obj2;
							};
							if(idx=="DAY_OPEN_CHG_P"){
								charttmp["DAY_CHG_P"] = parseFloat(obj2).toFixed(1);
							};
							if(idx=="NSE_INDEX"){
								charttmp["NSE_INDEX"] = parseInt(obj2);
							};
							if(idx=="FNO_FLAG"){
								charttmp["FNO_FLAG"] = parseInt(obj2);
							};
							if(idx=="TIME"){
								time = parseInt(obj2);
							};
							if(idx=="TIMESTAMP"){
								timestamp = obj2;
								$scope.Snapshot_Time_Open = obj2;
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
					if(sector == 'INDUSTRIAL MANUFACTURING'){
						sector = 'INDUSTRIAL';
					}else if(sector == 'FINANCIAL SERVICES'){
						sector = 'FINANCE';
					}else if(sector == 'CHEMICALS & FERTILISERS'){
						sector = 'CHEMICALS';
					}else if(sector == 'PSU BANK'){
						sector = 'PSU';
					}else if(sector == 'CONSUMER GOODS'){
						sector = 'FMCG';
					}else if(sector == 'PRIVATE BANK'){
						sector = 'PRIVATE';
					}

					chartdata = {'sector': sector, 'time': time,'group1':group1perc,'group2': group2perc, 'group3': group3perc, 'group4': group4perc, 'countgroup1': group1, 'countgroup2': group2, 'countgroup3': group3, 'countgroup4':  group4};

					return chartdata;
				}

				var chart_stack_timelapse_open = AmCharts.makeChart("m_chart_sector_stack_view_timelapse_open_dashboard", {
					"type": "serial",
					"theme": "light",
					"dataProvider": $scope.marketviewchange_open_stack_timelapse(1),
					"marginTop": 35,
					"startDuration": 0,
					"valueAxes": [{
						"stackType": "regular",
						"axisAlpha": 0.3,
						"gridAlpha": 0,
						"maximum": 100,
					}],
					"graphs": [{
						"balloonText": "<b>< -2%</b><br><span style='font-size:14px'>[[sector]]<b>([[countgroup1]]):[[group1]]%</b></span>",
						"fillAlphas": 0.8,
						"labelText": "[[group1]]",
						"lineAlpha": 0.3,
						"title": "< -2",
						"type": "column",
						"color": "#000000",
						"valueField": "group1",
						"fillColors": "#FF0033"
					}, {
						"balloonText": "<b>0% to -2%</b><br><span style='font-size:14px'>[[sector]]<b>([[countgroup2]]):[[group2]]%</b></span>",
						"fillAlphas": 0.8,
						"labelText": "[[group2]]",
						"lineAlpha": 0.3,
						"title": "0 to -2",
						"type": "column",
						"color": "#000000",
						"valueField": "group2",
						"fillColors": "#FF9999"
					}, {
						"balloonText": "<b>0% to 2%</b><br><span style='font-size:14px'>[[sector]]<b>([[countgroup3]]):[[group3]]%</b></span>",
						"fillAlphas": 0.8,
						"labelText": "[[group3]]",
						"lineAlpha": 0.3,
						"title": "0 to 2",
						"type": "column",
						"color": "#000000",
						"valueField": "group3",
						"fillColors": "#99FFCC"
					}, {
						"balloonText": "<b>> 2%</b><br><span style='font-size:14px'>[[sector]]<b>([[countgroup4]]):[[group4]]%</b></span>",
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

				$scope.loop_func_open = function(i){
						if (paused_open) {
							loop_func_o = setTimeout(
								function(){
									$scope.loop_func_open(i)
								}

								, 2000);
								return;
							}
							type = $scope.SelectChangeValue_Timelapse

							j = i+1;
							if(i==$scope.timelapse_count){
								k++;
								j = 1;
							};

							var data = $scope.marketviewchange_open_stack_timelapse(i);
							chart_stack_timelapse_open.clearLabels()
							chart_stack_timelapse_open.addLabel("!20", "!300", $scope.Snapshot_Time_Open, "right", 16,"black",0,1,true)
							chart_stack_timelapse_open.animateData(data, {
								duration: 0,
								complete: function () {
									$("#snapshot_time_open").text($scope.Snapshot_Time_Open);
									chart_stack_timelapse_close.allLabels.text = $scope.Snapshot_Time_Open;
									if(k==1){
										k = 0;
										return;
									};
									loop_func_o1 =	setTimeout(
										function(){
											$scope.loop_func_open(j)
										}

										, 2000);
									}
								});

				};

				$scope.togglePlayOpen = function() {
					paused_open = !paused_open;
					document.getElementById("btpauseopen_dashboard").value = paused_open ? "resume" : "pause";
				};
				// All Sectors Timelapse - Open logic Coding Ended ///

				// All Sectors Timelapse - Close logic Coding ///
				$scope.getTimelapseCount = function(){
					if ($rootScope.user_permission.BASIC != false){
						return
					}else
					{
					$http.get('/app/Markets_View_Change_Fut_Timelapse_Count/').then( function(response){
						$scope.timelapse_count = response.data;
					});
				}
				};

				j = 0;
				k = 0;
				max_limit = 0;
				$scope.getTimelapseCount();

				$scope.Snapshot_Time_Close = '0000-00-00 00:00:00';
				var paused_close = false;

				$scope.marketviewchange_close_stack_timelapse = function(snapshot_id){

					url = '/app/Markets_View_Change_Fut_Timelapse/'+String(snapshot_id)+'/';
					count = $scope.timelapse_count;

					$.ajax({
						type: "GET",
						url: url,
						// This is the dictionary you are SENDING to your Django code.
						// We are sending the 'action':add_car and the 'id: $car_id
						// which is a variable that contains what car the user selected
						datatype: "json",
						//data: {'array':array},
						error: function(XMLHttpRequest, textStatus, errorThrown){
							//alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
							if(XMLHttpRequest.status == 0)
							window.location.href = '/accounts/login/';
						},
						success: function(data){
							json_data = data;
							chartdata_stack = [];

							// chartdata_stack_finance = setChartDataStack_Timelapse_Close(json_data, 'FINANCIAL SERVICES');
							// chartdata_stack.push(chartdata_stack_finance);
							// chartdata_stack_finance = null;

							chartdata_stack_automobile = setChartDataStack_Timelapse_Close(json_data, 'AUTO', 'Open');
							chartdata_stack.push(chartdata_stack_automobile);
							chartdata_stack_automobile = null;

							chartdata_stack_cement = setChartDataStack_Timelapse_Close(json_data, 'CEMENT', 'Open');
							chartdata_stack.push(chartdata_stack_cement);
							chartdata_stack_cement = null;

							chartdata_stack_chemicals = setChartDataStack_Timelapse_Close(json_data, 'CHEMICALS & FERTILISERS', 'Open');
							chartdata_stack.push(chartdata_stack_chemicals);
							chartdata_stack_chemicals = null;

							chartdata_stack_construction = setChartDataStack_Timelapse_Close(json_data, 'CONSTRUCTION', 'Open');
							chartdata_stack.push(chartdata_stack_construction);
							chartdata_stack_construction = null;

							chartdata_stack_fmcg = setChartDataStack_Timelapse_Close(json_data, 'CONSUMER GOODS', 'Open');
							chartdata_stack.push(chartdata_stack_fmcg);
							chartdata_stack_fmcg = null;

							chartdata_stack_energy = setChartDataStack_Timelapse_Close(json_data, 'ENERGY', 'Open');
							chartdata_stack.push(chartdata_stack_energy);
							chartdata_stack_energy = null;

							chartdata_stack_finance = setChartDataStack_Timelapse_Close(json_data, 'FINANCIAL SERVICES', 'Open');
							chartdata_stack.push(chartdata_stack_finance);
							chartdata_stack_finance = null;

							chartdata_stack_industrial = setChartDataStack_Timelapse_Close(json_data, 'INDUSTRIAL MANUFACTURING', 'Open');
							chartdata_stack.push(chartdata_stack_industrial);
							chartdata_stack_industrial = null;

							chartdata_stack_it = setChartDataStack_Timelapse_Close(json_data, 'IT', 'Open');
							chartdata_stack.push(chartdata_stack_it);
							chartdata_stack_it = null;

							chartdata_stack_media = setChartDataStack_Timelapse_Close(json_data, 'MEDIA', 'Open');
							chartdata_stack.push(chartdata_stack_media);
							chartdata_stack_media = null;

							chartdata_stack_metals = setChartDataStack_Timelapse_Close(json_data, 'METALS', 'Open');
							chartdata_stack.push(chartdata_stack_metals);
							chartdata_stack_metals = null;

							chartdata_stack_misc = setChartDataStack_Timelapse_Close(json_data, 'MISC', 'Open');
							chartdata_stack.push(chartdata_stack_misc);
							chartdata_stack_misc = null;

							chartdata_stack_pharma = setChartDataStack_Timelapse_Close(json_data, 'PHARMA', 'Open');
							chartdata_stack.push(chartdata_stack_pharma);
							chartdata_stack_pharma = null;

							chartdata_stack_pvt_bank = setChartDataStack_Timelapse_Close(json_data, 'PRIVATE BANK', 'Open');
							chartdata_stack.push(chartdata_stack_pvt_bank);
							chartdata_stack_pvt_bank = null;

							chartdata_stack_psu_bank = setChartDataStack_Timelapse_Close(json_data, 'PSU BANK', 'Open');
							chartdata_stack.push(chartdata_stack_psu_bank);
							chartdata_stack_psu_bank = null;

							chartdata_stack_services = setChartDataStack_Timelapse_Close(json_data, 'SERVICES', 'Open');
							chartdata_stack.push(chartdata_stack_services);
							chartdata_stack_services = null;

							chartdata_stack_telecom = setChartDataStack_Timelapse_Close(json_data, 'TELECOM', 'Open');
							chartdata_stack.push(chartdata_stack_telecom);
							chartdata_stack_telecom = null;

							chartdata_stack_textiles = setChartDataStack_Timelapse_Close(json_data, 'TEXTILES', 'Open');
							chartdata_stack.push(chartdata_stack_textiles);
							chartdata_stack_textiles = null;

							$scope.chartdata_timelapse = chartdata_stack;

							json_data = null;
							return data;
						}
						,
						async: false

					});

					return $scope.chartdata_timelapse;
				};

				function setChartDataStack_Timelapse_Close(json_data, sector){
					group1 = 0;
					group2 = 0;
					group3 = 0;
					group4 = 0;
					total = 0;
					time = 0;

					$.each(json_data, function(idx, obj1) {

						charttmp = {};

						$.each(obj1, function(idx, obj2) {

							if(idx=="SECTOR"){
								charttmp["SECTOR"] = obj2;
							};
							if(idx=="DAY_CLOSE_CHG_P"){
								charttmp["DAY_CHG_P"] = parseFloat(obj2).toFixed(1);
							};
							if(idx=="NSE_INDEX"){
								charttmp["NSE_INDEX"] = parseInt(obj2);
							};
							if(idx=="FNO_FLAG"){
								charttmp["FNO_FLAG"] = parseInt(obj2);
							};
							if(idx=="TIME"){
								time = parseInt(obj2);
							};
							if(idx=="TIMESTAMP"){
								timestamp = obj2;
								$scope.Snapshot_Time_Close = obj2;
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
					if(sector == 'INDUSTRIAL MANUFACTURING'){
						sector = 'INDUSTRIAL';
					}else if(sector == 'FINANCIAL SERVICES'){
						sector = 'FINANCE';
					}else if(sector == 'CHEMICALS & FERTILISERS'){
						sector = 'CHEMICALS';
					}else if(sector == 'PSU BANK'){
						sector = 'PSU';
					}else if(sector == 'CONSUMER GOODS'){
						sector = 'FMCG';
					}else if(sector == 'PRIVATE BANK'){
						sector = 'PRIVATE';
					}

					chartdata = {'sector': sector, 'time': time, 'timestamp': timestamp,'group1':group1perc,'group2': group2perc, 'group3': group3perc, 'group4': group4perc, 'countgroup1': group1, 'countgroup2': group2, 'countgroup3': group3, 'countgroup4':  group4};

					return chartdata;
				}


				var chart_stack_timelapse_close = AmCharts.makeChart("m_chart_sector_stack_view_timelapse_close_dashboard", {
					"type": "serial",
					"theme": "light",
					"dataProvider": $scope.marketviewchange_close_stack_timelapse(1),
					"marginTop": 35,
					"startDuration": 0,
					"valueAxes": [{
						"stackType": "regular",
						"axisAlpha": 0.3,
						"gridAlpha": 0,
						"maximum": 100,
					}],
					"graphs": [{
						"balloonText": "<b>< -2%</b><br><span style='font-size:14px'>[[sector]]<b>([[countgroup1]]):[[group1]]%</b></span>",
						"fillAlphas": 0.8,
						"labelText": "[[group1]]",
						"lineAlpha": 0.3,
						"title": "< -2",
						"type": "column",
						"color": "#000000",
						"valueField": "group1",
						"fillColors": "#FF0033"
					}, {
						"balloonText": "<b>0% to -2%</b><br><span style='font-size:14px'>[[sector]]<b>([[countgroup2]]):[[group2]]%</b></span>",
						"fillAlphas": 0.8,
						"labelText": "[[group2]]",
						"lineAlpha": 0.3,
						"title": "0 to -2",
						"type": "column",
						"color": "#000000",
						"valueField": "group2",
						"fillColors": "#FF9999"
					}, {
						"balloonText": "<b>0% to 2%</b><br><span style='font-size:14px'>[[sector]]<b>([[countgroup3]]):[[group3]]%</b></span>",
						"fillAlphas": 0.8,
						"labelText": "[[group3]]",
						"lineAlpha": 0.3,
						"title": "0 to 2",
						"type": "column",
						"color": "#000000",
						"valueField": "group3",
						"fillColors": "#99FFCC"
					}, {
						"balloonText": "<b>> 2%</b><br><span style='font-size:14px'>[[sector]]<b>([[countgroup4]]):[[group4]]%</b></span>",
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

				$scope.loop_func_close = function(i){

					if (paused_close) {
						loop_func_c =	setTimeout(
							function(){
								$scope.loop_func_close(i)
							}

							, 2000);
							return;
						}
						type = $scope.SelectChangeValue_Timelapse

						j = i+1;
						if(i==$scope.timelapse_count){
							k++;
							j = 1;
						};

						var data = $scope.marketviewchange_close_stack_timelapse(i);
						chart_stack_timelapse_close.clearLabels()
						chart_stack_timelapse_close.addLabel("!20", "!300", $scope.Snapshot_Time_Close, "right", 16,"black",0,1,true)

						chart_stack_timelapse_close.animateData(data, {
							duration: 0,
							complete: function () {
								$("#snapshot_time_close").text($scope.Snapshot_Time_Close);

								if(k==1){
									k = 0;
									j=0;
									return;
								};
								loop_func_c1 = setTimeout(
									function(){
										$scope.loop_func_close(j)
									}

									, 2000);
								}
							});

				};

				$scope.togglePlayClose = function() {
					paused_close = !paused_close;

					document.getElementById("btpauseclose_dashboard").value = paused_close ? "resume" : "pause";
				};

				// All Sectors Timelapse - Close logic Coding Ended ///

			} 
		}
		});
	
