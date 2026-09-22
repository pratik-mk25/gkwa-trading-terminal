angular
	.module('app')
	.config(function ($httpProvider) {
		$httpProvider.defaults.xsrfCookieName = 'csrftoken'
		$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken'
	})
	.controller('headerCtrl', ['getUserNotificationsDataService', 'getFeatureNotificationDataService', '$scope', '$http', '$interval', '$timeout', function (getUserNotificationsData, getFeatureNotificationDataService, $scope, $http, $interval, $timeout) {
		$scope.user_notification_data = null;
		$scope.stop_icon_animate = null;
		function user_notifications(data) {
			json_data = data;
			len = parseInt(json_data.length);
			notification_data = [];
			$.each(json_data, function (idx, obj1) {
				notification_temp = {};
				$.each(obj1, function (idx, obj2) {
					if (idx == "MESSAGE") {
						notification_temp["MESSAGE"] = obj2;
					};
					if (idx == "TIMESTAMP") {
						notification_temp["TIMESTAMP"] = timestamp_init(obj2);
					};
					if (idx == "TYPE") {
						notification_temp["TYPE"] = obj2;
					};
					if (idx == "READ") {
						notification_temp["READ"] = parseInt(obj2);
					};
				});
				notification_data.push(notification_temp);
				$scope.user_notification_data = notification_data;
			});
		};
		function timeSince(timeStamp) {
			var now = new Date(),
				secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
			if (secondsPast < 60) {
				return parseInt(secondsPast) + ' secs';
			}
			if (secondsPast < 3600) {
				return parseInt(secondsPast / 60) + ' mins';
			}
			if (secondsPast <= 86400) {
				return parseInt(secondsPast / 3600) + ' hrs';
			}
			if (secondsPast > 86400) {
				day = timeStamp.getDate();
				month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
				year = timeStamp.getFullYear() == now.getFullYear() ? "" : " " + timeStamp.getFullYear();
				return day + " " + month + year;
			}
		};
		function timestamp_init(current) {
			d = new Date(current);
			return timeSince(d);
		};
		function user_notifications_count() {
			$http.get('/app/User_Notifications_Count_Getdata/').then(function (response) {
				json_data = response.data;
				$.each(json_data, function (idx, obj1) {
					$.each(obj1, function (idx, obj2) {
						if (idx == "COUNT") {
							$scope.count = parseInt(obj2);
							if ($scope.count > 0) {
								console.log("audio")
								var audio = document.getElementById('scannerAlertAudio')
								audio.play()
								shake_blink_add();
							}
							else {
								shake_blink_remove();
							}
						};
					});
				});

			});
		}
		function user_notifications_read() {
			$http.post('/app/User_Notifications_Read/').then(function (response) {
				$scope.user_notifications_change_data();
			});
		}
		function user_notifications_count_reset() {
			$http.post('/app/User_Notifications_Count_Pushdata/').then(function (response) {
				user_notifications_count();
			});
		}
		hasbeenclicked = false;
		$(".notification_count").click(function () {
			hasbeenclicked = true;
			if ($("#ts_notification").hasClass("m-dropdown--open")) {
				user_notifications_count_reset();
				user_notifications_read();
				clear_interval($scope.stop_icon_animate);
				hasbeenclicked = false;
			};

		});
		$(document).click(function () {
			if ($("#ts_notification").hasClass("m-dropdown--open") && (hasbeenclicked)) {
				user_notifications_count_reset();
				user_notifications_read();
				clear_interval($scope.stop_icon_animate);
				hasbeenclicked = false;
			};

		});
		clear_interval = null;
		clear_interval = function (a) {
			clearInterval(a);
			$("#tradestation_notification_icon .m-nav__link-icon").removeClass("m-animate-shake");
			$("#tradestation_notification_icon .m-nav__link-badge").removeClass("m-animate-blink");
		};
		function shake_blink_add() {
			$("#tradestation_notification_badge").addClass("m-nav__link-badge m-badge m-badge--accent"),
				$scope.stop_icon_animate = setInterval(function () {
					$("#tradestation_notification_icon .m-nav__link-icon").addClass("m-animate-shake"),
						$("#tradestation_notification_icon .m-nav__link-badge").addClass("m-animate-blink")
				}, 2000);


		};
		function shake_blink_remove() {
			$scope.count = "";
			$("#tradestation_notification_badge").removeClass("m-nav__link-badge m-badge m-badge--accent");
			$("#tradestation_notification_icon .m-nav__link-icon").removeClass("m-animate-shake");
			$("#tradestation_notification_icon .m-nav__link-badge").removeClass("m-animate-blink");
		};
		$scope.user_notifications_change_data = function () {
			var getNotificationData = getUserNotificationsData.getData();
			getNotificationData.then(function (data) {
				user_notifications(data);
				setTimeout(
					function () {
						$http.get('/check_user_login/').then(function (response) {
							//console.log(response.data);
							if (response.data == "False") {
								window.location = "/auth/login/";
							}
						});

						$scope.user_notifications_change_data();
					}, 60000);
			});
		};
		var tinker1_set_timeout;
		// $scope.ticker_change_data = function () {
		// 	var getTickerChangeData = getTickerData.getData();
		// 	getTickerChangeData.then(function (data) {
		// 		$scope.ticker_data = data;
		// 		$scope.ticker_total_group = parseInt($scope.ticker_data.length / 2);
		// 		$scope.data_lenght_array = $scope.ticker_data.length;
		// 		clearTimeout(tinker1_set_timeout);
		// 		tinker1();
		// 		setTimeout(
		// 			function () {
		// 				$scope.ticker_change_data();
		// 			}, 120000);
		// 	});
		// };


		function tinker1() {
			data = $scope.ticker_data;
			$scope.ticker_data_array = [];
			count = 1;
			$.each(data, function (idx, obj1) {
				ticker_data_temp = {};
				$.each(obj1.fields, function (idx, obj2) {

					if (idx == "SYMBOL") {
						ticker_data_temp['SYMBOL'] = obj2;
					};
					if (idx == "TICKER_TYPE") {
						ticker_data_temp['TICKER_TYPE'] = obj2;
					};
					if (idx == "ALERT") {
						ticker_data_temp['ALERT'] = parseInt(obj2);
					};
					if (idx == "EXPIRY") {
						ticker_data_temp['EXPIRY'] = parseInt(obj2);
					};
					if (idx == "TIMESTAMP") {
						ticker_data_temp['TIMESTAMP'] = obj2;
					};
					if (idx == "TIMEFRAME") {
						ticker_data_temp['TIMEFRAME'] = obj2;
					};

					ticker_data_temp['ID'] = parseInt(count);
				});
				count++;
				if (ticker_data_temp['ID'] % 2 == 1) {
					ticker_data_temp['GROUP_ID'] = 1;
				}
				if (ticker_data_temp['ID'] % 2 == 0) {
					ticker_data_temp['GROUP_ID'] = 0;
				}
				$scope.ticker_data_array.push(ticker_data_temp);
			});

			if ($(".tinker_1").hasClass("tinker_1")) {
				data_i = 0;
				for (i = 0; i < $scope.ticker_data_array.length; i++) {

					if ($scope.ticker_data_array[i]['GROUP_ID'] == 0 && (i == $scope.data_lenght_array - 1)) {

						$scope.tinker_1 = $scope.ticker_data_array[i]['SYMBOL'];
						$scope.tinker_type_1 = $scope.ticker_data_array[i]['TICKER_TYPE'];
						$scope.tinker_color_1 = $scope.ticker_data_array[i]['ALERT'];
						$scope.tinker_timeframe_1 = $scope.ticker_data_array[i]['TIMEFRAME'];
						$scope.$applyAsync(function () {

						});
					};
					if ($scope.ticker_data_array[i]['GROUP_ID'] == 0 && (i == $scope.data_lenght_array - 1)) {

						$scope.tinker_2 = $scope.ticker_data_array[i]['SYMBOL'];
						$scope.tinker_type_2 = $scope.ticker_data_array[i]['TICKER_TYPE'];
						$scope.tinker_color_2 = $scope.ticker_data_array[i]['ALERT'];
						$scope.tinker_timeframe_2 = $scope.ticker_data_array[i]['TIMEFRAME'];
						$scope.$applyAsync(function () {

						});
					};
					if ($scope.ticker_data_array[i]['GROUP_ID'] == 1 && (i == $scope.data_lenght_array - 1)) {

						$scope.tinker_1 = $scope.ticker_data_array[i]['SYMBOL'];
						$scope.tinker_type_1 = $scope.ticker_data_array[i]['TICKER_TYPE'];
						$scope.tinker_color_1 = $scope.ticker_data_array[i]['ALERT'];
						$scope.tinker_timeframe_1 = $scope.ticker_data_array[i]['TIMEFRAME'];
						$scope.$applyAsync(function () {

						});
					};
					if ($scope.ticker_data_array[i]['GROUP_ID'] == 1 && (i == $scope.data_lenght_array - 1)) {

						$scope.tinker_2 = $scope.ticker_data_array[i]['SYMBOL'];
						$scope.tinker_type_2 = $scope.ticker_data_array[i]['TICKER_TYPE'];
						$scope.tinker_color_2 = $scope.ticker_data_array[i]['ALERT'];
						$scope.tinker_timeframe_2 = $scope.ticker_data_array[i]['TIMEFRAME'];
						$scope.$applyAsync(function () {

						});
					};
					$("#div_ticker_2").show();
					if (data_i == 1 || data_i == 0) {
						data_i = 2;
					}
					else {
						data_i = 1;
					};
					div_ticker_change(data_i);

				};
				var data_l = 0;
				for (i = 0; i < $scope.ticker_data_array.length; i++) {
					if ($scope.ticker_data_array[i]['GROUP_ID'] == 1 && (i == $scope.data_lenght_array - 2)) {

						$scope.tinker_3 = $scope.ticker_data_array[i]['SYMBOL'];
						$scope.tinker_type_3 = $scope.ticker_data_array[i]['TICKER_TYPE'];
						$scope.tinker_color_3 = $scope.ticker_data_array[i]['ALERT'];
						$scope.tinker_timeframe_3 = $scope.ticker_data_array[i]['TIMEFRAME'];
						$scope.$applyAsync(function () {

						});
					};
					if ($scope.ticker_data_array[i]['GROUP_ID'] == 1 && (i == $scope.data_lenght_array - 2)) {
						$scope.tinker_4 = $scope.ticker_data_array[i]['SYMBOL'];
						$scope.tinker_type_4 = $scope.ticker_data_array[i]['TICKER_TYPE'];
						$scope.tinker_color_4 = $scope.ticker_data_array[i]['ALERT'];
						$scope.tinker_timeframe_4 = $scope.ticker_data_array[i]['TIMEFRAME'];
						$scope.$applyAsync(function () {

						});
					};
					if ($scope.ticker_data_array[i]['GROUP_ID'] == 0 && (i == $scope.data_lenght_array - 2)) {

						$scope.tinker_3 = $scope.ticker_data_array[i]['SYMBOL'];
						$scope.tinker_type_3 = $scope.ticker_data_array[i]['TICKER_TYPE'];
						$scope.tinker_color_3 = $scope.ticker_data_array[i]['ALERT'];
						$scope.tinker_timeframe_3 = $scope.ticker_data_array[i]['TIMEFRAME'];
						$scope.$applyAsync(function () {

						});
					};
					if ($scope.ticker_data_array[i]['GROUP_ID'] == 0 && (i == $scope.data_lenght_array - 2)) {
						$scope.tinker_4 = $scope.ticker_data_array[i]['SYMBOL'];
						$scope.tinker_type_4 = $scope.ticker_data_array[i]['TICKER_TYPE'];
						$scope.tinker_color_4 = $scope.ticker_data_array[i]['ALERT'];
						$scope.tinker_timeframe_4 = $scope.ticker_data_array[i]['TIMEFRAME'];
						$scope.$applyAsync(function () {

						});
					};
					$("#div_ticker_4").show();
					if (data_l == 1 || data_l == 0) {
						data_l = 2;
					}
					else {
						data_l = 1;
					};
					div_ticker_change_2(data_l);
				};
				if ($scope.data_lenght_array == 0 | $scope.data_lenght_array == 1) {
					$scope.data_lenght_array = $scope.ticker_data.length;
				}
				else {
					$scope.data_lenght_array = $scope.data_lenght_array - 2;
				};
			};

			tinker1_set_timeout = setTimeout(function () {
				tinker1();
			}, 4000);
		};
		$(document).ready(function () {
			$("#div_ticker_2").hide();
			$("#div_ticker_4").hide();
		});

		var data_i = 0;
		function div_ticker_change(i) {
			if (i == 0) {
				$("#div_ticker_1").css({ "transform": "translate3d(0px, 0px, 0px)", "transition-duration": "500ms", "visibility": "hidden" });
				$("#div_ticker_2").css({ "transform": "translate3d(0px, 70px, 0px)", "transition-duration": "500ms", "visibility": "hidden" });
			};

			if (i == 1) {
				$("#div_ticker_1").css({ "transition": "" });
				$("#div_ticker_1").css({ "transform": "translate3d(0px, 0px, 0px)", "transition-duration": "500ms", "visibility": "visible" });
				$("#div_ticker_2").css({ "transform": "translate3d(0px, 75px, 0px)", "transition-duration": "500ms", "visibility": "hidden", "transition": "none" });
			};
			if (i == 2) {
				$("#div_ticker_1").css({ "transform": "translate3d(0px, 75px, 0px)", "transition-duration": "500ms", "visibility": "hidden", "transition": "none" });
				$("#div_ticker_2").css({ "transition": "" });
				$("#div_ticker_2").css({ "transform": "translate3d(0px, 0px, 0px)", "transition-duration": "500ms", "visibility": "visible" });
			};

		};

		function div_ticker_change_2(l) {
			if (l == 0) {
				$("#div_ticker_3").css({ "transform": "translate3d(0px, 0px, 0px)", "transition-duration": "500ms", "visibility": "hidden" });
				$("#div_ticker_4").css({ "transform": "translate3d(0px, 70px, 0px)", "transition-duration": "500ms", "visibility": "hidden" });
			};

			if (l == 1) {
				$("#div_ticker_3").css({ "transition": "" });
				$("#div_ticker_3").css({ "transform": "translate3d(0px, 0px, 0px)", "transition-duration": "500ms", "visibility": "visible" });
				$("#div_ticker_4").css({ "transform": "translate3d(0px, 75px, 0px)", "transition-duration": "500ms", "visibility": "hidden", "transition": "none" });
			};
			if (l == 2) {
				$("#div_ticker_3").css({ "transform": "translate3d(0px, 75px, 0px)", "transition-duration": "500ms", "visibility": "hidden", "transition": "none" });
				$("#div_ticker_4").css({ "transition": "" });
				$("#div_ticker_4").css({ "transform": "translate3d(0px, 0px, 0px)", "transition-duration": "500ms", "visibility": "visible" });
			};

			$("#div_ticker_4").show();
		};

		function feature_info_alert(data) {
			$scope.web_feature = data;
		}

		$scope.feature_change_data = function () {
			var getFeatureNotification = getFeatureNotificationDataService.getData();
			getFeatureNotification.then(function (data) {
				feature_info_alert(data);
				setTimeout(
					function () {
						$http.get('/check_user_login/').then(function (response) {
							if (response.data == "False") {
								window.location = "/auth/login/";
							}
						});
						$scope.feature_change_data();
					}, 1000);
			});
		};

		$scope.user_notifications_change_data();
		$scope.feature_change_data();
		// $scope.ticker_change_data();
	}]);
