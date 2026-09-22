angular
  .module("app")
  .config(function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode({
      enabled: true,
    });
    $routeProvider
      .when("/positional/", {
        template: "<positional></positional>",
      })
      .when("/candlestick_demo/", {
        template: "<candlestick_alerts_demo></candlestick_alerts_demo>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/intraday_trades_signals/", {
        template: "<eqsis_intraday></eqsis_intraday>",
      })
      .when("/intraday_trades_two/", {
        template: "<intraday_trades_two></intraday_trades_two>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/multiday_trades_two/", {
        template: "<multiday_trades_two></multiday_trades_two>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/postional_demo/", {
        template: "<postional_demo></postional_demo>",
      })
      .when("/intraday_trades_signals/", {
        template: "<eqsis_intraday></eqsis_intraday>",
      })
      .when("/nse_option_chain_analysis_with_filters/", {
        template:
          "<nse_option_chain_analysis_pro></nse_option_chain_analysis_pro>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/nse_technical_analysis/", {
        template: "<nse_technical_analysis></nse_technical_analysis>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/fii_nse_stock/", {
        template: "<eqsis_fii_nse_stock></eqsis_fii_nse_stock>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/nse_option_chain/:symbolname", {
        template: "<nse_option_chain></nse_option_chain>",
      })
      .when("/nse_implied_volatility/:symbolname", {
        template: "<nse_implied_volatility></nse_implied_volatility>",
      })
      .when("/eqsis_a/", {
        template: "<eqsis_a></eqsis_a>",
      })
      .when("/eqsis_nse_stock_performance/", {
        template: "<eqsis_nse_stock_performance></eqsis_nse_stock_performance>",
      })
      .when("/fii_nse_index/", {
        template: "<eqsis_fii_nse_index></eqsis_fii_nse_index>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/nse_derivative_markets/", {
        template: "<nse_derivative_markets></nse_derivative_markets>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/fii_activity_nse_stock/", {
        template: "<fii_activity_nse_stock></fii_activity_nse_stock>",
      })
      .when("/fib_support_resistance_levels/", {
        template:
          "<fib_support_resistance_levels></fib_support_resistance_levels>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/technical_analysis/", {
        template: "<technical_analysis></technical_analysis>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/nse_option_high_low_implied_volatility/", {
        template:
          "<nse_option_high_low_implied_volatility></nse_option_high_low_implied_volatility>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/nse_max_pain_analysis/", {
        template: "<nse_max_pain_analysis></nse_max_pain_analysis>",
      })
      .when("/stock_fut_derivative_scannner/", {
        template:
          "<stock_fut_dervitaive_scannner></stock_fut_dervitaive_scannner>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/popup_admin/", {
        template: "<popup_admin></popup_admin>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/popup_admi/", {
        template: "<popup_admi></popup_admi>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/sector_view/", {
        template: "<sectorview></sectorview>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/sector_analysis_view/", {
        template: "<sectoranalysis></sectoranalysis>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/dashboard_old/", {
        template: "<dashboard-old></dashboard-old>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/dashboard/", {
        template: "<dashboard></dashboard>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/market_stats/", {
        template: "<dashboardstats></dashboardstats>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/market_replay/", {
        template: "<marketreplay></marketreplay>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/give_request/", {
        template: "<give_request></give_request>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/trade_statistic/", {
        template: "<stats></stats>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/changed_now/", {
        template: "<changedon></changedon>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/trending/", {
        template: "<trending></trending>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/trending_demo/", {
        template: "<trending_demo></trending_demo>",
      })
      .when("/ichimoku/", {
        template: "<ichimoku></ichimoku>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/ichimoku_demo/", {
        template: "<ichimoku_demo></ichimoku_demo>",
      })
      .when("/scanners/", {
        template: "<scanners></scanners>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/candlestick_alerts/", {
        template: "<candlestick-alerts></candlestick-alerts>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/intraday_trends/", {
        template: "<intraday-trends></intraday-trends>",
      })
      .when("/rsi/", {
        template: "<rsi></rsi>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/Fibonacci_pivot/", {
        template: "<pivots></pivots>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/nse_stock_performance/", {
        template: "<pivots-demo></pivots-demo>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/camarilla/", {
        template: "<camarilla></camarilla>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/twr/", {
        template: "<twr></twr>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/smd/", {
        template: "<smd></smd>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/pivots_camarilla_demo/", {
        template: "<pivots-camarilla-demo></pivots-camarilla-demo>",
      })
      .when("/technical_indicators/", {
        template: "<technical-indicators></technical-indicators>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/technical_indicators_demo/", {
        template: "<technical-indicators_demo></technical-indicators_demo>",
      })
      .when("/stock_trends/", {
        template: "<stock-trends></stock-trends>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/rsi_demo/", {
        template: "<stock-trends-demo></stock-trends-demo>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/intraday_trades_ap/", {
        template: "<intraday-trades-active-play></intraday-trades-active-play>",
      })
      .when("/intraday_trades_pp/", {
        template:
          "<intraday-trades-passive-play></intraday-trades-passive-play>",
      })
      .when("/my_trades/", {
        template: "<my-trades></my-trades>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/nse-option-chain-filter/", {
        template: "<eqsis></eqsis>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/stock_analyser/", {
        redirectTo: "/stock_analyser/NIFTY/INTRADAY",
      })
      .when("/stock_analyser/:symbolname/:timeplay", {
        template: "<stock-analyser></stock-analyser>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/login/", {
        template: "<login></login>",
      })
      .when("/trade_now/", {
        template: "<trade-now></trade-now>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/watchlist/", {
        template: "<watchlist></watchlist>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      // .when("/ticker/", {
      //   template: "<ticker></ticker>",
      //   resolve: {
      //     app: function ($q, $rootScope) {
      //       // $location.path("/404");
      //       var defer = $q.defer();
      //       var promise = $rootScope.UserAppPermission();
      //       promise.then(function (name) {
      //         defer.resolve();
      //       });
      //       return defer.promise;
      //     },
      //   },
      // })
      .when("/my_alerts/", {
        template: "<my-alerts></my-alerts>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/multiday_trade/", {
        template: "<multiday-trades></multiday-trades>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/multiday_trades_demo/", {
        template: "<multiday-trades-demo></multiday-trades-demo>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/positional_trades/", {
        template: "<positional-trades></positional-trades>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/overnight_trades/", {
        template: "<overnight-trades></overnight-trades>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/intraday_trade/", {
        template: "<intraday-trades></intraday-trades>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/airline_trades/", {
        template: "<airline-trades></airline-trades>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/query_window/", {
        template: "<query-window></query-window>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/options_alerts/", {
        template: "<options-alerts></options-alerts>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/live_markets/", {
        template: "<live-markets></live-markets>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/expert_alerts/", {
        template: "<expert-alerts></expert-alerts>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/coming_soon/", {
        templateUrl: "/static/scripts/templates/coming_soon.html",
      })
      .when("/investments/", {
        template: "<investment-trades></investment-trades>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/admin_stocks_results/", {
        template: "<admin-stocks-results></admin-stocks-results>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/realtime_charts/", {
        template: "<realtime-charts></realtime-charts>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/charts/:symbolname", {
        template: "<charts></charts>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/market_movers/", {
        template: "<market-movers></market-movers>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/market_movers_demo/", {
        template: "<market-movers-demo></market-movers-demo>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/Option_Trades/", {
        template: "<intraday-trades-demo></intraday-trades-demo>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/query_window_demo/", {
        template: "<query-window-demo></query-window-demo>",
      })
      .when("/indices/", {
        template: "<indices></indices>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/reference_dashboard/", {
        template: "<reference_dashboard></reference_dashboard>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/atr_trends/", {
        template: "<atr_trends></atr_trends>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      // .when("/user_profile_form/", {
      //   template: "<user_profile_form></user_profile_form>",
      //   resolve: {
      //     app: function ($q, $rootScope) {
      //       var defer = $q.defer();
      //       var promise = $rootScope.UserAppPermission();
      //       promise.then(function (name) {
      //         defer.resolve();
      //       });
      //       return defer.promise;
      //     },
      //   },
      // })
      .when("/user_details/", {
        template: "<user_details></user_details>",
        resolve: {
          app: function ($q, $rootScope,$location) {
            // $location.path("/404");
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/user_info/", {
        template: "<user_info></user_info>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/rolling_ticker/", {
        template: "<rolling_ticker></rolling_ticker>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/intraday_trades_new/", {
        template: "<intraday_trades_new></intraday_trades_new>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/trade_trial/", {
        template: "<trade_trial></trade_trial>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/atr/", {
        template: "<atr></atr>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/ha_patterns/", {
        template: "<heikin_ashi_patterns></heikin_ashi_patterns>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/cpr/", {
        template: "<cpr></cpr>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })

      .when("/pt_matrix/", {
        template: "<pt_matrix></pt_matrix>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/rsi_trends/", {
        template: "<rsi_trends></rsi_trends>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/telegram_trade/", {
        template: "<telegram_trade></telegram_trade>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/user_profile/", {
        template: "<user_profile></user_profile>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      })
      .when("/trade_calendar/", {
        template: "<trade_calendar></trade_calendar>",
        resolve: {
          app: function ($q, $rootScope) {
            var defer = $q.defer();
            var promise = $rootScope.UserAppPermission();
            promise.then(function (name) {
              defer.resolve();
            });
            return defer.promise;
          },
        },
      }).when("/trade_range/", {
				template: "<trade_range></trade_range>",
				resolve: {
					app: function ($q, $rootScope) {
						var defer = $q.defer();
						var promise = $rootScope.UserAppPermission();
						promise.then(function (name) {
							defer.resolve();
						});
						return defer.promise;
					},
				},
			}).when("/turning_time/", {
				template: "<turning_time></turning_time>",
				resolve: {
					app: function ($q, $rootScope) {
						var defer = $q.defer();
						var promise = $rootScope.UserAppPermission();
						promise.then(function (name) {
							defer.resolve();
						});
						return defer.promise;
					},
				},
			}).when("/manual_trade/", {
        template: "<manual_trade></manual_trade>",
        resolve: {
            app: function ($q, $rootScope) {
                var defer = $q.defer();
                var promise = $rootScope.UserAppPermission();
                promise.then(function (name) {
                    defer.resolve();
                });
    
                return defer.promise;
            },
        },
    }).otherwise({
        templateUrl: "/static/scripts/templates/page_not_found.html",
      });
  })
  .run([
    "$location",
    "$q",
    "$http",
    "$templateCache",
    "$rootScope",
    "getGiveAccessUserPermissionsDataService",
    "getAppUserPermissionsDataService",
    "getIntradayUserPermissionsDataService",
    "getTradeNowUserPermissionsDataService",
    "getMultidayUserPermissionsDataService",
    "getPositionalUserPermissionsDataService",
    "getIchimokuUserPermissionsDataService",
    "getStockTrendsUserPermissionsDataService",
    "getCandlestickUserPermissionsDataService",
    "getPivotsUserPermissionsDataService",
    "getAdxTrendsUserPermissionsDataService",
    "getTechnicalIndUserPermissionsDataService",
    "getExpertAlertsUserPermissionsDataService",
    "getStockAnalyserUserPermissionsDataService",
    "getLiveMarketsUserPermissionsDataService",
    "watchlistService",
    "commonService",
    "manualTradeService",
    function (
      $location,
      $q,
      $http,
      $templateCache,
      $rootScope,
      getGiveAccessUserPermissionsDataService,
      getAppUserPermissionsDataService,
      getIntradayUserPermissionsDataService,
      getTradeNowUserPermissionsDataService,
      getMultidayUserPermissionsDataService,
      getPositionalUserPermissionsDataService,
      getIchimokuUserPermissionsDataService,
      getStockTrendsUserPermissionsDataService,
      getCandlestickUserPermissionsDataService,
      getPivotsUserPermissionsDataService,
      getAdxTrendsUserPermissionsDataService,
      getTechnicalIndUserPermissionsDataService,
      getExpertAlertsUserPermissionsDataService,
      getStockAnalyserUserPermissionsDataService,
      getLiveMarketsUserPermissionsDataService,
      watchlistService,
      commonService,
    ) {

      $rootScope.universeIndice = ()=>{
        commonService.getIndicesList().then((response)=>{
          $rootScope.indicesList = response
        })
      }

      $rootScope.universeIndice()

      

      $rootScope.brokerButton =()=>{
        commonService.brokers().then((response)=>{
          $rootScope.isBrokerButton = response
        })
      }
      $rootScope.brokerButton()

      $rootScope.$on(
        "$routeChangeSuccess",
        function (event, current, previous) {
          url = window.location.pathname;
          url = url.replace(/[^a-zA-Z ]/g, " ");
          title = url.substring(6, 50).toUpperCase();
          document.title = title;
        }
      );

      $templateCache.removeAll();

      $http.get("/check_user_login/").then(function (response) {
        if (response.data == "False") {
          window.location = "/auth/login/";
        }
      });

      $rootScope.UserAppPermission = function () {
        var deferred = $q.defer();
        if ($rootScope.user_permission == undefined) {
          getAppUserPermissionsDataService.getData().then(function (data) {
            $rootScope.user_permission = data;
            $rootScope.isLoaded = true;
            deferred.resolve();
          });
        } else {
          deferred.resolve();
        }

        return deferred.promise;
      };

      $rootScope.give_access_user_permissions_get_data = function () {
        var giveAccessuserPermissionsData_intraday =
          getGiveAccessUserPermissionsDataService.getData();
        giveAccessuserPermissionsData_intraday.then(function (data) {
          $rootScope.give_access_user_permissions = data;
          if ($rootScope.give_access_user_permissions == "True") {
            $rootScope.give_access_user_permissions = true;
          } else {
            $rootScope.give_access_user_permissions = false;
          }
        });
      };

      $rootScope.Log = function (log = false, message = "None") {
        if (log) {
          console.log(log);
        }
      };

      $rootScope.GetUniverseDropdown = function (ExclusionList = []) {
        $http
          .get("/app/universe/table/")
          .then(function (response) {
            $rootScope.dropdown = response.data;
          })
          .then(function () { });
      };
      $rootScope.GetUniverseDropdown();

      $rootScope.GetUniverseSymbol = function () {
        $http
          .get("/app/universe/symbol/")
          .then(function (response) {
            Universe_Symbol_Data = response.data;
            $rootScope.GlobalExclusionList = [];
            Universes = $rootScope.dropdown;
            $.each(Universes, function (idx, universe) {
              if (
                GetSymbol(Universe_Symbol_Data[universe.Value]).length == 0 &&
                universe.Universe == "NSE"
              ) {
                $rootScope.GlobalExclusionList.push(universe.Value);
              }
            });
          })
          .then(function () {
            $rootScope.GetUniverseDropdown();
          });
      };

      $rootScope.GetSpecificDropdownValues = function (
        ExclusionList = [],
        modify_by_watchlist = false
      ) {
        if (modify_by_watchlist) $rootScope.GetUniverseSymbol();

        temp_dropdown = [];
        $.each($rootScope.dropdown, function (idx, value) {
          if (!ExclusionList.includes(value.Value)) {
            temp_dropdown.push(value);
          }
        });

        return temp_dropdown;
      };

      function GetSymbol(universe) {
        temp_push = [];
        $.each(universe, function (idx, value) {
          temp_push.push(value.SYMBOL);
        });
        return temp_push;
      }

      $rootScope.GetUniverseData = function (universe) {
        return GetSymbol(Universe_Symbol_Data[universe]);
      };

      $rootScope.GlobalFilter = function (data, universe) {
        symbolFilterArray = [];
        $.each($rootScope.dropdown, function (idx, value) {
          if (value.Value == universe) {
            _.each(
              GetSymbol(Universe_Symbol_Data[value.Value]),
              function (symbol) {
                symbolFilterArray.push(_.where(data, { SYMBOL: symbol }));
              }
            );
          }
        });
        symbolFilterArray = _.flatten(symbolFilterArray);
        return symbolFilterArray;
      };

      $rootScope.give_access_user_permissions_get_data();

      $rootScope.CallFunctions = function () {
        $rootScope.GetUniverseDropdown();
        $rootScope.GetUniverseSymbol();
        setTimeout(function () {
          $rootScope.CallFunctions();
        }, 300000);
      };
      $rootScope.CallFunctions();

      $rootScope.deletemyPopup = function () {
        localStorage.removeItem("show_popup");
      };
      $rootScope.deletemyPopup();

      $rootScope.myPopup = function () {
        $http.get("/app/Show_Popup_Get_Data/").then(function (response) {
          $rootScope.getModalData = [];
          $.each(response.data, function (idx, value) {
            value["next"] = "";
            $rootScope.getModalData.push(
              _.pick(
                value,
                "User_Id",
                "Popup_Id",
                "User_Group",
                "Start_Date",
                "End_Date",
                "Image_URL",
                "Description",
                "Frequency",
                "Is_Active",
                "next",
                "URL_Click"
              )
            );
          });
        });
      };
      $rootScope.myPopup();
      $rootScope.deletemyPopup = function () {
        localStorage.removeItem("show_popup");
      };
      $rootScope.deletemyPopup();

      $rootScope.webinar_jam = function () {
        $http.get("/app/webinar_jam/").then(function (response) {
          $rootScope.webinar = response.data;

          $rootScope.append_webinar_jam();
        });
      };

      $rootScope.webinar_jam();
      $rootScope.append_webinar_jam = function () {
        data = $rootScope.webinar;
        $.each(data, function (idx, obj) {
          if (obj.type == "Single presentation") {
            $("#upcoming_webinar1").append(
              `<li class="m-menu__item " aria-haspopup="true" m-menu-link-redirect="1">
					<button class="dropdown-item dropright" type="button" data-webinarHash=` +
              obj.webinar_hash +
              ` >` +
              obj.name +
              `</button>
					<script src="https://event.webinarjam.com/register/` +
              obj.webinar_hash +
              `/embed-button"></script></li>`
            );
          } else if (obj.type == "EVER_WEBINAR") {
            $("#stratergy_webinar1").append(
              `<li class="m-menu__item " aria-haspopup="true" m-menu-link-redirect="1">
					<button class="dropdown-item dropright" type="button" data-webinarHash=` +
              obj.webinar_hash +
              ` >` +
              obj.name +
              `</button>
					<script src="https://event.webinarjam.com/register/` +
              obj.webinar_hash +
              `/embed-button"></script></li>`
            );
          }
        });
      };

      $rootScope.GetCustomDropdown = function () {
        $http.get("/app/watchlist/").then(function (response) {
          $rootScope.customDropdown = response.data;
        });
      };
      $rootScope.GetCustomDropdown();

      $rootScope.MyCustomDropdown = function () {

        return $rootScope.customDropdown;
      };

      // WATCHLIST CODE START
      $rootScope.watchlist_modal_data = [];
      $rootScope.isDynamicWatchlist = 'no'
      $rootScope.watchlistModal = (data, mode) => {
        mytradedata = [];
        if (mode == "table") {
          data.rows(".m-datatable__row--active");
          data.nodes().each(function (i, row) {
            var data = $(row).data("obj");
            mytradedata.push(data);
          });
          $rootScope.watchlist_modal_data = _.pluck(commonService.objectkeyUpper(mytradedata), "SYMBOL");
        } else if (mode == 'heatmap') {
          $rootScope.watchlist_modal_data = _.pluck(commonService.objectkeyUpper(data), "SYMBOL");
        }
      };
      // WATCHLIST CODE END

      // All symbol list start
      $http.get("/app/Universe_Symbol_Getdata/").then(function (response) {
        response = response.data
        $rootScope.INDICES = []
        $rootScope.NIFTY_50 = []
        $rootScope.NIFTY_500 = []
        $rootScope.NIFTY_BANK = []
        $rootScope.NIFTY_FNO = []
        $rootScope.NIFTY_MID_SMALL = []
        $rootScope.NIFTY_NEXT_50 = []

        $.each(response,(idx,obj)=>{
          obj = obj.fields
          var whichUniverse = obj.UNIVERSE; 

          switch (whichUniverse) {
          case "NIFTY 500":
            $rootScope.NIFTY_500.push({"SYMBOL":obj.SYMBOL})
            break;
          case "NIFTY 50":
            $rootScope.NIFTY_50.push({"SYMBOL":obj.SYMBOL})
            break;
          case "NIFTY BANK":
            $rootScope.NIFTY_BANK.push({"SYMBOL":obj.SYMBOL})
            break;
          case "NIFTY FNO":
            $rootScope.NIFTY_FNO.push({"SYMBOL":obj.SYMBOL})
            break;
          case "NIFTY MID SMALL":
            $rootScope.NIFTY_MID_SMALL.push({"SYMBOL":obj.SYMBOL})
            break;
          case "NIFTY NEXT 50":
            $rootScope.NIFTY_NEXT_50.push({"SYMBOL":obj.SYMBOL})
            break;
        }                                                             
        })
        $rootScope.SYMBOL_LIST = [].concat(
            $rootScope.INDICES,
            $rootScope.NIFTY_50,
            $rootScope.NIFTY_500,
            $rootScope.NIFTY_BANK,
            $rootScope.NIFTY_FNO,
            $rootScope.NIFTY_MID_SMALL,
            $rootScope.NIFTY_NEXT_50
          );
      });
      // All symbol list end

      // All Symbol list for typehed start
      $rootScope.symbolLists = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace("SYMBOL"),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: "/app/Scan_IND_TYPEAHEAD/",
      });
      $rootScope.symbolLists.initialize()
      // All Symbol list for typehed end


      // Global URL
      $rootScope.APP_URL = document.location.origin


      $http.get("/is_user_details_available/").then(function (response) {
        $rootScope.IS_USER_DETAILS_AVIALABLE = response.data == "True" ? true :false
      })

    },
  ]);
