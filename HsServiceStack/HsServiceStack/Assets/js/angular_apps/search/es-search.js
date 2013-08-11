var app = angular.module('esSearchNg', ['hsCrud', 'hmTouchEvents']);
app.run(['basicCrud', function (basicCrud) {
    console.log(basicCrud);
    basicCrud.setBaseUrl('/api/search');
    basicCrud.setResponseExtractor(function (response, operation, what, url) {
        var resp = response.HitCount ? response.Hits.Hits : [];
        resp.Facets = response.Facets;
        resp.HitCount = response.HitCount;
        resp.SearchDuration = response.SearchDuration;
        resp.AvailableDateHistFacets = response.AvailableDateHistFacets;
        resp.Errors = response.Errors;
        return resp;
    });
}]);

app.controller('EsSearchCtrl', ['$scope', 'basicCrud', function ($scope, basicCrud) {
    $scope.sortPredicate = "Name";
    $scope.getTextSortIcon = function (reverse) {
        return reverse ? 'glyphicon glyphicon-sort-by-alphabet-alt' : 'glyphicon glyphicon-sort-by-alphabet';
    };
    
    $scope.getNumberSortIcon = function (reverse) {
        return reverse ? 'glyphicon glyphicon-sort-by-attributes-alt' : 'glyphicon glyphicon-sort-by-attributes';
    };
    
    $scope.getDateStr = function (jsonDate) {
        var date = new Date(parseInt(jsonDate.substr(6)));
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    $scope.query = { QueryString: '' };

    $scope.clearQuery = function() {
        $scope.query = { QueryString: '' };
        $scope.loadingResults = false;
        $scope.resultList = [];
    };
    
    $scope.clearQueryPreserveString = function () {
        var qs = $scope.query.QueryString;
        $scope.query = { QueryString: qs };
        $scope.searchClients();
    };

    $scope.searchByEntityId = function(entityId) {
        $scope.query.EntityId = entityId;
        $scope.searchClients();
    };

    $scope.resultList = [];
    $scope.loadingResults = false;
    $scope.searchClients = function() {
        $scope.loadingResults = true;
        //console.log(new Date().toLocaleTimeString(), 'calling loadClientResults');
        basicCrud.loadList('clients', $scope.query).resultList.then(function(clns) {
            $scope.loadingResults = false;
            $scope.resultList = clns;
            console.log('resultList: ', $scope.resultList);
        });
    };
    
    $scope.queryClients = _.throttle(function () {
        if ($scope.query.QueryString.length) {
            $scope.searchClients($scope.query);
        }
        else {
            $scope.loadingResults = false;
            $scope.resultList = [];
        }
    }, 500, { 'trailing': true });

    $scope.listClients = _.throttle(function() {
        $scope.searchClients('');
    }, 500, { 'trailing': true });
}]);
