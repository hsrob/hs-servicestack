var app = angular.module('todoListCtrl', ['hsCrud'])
    //provide the dependency(ies) as an array, with strings first, then the dependent function.
    //This prevents issues with minification from affecting Angular's dependency injection framework.
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/',
            {
                templateUrl: '/assets/js/angular_apps/todo/templates/todolist.html',
                controller: 'todoListCtrl'
            })
            .when('/:todoId',
                {
                    templateUrl: '/assets/js/angular_apps/todo/templates/todoitem.html',
                    controller: 'todoItemCtrl'
                });
    }])
    .run(['basicCrud', function (basicCrud) {
        console.log(basicCrud);
        basicCrud.setBaseUrl('/api/todo');
        basicCrud.setResponseExtractor(function(response, operation, what, url) {
            return response.Results;
        });
    }])
    .controller('todoListCtrl', ['$scope', function ($scope) {
        //Initialize the todoList scope variable as an array
        $scope.todoList = [];
        $scope.newTodo = '';

        $scope.addTodoItem = function () {
            $scope.todoList.push({
                Id: 1000,
                Title: $scope.newTodo,
                DateAdded: moment(),
                DateDue: moment().add('hours', 2)
            });

            $scope.newTodo = '';
        };
        var dateNow = new Date();

        //Use a fake web service (just local data) to push into the todoList
        $scope.loadTodos = function () {
            
        };
    }])
    .directive('todoItem', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                todolist: '='
            },
            template: '<ul><li ng-repeat="todo in todolist">{{todo.Id}} {{todo.Title}}</li></ul><div ng-transclude></ng-transclude>',
            link: function (scope, elem, attrs) {
            }
        };
    });
