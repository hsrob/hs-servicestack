var hsCrud = angular.module('apiRespConversion', [])
    .factory('convertClientBhvChart', function() {
        return {
            parseDate: function (dateStr) {
                return new Date(parseInt(dateStr.substr(6)));
            },
            convertResponse: function (data) {
                var self = this;
                var bhvs = _.sortBy(data.Behaviors, function (b) { return parseInt(b.CreatedDateTime.substr(6)); });

                
                var xCats = _.uniq(_.map(bhvs, function (val, idx, coll) { return self.parseDate(val.CreatedDateTime).toLocaleDateString(); }), true);
                var series = _.groupBy(bhvs, 'BehaviorTypeName', self);
                var seriesKeys = _.keys(series);
                console.log(series, seriesKeys);
                var fmtData = {
                    xAxis: {
                        categories: xCats,
                        labels: {
                            rotation: -45,
                            align: 'right',
                        }
                    }, series: []
                };
                for (var sk in seriesKeys) {
                    fmtData.series.push({ name: seriesKeys[sk] });
                }
                
                console.log(fmtData);
                for (var g = 0; g < seriesKeys.length; g++) {
                    var o = series[seriesKeys[g]];
                    var counts = _.pluck(o, 'Count');
                    fmtData.series[g].data = counts;
                }
                return fmtData;
            }
        }
    });