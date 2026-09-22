angular.module("dashboard").component("dashboard", {
  templateUrl: "/static/scripts/templates/dashboard.html",
  controller: function (
    $rootScope,
    $scope,
    $http,
    postSymbolWatchlistService,
    getDashboardHeatmapDataServiceOpenClose,
    getDashboardLastRefreshDatetimeService,
    getCamarillaLastRefreshDatetimeService,
    commonService,userDetailsService,
    $interval,
    $window
  ) {
  if ($rootScope.user_permission['NEOTRADER_PRO']) {
    $scope.datatable;
    $scope.lastRefresh;

    $scope.sortOptions = [
      { label: "SYMBOL", value: "Name" },
      { label: "AGING", value: "Age" },
      { label: "CHG %", value: "PctChg" }
    ];
    
    $scope.selectedSortOption = "Age";
    $scope.timeframes = ["DAY", "WEEK", "MONTH"];
    $scope.selectedTimeframeNew = $scope.timeframes[0];

    $scope.changeNowTrendedBullish=false;
    $scope.changeNowTrendedBearish=false;
    $scope.changeNowReversalBullish=false;
    $scope.changeNowReversalBearish=false;

    $scope.IsAstrikeForTrendedBull = false;
    $scope.IsAstrikeForTrendedBear = false;
    $scope.IsAstrikeForReversalBull= false;
    $scope.IsAstrikeForReversalBear= false;

    $scope.changeNowTrendedModeBullish=false;
    $scope.changeNowTrendedModeBearish=false;
   
    $scope.reversal_bullish = [];
    $scope.reversal_bearsish = [];

    $scope.reversal_bullish_filter_data = [];
    $scope.reversal_bearish_filter_data = [];

    $scope.DayTraderBulletsChangeValue = ["CLOSE", "OPEN"];
    $scope.SelectDayTraderBulletsChangeValue = $scope.DayTraderBulletsChangeValue[0];
    
    $scope.DayTraderBulletsBullishValues = [
                                              { label: '< 0.75'},
                                              { label: '>= 0.25'},
                                              { label: '>= 0.50'},
                                              { label: '>= 0.75'},
                                              { label: '>= 1.00'},
                                              { label: '>= 1.25'},
                                              { label: '>= 1.50'},
                                              { label: '>= 1.75'},
                                              { label: '>= 2.00'},
                                              
                                            ];

    $scope.selectedBullishFilter =  $scope.DayTraderBulletsBullishValues[3];

    $scope.DayTraderBulletsBearishValues = [
                                            { label: '> -0.75' },
                                            { label: '<= -0.25' },
                                            { label: '<= -0.50' },
                                            { label: '<= -0.75' },
                                            { label: '<= -1.00' },
                                            { label: '<= -1.25' },
                                            { label: '<= -1.50' },
                                            { label: '<= -1.75' },
                                            { label: '<= -2.00' },
                                          ];


    $scope.selectedBearishFilter =  $scope.DayTraderBulletsBearishValues[3];

   
    $scope.is_initial_call_active_stock_bull=true;
    $scope.is_initial_call_active_stock_bear=true;
    
    mytradedata = [];
    $scope.WatchListValue = { Value: "WATCHLIST_1" };
    $scope.IndexValue1 = $rootScope.MyCustomDropdown();
    $scope.IndexValue1Array = $scope.IndexValue1.map((watchlist) => {
      return watchlist.WATCHLIST;
    });
    $scope.SelectIndexValue1 = $scope.IndexValue1[0];
    $scope.WatchChange = function (watchlist) {
      $scope.WatchListValue = watchlist;
    };

    // WATCHLIST CODE START
    $scope.updatedata = function (data) {
      document.getElementById("createNewWatchlist").style.display = "block";
      $scope.symbolArray = data.map((item) => {
        return item.SYMBOL;
      });
      mytradedata = [];
      $scope.symbolArray.forEach((symbol) => {
        mytradedata.push({ SYMBOL: symbol });
      });
    };
    // EVERYTHING HAPPENING AFTER A CLICK OF WATCHLIST

    $scope.typeahead1 = function (e) {
      toWatchlist = e.target.innerText;
      showtoast_watchlist(toWatchlist);
      $.each(mytradedata, function (idx, obj1) {
        $scope.watch_symbol = obj1.SYMBOL;
        $scope.symbol_watchlist_post_data(toWatchlist);
      });
      mytradedata = [];
    };

    $scope.symbol_watchlist_post_data = function (toWatchlist) {
      postSymbolWatchlistService.postData(toWatchlist, $scope.watch_symbol);
    };

    $scope.create_new_watchlist = function () {
      document.getElementById("newWatchlist").style.display = "block";
      document.getElementById("createNewWatchlist").style.display = "none";
    };

    $scope.add_new_watchlist = function () {
      watchlistName = document.querySelector("#newWatchlistName").value;
      let pattern = /^[0-9a-zA-Z\_ ]+$/g;
      if (pattern.test(watchlistName)) {
        if (watchlistName.length > 2) {
          if (!$scope.IndexValue1Array.includes(watchlistName)) {
            if ($scope.IndexValue1Array.length < 10) {
              newWatchlistButton = document.createElement("button");
              newWatchlistButton.innerText = watchlistName;
              newWatchlistButton.setAttribute(
                "class",
                "btn btn-outline-primary rounded-pill m-2"
              );
              newWatchlistButton.setAttribute("data-dismiss", "modal");
              $scope.new_list = { target: { innerText: watchlistName } };
              newWatchlistButton.addEventListener("click", () => {
                $scope.typeahead1($scope.new_list);
              });
              document
                .querySelector("#watchlists")
                .appendChild(newWatchlistButton);
              document.getElementById("newWatchlist").style.display = "none";
              document.querySelector("#newWatchlistName").value = "";
              data = { target: { innerText: watchlistName } };
              $scope.typeahead1(data);
            } else {
              alert(
                "You have already created 10 watchlist. You can delete the some from watchlist page to create new one"
              );
            }
          } else {
            alert("You have already created the watchlist with the same name");
          }
        } else {
          alert("Watchlist name should be more than 2 characters");
        }
      } else {
        alert("You can use only alphabets, numbers, underscore and spaces");
      }
    };

    $scope.close_watchlist_modal = function () {
      document.getElementById("newWatchlist").style.display = "none";
      document.getElementById("createNewWatchlist").style.display = "block";
    };
    $("#m_modal_2").on("hidden.bs.modal", function () {
      $scope.close_watchlist_modal();
    });
    //Get selected value from table
    $scope.mytrades_post_data_onclick = function () {
      $scope.datatable.rows(".m-datatable__row--active");
      mytradedata = [];
      $scope.datatable.nodes().each(function (i, row) {
        var data = $(row).data("obj");
        mytradedata.push(data);
      });
    };

    function showtoast_watchlist(watchlistName) {
      toastr.options = {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: "toast-top-right",
        preventDuplicates: false,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "2000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
      };
      var string_add = watchlistName;
      toastr.success("Added to " + string_add, "Successfully");
    }

    // Call All Function Code Starts Here//

    var ctrl = this;
    ctrl.updateParent = () => {
      SetDropdownValues((modify_by_watchlist = true));
    };

    function SetDropdownValues() {
      if (typeof $rootScope.GlobalExclusionList !== "undefined") {
        $scope.IndexValue = $rootScope.GetSpecificDropdownValues(
          $rootScope.GlobalExclusionList.concat([])
        );
        if (typeof $scope.SelectIndexValue === "undefined") {
          $scope.SelectIndexValue = $scope.IndexValue[5];
        } else {
          if ($scope.LastSelectUniverseIndex + 1 > $scope.IndexValue.length) {
            $scope.SelectIndexValue =
              $scope.IndexValue[$scope.LastSelectUniverseIndex - 1];
          } else {
            $scope.SelectIndexValue =
              $scope.IndexValue[$scope.LastSelectUniverseIndex];
          }
        }

        return;
      } else {
        setTimeout(function () {
          SetDropdownValues();
        }, 100);
      }
    }
    // funtion used to get the color of the heatmaop 
    $scope.getBackgroundColor = function(day_change){
      if((day_change > 2 ))
        return'#00CC99'; // dark green 
      if ((day_change >= 0 ) & (day_change <= 2))
        return '#99FFCC'; // green
      if((day_change < 0 ) & (day_change >= -2 ))
        return '#FF9999'; // red
      if(day_change < -2 ) 
        return '#FF0033'; // dark  red
      }

    $(document).ready(function () {
      $http.get("/mycode/").then(function (res) {
        user_list = ["11259", "3942"];
        if (user_list.includes(res.data)) {
          localStorage.setItem("dsm_v2", "seen");
        }
      });
      broadmarket();
      livesector();
      cprDataFetch();
      daytraderDataFetch();

      // Call All Function Code Ends here //

      $scope.loading = true;
      CALL1 = 1;
      CALL2 = 1;
      $scope.unblock_dashboard = true;
      $http.get("/check_groups/").then(function (response) {
        $scope.user_profile = response.data;
        if ($scope.user_profile.CORPORATELITE == true) {
          $scope.HeatmapOpenClose = ["Close", "Open"];
          $scope.SelectHeatmapOpenClose = $scope.HeatmapOpenClose[0];
          document.getElementById("HeatmapOpenClose").options[1].style.display =
            "none";
        } else {
          $scope.HeatmapOpenClose = ["Close", "Open"];
          $scope.SelectHeatmapOpenClose = $scope.HeatmapOpenClose[0];
        }
      });

      $scope.HeatmapOpenClose = ["Close", "Open"];
      $scope.SelectHeatmapOpenClose = $scope.HeatmapOpenClose[0];

      $scope.$on("$destroy", function () {
        try {
          clearTimeout(CallLocalFunctionsTimer);
          clearTimeout(d_change_data_set_timeout);
          clearTimeout(d_change_data_index);
          clearTimeout(d_refresh_datetime_data_set_timeout);
        } catch (err) {
          console.log(err);
        }
        $scope.$destroy();
      });

      $scope.clear = function () {
        try {
          clearTimeout(CallLocalFunctionsTimer);
          clearTimeout(d_change_data_set_timeout);
          clearTimeout(d_change_data_index);
          clearTimeout(d_refresh_datetime_data_set_timeout);
        } catch (err) {
          console.log(err);
        }
      };

      var CallLocalFunctionsTimer;
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

      /// Heet Code ///
      $scope.isPopupOpen = false;

      $scope.hide_popup = function () {
        $scope.isPopupOpen = false;
        // Clean up obsolete keys from the previous implementation.
        localStorage.removeItem("show_popup");
        localStorage.removeItem("show_popup_4H");
        // Re-check periodically so a long-open (no reload) session re-shows
        // popups once they are due again, respecting the per-popup frequency gate.
        setTimeout(function () {
          $scope.separate_popup_by_frequency();
        }, 3600000); //1H
      };

      // Frequency (in ms) after which a popup is allowed to be shown again.
      // 0 => no gating (falls back to old "show every time" behaviour).
      $scope.popupFrequencyIntervals = {
        "Every Hour": 3600000,    // 1H
        "Every 4 Hour": 14400000, // 4H
        "Everyday": 86400000      // 24H
      };

      $scope.separate_popup_by_frequency = function () {
        if ( !$scope.isPopupOpen && window.location.href.indexOf("dashboard") >= 0 ) {
          if ($rootScope.getModalData.length > 0) {
            var now = new Date().getTime();
            var shownMap = {};
            try {
              shownMap = JSON.parse(localStorage.popup_shown || "{}");
            } catch (err) {
              shownMap = {};
            }

            // Keep only the popups that are due, based on their configured Frequency
            // and the last time we showed them (persisted across reloads).
            var duePopups = [];
            $.each($rootScope.getModalData, function (idx, value) {
              value.next = 1;
              var gap = $scope.popupFrequencyIntervals[value.Frequency] || 0;
              var lastShown = shownMap[value.Popup_Id] || 0;
              if (now - lastShown >= gap) {
                duePopups.push(value);
              }
            });

            if (duePopups.length > 0) {
              // Stamp the shown time so a reload won't re-display them until due again.
              $.each(duePopups, function (idx, value) {
                shownMap[value.Popup_Id] = now;
              });
              localStorage.popup_shown = JSON.stringify(shownMap);

              $scope.popup(duePopups);
            }
          }
        }
      };

      $scope.popup = (array_data)=>{
          $scope.idx = 0;
          $scope.Img = array_data
          $scope.isPopupOpen = true;
          $scope.Img.length > 1 ? $(".slideBtn").show():$(".slideBtn").hide();
          $("#myModal").attr("data-keyboard", false);
          $("#myModal").attr("data-backdrop", "static");
          $("#myModal").modal("show");
          $("#allModalAds").attr("src", $scope.Img[0].Image_URL);
          $("#description").text($scope.Img[0].Description);
          $("#URL_Click").attr("href", $scope.Img[0].URL_Click);
      }

      $scope.slide_popup = function (index,Img) {
        $scope.idx = parseInt($scope.idx) + parseInt(index);
        if ($scope.idx > Img.length - 1) {
          $scope.idx = 0;
        }
        if ($scope.idx < 0) {
          $scope.idx = Img.length - 1;
        }
        $("#allModalAds").attr("src", Img[$scope.idx].Image_URL);
        $("#description").text(Img[$scope.idx].Description);
        $("#URL_Click").attr("href", Img[$scope.idx].URL_Click);
      };

      /// Heet End ///
      // Refresh DateTime Coding Ended //

      // First Time User pop up and Subscribe code //

      var disclaimer = localStorage.dsm_v2;

      $scope.check = function () {
        var d = new Date();

        if (disclaimer != "seen") {
          $("#m_modal_1").modal("show");
        } else if ($rootScope.user_permission_intraday == false) {
          day = d.getDate();
          date = "todayis" + day.toString();
          if (localStorage.todaysdate) {
            if (localStorage.todaysdate != date) {
              localStorage.todaysdate = date;
              $("#m_modal_2").modal("show");
            }
          } else {
            localStorage.todaysdate = date;
            $("#m_modal_2").modal("show");
          }
        }
      };

      $(window).on("load", function () {
        $("body").removeClass("m-page--loading");
        $scope.check();
      });

      commonService.getDisclaimer().then((response)=>{
         response = parseInt(response)
        if (response==0){
        $("#disclaimer_once").modal("show");
        }else{
          setTimeout(function () {
            $scope.separate_popup_by_frequency();
          }, 10000);
          $scope.check();
        }

      })


      $('#disclaimer_once').on('hidden.bs.modal', function (e) {

        commonService.postDisclaimer().then((response)=>{
          if(response==='success'){
            setTimeout(function () {
              $scope.separate_popup_by_frequency();
            }, 10000);
            $scope.check();

          }else{
            $("#disclaimer_once").modal("show");
            alert("Something went wrong . Try another ?")
          }
       })
      })
      
      $scope.viewtemppopup = function () {
        $(document).ready(function () {
          var sd = new Date();
          var ed = new Date(2019, 10, 31);
          if (sd <= ed) {
            $(".show1").fadeIn();
            $("span").click(function () {
              $(".show1").fadeOut();
            });
          }
        });
      };

      if (typeof disclaimer != "undefined") {
        $scope.popupTemp = true;
        $scope.viewtemppopup();
        $("#popupTemp").removeAttr("hidden");
      }

      $("#view_site").click(function () {
        setTimeout(function () {
          $scope.viewtemppopup();
          $scope.popupTemp = true;
        });
        $("#popupTemp").removeAttr("hidden");
        url_hit =
          "https://neotrader.in/app/Accepted_Terms_Condition/" + $scope.agreed;
        $http.get(url_hit).then(function (response) {});
      });

      $("#checkbox_agree").change(function () {
        if ($(this).is(":checked")) {
          $("#view_demo").prop("disabled", false);
          $("#view_site").prop("disabled", false);
          localStorage.dsm_v2 = "seen"; // set
          $scope.agreed = true;
        } else {
          $("#view_demo").prop("disabled", true);
          $("#view_site").prop("disabled", true);
          delete localStorage.dsm_v2; // unset
          $scope.agreed = false;
        }
      });

      // First Time User pop up and Subscribe code ends //

      // Broad Market Indices Code Starts //

      var chart_broadmarket = AmCharts.makeChart("m_chart_broad_market", {
        type: "serial",
        theme: "light",
        valueAxes: [
          {
            position: "bottom",
          },
        ],
        startDuration: 0,
        graphs: [
          {
            balloonText:
              "<span style='font-size:13px;'>[[NAME]]: <b>[[LTP]]</b> <b>([[CHGPCT]])</b></span>",
            title: "NAME",
            type: "column",
            fillAlphas: 0.8,
            fillColors: "#00CC99",
            negativeBase: 0,
            negativeFillColors: "#FF0033",
            valueField: "CHGPCT",
          },
        ],
        rotate: true,
        categoryField: "NAME",
        autoMargins: false,
        marginTop: 15,
        marginBottom: 30,
        marginLeft: 80,
        marginRight: 20,
        export: {
          enabled: false,
        },
      });

      function broadmarket() {
        $http
          .get("/dashboard/Live_Broad_Market/?format=json")
          .then(function (response) {
            $scope.data = response.data;
            json_data = JSON.stringify($scope.data);
            json_data = JSON.parse(json_data);
            json_data = json_data.data;
            NAME = [];
            CHGPCT = [];
            CHGPCTSTR = [];
            COLOR = [];
            LTP = [];
            LTPSTR = [];
            chartdata = [];

            $.each(json_data, function (idx, obj1) {
              charttmp = {};
              $.each(obj1, function (idx, obj2) {
                if (idx == "NAME") {
                  charttmp["NAME"] = obj2;
                }
                if (idx == "LTP") {
                  charttmp["LTP"] = parseFloat(obj2);
                }
                if (idx == "CHGPCT") {
                  charttmp["CHGPCT"] = parseFloat(obj2);
                }
              });
              chartdata.push(charttmp);
            });
            chartdata = JSON.stringify(chartdata);
            chart_broadmarket.dataProvider = eval(chartdata);
            chart_broadmarket.validateData();

            json_data = null;
            chartdata = null;
            charttmp = null;
          });
      }

      // ######## Active Stocks Code Start #######

      $scope.isVisible = false;

      function checkTime() {
        var currentTime = new Date();
        var currentHours = currentTime.getHours();
        var currentMinutes = currentTime.getMinutes();
        var currentTimeInMinutes = currentHours * 60 + currentMinutes;
        var startMinutes = 16 * 60 + 30;
        var endMinutes = 9 * 60 + 15;

        if (
          currentTimeInMinutes >= startMinutes ||
          currentTimeInMinutes <= endMinutes
        ) {
          $scope.isVisible = true;
        } else {
          $scope.isVisible = false;
        }
      }

      checkTime();
      $interval(checkTime, 60000);

      $scope.activeTab = 'trendedBullish';
      $scope.activeDayTab = 'cprBullish';
      $scope.getNumber = function(num) {
        var arr = [];
        for (var i = 0; i < num; i++) {
          arr.push(i);
        }
        return arr;
      };

      

      function daytraderDataFetch() {
        $http.get("/app/day_trader_stocks/").then(function (res) {
        const data_new = res.data || [];
        
        const data = $scope.universe_symbol_filter(data_new);

        // Split bullish & bearish using BULL_BEAR
        $scope.daytrader_bullish = data.filter(x => x.BULL_BEAR === 1);
        $scope.daytrader_bearish = data.filter(x => x.BULL_BEAR === -1);

        // Initial CHG_P (default CLOSE)
        $scope.cpr_bullish.forEach(x => x.CHG_P = x.CLOSE_CHG_P);
        $scope.cpr_bearish.forEach(x => x.CHG_P = x.CLOSE_CHG_P);

        // Default filter call
        $scope.dayTraderValue(
          $scope.SelectDayTraderBulletsChangeValue,
          $scope.selectedBullishFilter,
          'BULLISH'
        );
      });

      }

      daytraderDataFetch();

      function cprDataFetch() {
        $http.get("/app/cpr_active_stocks/").then(function (response) {
          $scope.cprData = response.data;
          const dayItem = $scope.cprData?.find(item => item.TIMEFRAME === "DAY");
          $scope.lastRefresh = dayItem
            ? dayItem["TS"].toString()
            : "NA";
          $scope.lastRefresh = $scope.lastRefresh.replace('T', ' ');
          
          
          $http.get("/app/trade_range_targets/").then(function (response) {
          $scope.TraderangeTargets = response.data;
          $scope.onTimeframeChange();
          $scope.curatedCprData($scope.activeDayTab);
        })
        });
      }
     
      cprDataFetch();
     
      $scope.onTimeframeChange = function () {
        $scope.cprData_filter = $scope.cprData.filter(x => x.TIMEFRAME == $scope.selectedTimeframeNew);
        CprDataBucketing($scope.cprData_filter);
      };

      $scope.isDisabled = function(timeframe) {
        return ($scope.IsAstrikeForTrendedBull || $scope.IsAstrikeForTrendedBear) && (timeframe === 'WEEK' || timeframe === 'MONTH');
      };
      
      $scope.changeCurated = function (tab){
        if (tab === "trendedBullish" ){
          $scope.IsAstrikeForTrendedBear = $scope.IsAstrikeForTrendedBull;
        }
        if (tab === "trendedBearish" ){
          $scope.IsAstrikeForTrendedBull = $scope.IsAstrikeForTrendedBear;
        }
        if (tab === "reversalBullish"){
          $scope.IsAstrikeForReversalBear = $scope.IsAstrikeForReversalBull;
        }
        if (tab === "reversalBearish"){
          $scope.IsAstrikeForReversalBull = $scope.IsAstrikeForReversalBear;
        }
        if ($scope.selectedTimeframeNew != 'DAY'){
          $scope.IsAstrikeForTrendedBull = false;
          $scope.IsAstrikeForTrendedBear = false;
        }
        $scope.onTimeframeChange();
      }

      $scope.filterReversalChangeNow = function(trend){
        if(trend==="bullish"){
          $scope.changeNowReversalBearish = $scope.changeNowReversalBullish;
          $scope.reversal_bullish_filter_data = $scope.change_now($scope.reversal_bullish,$scope.changeNowReversalBullish)
          if($scope.reversal_bullish_filter_data.length !=0){
            // $scope.reversal_bullish_filter_data.forEach(item1 => {
            //   $scope.TraderangeTargets.forEach(item2 =>{
            //     if (item1.ASTRIKE_COUNT == 3 && item1.SYMBOL == item2.SYMBOL && item1.TIMEFRAME == item2.TIMEFRAME){
            //       item1.bull_t1 = item2.bull_t1;
            //       item1.bull_t2 = item2.bull_t2; 
            //       item1.bull_sl = item2.SELLBELOW;
            //       //  if(item2.bull_t1 == 0 || item2.bull_t1 == 0  ){
            //       //   item1.bull_sl = item1.BC;
            //       // } 
            //     }
            //   })
            // });

            $scope.reversal_bullish_filter_data.forEach(x => {
              x.CHANGE_COLOUR = 0;
              if (x.ASTRIKE_COUNT == 3){
                if (x.TRADE_BULL == 1){
                  x.CHANGE_COLOUR = 0;
                }
                else{
                  x.CHANGE_COLOUR = 1;
                }
              }
            });
          }
          if ($scope.IsAstrikeForReversalBull) {
            $scope.reversal_bullish_filter_data = $scope.reversal_bullish_filter_data.filter(item => (item.BULL_BEAR == 1) && (item.REVERSAL_FLIP != 0) && (item.ASTRIKE_COUNT == 3));
          }
        }
        if(trend==="bearish"){
          $scope.changeNowReversalBullish = $scope.changeNowReversalBearish;
          $scope.reversal_bearish_filter_data = $scope.change_now($scope.reversal_bearish,$scope.changeNowReversalBearish)

          if($scope.reversal_bearish_filter_data.length !=0){
            // $scope.reversal_bearish_filter_data.forEach(item1 => {
            //   $scope.TraderangeTargets.forEach(item2 =>{
            //     if (item1.ASTRIKE_COUNT == 3 && item1.SYMBOL == item2.SYMBOL && item1.TIMEFRAME == item2.TIMEFRAME){
            //       item1.bear_t1 = item2.bear_t1;
            //       item1.bear_t2 = item2.bear_t2; 
            //       item1.bear_sl = item2.BUYABOVE;
            //       // if(item2.bear_t1 == 0 || item2.bear_t1 == 0  ){
            //       //   item1.bear_sl = item1.TC
            //       // }
            //     }
            //   })
            // });

            $scope.reversal_bearish_filter_data.forEach(x => {
              x.CHANGE_COLOUR = 0;
              if (x.ASTRIKE_COUNT == 3){
                if (x.TRADE_BEAR == 1){
                  x.CHANGE_COLOUR = 0;
                }
                else{
                  x.CHANGE_COLOUR = 1;
                }
              }
            });
          }
          
          if ($scope.IsAstrikeForReversalBear) {
            $scope.reversal_bearish_filter_data = $scope.reversal_bearish_filter_data.filter(item => (item.BULL_BEAR == -1) && (item.REVERSAL_FLIP != 0) && (item.ASTRIKE_COUNT == 3));
          }
        }
      }

      
        function CprDataBucketing(data) {
        $scope.reversal_bullish = [];
        $scope.reversal_bearsish = [];
        $scope.trended_bullish = [];
        $scope.trended_bearish = [];

        $scope.cprData_day = data.filter((x) => x.TIMEFRAME == 'DAY');
        $scope.cprData_day = $scope.universe_symbol_filter($scope.cprData_day);

        if ($scope.cprData_day.length != 0) {
          $scope.reversal_bullish = $scope.cprData_day.filter(
            (x) => {return x.FLIP == 1 && [-1, 0].includes(x.REVERSAL_FLIP)}
          );
          $scope.reversal_bullish.sort(function (a, b) {
            return a.REVERSAL_FLIP - b.REVERSAL_FLIP;
          });

          $scope.reversal_bullish.sort((a, b) => {
            if (a.REVERSAL_FLIP === 0 && b.REVERSAL_FLIP === 0) {
                return b.SCORE - a.SCORE;
            }
            if (a.REVERSAL_FLIP === -1 && b.REVERSAL_FLIP === -1) {
                return b.SCORE - a.SCORE;
            }
            return a.REVERSAL_FLIP - b.REVERSAL_FLIP;
          });  
          
          $scope.reversal_bullish_filter_data = $scope.change_now($scope.reversal_bullish,$scope.changeNowReversalBullish)
          
          
          if($scope.reversal_bullish_filter_data.length !=0){
            // $scope.reversal_bullish_filter_data.forEach(item1 => {
            //   $scope.TraderangeTargets.forEach(item2 =>{
            //     if (item1.ASTRIKE_COUNT == 3 && item1.SYMBOL == item2.SYMBOL && item1.TIMEFRAME == item2.TIMEFRAME){
            //       item1.bull_t1 = item2.bull_t1;
            //       item1.bull_t2 = item2.bull_t2;
            //       item1.bull_sl = item2.SELLBELOW;
            //       // if(item2.bull_t1 == 0 || item2.bull_t1 == 0  ){
            //       //   item1.bull_sl = item1.BC;
            //       // } 
            //     }
            //   })
            // });
            $scope.reversal_bullish_filter_data.forEach(x => {
              x.CHANGE_COLOUR = 0;
              if (x.ASTRIKE_COUNT == 3){
                if (x.TRADE_BULL == 1){
                  x.CHANGE_COLOUR = 0;
                }
                else{
                  x.CHANGE_COLOUR = 1;
                }
              }
            });
          }
          
          if ($scope.IsAstrikeForReversalBull) {
            $scope.reversal_bullish_filter_data = $scope.reversal_bullish_filter_data.filter(x => (x.BULL_BEAR == 1) && (x.REVERSAL_FLIP != 0) && (x.ASTRIKE_COUNT == 3));
          }
          
          $scope.reversal_bearish = $scope.cprData_day.filter(
            (x) => x.FLIP == -1 && [1, 0].includes(x.REVERSAL_FLIP)
          );
          $scope.reversal_bearish.sort(function (a, b) {
            return b.REVERSAL_FLIP - a.REVERSAL_FLIP;
          });
    
          $scope.reversal_bearish.sort((a, b) => {
            if (a.REVERSAL_FLIP === 1 && b.REVERSAL_FLIP === 1) {
                return a.SCORE - b.SCORE;
            }
            if (a.REVERSAL_FLIP === 0 && b.REVERSAL_FLIP === 0) {
                return a.SCORE - b.SCORE;
            }
            return b.REVERSAL_FLIP - a.REVERSAL_FLIP;
          });

          $scope.reversal_bearish_filter_data = $scope.change_now($scope.reversal_bearish,$scope.changeNowReversalBearish)
          
          if($scope.reversal_bearish_filter_data.length !=0){
            // $scope.reversal_bearish_filter_data.forEach(item1 => {
            //   $scope.TraderangeTargets.forEach(item2 =>{
            //     if (item1.ASTRIKE_COUNT == 3 && item1.SYMBOL == item2.SYMBOL && item1.TIMEFRAME == item2.TIMEFRAME){
            //       item1.bear_t1 = item2.bear_t1;
            //       item1.bear_t2 = item2.bear_t2;
            //       item1.bear_sl = item2.BUYABOVE;
            //       // if(item2.bear_t1 == 0 || item2.bear_t1 == 0  ){
            //       //   item1.bear_sl = item1.TC
            //       // }
            //     }
            //   })
            // });

            $scope.reversal_bearish_filter_data.forEach(x => {
              x.CHANGE_COLOUR = 0;
              if (x.ASTRIKE_COUNT == 3){
                if (x.TRADE_BEAR == 1){
                  x.CHANGE_COLOUR = 0;
                }
                else{
                  x.CHANGE_COLOUR = 1;
                }
              }
            });
          }
          
          if ($scope.IsAstrikeForReversalBear) {
            $scope.reversal_bearish_filter_data = $scope.reversal_bearish_filter_data.filter(x => (x.BULL_BEAR == -1) && (x.REVERSAL_FLIP != 0) && (x.ASTRIKE_COUNT == 3));
          }
        }
        
        $scope.filteredCprData = $scope.universe_symbol_filter(data);
       
        if ($scope.filteredCprData.length != 0) {
          $scope.trended_bullish = $scope.filteredCprData.filter(
            (x) => x.WTT == 1 && [1, 0].includes(x.TRENDED_FLIP)
          );

          $scope.trended_bullish.sort((a, b) =>{
            if (a.TRENDED_FLIP === 1 && b.TRENDED_FLIP === 1) {
                return b.SCORE - a.SCORE;
            }
            if (a.TRENDED_FLIP === 0 && b.TRENDED_FLIP === 0) {
                return b.SCORE - a.SCORE;
            }
            return b.TRENDED_FLIP - a.TRENDED_FLIP;
          });

          $scope.trended_bullish.sort((a, b) => {
            if (a.TRENDED_FLIP === 1 && b.TRENDED_FLIP === 1) {
                return a.SYMBOL.localeCompare(b.SYMBOL);
            }
            if (a.TRENDED_FLIP === 0 && b.TRENDED_FLIP === 0) {
                return a.SYMBOL.localeCompare(b.SYMBOL);
            }
            return b.TRENDED_FLIP - a.TRENDED_FLIP;
          });
        
          $scope.trended_bullish.sort((a, b) =>{
            if (a.TRENDED_FLIP === 1 && b.TRENDED_FLIP === 1) {
                return b.PCT_CHG - a.PCT_CHG;
            }
            if (a.TRENDED_FLIP === 0 && b.TRENDED_FLIP === 0) {
                return b.PCT_CHG - a.PCT_CHG;
            }
            return b.TRENDED_FLIP - a.TRENDED_FLIP;
          });
          
          $scope.trended_bullish_old_score = $scope.trended_bullish.map(function(item) {
            return {
              ...item,
              SCORE: +(item.SCORE - 1).toFixed(2),
              SCORE_OLD: +(item.SCORE_OLD - 1).toFixed(2)
            };
          });    

          const scores = $scope.trended_bullish_old_score.map(x => x.SCORE);
          const min = Math.floor(Math.min(...scores));
          const max = Math.ceil(Math.max(...scores));

          $scope.scoreRange = Array.from({ length: max - min + 1 }, (_, i) => min + i); 

          if($scope.is_initial_call_active_stock_bull){
            $scope.selectedBullMin = min;
            $scope.selectedBullMax = max;
          }
          
          $scope.fullTrendedBullishData = angular.copy($scope.trended_bullish_old_score);
          $scope.trended_bullish_data = angular.copy($scope.trended_bullish_old_score);

          if($scope.trended_bullish_data.length !=0){
            // $scope.trended_bullish_data.forEach(item1 => {
            //   $scope.TraderangeTargets.forEach(item2 =>{
            //     if (item1.ASTRIKE_COUNT == 3 && item1.SYMBOL == item2.SYMBOL && item1.TIMEFRAME == item2.TIMEFRAME){
            //       item1.bull_t1 = item2.bull_t1;
            //       item1.bull_t2 = item2.bull_t2;
            //       item1.bull_sl = item2.SELLBELOW;
            //       // if(item2.bull_t1 == 0 || item2.bull_t1 == 0){
            //       //   item1.bull_sl = item1.BC;
            //       // } 
            //     }
            //   })
            // });
            
            $scope.trended_bullish_data.forEach(x => {
              x.CHANGE_COLOUR = 0;
              if (x.ASTRIKE_COUNT == 3){
                if (x.TRADE_BULL == 1){
                  x.CHANGE_COLOUR = 0;
                }
                else{
                  x.CHANGE_COLOUR = 1;
                }
              }
            });
          }
          if ($scope.IsAstrikeForTrendedBull) {
            $scope.trended_bullish_data = $scope.trended_bullish_data.filter(x => (x.BULL_BEAR == 1) && (x.TRENDED_FLIP != 0) && (x.ASTRIKE_COUNT == 3));
          }
          
          const pctChgValues = $scope.fullTrendedBullishData.map(x => x.PCT_CHG);
          const minPct = Math.floor(Math.min(...pctChgValues));
          const maxPct = Math.ceil(Math.max(...pctChgValues));

          $scope.pctChgRange = Array.from({ length: maxPct - minPct + 1 }, (_, i) => minPct + i);

          $scope.selectedPctChgMin = $scope.pctChgRange[0];
          $scope.selectedPctChgMax = $scope.pctChgRange[$scope.pctChgRange.length - 1];

          $scope.trended_bearish = $scope.filteredCprData.filter(
            (x) => x.WTT == -1 && [-1, 0].includes(x.TRENDED_FLIP)
          );

          $scope.trended_bearish.sort((a, b) =>{
            if (a.TRENDED_FLIP === 0 && b.TRENDED_FLIP === 0) {
                return a.SCORE - b.SCORE;
            }
            if (a.TRENDED_FLIP === -1 && b.TRENDED_FLIP === -1) {
                return a.SCORE - b.SCORE;
            }
            return a.TRENDED_FLIP - b.TRENDED_FLIP;
          });

          $scope.trended_bearish_old_score = $scope.trended_bearish.map(function(item) {
            return {
              ...item,
              SCORE: +(item.SCORE + 1).toFixed(2),
              SCORE_OLD: +(item.SCORE_OLD + 1).toFixed(2)

            };
          });  

          const bearishScores =  $scope.trended_bearish_old_score.map(x => x.SCORE);
          const minBear = Math.floor(Math.min(...bearishScores, -1));
          const maxBear = Math.ceil(Math.max(...bearishScores, -1));
         
          $scope.bear_scoreRange = Array.from({ length: maxBear - minBear + 1 }, (_, i) => minBear + i);

          if($scope.is_initial_call_active_stock_bear){
            $scope.selectedBearMin =  $scope.bear_scoreRange[0];
            $scope.selectedBearMax =  $scope.bear_scoreRange[$scope.bear_scoreRange.length-1]; 
          // $scope.is_initial_call_active_stock_bear = false;
          }

          $scope.fullTrendedBearishData = angular.copy($scope.trended_bearish_old_score);
          $scope.trended_bearish_data = angular.copy($scope.trended_bearish_old_score);
          if($scope.trended_bearish_data.length !=0){
            // $scope.trended_bearish_data.forEach(item1 => {
            //   $scope.TraderangeTargets.forEach(item2 =>{
            //     if (item1.ASTRIKE_COUNT == 3 && item1.SYMBOL == item2.SYMBOL && item1.TIMEFRAME == item2.TIMEFRAME){
            //       item1.bear_t1 = item2.bear_t1;
            //       item1.bear_t2 = item2.bear_t2;
            //       item1.bear_sl = item2.BUYABOVE;
            //       // if(item2.bear_t1 == 0 || item2.bear_t1 == 0  ){
            //       //   item1.bear_sl = item1.TC
            //       // }
            //     }
            //   })
            // });
            $scope.trended_bearish_data.forEach(x => {
              x.CHANGE_COLOUR = 0;
              if (x.ASTRIKE_COUNT == 3){
                if (x.TRADE_BEAR == 1){
                  x.CHANGE_COLOUR = 0;
                }
                else{
                  x.CHANGE_COLOUR = 1;
                }
              }
            });
          }
          if ($scope.IsAstrikeForTrendedBear) {
            $scope.trended_bearish_data = $scope.trended_bearish_data.filter(x => (x.BULL_BEAR == -1) && (x.TRENDED_FLIP != 0) && (x.ASTRIKE_COUNT == 3));
          }
          
          const bearPctChgValues = $scope.fullTrendedBearishData.map(x => x.PCT_CHG);
          const minBearPct = Math.floor(Math.min(...bearPctChgValues));
          const maxBearPct = Math.ceil(Math.max(...bearPctChgValues));

          $scope.bear_pctChgRange = Array.from({ length: maxBearPct - minBearPct + 1 }, (_, i) => minBearPct + i);

          if ($scope.is_initial_call_active_stock_bear) {
            $scope.selectedBearPctChgMin = minBearPct;
            $scope.selectedBearPctChgMax = maxBearPct;
          }

          $scope.onSortOptionChange()
        }
      }
      
      $scope.selectedTimeframe = "30Min";
      $scope.setTimeframe = function (timeframe) {
        $scope.selectedTimeframe = timeframe;
      };

      $scope.onSortOptionChange = function () {
        switch ($scope.selectedSortOption) {

          case "Name":
            $scope.trended_bullish_data = $scope.change_now($scope.trended_bullish_data,$scope.changeNowTrendedBullish).sort((a, b) => {
              if (a.TRENDED_FLIP === 1 && b.TRENDED_FLIP === 1) {
                return a.SYMBOL.localeCompare(b.SYMBOL);
              }
              if (a.TRENDED_FLIP === 0 && b.TRENDED_FLIP === 0) {
                return a.SYMBOL.localeCompare(b.SYMBOL);
              }
              return b.TRENDED_FLIP - a.TRENDED_FLIP;
            });
          
            $scope.trended_bearish_data = $scope.change_now($scope.trended_bearish_data,$scope.changeNowTrendedBearish).sort((a, b) =>{
              if (a.TRENDED_FLIP === 0 && b.TRENDED_FLIP === 0) {
                return a.SYMBOL.localeCompare(b.SYMBOL);
              }
              if (a.TRENDED_FLIP === -1 && b.TRENDED_FLIP === -1) {
                return a.SYMBOL.localeCompare(b.SYMBOL);
              }
              return a.TRENDED_FLIP - b.TRENDED_FLIP;
            });
            
            break;
      
          case "Age":
            $scope.trended_bullish_data = $scope.change_now($scope.trended_bullish_data,$scope.changeNowTrendedBullish).sort((a, b) => {
              if (a.TRENDED_FLIP === 1 && b.TRENDED_FLIP === 1) {
                return b.SCORE - a.SCORE;
              }
              if (a.TRENDED_FLIP === 0 && b.TRENDED_FLIP === 0) {
                return b.SCORE - a.SCORE;
              }
              return b.TRENDED_FLIP - a.TRENDED_FLIP;
            });
           
            $scope.trended_bearish_data = $scope.change_now($scope.trended_bearish_data,$scope.changeNowTrendedBearish).sort((a, b) =>{
              if (a.TRENDED_FLIP === 0 && b.TRENDED_FLIP === 0) {
                  return a.SCORE - b.SCORE;
              }
              if (a.TRENDED_FLIP === -1 && b.TRENDED_FLIP === -1) {
                  return a.SCORE - b.SCORE;
              }
              return a.TRENDED_FLIP - b.TRENDED_FLIP;
            });
            
            break;
      
          case "PctChg":
            $scope.trended_bullish_data = $scope.change_now($scope.trended_bullish_data,$scope.changeNowTrendedBullish).sort((a, b) => {
              if (a.TRENDED_FLIP === 1 && b.TRENDED_FLIP === 1) {
                return b.PCT_CHG - a.PCT_CHG;
              }
              if (a.TRENDED_FLIP === 0 && b.TRENDED_FLIP === 0) {
                return b.PCT_CHG - a.PCT_CHG;
              }
              return b.TRENDED_FLIP - a.TRENDED_FLIP;
            });
            
            $scope.trended_bearish_data = $scope.change_now($scope.trended_bearish_data,$scope.changeNowTrendedBearish).sort((a, b) =>{
              if (a.TRENDED_FLIP === 0 && b.TRENDED_FLIP === 0) {
                  return b.PCT_CHG - a.PCT_CHG;
              }
              if (a.TRENDED_FLIP === -1 && b.TRENDED_FLIP === -1) {
                  return b.PCT_CHG - a.PCT_CHG;
              }
              return a.TRENDED_FLIP - b.TRENDED_FLIP;
            });

            break;
        }
      };
      // Filter function

      $scope.change_now = function(data,changeNow){
       
        return data.filter(item => {
          if(changeNow){

            if((item.SCORE > 0 && item.SCORE_OLD < 0) || (item.SCORE < 0 && item.SCORE_OLD > 0) ){
              return true
            }else{
                return Math.floor(Math.abs(item.SCORE)) !=  Math.floor(Math.abs(item.SCORE_OLD ))
            }

          }else{
            return true
          }

        });
      }

      $scope.filterBullishData = function () {
        $scope.changeNowTrendedBearish = $scope.changeNowTrendedBullish; 
        const scoreMin = parseFloat($scope.selectedBullMin) || $scope.scoreRange[0];
        const scoreMax = parseFloat($scope.selectedBullMax) || $scope.scoreRange[$scope.scoreRange.length - 1];
      
        const pctMin = ($scope.selectedPctChgMin !== undefined && $scope.selectedPctChgMin !== null)
          ? parseFloat($scope.selectedPctChgMin)
          : $scope.pctChgRange[0];

        const pctMax = ($scope.selectedPctChgMax !== undefined && $scope.selectedPctChgMax !== null)
          ? parseFloat($scope.selectedPctChgMax)
          : $scope.pctChgRange[$scope.pctChgRange.length - 1];

        $scope.trended_bullish_data = $scope.fullTrendedBullishData.filter(item => {
          return (
            item.SCORE >= scoreMin &&
            item.SCORE <= scoreMax &&
            item.PCT_CHG >= pctMin &&
            item.PCT_CHG <= pctMax 
          );
        });

        if($scope.trended_bullish_data.length !=0){
          // $scope.trended_bullish_data.forEach(item1 => {
          //   $scope.TraderangeTargets.forEach(item2 =>{
          //     if (item1.ASTRIKE_COUNT == 3 && item1.SYMBOL == item2.SYMBOL && item1.TIMEFRAME == item2.TIMEFRAME){
          //       item1.bull_t1 = item2.bull_t1;
          //       item1.bull_t2 = item2.bull_t2;
          //       item1.bull_sl = item2.SELLBELOW;
          //       // if(item2.bull_t1 == 0 || item2.bull_t1 == 0){
          //       //     item1.bull_sl = item1.BC;
          //       // } 
          //     }
          //   })
          // });
          $scope.trended_bullish_data.forEach(x => {
            x.CHANGE_COLOUR = 0;
            if (x.ASTRIKE_COUNT == 3){
              if (x.TRADE_BULL == 1){
                x.CHANGE_COLOUR = 0;
              }
              else{
                x.CHANGE_COLOUR = 1;
              }
            }
          });
          }

        if ($scope.IsAstrikeForTrendedBull) {
          $scope.trended_bullish_data = $scope.trended_bullish_data.filter(item => (item.BULL_BEAR == 1) && (item.TRENDED_FLIP != 0) && (item.ASTRIKE_COUNT == 3));
        }
        $scope.onSortOptionChange();
      };

      $scope.filterBearishData = function () {
        $scope.changeNowTrendedBullish = $scope.changeNowTrendedBearish;
        const scoreMin = parseFloat($scope.selectedBearMin) || $scope.bear_scoreRange[0];
        const scoreMax = parseFloat($scope.selectedBearMax) || $scope.bear_scoreRange[$scope.bear_scoreRange.length - 1];

        const pctMin = ($scope.selectedBearPctChgMin !== undefined && $scope.selectedBearPctChgMin !== null)
          ? parseFloat($scope.selectedBearPctChgMin)
          : $scope.bear_pctChgRange[0];

        const pctMax = ($scope.selectedBearPctChgMax !== undefined && $scope.selectedBearPctChgMax !== null)
          ? parseFloat($scope.selectedBearPctChgMax)
          : $scope.bear_pctChgRange[$scope.bear_pctChgRange.length - 1];


        $scope.trended_bearish_data = $scope.fullTrendedBearishData.filter(item => {
          return (
            item.SCORE >= scoreMin &&
            item.SCORE <= scoreMax &&
            item.PCT_CHG >= pctMin &&
            item.PCT_CHG <= pctMax
          );
        });

        if($scope.trended_bearish_data.length !=0){
          // $scope.trended_bearish_data.forEach(item1 => {
          //   $scope.TraderangeTargets.forEach(item2 =>{
          //     if (item1.ASTRIKE_COUNT == 3 && item1.SYMBOL == item2.SYMBOL && item1.TIMEFRAME == item2.TIMEFRAME){
          //       item1.bear_t1 = item2.bear_t1;
          //       item1.bear_t2 = item2.bear_t2;
          //       item1.bear_sl = item2.BUYABOVE;
          //       // if(item2.bear_t1 == 0 || item2.bear_t1 == 0  ){
          //       //     item1.bear_sl = item1.TC
          //       // }
          //     }
          //   })
          // });
          $scope.trended_bearish_data.forEach(x => {
            x.CHANGE_COLOUR = 0;
            if (x.ASTRIKE_COUNT == 3){
              if (x.TRADE_BEAR == 1){
                x.CHANGE_COLOUR = 0;
              }
              else{
                x.CHANGE_COLOUR = 1;
              }
            }
          });
        }

        if ($scope.IsAstrikeForTrendedBear) {
          $scope.trended_bearish_data = $scope.trended_bearish_data.filter(item => (item.BULL_BEAR == -1) && (item.TRENDED_FLIP != 0) && (item.ASTRIKE_COUNT == 3));
        }
      $scope.onSortOptionChange();
      };

      $scope.resetFilters = function () {
        // Reset Bullish
        $scope.selectedBullMin = $scope.scoreRange[0];
        $scope.selectedBullMax = $scope.scoreRange[$scope.scoreRange.length - 1];
        $scope.selectedPctChgMin = $scope.pctChgRange[0];
        $scope.selectedPctChgMax = $scope.pctChgRange[$scope.pctChgRange.length - 1];
        $scope.filterBullishData();

        // Reset Bearish
        $scope.selectedBearMin = $scope.bear_scoreRange[0];
        $scope.selectedBearMax = $scope.bear_scoreRange[$scope.bear_scoreRange.length - 1];
        $scope.selectedBearPctChgMin = $scope.bear_pctChgRange[0];
        $scope.selectedBearPctChgMax = $scope.bear_pctChgRange[$scope.bear_pctChgRange.length - 1];
        $scope.filterBearishData();

        // Reset sorting and timeframe
        $scope.selectedSortOption = "Age";
        $scope.onSortOptionChange();
        $scope.onTimeframeChange();
      };
      
    
      $scope.updateTabdata = function(tabName) {
          $scope.activeTab = tabName;
      };

      $scope.allowedBullishPct = [0.5,1,1.5,2,2.5,3,3.5,4,4.5,5];
      $scope.selectedBullishPct = $scope.allowedBullishPct[1];

      $scope.validateBullishValue = function(value) {
        $scope.selectedBullishPct = value;
        $scope.dayTraderValue($scope.SelectDayTraderBulletsChangeValue,$scope.selectedBullishFilter,'BULLISH');
      }

      $scope.allowedBullishPct_Risk = [0.5,1,1.5,2,2.5,3,3.5,4,4.5,5];
      $scope.selectedBullishPct_Risk = $scope.allowedBullishPct_Risk[1];

      $scope.validateBullishValue_Risk = function(value) {
        $scope.selectedBullishPct_Risk = value;
        $scope.dayTraderValue($scope.SelectDayTraderBulletsChangeValue,$scope.selectedBullishFilter,'BULLISH');
      }

      $scope.allowedBearishPct = [-0.5,-1,-1.5,-2,-2.5,-3,-3.5,-4,-4.5,-5];
      $scope.selectedBearishPct = $scope.allowedBearishPct[1];

      $scope.validateBearishValue = function(value){
        $scope.selectedBearishPct = value
        $scope.dayTraderValue($scope.SelectDayTraderBulletsChangeValue,$scope.selectedBearishFilter,'BEARISH');
      }
      
      $scope.allowedBearishPct_Risk = [-0.5,-1,-1.5,-2,-2.5,-3,-3.5,-4,-4.5,-5];
      $scope.selectedBearishPct_Risk = $scope.allowedBearishPct_Risk[1];

      $scope.validateBearishValue_Risk = function(value){
        $scope.selectedBearishPct_Risk = value
        $scope.dayTraderValue($scope.SelectDayTraderBulletsChangeValue,$scope.selectedBearishFilter,'BEARISH');
      }
      
      $scope.curatedCprData = function(tabname){
        $scope.activeDayTab = tabname;

        $scope.reversal_bullish_curated = $scope.reversal_bullish_filter_data.filter(item => (item.BULL_BEAR == 1) && (item.REVERSAL_FLIP != 0) && (item.ASTRIKE_COUNT == 3));
        $scope.trended_bullish_curated = $scope.trended_bullish_data.filter(x => (x.BULL_BEAR == 1) && (x.TRENDED_FLIP != 0) && (x.ASTRIKE_COUNT == 3));
        $scope.cpr_bullish = $scope.trended_bullish_curated.concat( $scope.reversal_bullish_curated);
        $scope.cpr_bullish = $scope.cpr_bullish.filter((x) => x.TIMEFRAME == 'DAY');
        $scope.cpr_bullish.sort(function (a, b) {
            return new Date(b.TRADE_RANGE_TS) - new Date(a.TRADE_RANGE_TS);
        });

        $scope.cpr_bullish = $scope.cpr_bullish.filter(item => {
              const d = new Date(item.TRADE_RANGE_TS);
              return (d.getHours() * 60 + d.getMinutes()) < 810; 
        });

        $scope.reversal_bearish_curated = $scope.reversal_bearish_filter_data.filter(x => (x.BULL_BEAR == -1) && (x.REVERSAL_FLIP != 0) && (x.ASTRIKE_COUNT == 3));  
        $scope.trended_bearish_curated = $scope.trended_bearish_data.filter(x => (x.BULL_BEAR == -1) && (x.TRENDED_FLIP != 0) && (x.ASTRIKE_COUNT == 3));
        $scope.cpr_bearish = $scope.trended_bearish_curated.concat($scope.reversal_bearish_curated);
        $scope.cpr_bearish = $scope.cpr_bearish.filter((x) => x.TIMEFRAME == 'DAY');

        $scope.cpr_bearish.sort(function (a, b) {
            return new Date(b.TRADE_RANGE_TS) - new Date(a.TRADE_RANGE_TS);
        });

        $scope.cpr_bearish = $scope.cpr_bearish.filter(item => {
              const d = new Date(item.TRADE_RANGE_TS);
              return (d.getHours() * 60 + d.getMinutes()) < 810; 
        });
        
        $scope.startTime = "09:00";
        $scope.endTime = "19:00";
        const currentTime = new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Kolkata",
        });
        
        let local_date = new Date().toLocaleDateString(undefined, {
            year: "numeric",  
            month: "long",
            day: "numeric",
            timeZone: "Asia/Kolkata",
        });

        let server_date = new Date($scope.lrdatetime).toLocaleDateString(
            undefined,
            { year: "numeric", month: "long", day: "numeric" }
        );

        $scope.SelectCuratedShowTime = server_date === local_date && currentTime >= $scope.startTime && currentTime <= $scope.endTime;
        $scope.dayTraderValue($scope.SelectDayTraderBulletsChangeValue,$scope.selectedBullishFilter,'BULLISH');
        $scope.dayTraderValue($scope.SelectDayTraderBulletsChangeValue,$scope.selectedBearishFilter,'BEARISH');
      };
      

      $scope.dayTraderValue = function(SelectChangeValue,filter_value,filter_for){
        const filterLabel = filter_value?.label || '';

        if(SelectChangeValue == 'OPEN'){
          $scope.daytrader_bullish.forEach(x => {
            x.CHG_P = x.OPEN_CHG_P
          }) 
           $scope.daytrader_bearish.forEach(x => {
            x.CHG_P = x.OPEN_CHG_P
          })
        }
        else {
          $scope.daytrader_bullish.forEach(x => {
            x.CHG_P = x.CLOSE_CHG_P
          })
          $scope.daytrader_bearish.forEach(x => {
            x.CHG_P = x.CLOSE_CHG_P
          })
        }
         
        if (filter_for === 'BULLISH') {

          if(filterLabel === '< 0.75') {
            $scope.cpr_bullish_filter = $scope.daytrader_bullish.filter((x) => x.CHG_P < 0.75);
          } else if(filterLabel === '>= 0.25') {
            $scope.cpr_bullish_filter = $scope.daytrader_bullish.filter((x) => x.CHG_P >= 0.25);
          } else if(filterLabel === '>= 0.50') {
            $scope.cpr_bullish_filter = $scope.daytrader_bullish.filter((x) => x.CHG_P >= 0.50);
          } else if(filterLabel === '>= 0.75') {
            $scope.cpr_bullish_filter = $scope.daytrader_bullish.filter((x) => x.CHG_P >= 0.75);
          } else if(filterLabel === '>= 1.00') {
            $scope.cpr_bullish_filter = $scope.daytrader_bullish.filter((x) => x.CHG_P >= 1.00);
          } else if(filterLabel === '>= 1.25') {
            $scope.cpr_bullish_filter = $scope.daytrader_bullish.filter((x) => x.CHG_P >= 1.25);
          } else if(filterLabel === '>= 1.50') {
            $scope.cpr_bullish_filter = $scope.daytrader_bullish.filter((x) => x.CHG_P >= 1.50);
          } else if(filterLabel === '>= 1.75') {
            $scope.cpr_bullish_filter = $scope.daytrader_bullish.filter((x) => x.CHG_P >= 1.75);
          } else if(filterLabel === '>= 2.00') {
            $scope.cpr_bullish_filter = $scope.daytrader_bullish.filter((x) => x.CHG_P >= 2);
          }
          
          const PCT_Risk = $scope.selectedBullishPct_Risk / 100;
          const PCT = $scope.selectedBullishPct / 100;
          
          $scope.cpr_bullish_filter.forEach(x => {
            const entry = Number(x.ENTRY_PRICE) || 0;
            x.UP_PRICE = Number((entry + (entry * PCT)).toFixed(2));
            x.RISK_PRICE_UP = Number((entry - (entry * PCT_Risk)).toFixed(2));
          });
          $(".m_datatable_bullish").mDatatable("destroy");
          $scope.table_data($scope.cpr_bullish_filter,'BULLISH');
        }
        else if (filter_for === 'BEARISH'){
          if(filterLabel === '> -0.75') {
            $scope.cpr_bearish_filter = $scope.daytrader_bearish.filter((x) => x.CHG_P > -0.25);
          } else if(filterLabel === '<= -0.25') {
            $scope.cpr_bearish_filter = $scope.daytrader_bearish.filter((x) => x.CHG_P <= -0.50);
          } else if(filterLabel === '<= -0.50') {
            $scope.cpr_bearish_filter = $scope.daytrader_bearish.filter((x) => x.CHG_P <= -0.75);
          } else if(filterLabel === '<= -0.75') {
            $scope.cpr_bearish_filter = $scope.daytrader_bearish.filter((x) => x.CHG_P <= -0.75);
          } else if(filterLabel === '<= -1.00') {
            $scope.cpr_bearish_filter = $scope.daytrader_bearish.filter((x) => x.CHG_P <= -1.00);
          } else if(filterLabel === '<= -1.25') {
            $scope.cpr_bearish_filter = $scope.daytrader_bearish.filter((x) => x.CHG_P <= -1.25);
          } else if(filterLabel === '<= -1.50') {
            $scope.cpr_bearish_filter = $scope.daytrader_bearish.filter((x) => x.CHG_P <= -1.50);
          } else if(filterLabel === '<= -1.75') {
            $scope.cpr_bearish_filter = $scope.daytrader_bearish.filter((x) => x.CHG_P <= -1.75);
          } else if(filterLabel === '<= -2.00') {
            $scope.cpr_bearish_filter = $scope.daytrader_bearish.filter((x) => x.CHG_P <= -2.00);
          }
          
          const PCT_Risk = $scope.selectedBearishPct_Risk / 100;
          const PCT = $scope.selectedBearishPct / 100;
          $scope.cpr_bearish_filter.forEach(x => {
            const entry = Number(x.ENTRY_PRICE) || 0;
            x.DOWN_PRICE = Number((entry + (entry * PCT)).toFixed(2));
            x.RISK_PRICE_DOWN = Number((entry - (entry * PCT_Risk)).toFixed(2));
          });
          
          $(".m_datatable_bearish").mDatatable("destroy");
          $scope.table_data($scope.cpr_bearish_filter,'BEARISH');
        }
      }


      $scope.table_data = function (data,table_for) {
        if (table_for == 'BULLISH') {
          var table_bullish_data = [];
          angular.forEach(data, function (obj ) {
            var cleanObj = angular.copy(obj); 
            delete cleanObj.$$hashKey;
            table_bullish_data.push(cleanObj);
          })

          $scope.datatable_bullish = $(".m_datatable_bullish").mDatatable({
          data: {
            type: "local",
            source: table_bullish_data,
            pageSize: 5,
          },

          // layout definition
          layout: {
            theme: "default", // datatable theme
            class: "", // custom wrapper class
            scroll: true, // enable/disable datatable scroll both horizontal and vertical when needed.
            height: 400, // datatable's body's fixed height
            footer: false, // display/hide footer
          },

          translate: {
            records: {
              // processing: "Loading...",
              noRecords: "No signals have qualified."
            }
          },

          select: true,
          // column sorting
          sortable: true,

          filterable: false,

          pagination: true,

          search: {
            input: $("#generalSearchDay_trader_bullets"),
          },

          // toolbar
          toolbar: {
            // toolbar items
            items: {
              // pagination
              pagination: {
                pageSizeSelect: [5, 10, 20, 30, 50, 100 /*, -1*/], // display dropdown to select pagination size. -1 is used for "ALl" option
              },
            },
          },
          // columns definition
          columns: [
            {
              field: "id",
              title: "#",
              sortable: false, // disable sort for this column
              width: 40,
              selector: { class: "m-checkbox--solid m-checkbox--brand" },
            },
            {
              field: "SYMBOL",
              title: "Stock",
              template: function (row) {
                return (
                  '<a class="m-link m--font-boldest" id="call_symbol" href="/index/stock_analyser/' +
                  row.SYMBOL +
                  '/PIVOTS" target="_blank"><strong>' +
                  row.SYMBOL +
                  "</strong></a>"
                );
              },
            },
            {
              field: "CLOSE_CHG_P",
              title: "Day Change%",
              template: function (row) {
                // return '<span style="color:#2ca189!important;"><strong>' + row.CHG_P + '</strong></span>' ;
                return '<span style="color:' + (row.CHANGE_COLOUR > 0 ? '#2ca189!important' : 'grey') + ';"><strong>' + row.CHG_P + '</strong></span>';

              },
            },
            {
              field: "CUR_DT",
              title: "Trigger Time",
              // template: function (row) {
              //   return '<span style="color:#2ca189!important;"><strong>' + row.SIGNAL_DATE.replace("T", " ") + '</strong></span>' ;
              // },
              template: function (row) {
                  if (!row.CUR_DT) return '-';
                  return '<span style="color:' + (row.CHANGE_COLOUR > 0 ? '#2ca189!important' : 'grey') + ';"><strong>' + String(row.CUR_DT).replace("T", " ") + '</strong></span>';
                },

            },
            {
              field: "ENTRY_PRICE",
              title: "Trigger Price",
              template: function (row) {
                return '<span style="color:' + (row.CHANGE_COLOUR > 0 ? '#2ca189!important' : 'grey') + ';"><strong>' + row.ENTRY_PRICE + '</strong></span>';
              },
            },
            {
              field: "TIME_CHG_PERC",
              title: "Move Since Trigger",
              template: function (row) {
                return '<span style="color:' + (row.CHANGE_COLOUR > 0 ? '#2ca189!important' : 'grey') + ';"><strong>' + row.TIME_CHG_PERC + '</strong></span>' ;
              },
            },
            {
              field: "UP_PRICE",
              title: "I Expect",
              template: function (row) {
                return '<span style="color:' + (row.CHANGE_COLOUR > 0 ? '#2ca189!important' : 'grey') + ';"><strong>' + row.UP_PRICE + '</strong></span>' ;
              },
            },
            {
              field: "RISK_PRICE_UP",
              title: "My Risk",
              template: function (row) {
                return '<span style="color:' + (row.CHANGE_COLOUR > 0 ? '#2ca189!important' : 'grey') + ';"><strong>' + row.RISK_PRICE_UP + '</strong></span>' ;
              },
            }
            
          ],
          });

          $scope.datatable_bullish.redraw();

          $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
            e.cprBullish; // newly activated tab
          $scope.datatable_bullish.redraw();
          });
          
        }
        else if (table_for == 'BEARISH') {
           var table_bearish_data = [];
          angular.forEach(data, function (obj ) {
            var cleanObj = angular.copy(obj); 
            delete cleanObj.$$hashKey;
            table_bearish_data.push(cleanObj);
          })

          $scope.datatable_bearish = $(".m_datatable_bearish").mDatatable({
          data: {
            type: "local",
            source: table_bearish_data,
            pageSize: 5,
          },

          // layout definition
          layout: {
            theme: "default", // datatable theme
            class: "", // custom wrapper class
            scroll: true, // enable/disable datatable scroll both horizontal and vertical when needed.
            height: 400, // datatable's body's fixed height
            footer: false, // display/hide footer
          },

          translate: {
            records: {
              // processing: "Loading...",
              noRecords: "No signals have qualified."
            }
          },

          select: true,
          // column sorting
          sortable: true,

          filterable: false,

          pagination: true,

          search: {
            input: $("#generalSearchDay_trader_bullets"),
          },

          // toolbar
          toolbar: {
            // toolbar items
            items: {
              // pagination
              pagination: {
                pageSizeSelect: [5, 10, 20, 30, 50, 100 /*, -1*/], // display dropdown to select pagination size. -1 is used for "ALl" option
              },
            },
          },
          // columns definition
          columns: [
            {
              field: "id",
              title: "#",
              sortable: false, // disable sort for this column
              width: 40,
              selector: { class: "m-checkbox--solid m-checkbox--brand" },
            },
            {
              field: "SYMBOL",
              title: "Stock",
              template: function (row) {
                return (
                  '<a class="m-link m--font-boldest" id="call_symbol" href="/index/stock_analyser/' +
                  row.SYMBOL +
                  '/PIVOTS" target="_blank"><strong>' +
                  row.SYMBOL +
                  "</strong></a>"
                );
              },
            },
            {
              field: "CLOSE_CHG_P",
              title: "Day Change%",
              template: function (row) {
                return '<span style="color:' + (row.CHANGE_COLOUR > 0 ? '#f4516c!important' : 'grey') + ';"><strong>' + row.CHG_P + '</strong></span>';

              },
            },
            {
              field: "CUR_DT",
              title: "Trigger Time",
              // template: function (row) {
              //   return '<span style="color:#f4516c!important;"><strong>' + row.SIGNAL_DATE.replace("T", " ") + '</strong></span>' ;
              // },
              template: function (row) {
                  if (!row.CUR_DT) return '-';
                  return '<span style="color:' + (row.CHANGE_COLOUR > 0 ? '#f4516c!important' : 'grey') + ';"><strong>' + String(row.CUR_DT).replace("T", " ") + '</strong></span>';
                },
            },
            {
              field: "ENTRY_PRICE",
              title: "Trigger Price",
              template: function (row) {
                return '<span style="color:' + (row.CHANGE_COLOUR > 0 ? '#f4516c!important' : 'grey') + ';"><strong>' + row.ENTRY_PRICE + '</strong></span>' ;
              },
            },
            {
              field: "TIME_CHG_PERC",
              title: "Move Since Trigger",
              template: function (row) {
                return '<span style="color:' + (row.CHANGE_COLOUR > 0 ? '#f4516c!important' : 'grey') + ';"><strong>' + row.TIME_CHG_PERC + '</strong></span>' ;
              },
            },
            {
              field: "DOWN_PRICE",
              title: "I Expect",
              template: function (row) {
                return '<span style="color:' + (row.CHANGE_COLOUR > 0 ? '#f4516c!important' : 'grey') + ';"><strong>' + row.DOWN_PRICE + '</strong></span>' ;
              },
            },
            {
              field: "RISK_PRICE_DOWN",
              title: "My Risk",
              template: function (row) {
                return '<span style="color:' + (row.CHANGE_COLOUR > 0 ? '#f4516c!important' : 'grey') + ';"><strong>' + row.RISK_PRICE_DOWN + '</strong></span>' ;
              },
            },
          ],
          });

        }

      };

      


      // For Update mobile view for 30min & 60min
      $scope.isMobile = $window.innerWidth <= 750;

      // Listen for window resize event
      angular.element($window).bind('resize', function() {
          $scope.$apply(function() {
              $scope.isMobile = $window.innerWidth <= 750;
          });
      });

    // ######## Active Stocks Code End #######


      // Sector View Code Starts //
      var chart_livesector = AmCharts.makeChart("m_chart_sector_view", {
        type: "serial",
        theme: "light",
        valueAxes: [
          {
            position: "bottom",
          },
        ],
        startDuration: 0,
        graphs: [
          {
            balloonText:
              "<span style='font-size:13px;'>[[NAME]]: <b>[[LTP]]</b> <b>([[CHGPCT]])</b></span>",
            title: "NAME",
            type: "column",
            fillAlphas: 0.8,
            fillColors: "#00CC99",
            negativeBase: 0,
            negativeFillColors: "#FF0033",
            valueField: "CHGPCT",
          },
        ],
        rotate: true,
        categoryField: "NAME",
        autoMargins: false,
        marginTop: 15,
        marginBottom: 30,
        marginLeft: 140,
        marginRight: 20,
        categoryAxis: {
          labelRotation: 45,
        },
        export: {
          enabled: false,
        },
      });

      function livesector() {
        $http
          .get("/dashboard/Live_Sector_Market/?format=json")
          .then(function (response) {
            $scope.data = response.data;
            json_data = JSON.stringify($scope.data);
            json_data = JSON.parse(json_data);
            json_data = json_data.data;
            NAME = [];
            CHGPCT = [];
            CHGPCTSTR = [];
            COLOR = [];
            LTP = [];
            LTPSTR = [];
            chartdata = [];

            $.each(json_data, function (idx, obj1) {
              charttmp = {};
              $.each(obj1, function (idx, obj2) {
                if (idx == "NAME") {
                  charttmp["NAME"] = obj2;
                }
                if (idx == "LTP") {
                  charttmp["LTP"] = parseFloat(obj2);
                }
                if (idx == "CHGPCT") {
                  charttmp["CHGPCT"] = parseFloat(obj2);
                }
              });
              chartdata.push(charttmp);
            });
            chartdata = JSON.stringify(chartdata);

            chart_livesector.dataProvider = eval(chartdata);
            chart_livesector.validateData();

            json_data = null;
            chartdata = null;
            charttmp = null;
          });
      }

      // Sector View Ends //

      // Drop Down Time Frame Logic Starts here //

      var ctrl = this;
      ctrl.updateParent = () => {
        SetDropdownValues((modify_by_watchlist = true));
      };

      function SetDropdownValues() {
        if (typeof $rootScope.GlobalExclusionList !== "undefined") {
          $scope.IndexValue = $rootScope.GetSpecificDropdownValues(
            $rootScope.GlobalExclusionList.concat([])
          );
          if (typeof $scope.SelectIndexValue === "undefined") {
            $scope.SelectIndexValue = $scope.IndexValue[5];
          } else {
            if ($scope.LastSelectUniverseIndex + 1 > $scope.IndexValue.length) {
              $scope.SelectIndexValue =
                $scope.IndexValue[$scope.LastSelectUniverseIndex - 1];
            } else {
              $scope.SelectIndexValue =
                $scope.IndexValue[$scope.LastSelectUniverseIndex];
            }
          }

          return;
        } else {
          setTimeout(function () {
            SetDropdownValues();
          }, 100);
        }
      }

      function CallLocalFunctions() {
        SetDropdownValues();
        $scope.dashboard_change_data(
          $scope.SelectIndexValue,
          $scope.SelectHeatmapOpenClose
        );
        CallLocalFunctionsTimer = setTimeout(function () {
          CallLocalFunctions();
        }, 300000);
      }

      var d_change_data_set_timeout;
      $scope.dashboard_change_data = function (index, selectopenclose) {
        var now = new Date().toLocaleString();
        if (typeof index == "undefined") {
          setTimeout(function () {
            $scope.dashboard_change_data(
              $scope.SelectIndexValue,
              selectopenclose
            );
          }, 1000);
          return;
        }

        var getHeatMapData = getDashboardHeatmapDataServiceOpenClose.getData();
        getHeatMapData.then(function (data) {
          $scope.userbullmin = $scope.selectedBullMin;
          $scope.userbullmax = $scope.selectedBullMax;
          broadmarket();
          livesector();
          advance_decline(index, data, selectopenclose);
          heatmap(index, data, selectopenclose);
          // cprDataFetch($scope.selectedTimeframeNew);
          cprDataFetch();
          daytraderDataFetch();
          // d_change_data_set_timeout = setTimeout(function () {
          //   $scope.dashboard_change_data( $scope.SelectIndexValue, $scope.SelectHeatmapOpenClose );
          // }, 40000);


        });
      };
     

      var d_change_data_index;

      $scope.dashboard_change_data_index = function (index, selectopenclose) {
        var getHeatMapData = getDashboardHeatmapDataServiceOpenClose.getData();
        getHeatMapData.then(function (data) {
          if (
            $rootScope.user_permission_intraday == false &&
            index == "WATCHLIST"
          ) {
            $scope.unblock_dashboard = false;
          } else {
            $scope.unblock_dashboard = true;
            if (CALL2 == 1) {
              d_change_data_index = setTimeout(function () {
                advance_decline(index, data, selectopenclose);
                heatmap(index, data, selectopenclose);
                cprDataFetch();
                daytraderDataFetch();
              }, 1000);
              CALL2 = 2;
            } else {
              cprDataFetch();
              daytraderDataFetch();
              // cprDataFetch($scope.selectedTimeframeNew);
              advance_decline(index, data, selectopenclose);
              heatmap(index, data, selectopenclose);
            }
          }
        });
      };

      CallLocalFunctions();

      // Drop Down Time Frame Logic ends here //

      // Advance/Decline Starts Here //

      var chart_advance_decline = AmCharts.makeChart("m_chart_adv_dec", {
        type: "pie",
        startDuration: 0,
        startEffect: "easeInSine",
        theme: "light",
        addClassNames: true,
        innerRadius: "30%",
        defs: {
          filter: [
            {
              id: "shadow",
              width: "200%",
              height: "200%",
              feOffset: {
                result: "offOut",
                in: "SourceAlpha",
                dx: 0,
                dy: 0,
              },
              feGaussianBlur: {
                result: "blurOut",
                in: "offOut",
                stdDeviation: 5,
              },
              feBlend: {
                in: "SourceGraphic",
                in2: "blurOut",
                mode: "normal",
              },
            },
          ],
        },

        valueField: "count",
        colorField: "color",
        titleField: "type",
        autoMargins: false,
        labelsEnabled: false,
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 0,
        marginRight: 0,
        pullOutRadius: 0,
        export: {
          enabled: false,
        },
      });

      function advance_decline(index, data, selectopenclose) {
        json_data = data;
        chartdata_ad = setChartDataAdvanceDecline(
          json_data,
          index,
          selectopenclose
        );
        chart_advance_decline.addListener("rollOverSlice", function (e) {
          handleRollOver(e);
        });

        function handleRollOver(e) {
          var wedge = e.dataItem.wedge.node;
          wedge.parentNode.appendChild(wedge);
        }

        chartdata_ad = JSON.stringify(chartdata_ad);

        chart_advance_decline.dataProvider = eval(chartdata_ad);

        chart_advance_decline.validateData();

        json_data = null;
        chartdata_ad = null;
      }

      function setChartDataAdvanceDecline(json_data, index, selectopenclose) {
        group1 = 0;
        group2 = 0;
        group3 = 0;
        group4 = 0;

        chartdata = [];
        //idhar
        json_data = json_data.data;
        json_data = $scope.universe_symbol_filter(json_data);
        $.each(json_data, function (idx, obj1) {
          charttmp = {};
          $.each(obj1, function (idx, obj2) {
            if (idx == "SYMBOL") {
              charttmp["SYMBOL"] = obj2;
            }
            if (idx == "NSE_INDEX") {
              charttmp["NSE_INDEX"] = parseInt(obj2);
              if (charttmp["NSE_INDEX"] == 1 && index == "NIFTY 50") {
                charttmp["NSE_INDEX"] = true;
              } else if (
                (charttmp["NSE_INDEX"] == 1 ||
                  charttmp["NSE_INDEX"] == 2 ||
                  charttmp["NSE_INDEX"] == 3 ||
                  charttmp["NSE_INDEX"] == 4) &&
                (index == "WATCHLIST" ||
                  index == "NIFTY MID-SMALL" ||
                  index == "NIFTY NEXT 50" ||
                  index == "NIFTY BANK")
              ) {
                charttmp["NSE_INDEX"] = true;
              } else if (
                (charttmp["NSE_INDEX"] == 1 ||
                  charttmp["NSE_INDEX"] == 2 ||
                  charttmp["NSE_INDEX"] == 3 ||
                  charttmp["NSE_INDEX"] == 4) &&
                index == "NIFTY 500"
              ) {
                charttmp["NSE_INDEX"] = true;
              } else {
                charttmp["NSE_INDEX"] = false;
              }
            }

            if (idx == "FNO_FLAG") {
              charttmp["FNO_FLAG"] = parseInt(obj2);
              if (charttmp["FNO_FLAG"] == 1) {
                charttmp["FNO_FLAG"] = true;
              } else {
                charttmp["FNO_FLAG"] = false;
              }
            }

            if (idx == "DAY_CLOSE_CHG_P") {
              if (selectopenclose == "Close") {
                charttmp["DAY_CLOSE_CHG_P"] = parseFloat(obj2);
              }
            }
            if (idx == "DAY_OPEN_CHG_P") {
              if (selectopenclose == "Open") {
                charttmp["DAY_OPEN_CHG_P"] = parseFloat(obj2);
              }
            }
          });
          if (charttmp["NSE_INDEX"] || charttmp["FNO_FLAG"]) {
            if (
              charttmp["SYMBOL"] != "FTSE100" &&
              charttmp["SYMBOL"] != "BANKNIFTY" &&
              charttmp["SYMBOL"] != "NIFTYIT" &&
              charttmp["SYMBOL"] != "NIFTY" &&
              charttmp["SYMBOL"] != "INDIAVIX"
            ) {
              if (selectopenclose == "Close") {
                if (charttmp["DAY_CLOSE_CHG_P"] < -2) {
                  group1++;
                } else if (
                  charttmp["DAY_CLOSE_CHG_P"] >= -2 &&
                  charttmp["DAY_CLOSE_CHG_P"] <= 0
                ) {
                  group2++;
                } else if (
                  charttmp["DAY_CLOSE_CHG_P"] > 0 &&
                  charttmp["DAY_CLOSE_CHG_P"] <= 2
                ) {
                  group3++;
                } else {
                  group4++;
                }
              }
              if (selectopenclose == "Open") {
                if (charttmp["DAY_OPEN_CHG_P"] < -2) {
                  group1++;
                } else if (
                  charttmp["DAY_OPEN_CHG_P"] >= -2 &&
                  charttmp["DAY_OPEN_CHG_P"] <= 0
                ) {
                  group2++;
                } else if (
                  charttmp["DAY_OPEN_CHG_P"] > 0 &&
                  charttmp["DAY_OPEN_CHG_P"] <= 2
                ) {
                  group3++;
                } else {
                  group4++;
                }
              }
            }
          }
        });
        chartdata.push({ type: "< -2%", count: group1, color: "#FF0033" });
        chartdata.push({ type: "0% to -2%", count: group2, color: "#FF9999" });
        chartdata.push({ type: "0% to 2%", count: group3, color: "#99FFCC" });
        chartdata.push({ type: "> 2%", count: group4, color: "#00CC99" });

        return chartdata;
      }

      $scope.universe_symbol_filter = function (data) {
        symbolFilterArray = [];
        $scope.LastSelectUniverseIndex = $scope.IndexValue.findIndex(
          (x) => x.Value === $scope.SelectIndexValue.Value
        );
        return $rootScope.GlobalFilter(data, $scope.SelectIndexValue.Value);
      };

      // Advance/Decline ends Here //

      // Price Gainers Code Starts Here //

      var chart_price_gainers = AmCharts.makeChart("m_chart_price_gainers", {
        type: "serial",
        theme: "light",
        valueAxes: [
          {
            position: "bottom",
            labelsEnabled: false,
            gridThickness: 0,
          },
        ],
        startDuration: 0,
        graphs: [
          {
            balloonText:
              "<span style='font-size:13px;'>[[SYMBOL]]: <b>([[DAY_CHG_P]]%)</b></span>",
            title: "NAME",
            type: "column",
            fillAlphas: 0.8,
            fillColors: "#00CC99",
            negativeBase: 0,
            negativeFillColors: "red",
            valueField: "DAY_CHG_P",
            colorField: "color",
            balloon: {
              fontSize: 8,
            },
          },
        ],
        rotate: true,
        categoryField: "SYMBOL",
        autoMargins: false,
        marginTop: 15,
        marginBottom: 30,
        marginLeft: 90,
        marginRight: 40,
        categoryAxis: {
          fontSize: 10,
          minHorizontalGap: 0,
          minVerticalGap: 0,
          gridThickness: 0,
        },
        export: {
          enabled: false,
        },
      });

      function fn_price_gainers(data) {
        $scope.chartdata_final = JSON.stringify(data);
        chart_price_gainers.dataProvider = eval($scope.chartdata_final);
        chart_price_gainers.validateData();
        $scope.chartdata_final = null;
      }
      // Price Gainers Code ends Here //

      // Price Losers Starts Here //

      var chart_price_losers = AmCharts.makeChart("m_chart_price_losers", {
        type: "serial",
        theme: "light",
        valueAxes: [
          {
            position: "bottom",
            labelsEnabled: false,
            gridThickness: 0,
          },
        ],
        startDuration: 0,
        graphs: [
          {
            balloonText:
              "<span style='font-size:13px;'>[[SYMBOL]]: <b>([[DAY_CHG_P]]%)</b></span>",
            title: "NAME",
            type: "column",
            fillAlphas: 0.8,
            fillColors: "#FF0033",
            negativeBase: 0,
            negativeFillColors: "red",
            valueField: "ADJ_DAY_CHG_P",
            colorField: "color",
            balloon: {
              fontSize: 8,
            },
          },
        ],
        rotate: true,
        categoryField: "SYMBOL",
        autoMargins: false,
        marginTop: 15,
        marginBottom: 30,
        marginLeft: 90,
        marginRight: 40,
        categoryAxis: {
          fontSize: 10,
          minHorizontalGap: 0,
          minVerticalGap: 0,
          gridThickness: 0,
        },
        export: {
          enabled: false,
        },
      });

      function fn_price_losers(data) {
        $scope.chartdata_final = JSON.stringify(data);
        chart_price_losers.dataProvider = eval($scope.chartdata_final);
        chart_price_losers.validateData();
        $scope.chartdata_final = null;
      }

      // Price Losers ends Here //

      // Heatmap Code Starts Here //

      function heatmap(index, data, selectopenclose) {
        json_data = JSON.stringify(data);
        json_data = JSON.parse(json_data);
        json_data = json_data.data;
        nifty_data = [];
        price_gainers = [];
        price_losers = [];
        $.each(json_data, function (idx, obj1) {
          nifty_temp = {};
          $.each(obj1, function (idx, obj2) { 
            if (idx == "SYMBOL") {
              nifty_temp["SYMBOL"] = obj2;
            }
            // if (idx == "SECURITY_ID") {
            //   nifty_temp["SECURITY_ID"] = obj2;
            // }
            if (idx == "DAY_CLOSE_CHG_P") {
              if (selectopenclose == "Close") {
                nifty_temp["DAY_CLOSE_CHG_P"] = parseFloat(obj2).toFixed(2);
                nifty_temp["DAY_CHG_P"] = parseFloat(obj2).toFixed(2);
                if (nifty_temp["DAY_CLOSE_CHG_P"] >= 0) {
                  nifty_temp["ADJ_DAY_CHG_P"] = nifty_temp["DAY_CLOSE_CHG_P"];
                }
                if (nifty_temp["DAY_CLOSE_CHG_P"] < 0) {
                  nifty_temp["ADJ_DAY_CHG_P"] =
                    nifty_temp["DAY_CLOSE_CHG_P"] * -1;
                }
              }
            }
            if (idx == "DAY_OPEN_CHG_P") {
              if (selectopenclose == "Open") {
                nifty_temp["DAY_OPEN_CHG_P"] = parseFloat(obj2).toFixed(2);
                nifty_temp["DAY_CHG_P"] = parseFloat(obj2).toFixed(2);
                if (nifty_temp["DAY_OPEN_CHG_P"] >= 0) {
                  nifty_temp["ADJ_DAY_CHG_P"] = nifty_temp["DAY_OPEN_CHG_P"];
                }
                if (nifty_temp["DAY_OPEN_CHG_P"] < 0) {
                  nifty_temp["ADJ_DAY_CHG_P"] =
                    nifty_temp["DAY_OPEN_CHG_P"] * -1;
                }
              }
            }
            if (idx == "NSE_INDEX") {
              nifty_temp["NSE_INDEX"] = parseInt(obj2);
              if (nifty_temp["NSE_INDEX"] == 1 && index == "NIFTY 50") {
                nifty_temp["NSE_INDEX"] = true;
              } else if (
                (nifty_temp["NSE_INDEX"] == 1 ||
                  nifty_temp["NSE_INDEX"] == 2 ||
                  nifty_temp["NSE_INDEX"] == 3 ||
                  nifty_temp["NSE_INDEX"] == 4) &&
                index == "NIFTY 500"
              ) {
                nifty_temp["NSE_INDEX"] = true;
              } else if (
                (nifty_temp["NSE_INDEX"] == 1 ||
                  nifty_temp["NSE_INDEX"] == 2 ||
                  nifty_temp["NSE_INDEX"] == 3 ||
                  nifty_temp["NSE_INDEX"] == 4) &&
                (index == "WATCHLIST" ||
                  index == "NIFTY BANK" ||
                  index == "NIFTY MID-SMALL" ||
                  index == "NIFTY NEXT 50")
              ) {
                nifty_temp["NSE_INDEX"] = true;
              } else {
                nifty_temp["NSE_INDEX"] = false;
              }
            }
            if (idx == "FNO_FLAG") {
              nifty_temp["FNO_FLAG"] = parseInt(obj2);
              if (nifty_temp["FNO_FLAG"] == 1) {
                nifty_temp["FNO_FLAG"] = true;
              } else {
                nifty_temp["FNO_FLAG"] = false;
              }
            }
          });

          if (nifty_temp["NSE_INDEX"] || nifty_temp["FNO_FLAG"]) {
            if (
              nifty_temp["SYMBOL"] != "FTSE100" &&
              nifty_temp["SYMBOL"] != "INDIAVIX"
            ) {
              nifty_data.push(nifty_temp);
            }
          }
          if (selectopenclose == "Close") {
            if (
              (nifty_temp["NSE_INDEX"] || nifty_temp["FNO_FLAG"]) &&
              nifty_temp["DAY_CLOSE_CHG_P"] > 0
            ) {
              if (
                nifty_temp["SYMBOL"] != "FTSE100" &&
                nifty_temp["SYMBOL"] != "INDIAVIX"
              ) {
                price_gainers.push(nifty_temp);
              }
            }
            if (
              (nifty_temp["NSE_INDEX"] || nifty_temp["FNO_FLAG"]) &&
              nifty_temp["DAY_CLOSE_CHG_P"] < 0
            ) {
              if (
                nifty_temp["SYMBOL"] != "FTSE100" &&
                nifty_temp["SYMBOL"] != "INDIAVIX"
              ) {
                price_losers.push(nifty_temp);
              }
            }
          }
          if (selectopenclose == "Open") {
            if (
              (nifty_temp["NSE_INDEX"] || nifty_temp["FNO_FLAG"]) &&
              nifty_temp["DAY_OPEN_CHG_P"] > 0
            ) {
              if (
                nifty_temp["SYMBOL"] != "FTSE100" &&
                nifty_temp["SYMBOL"] != "INDIAVIX"
              ) {
                price_gainers.push(nifty_temp);
              }
            }
            if (
              (nifty_temp["NSE_INDEX"] || nifty_temp["FNO_FLAG"]) &&
              nifty_temp["DAY_OPEN_CHG_P"] < 0
            ) {
              if (
                nifty_temp["SYMBOL"] != "FTSE100" &&
                nifty_temp["SYMBOL"] != "INDIAVIX"
              ) {
                price_losers.push(nifty_temp);
              }
            }
            
          }
        });
        nifty_data = $scope.universe_symbol_filter(nifty_data);
        price_gainers = $scope.universe_symbol_filter(price_gainers);
        price_losers = $scope.universe_symbol_filter(price_losers);

        if (selectopenclose == "Close") {
          nifty_data = nifty_data.sort(function (a, b) {
            var x = a.DAY_CLOSE_CHG_P;
            var y = b.DAY_CLOSE_CHG_P;

            if (x === 0 && y === 0) return 1 / x - 1 / y || 0;
            else return y - x;
          });
        }
        if (selectopenclose == "Open") {
          nifty_data = nifty_data.sort(function (a, b) {
            var x = a.DAY_OPEN_CHG_P;
            var y = b.DAY_OPEN_CHG_P;

            if (x === 0 && y === 0) return 1 / x - 1 / y || 0;
            else return y - x;
          });
        }
        $scope.heatmap_data = nifty_data;
        if (selectopenclose == "Close") {
          price_gainers = price_gainers.sort(function (a, b) {
            var x = a.ADJ_DAY_CHG_P;
            var y = b.ADJ_DAY_CHG_P;

            if (x === 0 && y === 0) return 1 / x - 1 / y || 0;
            else return y - x;
          });
          gainers = price_gainers.slice(0, 5);
          price_losers = price_losers.sort(function (a, b) {
            var x = a.ADJ_DAY_CHG_P;
            var y = b.ADJ_DAY_CHG_P;

            if (x === 0 && y === 0) return 1 / x - 1 / y || 0;
            else return x - y;
          });
          losers = price_losers.slice(-5);
          losers = losers.sort(function (a, b) {
            var x = a.ADJ_DAY_CHG_P;
            var y = b.ADJ_DAY_CHG_P;

            if (x === 0 && y === 0) return 1 / x - 1 / y || 0;
            else return y - x;
          });
        }
        if (selectopenclose == "Open") {
          price_gainers = price_gainers.sort(function (a, b) {
            var x = a.ADJ_DAY_CHG_P;
            var y = b.ADJ_DAY_CHG_P;

            if (x === 0 && y === 0) return 1 / x - 1 / y || 0;
            else return y - x;
          });
          gainers = price_gainers.slice(0, 5);
          price_losers = price_losers.sort(function (a, b) {
            var x = a.ADJ_DAY_CHG_P;
            var y = b.ADJ_DAY_CHG_P;

            if (x === 0 && y === 0) return 1 / x - 1 / y || 0;
            else return x - y;
          });
          losers = price_losers.slice(-5);
          losers = losers.sort(function (a, b) {
            var x = a.ADJ_DAY_CHG_P;
            var y = b.ADJ_DAY_CHG_P;

            if (x === 0 && y === 0) return 1 / x - 1 / y || 0;
            else return y - x;
          });
        }

        fn_price_gainers(gainers);
        fn_price_losers(losers);

        $scope.loading = false;
      }
      // Heatmap Code ends Here //

      $(document).ready(function startIntro() {
        var intro = introJs();
        intro.setOptions({
          steps: [
            {
              intro: "<b>Hello Traders</b>",
            },
            {
              element: "#stock_analyzer",
              intro:
                "<b>Key Insights for ANY Stock across multiple Time Frames</b>",
              position: "bottom",
            },
            {
              element: "#trade_now",
              intro:
                "<b>Trades ready to execute NOW – Intraday Trades Only</b>",
              position: "bottom",
            },
            {
              element: "#markets_live",
              intro:
                "<b>Live commentary on the Markets by Dr. C K Narayan & his Team.</b> ",
              position: "bottom",
            },
            {
              element: "#m_header_topbar",
              intro:
                "<b>Price Action across multiple modules. Checkout what is moving the markets</b>",
              position: "bottom",
            },
            {
              element: "#tradestation_notification_icon",
              intro:
                "<b>Get Alerts when our Algorithms refresh with new results for Candlestick modules.</b>",
              position: "bottom",
            },
            {
              element: document.querySelector("#step1"),
              intro:
                "Build a view on today’s Trade Setup &amp; Market Action.\
									Different tabs provide the user with a view on market action across stocks and sectors.\
									<br><img src='../../static/hint/dashboard.png' /><br>Get a comprehensive view on today’s Market Action<br>\
									<img src='../../static/hint/index_trades.png' /><br>Get a View on indices and their Trades<br>",
              position: "right",
            },
            {
              element: "#step2",
              intro:
                "<h4>Intraday Play </h4> <br>Realtime Intraday Trading Modules, includes Trade Management.<br>\
									<img src='../../static/hint/intraday_trades.png' /><br>Checkout Intraday Trades. Complete trade management module.\
									<img src='../../static/hint/query_window.png' /><br>Identify scalping opportunities.",
              position: "right",
            },
            {
              element: "#multi_day_play",
              intro:
                "<h4>Multiday Play </h4> <br>Different modules for Multiday trading. <br>\
									<img src='../../static/hint/multiday_play.png' /><br>Checkout Multiday Trades. Refreshed EOD.\
									<img src='../../static/hint/option_alerts.png' /><br>Stock price action, ripe for playing option strategies. Refreshed EOD.<br>",
              position: "right",
            },
            {
              element: "#positional_play",
              intro:
                "<h4>Positional Play</h4><br>Positional Trading Modules, includes Trade Management. <br>\
									<img src='../../static/hint/positional_play.png' /><br>Checkout Positional Trades. Refreshed End of Week. Time Horizon – 1 to 5 Weeks.<br>",
              position: "right",
            },
            {
              element: "#investment_play",
              intro:
                "<h4>Investment Play</h4> <br>\
									<img src='../../static/hint/investment_play.png' /><br>Checkout Investment Opportunities. Refreshed End of Week.<br>",
              position: "right",
            },
            {
              element: "#my_markets",
              intro:
                "<h4>My Markets</h4> <br>\
									<img src='../../static/hint/my_watchlist.png' /><br>Add stocks you are interested, to your Watchlist. Get notified on trades generated.<br>\
									<img src='../../static/hint/my_trades.png' /><br>Track your Trades from different scanners on My Trades.<br>\
									<img src='../../static/hint/trading_journal.png' /><br>Coming Soon.<br> ",
              position: "auto",
            },
            {
              element: "#analyst_zone",
              intro:
                "<h4>Analyst Zone</h4><br>Different modules to analyze the markets\
									<img src='../../static/hint/ichimoku_dashboard.png' /><br>A complete module based on Ichimoku Strategies.<br>\
									<img src='../../static/hint/stock_trends.png' /><br>Track stock price action through the day.<br>\
									<img src='../../static/hint/candlestick.png' /><br>A complete module based on Candlestick Methods.<br>\
									<img src='../../static/hint/adx_trends.png' /><br> Check what is trending in the market across timeframes.<br>",
              position: "auto",
            },
            {
              element: "#analyst_zone",
              intro:
                "\
									<img src='../../static/hint/pivots_view.png' /><br> Check how the market is placed across stocks, across Pivot levels.<br>\
									<img src='../../static/hint/technical_indicators.png' /><br> Track stocks across Technical Indicators.<br>\
									<img src='../../static/hint/expert_alerts.png' /><br>  Track stock action across different modules in a single place.<br>\
									<img src='../../static/hint/charts.png' /><br>Track stock on Charts. EOD module & Realtime charts only.<br> ",
              position: "auto",
            },
            {
              intro: "<b>Thank you</b>",
            },
          ],
          showStepNumbers: false,
          hidePrev: true,
          scrollTo: "element",
          exitOnOverlayClick: false,
        });

        $("#view_demo").click(function () {
          if ($scope.agreed) {
            url_hit =
              "https://trade.chartadvise.com/app/Accepted_Terms_Condition/" +
              $scope.agreed;
            $http.get(url_hit).then(function (response) {});
          }
          $("html, body").css({
            overflow: "hidden",
            height: "100%",
          });

          intro.oncomplete(function () {
            $("html, body").css({
              overflow: "auto",
              height: "auto",
            });
          });

          intro.onexit(function () {
            $("html, body").css({
              overflow: "auto",
              height: "auto",
            });
          });

          intro.setOption("skipLabel", " Exit Tour ");

          intro.start();
        });
      });

      $("#site_demo").click(function () {
        $("#view_demo").trigger("click");
      });
    });
  } 
  
  },
});
