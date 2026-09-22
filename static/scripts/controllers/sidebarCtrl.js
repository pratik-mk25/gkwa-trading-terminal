angular
.module('app')
.config(function($httpProvider) {
$httpProvider.defaults.xsrfCookieName = 'csrftoken'
$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken'
})
.controller('sidebarCtrl', ['getAtr30DataService','getVolumeSurgeDataService', '$scope' , '$http','$interval','$rootScope', function(getAtr30Data,getVolumeSurgeData,$scope, $http, $interval, $rootScope){
	$scope.stocksInPlay_data = null;
	$scope.volumeSurge_data = null;

	function stocksInPlay(data){
		//console.log("inside user_notifications");
		json_data = data;
		len = parseInt(json_data.length);
		//console.log(len);
		stocksInPlay_data_array = [];

		$.each(json_data, function(idx,obj1){
			stocksInPlay_data_temp = {};
			$.each(obj1.fields, function(idx,obj2){

				if(idx == "SYMBOL"){
					stocksInPlay_data_temp["SYMBOL"] = obj2;
				};
				if(idx == "ATR_EXPANSION"){
					if(obj2 == 1){
						stocksInPlay_data_temp["ATR_EXPANSION"] = true;
					}
				};
				if(idx == "ATR_PR"){
					stocksInPlay_data_temp["ATR_PR"] = parseFloat(obj2);
				};
				if(idx == "ATR_RANK"){
					stocksInPlay_data_temp["ATR_RANK"] = parseFloat(obj2);
				};
				if(idx == "REX"){
					stocksInPlay_data_temp["REX"] = parseFloat(obj2);
				};
				if(idx == "RIX"){
					stocksInPlay_data_temp["RIX"] = parseFloat(obj2);
				};
				if(idx == "TIMESTAMP"){
					stocksInPlay_data_temp["TIMESTAMP"] = timestamp_init(obj2);
					//Date.parse(obj2);
				};

			});
			if(stocksInPlay_data_temp["ATR_EXPANSION"]){
				stocksInPlay_data_array.push(stocksInPlay_data_temp);
			}
			$rootScope.stocksInPlay_data = stocksInPlay_data_array;
			stocksInPlay_data_temp = null;
		});
		stocksInPlay_data_array = null;
	};

	function volumeSurge(data){
		//console.log("inside user_notifications");
		json_data = data;
		len = parseInt(json_data.length);
		//console.log(len);
		volumeSurge_data_array = [];

		$.each(json_data, function(idx,obj1){
			volumeSurge_data_temp = {};
			$.each(obj1.fields, function(idx,obj2){

				if(idx == "SYMBOL"){
					volumeSurge_data_temp["SYMBOL"] = obj2;
				};
				if(idx == "FLAG"){
					volumeSurge_data_temp["FLAG"] = parseInt(obj2);
				};
				if(idx == "MULTIPLE"){
					volumeSurge_data_temp["MULTIPLE"] = parseFloat(obj2);
				};
				if(idx == "TIMESTAMP"){
					volumeSurge_data_temp["TIMESTAMP"] = timestamp_init(obj2);
				};

			});
			volumeSurge_data_array.push(volumeSurge_data_temp);
			volumeSurge_data_temp = null;
		});
		$rootScope.volumeSurge_data = volumeSurge_data_array;
		//console.log($scope.volumeSurge_data);
		volumeSurge_data_array = null;
	};


	function timeSince(timeStamp) {
		var now = new Date(),
		secondsPast = (now.getTime() - timeStamp.getTime() ) / 1000;
		if(secondsPast < 60){
			return parseInt(secondsPast) + ' secs';
		}
		if(secondsPast < 3600){
			return parseInt(secondsPast/60) + ' mins';
		}
		if(secondsPast <= 86400){
			return parseInt(secondsPast/3600) + ' hrs';
		}
		if(secondsPast > 86400){
			day = timeStamp.getDate();
			month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
			year = timeStamp.getFullYear() == now.getFullYear() ? "" :  " "+timeStamp.getFullYear();
			return day + " " + month + year;
		}
	};

	function timestamp_init(current){
		d = new Date(current);
		return timeSince(d);
	};


	/*function user_notifications_count(){
		$http.get('/app/User_Notifications_Count_Getdata/').then(function(response){

			json_data = response.data;
			console.log(json_data);
			$.each(json_data, function(idx,obj1){
				$.each(obj1, function(idx,obj2){
					if(idx == "COUNT"){
						$scope.count = parseInt(obj2);
						console.log($scope.count);
						if($scope.count > 0){
							document.getElementById('scannerAlertAudio').play();
							shake_blink_add();
						}
						else{
							shake_blink_remove();
						}
					};
				});
			});

		});
	}*/

	/*function user_notifications_read(){
		//console.log("inside notifications read");
		$http.post('/app/User_Notifications_Read/').then(function(response){
			$scope.user_notifications_change_data();
		});
	}

	function user_notifications_count_reset(){
		//console.log("Inside count reset");
		$http.post('/app/User_Notifications_Count_Pushdata/').then(function(response){
			user_notifications_count();
		});
	}*/

	/*hasbeenclicked = false;

	$(".notification_count").click(function(){
		//console.log("count reset clicked");
		hasbeenclicked = true;
	    //user_notifications_count_reset();

		if($("#ts_notification").hasClass("m-dropdown--open")){
			user_notifications_count_reset();
			user_notifications_read();
			clear_interval($scope.stop_icon_animate);
			hasbeenclicked = false;
		};

	});

	$(document).click(function(){

		if($("#ts_notification").hasClass("m-dropdown--open") && (hasbeenclicked)){
			user_notifications_count_reset();
			user_notifications_read();
			clear_interval($scope.stop_icon_animate);
			hasbeenclicked = false;
		};
	    //user_notifications_count_reset()

	});*/

	/*clear_interval = null;


	clear_interval = function(a){
			console.log("inside clearInterval");
			clearInterval(a);
			$("#tradestation_notification_icon .m-nav__link-icon").removeClass("m-animate-shake");
			$("#tradestation_notification_icon .m-nav__link-badge").removeClass("m-animate-blink");
		};*/



	/*setInterval(function(){
		$("#tradestation_notification_icon .m-nav_link-icon").addClass("m-animate-shake"),
		$("#tradestation_notification_icon .m-navlink-badge").addClass("m-animate-blink")},3e3);

	setInterval(function(){
		$("#tradestation_notification_icon .m-navlink-icon").removeClass("m-animate-shake"),
		$("#tradestation_notification_icon .m-nav_link-badge").removeClass("m-animate-blink")},6e3);*/


	/*function shake_blink_add(){
		//console.log(" shake_blink_add called");
		$("#tradestation_notification_badge").addClass("m-nav__link-badge m-badge m-badge--accent"),
		$scope.stop_icon_animate = setInterval(function(){
		$("#tradestation_notification_icon .m-nav__link-icon").addClass("m-animate-shake"),
		$("#tradestation_notification_icon .m-nav__link-badge").addClass("m-animate-blink")
		//console.log("add animate");
	},2000);


	};

	function shake_blink_remove(){
		//console.log(" shake_blink_remove called");
		$scope.count = "";
		$("#tradestation_notification_badge").removeClass("m-nav__link-badge m-badge m-badge--accent");
		$("#tradestation_notification_icon .m-nav__link-icon").removeClass("m-animate-shake");
		$("#tradestation_notification_icon .m-nav__link-badge").removeClass("m-animate-blink");
	};*/


	$scope.stocks_in_play_getdata = function(){
	//	console.log("inside stocks_in_play_getdata");
		var getStockInPlayData = getAtr30Data.getData();
		getStockInPlayData.then(function(data){
				//console.log('printing stocks_in_play data');
				//console.log(data);
				stocksInPlay(data);
				setTimeout(
					function() {
						$scope.stocks_in_play_getdata();
					} , 60000);
			});
	};

	$scope.volume_surge_getdata = function(){
		//console.log("inside stocks_in_play_getdata");
		var VolumeSurgeData = getVolumeSurgeData.getData();
		VolumeSurgeData.then(function(data){
			//	console.log('printing Volume Surge data');
			//	console.log(data);
				volumeSurge(data);
				setTimeout(
					function() {
						$scope.volume_surge_getdata();
					} , 60000);
			});
	};

	$scope.stocks_in_play_getdata();
	$scope.volume_surge_getdata();
	//user_notifications_count();
	}]);
