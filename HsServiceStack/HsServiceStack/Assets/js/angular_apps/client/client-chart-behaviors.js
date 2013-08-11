var app = angular.module('chartClientBehaviorsNg', ['hsCrud', 'hmTouchEvents', 'apiRespConversion']);
app.run(['basicCrud', function (basicCrud) {
    console.log(basicCrud);
    basicCrud.setBaseUrl('/api/chart/client');
    basicCrud.setResponseExtractor(function (response, operation, what, url) {
        var resp = response.ClientDto;
        return resp;
    });
}]);

app.controller('ChartClientBehaviorsCtrl', ['$scope', 'basicCrud', 'convertClientBhvChart', function ($scope, basicCrud, convertBhv) {
    $scope.init = function (entityId) {
        $scope.query.EntityId = entityId;
        $scope.loadBehaviors();
    };
    $scope.stack = null;
    $scope.chartType = 'line';
    $scope.stackOptions = [{ label: 'Not Stacked', value: null }, { label: 'Standard', value: 'standard' }, { label: 'Percentage', value: 'percent' }];
    $scope.chartTypeOptions = [{ label: 'Line', value: 'line' }, { label: 'Column', value: 'column' }, { label: 'Box Plot', value: 'boxplot' }];
    
    $scope.query = {};
    $scope.resultList = [];
    $scope.loadingResults = false;
    $scope.loadBehaviors = function () {
        $scope.loadingResults = true;
        //console.log(new Date().toLocaleTimeString(), 'calling loadClientResults');
        basicCrud.loadList('behaviors', $scope.query).resultList.then(function (clns) {
            $scope.loadingResults = false;
            $scope.resultList = convertBhv.convertResponse(clns);
            console.log('resultList: ', $scope.resultList);
        });
    };
}]);

app.directive('chart', function () {
    return {
        restrict: 'E',
        template: '<div id="behaviorchart"></div>',
        scope: {
            val: '=',
            stack: '=',
            type: '='
        },
        transclude: true,
        replace: true,
        link: function (scope, element, attrs) {
            var chartsDefaults = {
                chart: {
                    renderTo: 'behaviorchart',
                    height: attrs.height || null,
                    width: attrs.width || null
                },
                title: {
                    text: attrs.displaytitle + ' Behavior Chart'
                },
                plotOptions: {
                    series: {
                        stacking: null,
                        dataLabels: {
                            enabled: true
                        }
                    }
                }
            };
      
            //Update when charts data changes
            scope.$watch(function() { return scope.val; }, function(value) {
                // We need deep copy in order to NOT override original chart object.
                // This allows us to override chart data member and still the keep
                // our original renderTo the same
                
                $.extend(true, value, chartsDefaults);
                var chart = new Highcharts.Chart(value);
                
                scope.$watch(function () { return scope.stack; }, function (stackVal) {

                    var plotOpts = {
                        series: {
                            stacking: stackVal,
                            dataLabels: {
                                color: stackVal != null ? 'white' : 'black'
                            }
                        }
                    };
                    $.extend(true, scope.val.plotOptions, plotOpts);
                    var chart = new Highcharts.Chart(value);
                });
                
                scope.$watch(function () { return scope.type; }, function (typeVal) {

                    var chartOpts = {
                        type: typeVal
                    };
                    $.extend(true, scope.val.chart, chartOpts);
                    var chart = new Highcharts.Chart(value);
                });
            });
        }
    }
});