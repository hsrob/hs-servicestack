var app = angular.module('todoList', ['hsCrud', 'ui.calendar'])
    //provide the dependency(ies) as an array, with strings first, then the dependent function.
    //This prevents issues with minification from affecting Angular's dependency injection framework.
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/',
            {
                templateUrl: '/assets/js/angular_apps/todo/templates/todolist.html',
                controller: 'todoListCtrl'
            })
            .when('/:todoListId',
                {
                    templateUrl: '/assets/js/angular_apps/todo/templates/todoitem.html',
                    controller: 'todoListDetailCtrl'
                });
    }])
    .run(['basicCrud', function (basicCrud) {
        console.log(basicCrud);
        basicCrud.setBaseUrl('/api/todolist');
        basicCrud.setResponseExtractor(function(response, operation, what, url) {
            return response.Results;
        });
    }])
    .controller('todoListCtrl', ['$scope', 'basicCrud', function ($scope, basicCrud) {
        //Initialize the todoList scope variable as an array
        $scope.todoLists = [];

        $scope.loadTodos = function () {
            basicCrud.loadList('list').resultList.then(function (todoRes) {
                $scope.todoLists = todoRes;
                console.log('todoLists: ', $scope.todoLists);
            });
        };
    }])
    .controller('todoListDetailCtrl', ['$scope', 'basicCrud', '$location', '$routeParams', function ($scope, basicCrud, $location, $routeParams) {
        //Initialize the todoList scope variable as an array
        $scope.todoList = {};
        $scope.todoPromise = {};
        $scope.todoListId = $routeParams.todoListId;
        $scope.addTodoItem = function (itm) {
            var newItm = angular.copy(itm);
            $scope.todoPromise.customPUT('additem', {}, {}, { TodoItemDto: newItm }).then(function(res) {
                $scope.todoList.TodoItems.push(newItm);
            });
        };
        
        $scope.navigateBack = function () {
            $location.url('/');
        };
        
        $scope.priorityOptions = [{ label: 'Low', value: 1 }, { label: 'Normal', value: 50 }, { label: 'High', value: 100 }];
        $scope.loadTodoDetails = function () {
            var todoLoadResp = basicCrud.loadOne('list', $scope.todoListId);
            $scope.todoPromise = todoLoadResp.onePromise;
            todoLoadResp.result.then(function (todoRes) {
                $scope.todoList = todoRes[0];
                console.log('todoList: ', $scope.todoList);
            });
        };
    }])
    .directive('todoItems', function () {
        return {
            restrict: 'E',
            scope: {
                todolist: '='
            },
            template: '<li class="list-group-item" ng-repeat="tdi in todolist.TodoItems">{{tdi.Name}}&nbsp;<em>Due <span ng-bind="formatDateFromNow(tdi.DueDateTime)"></span></em></li>',
            link: function (scope, elem, attrs) {
                scope.formatDateFromNow = function (dt) {
                    var mmt = moment(dt);
                    return mmt.fromNow();
                };
            }
        };
    });
