var app = angular.module('adminNg', ['hsCrud', 'hmTouchEvents']);
app.run(['basicCrud', function (basicCrud) {
    console.log(basicCrud);
    basicCrud.setBaseUrl('/api/admin');
    basicCrud.setResponseExtractor(function(response, operation, what, url) {
        return response.Results;
    });
}]);

app.controller('AdminInvitationCtrl', ['$scope', 'basicCrud', function ($scope, basicCrud) {
    $scope.sortPredicate = "Name";
    $scope.getSortIcon = function(reverse) {
        return reverse ? 'glyphicon glyphicon-chevron-up' : 'glyphicon glyphicon-chevron-down';
    };

    $scope.invitation = {        
        Name: '',
        Email: ''
    };

    $scope.filterBy =
    {
        //if true, show used invitations
        used: false
    };

    $scope.shouldShow = function(item) {
        return $scope.filterBy.used ? true : !item.IsUsed;
    };

    $scope.resultList = [];
    $scope.loadList = function () {
        basicCrud.loadList('invitations').resultList.then(function (invs) {
            $scope.resultList = invs;
            console.log($scope.resultList);
        });
    };

    $scope.deleteItem = function(itemEntityId) {
        var itmWithId = _.find($scope.resultList, function(itm) {
            return itm.EntityId == itemEntityId;
        });

        basicCrud.deleteItem(itmWithId).then(function() {
            $scope.resultList = _.without($scope.resultList, itmWithId);
        });
    };

    $scope.addItem = function (invitation) {
        if ($scope.inviteform.$valid) {
            basicCrud.create('invitations', invitation).then(function (resp) {
                console.log(resp[0]);
                $scope.resultList.push(resp[0]);
                $scope.invitation.Name = '';
                $scope.invitation.Email = '';
                $('#invite-success').show().fadeOut(5000);
            });
        }
    };
}]);
