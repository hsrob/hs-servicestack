var app = angular.module('clientSelect', ['restangular']);
app.config(function (RestangularProvider) {
    RestangularProvider.setBaseUrl('/Client');
    RestangularProvider.setDefaultRequestParams({
        jsonResults: true
    });

    RestangularProvider.setResponseExtractor(function (response, operation, what, url) {
        var clientResponse = response.Clients;
        clientResponse.CurrentPage = response.CurrentPage;
        clientResponse.PerPage = response.PerPage;
        clientResponse.TotalPages = response.TotalPages;
        clientResponse.Filter = response.Filter;
        clientResponse.ActionName = response.ActionName;
        clientResponse.ViewMode = response.ViewMode;
        return clientResponse;
    });
});

app.controller('ClientListCtrl', ['$scope', 'Restangular', function ($scope, Restangular) {
    $scope.clients = [];
    $scope.clientList = [];
    $scope.currentPage = 1;
    $scope.totalPages = 1;
    $scope.loadClientPage = function (page) {
        $scope.clients = Restangular.all('List');
        console.log($scope.clients);
        $scope.clients.getList({ page: page }).then(function (clns) {
            $scope.clientList = clns;
            $scope.currentPage = clns.CurrentPage;
            $scope.totalPages = clns.TotalPages;
            console.log($scope.clientList);
        });
    };

    $scope.pageList = function () {
        return _.filter(_.range($scope.currentPage - 3, $scope.currentPage + 3), function (pg) {
            return pg >= 1 && pg <= $scope.totalPages;
        });
    };

    $scope.getCurrentPage = function () {
        return $scope.currentPage;
    };

    $scope.getTotalPages = function () {
        return $scope.totalPages;
    };

    $scope.prevPage = function () {
        $scope.loadClientPage($scope.currentPage - 1);
    };

    $scope.nextPage = function () {
        $scope.loadClientPage($scope.currentPage + 1);
    };
}]);

app.directive('selectlist', function () {
    return {
        //Element restriction
        restrict: 'E',
        //Main function
        link: function (scope, elem, attrs) {
            elem.bind('show.bs.collapse', function () {
                scope.loadClientPage(1);
            });
        }
    };
});

