var app = angular.module('permMgr', ['hsCrud', 'hmTouchEvents'])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.when('/',
            {
                templateUrl: '/Assets/js/angular_apps/admin/templates/permlist.html',
                controller: 'PermissionCtrl'
            })
            .when('/:userEntityId',
                {
                    templateUrl: '/Assets/js/angular_apps/admin/templates/permdetails.html',
                    controller: 'PermDetailCtrl'
                });
    }])
    .run(['basicCrud', function (basicCrud) {
        basicCrud.setBaseUrl('/api/admin');
        basicCrud.setResponseExtractor(function (response, operation, what, url) {
            var resp = response.Results;
            return resp;
        });
    }])
    .controller('PermissionCtrl', ['$scope', 'basicCrud', function ($scope, basicCrud) {
        console.log('PermissionCtrl');
        $scope.resultList = [];
        $scope.loadingResults = false;

        $scope.loadAllPermissions = function () {
            $scope.loadingResults = true;
            basicCrud.loadList('permissions').resultList.then(function (perms) {
                $scope.loadingResults = false;
                $scope.resultList = perms;
                console.log('resultList: ', $scope.resultList);
            });
        };
    }])
    .controller('PermDetailCtrl', ['$scope', '$location', '$routeParams', 'basicCrud', function ($scope, $location, $routeParams, basicCrud) {
        console.log('PermDetailCtrl');
        $scope.availablePermLevels = ['Read', 'Write', 'Modify'];
        $scope.availablePermScopes = ['Own', 'OthersInGroup', 'AllOthers'];
        $scope.availablePermFlags = ['User', 'Contact', 'Antecedent', 'Behavior', 'Client', 'Consequence', 'Employee', 'Guardian', 'TherapySession', 'PermissionGrant', 'Admin'];

        $scope.result = {};
        $scope.loadingResults = false;
        $scope.userEntityId = $routeParams.userEntityId;
        $scope.userPerms = {};

        $scope.permLvlSplit = [];
        $scope.permScpSplit = [];
        $scope.permFlgSplit = [];
        
        $scope.permLvlAvailable = [];
        $scope.permScpAvailable = [];
        $scope.permFlgAvailable = [];
        
        $scope.navigateBack = function() {
            $location.url('/');
        };
        
        $scope.loadUserPermissions = function () {
            $scope.loadingResults = true;
            //Grab the base Restangular result, which includes typeName, onePromise (the promise), and result (result of onePromise.get())
            $scope.userPerms = basicCrud.loadOne('permissions', $scope.userEntityId);
            //console.log($scope.userPerms);
            $scope.userPerms.result.then(function (perm) {
                $scope.loadingResults = false;
                
                //Split out each PermissionGrant into individual strings for the permissions, allowing for checkbox lists (ng-repeat)
                //to data-bind against them, and reflect the result in the original object.
                var mappedGrnts = _.reduce(perm.PermissionGrants, function (accum, val, idx) {
                    /* Levels */
                    $scope.permLvlSplit[idx] = [];
                    $scope.permLvlAvailable[idx] = [];
                    _.each(_.invoke(val.PermissionLevelStrings.split(','), String.prototype.trim),
                        function (mapVal) {
                            this.push(mapVal);
                        },
                    $scope.permLvlSplit[idx]);
                    $scope.permLvlAvailable[idx] = _.difference($scope.availablePermLevels, $scope.permLvlSplit[idx]);
                    //console.log('Split/Available at ' + idx, $scope.permLvlSplit[idx], $scope.permLvlAvailable[idx]);
                    
                    /* Scopes */
                    $scope.permScpSplit[idx] = [];
                    $scope.permScpAvailable[idx] = [];
                    _.each(_.invoke(val.PermissionScopeStrings.split(','), String.prototype.trim),
                        function (mapVal) {
                            this.push(mapVal);
                        },
                    $scope.permScpSplit[idx]);
                    $scope.permScpAvailable[idx] = _.difference($scope.availablePermScopes, $scope.permScpSplit[idx]);
                    //console.log('Split/Available at ' + idx, $scope.permScpSplit[idx], $scope.permScpAvailable[idx]);
                    
                    /* Flags */
                    $scope.permFlgSplit[idx] = [];
                    $scope.permFlgAvailable[idx] = [];
                    _.each(_.invoke(val.PermissionFlagStrings.split(','), String.prototype.trim),
                        function (mapVal) {
                            this.push(mapVal);
                        },
                    $scope.permFlgSplit[idx]);
                    $scope.permFlgAvailable[idx] = _.difference($scope.availablePermFlags, $scope.permFlgSplit[idx]);
                    //console.log('Split/Available at ' + idx, $scope.permFlgSplit[idx], $scope.permFlgAvailable[idx]);
                    
                    return accum;
                }, perm.PermissionGrants);
                perm.PermissionGrants = mappedGrnts;
                
                $scope.result = perm;
                console.log('result: ', $scope.result);
            });
        };

        $scope.savePermissions = function () {
            var putRes = $scope.result.customPUT('').then(function(res) {
                $('#error-msg').hide();
                $('#success-msg').show().fadeOut(7000);
            }, function(err) {
                $('#error-msg').show();
            });
        };
    }])
    //provide an editor input with autocomplete for each permission grant type (Level, Scope, Flags)
    .directive('permissionField', function() {
        return {
            restrict: 'E',
            scope: {
                //The binding for an ng-repeated PermissionGrant (ex. grnt)
                grantBinding: '=',
                //the split type of Permission where a string[] representation can be found (ex. permLvlSplit, permScpSplit, permFlgSplit)
                //Currently assigned permissions
                assignedPermType: '=',
                availablePermType: '='
            },
            template:
                '<div class="panel panel-success"><div class="panel-heading panel-heading-compact">Assigned</div>' +
                    '<div class="tags">' +
                        '<a ng-repeat="(idx, permLvl) in assignedPermType" class="tag" ng-click="remove(permLvl)">{{permLvl}}&nbsp;&times;</a>' +
                    '</div>' +
                '</div>' +
                '<div class="panel" ng-show="availablePermType.length"><div class="panel-heading panel-heading-compact">Available</div>' +
                    '<div class="tags">' +
                        '<a ng-repeat="(idx, permLvl) in availablePermType" class="tag" ng-click="add(permLvl)">{{permLvl}}&nbsp;&plus;</a>' +
                    '</div>' +
                '</div>',
            link: function (scope, elem, attrs) {
                //Use the grant-string-type attribute to determine which type of Permission we are editing
                scope.remove = function (elValue) {
                    //console.log('removing ', elValue, ' from ', scope.assignedPermType);
                    scope.assignedPermType = _.without(scope.assignedPermType, elValue);
                    scope.availablePermType.push(elValue);
                };
                scope.add = function (elValue) {
                    scope.availablePermType = _.without(scope.availablePermType, elValue);
                    scope.assignedPermType.push(elValue);
                };
                scope.$watch('assignedPermType', function (newVal, oldVal) {
                    //console.log('assignedPermType', scope.assignedPermType);
                    scope.grantBinding[attrs.grantStringType] = _(newVal).toString();
                    //scope.availablePermType = _.difference(scope.availablePermType, scope.assignedPermType);
                });
                
                scope.$watch('availablePermType', function (newVal, oldVal) {
                    //console.log('availablePermType', scope.availablePermType);
                    scope.grantBinding[attrs.grantStringType] = _(scope.assignedPermType).toString();
                });
            }
        };
    });
